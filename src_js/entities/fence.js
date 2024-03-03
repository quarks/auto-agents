class Fence extends Entity {
    #lowX;
    get lowX() { return this.#lowX; }
    #lowY;
    get lowY() { return this.#lowY; }
    #highX;
    get highX() { return this.#highX; }
    #highY;
    get highY() { return this.#highY; }
    #tri;
    get triangles() { return this.#tri; }
    #walls = new Map();
    get walls() { return [...this.#walls.values()]; }
    #contour;
    get contour() { return this.#contour; }
    /**
     * A series of walls joined end-to-end making a fence or enclosure.
     *
     * The contour should be an open list of vectors for the 'fence posts'. For
     * consistant behaviour when using wall avoidance they should be in listed
     * in anti-clockwise order.
     *
     * An 'open' list is one where the first and last elements are not the same
     * position.
     *
     * A wall will be created between all adjacent elements in the array. So a
     * contour (array) of length 'n' will create 'n-1' walls. To create a wall
     * between the first and last element of the contour the second parameter
     * should be true.
     *
     *
     * @param contour an open list of vertices
     * @param makeEnclosure make the fence a closed enclosure.
     * @param repelSide which side of the wall is detectable to moving entities.
     */
    constructor(contour, makeEnclosure = false, repelSide = BOTH_SIDES) {
        // Find XY limits
        let lowX = contour[0].x, lowY = contour[0].y;
        let highX = contour[0].x, highY = contour[0].y;
        contour.forEach(v => {
            lowX = Math.min(lowX, v.x);
            lowY = Math.min(lowY, v.y);
            highX = Math.max(highX, v.x);
            highY = Math.max(highY, v.y);
        });
        super([(lowX + highX) / 2, (lowY + highY) / 2], 1);
        this.#lowX = lowX;
        this.#lowY = lowY;
        this.#highX = highX;
        this.#highY = highY;
        for (let i = 1; i < contour.length; i++)
            this.#walls.set(i - 1, new Wall(contour[i - 1], contour[i], repelSide));
        if (makeEnclosure)
            this.#walls.set(contour.length - 1, new Wall(contour[contour.length - 1], contour[0], repelSide));
        let closed = contour[0].equals(contour[contour.length - 1]);
        this.#tri = Geom2D.triangulate(contour, closed).map(idx => contour[idx]);
        this.#contour = contour;
    }
    /** Overrides entity.born */
    born(world) {
        world.births.push(this);
        world.births.push(...this.#walls.values());
    }
    /** Overrides entity.dies */
    dies(world) {
        world.deaths.push(this);
        world.deaths.push(...this.#walls.values());
    }
    deleteWall(idx, world) {
        let wall = this.#walls.get(idx);
        if (world && wall)
            world.deaths.push(wall);
    }
    wallRepelSide(idx, repelSide) {
        let wall = this.#walls.get(idx);
        console.log(`Fence clss: ${String(repelSide)}`);
        wall?.setRepelSide(repelSide);
    }
    fitsInside(lowX, lowY, highX, highY) {
        return this.#lowX >= lowX && this.#lowY >= lowY && this.#highX <= highX && this.#highY <= highY;
    }
    update(elapsedTime) {
        // Use enity method?
    }
}
//# sourceMappingURL=fence.js.map