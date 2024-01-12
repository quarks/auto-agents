class Obstacle extends Entity {
    constructor(position, colRadius = 1) {
        super(position, colRadius);
        this._type = OBSTACLE;
    }
    fits_inside(lowX, lowY, highX, highY) {
        throw new Error("Method not implemented.");
    }
    update(elapsedTime) {
        // Use enity method?
    }
}
//# sourceMappingURL=obstacle.js.map