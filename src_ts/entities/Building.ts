class Building extends Entity {

    lowX: number;
    lowY: number;
    highX: number;
    highY: number;

    constructor( /* Vetices */) {
        super(Vector2D.ZERO, 1); this._type = BUILDING;
    }

    fits_inside(lowX: number, lowY: number, highX: number, highY: number): boolean {
        throw new Error("Method not implemented.");
    }
    update(elapsedTime: number): void {
        // Use enity method?
    }

}