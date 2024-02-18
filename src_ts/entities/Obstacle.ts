class Obstacle extends Entity {

    constructor(position: Array<number> | _XY_, colRadius = 1) {
        super(position, colRadius);
        this.Z = 80;
    }

    born(world: World) {
        world.births.push(this);
        world.maxObstacleSize = this.colRad;
    }


    isEitherSide(p0: Vector2D, p1: Vector2D): boolean {
        // console.log(` Sight line Position ${p0.$(4)}   Target ${p1.$(4)}`)
        return Geom2D.line_circle(p0.x, p0.y, p1.x, p1.y,
            this.pos.x, this.pos.y, this.colRad);
    }

    // toString(): string {
    //     return `Obstacle @ ${super.toString()}`;
    // }

}