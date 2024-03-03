class Fence extends Entity {

    #lowX: number;
    get lowX(): number { return this.#lowX }
    #lowY: number;
    get lowY(): number { return this.#lowY }
    #highX: number;
    get highX(): number { return this.#highX }
    #highY: number;
    get highY(): number { return this.#highY }

    #tri: Array<Vector2D>;
    get triangles(): Array<Vector2D> { return this.#tri; }

    #walls: Map<number, Wall> = new Map();
    get walls(): Array<Wall> { return [...this.#walls.values()]; }

    #contour: Array<Vector2D>;
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
    constructor(contour: Array<Vector2D>, makeEnclosure = false, repelSide = BOTH_SIDES) {
        // Find XY limits
        let lowX = contour[0].x, lowY = contour[0].y;
        let highX = contour[0].x, highY = contour[0].y;
        contour.forEach(v => {
            lowX = Math.min(lowX, v.x); lowY = Math.min(lowY, v.y);
            highX = Math.max(highX, v.x); highY = Math.max(highY, v.y);
        })
        super([(lowX + highX) / 2, (lowY + highY) / 2], 1);
        this.#lowX = lowX; this.#lowY = lowY;
        this.#highX = highX; this.#highY = highY;
        for (let i = 1; i < contour.length; i++)
            this.#walls.set(i - 1, new Wall(contour[i - 1], contour[i], repelSide));
        if (makeEnclosure)
            this.#walls.set(contour.length - 1, new Wall(contour[contour.length - 1], contour[0], repelSide));
        let closed = contour[0].equals(contour[contour.length - 1]);
        this.#tri = Geom2D.triangulate(contour, closed).map(idx => contour[idx]);
        this.#contour = contour;
    }

    /** Overrides entity.born */
    born(world: World) {
        world.births.push(this);
        world.births.push(...this.#walls.values());
    }

    /** Overrides entity.dies */
    dies(world: World) {
        world.deaths.push(this);
        world.deaths.push(...this.#walls.values());
    }

    deleteWall(idx: number, world: World) {
        let wall = this.#walls.get(idx);
        if (world && wall)
            world.deaths.push(wall);
    }

    wallRepelSide(idx: number, repelSide: symbol) {
        let wall = this.#walls.get(idx);
        console.log(`Fence clss: ${String(repelSide)}`);
        wall?.setRepelSide(repelSide);
    }

    fitsInside(lowX: number, lowY: number, highX: number, highY: number): boolean {
        return this.#lowX >= lowX && this.#lowY >= lowY && this.#highX <= highX && this.#highY <= highY;
    }

    update(elapsedTime: number): void {
        // Use enity method?
    }

}