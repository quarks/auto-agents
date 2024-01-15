class Obstacle extends Entity {

    constructor(position: Array<number> | Position, colRadius = 1) {
        super(position, colRadius); this._type = OBSTACLE;
    }


    fits_inside(lowX: number, lowY: number, highX: number, highY: number): boolean {
        throw new Error("Method not implemented.");
    }

    update(elapsedTime: number): void {
        // Use enity method?
    }

}