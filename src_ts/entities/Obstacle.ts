class Obstacle extends Entity {

    constructor(position: Array<number> | _XY_, colRadius = 1) {
        super(position, colRadius);
        this.Z = 80;
    }

    born(births: Array<Entity>, world?: World) {
        births.push(this);
        world.maxObstacleSize = this._colRad;
    }


    isEitherSide(p0: Vector2D, p1: Vector2D): boolean {
        return Geom2D.line_circle(p0.x, p0.y, p1.x, p1.y,
            this.pos.x, this.pos.y, this.colRad);
    }

    // fitsInside(lowX: number, lowY: number, highX: number, highY: number): boolean {
    //     throw new Error("Method not implemented.");
    // }

    // update(elapsedTime: number): void {
    //     // Use enity method?
    // }

}