class Obstacle extends Entity {
    constructor(position, colRadius = 1) {
        super(position, colRadius);
        this.Z = 80;
    }
    born(world) {
        world.births.push(this);
        world.maxObstacleSize = this.colRad;
        return this;
    }
    isEitherSide(p0, p1) {
        // console.log(` Sight line Position ${p0.$(4)}   Target ${p1.$(4)}`)
        return Geom2D.line_circle(p0.x, p0.y, p1.x, p1.y, this.pos.x, this.pos.y, this.colRad);
    }
}
//# sourceMappingURL=obstacle.js.map