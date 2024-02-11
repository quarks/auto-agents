class Building extends Entity {

    #lowX: number;
    #lowY: number;
    #highX: number;
    #highY: number;

    #contour: Array<Vector2D>;
    #walls: Array<Wall> = [];

    constructor(contour: Array<Vector2D>, repelSide = OUTSIDE) {
        super(Vector2D.ZERO, 1);
        // Make sure contour is 'closed'
        if (Vector2D.dist(contour[0], contour[contour.length - 1]) < 2)
            contour[contour.length - 1] = contour[0].copy();
        else
            contour.push(contour[0].copy());
        this.#contour = contour;
        // Find limits
        let lowX = contour[0].x, lowY = contour[0].y;
        let highX = contour[0].x, highY = contour[0].y;
        this.#contour.forEach(v => {
            lowX = Math.min(lowX, v.x); lowY = Math.min(lowY, v.y);
            highX = Math.max(highX, v.x); highY = Math.max(highY, v.y);
        })
        this.#lowX = lowX; this.#lowY = lowY;
        this.#highX = highX; this.#highY = highY;
        for (let i = 1; i < this.#contour.length; i++)
            this.#walls.push(new Wall(this.#contour[i - 1], this.#contour[i], repelSide));
    }


    fits_inside(lowX: number, lowY: number, highX: number, highY: number): boolean {
        return this.#lowX >= lowX && this.#lowY >= lowY && this.#highX <= highX && this.#highY <= highY;
    }

    update(elapsedTime: number): void {
        // Use enity method?
    }

}