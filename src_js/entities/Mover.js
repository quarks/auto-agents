class Mover extends Entity {
    constructor(position, radius) {
        super(position);
        this.type = MOVER;
        this._domainConstraint = WRAP;
        // World position after last update
        this._prevPos = new Vector2D();
        // Current velocity vector
        this._vel = new Vector2D();
        // a normalised vector pointing in the direction the entity is heading. 
        this._heading = new Vector2D(1, 0); // facing East;
        // a normalised vector pointing in the entity's rest heading. 
        this._headingAtRest = new Vector2D(1, 0); // facing East;
        // The maximum speed this entity may travel at.
        this._maxSpeed = 50;
        // The maximum force this entity can use to power itself 
        this._maxForce = 10000;
        // The maximum rate (radians per second) this vehicle can rotate         
        this._maxTurnRate = 1;
        // The current rate of turn (radians per second)         
        this._currTurnRate = 0;
        // The previous rate of turn i.e. on last update (radians per second)         
        this._prevTurnRate = 0;
        // The distance that the entity can see another moving entity
        this._viewDistance = 50;
        // Field of view (radians)
        this._viewFOV = 1.047; // Default is 60 degrees
        this._pos.set(position);
        this._prevPos.set(position);
        this._bRad = radius;
        this._mass = this._bRad * this._bRad;
        this._side = this._heading.getPerp();
    }
    fits_inside(lowX, lowY, highX, highY) {
        let fits = (this._pos.x - this._bRad >= lowX)
            && (this._pos.x + this._bRad <= highX)
            && (this._pos.y - this._bRad >= lowY)
            && (this._pos.y + this._bRad <= highY);
        return fits;
    }
    update(elapsedTime) {
        this._pos.add(Vector2D.mult(this._vel, elapsedTime));
        // If a quadtree is provided constrain the balls to the limits
        // of the root partition 
        if (this.domain) {
            let root = this.domain;
            if (this._pos.x - this._bRad < root.lowX)
                this._vel.x = Math.abs(this._vel.x);
            else if (this._pos.x + this._bRad > root.highX)
                this._vel.x = -Math.abs(this._vel.x);
            if (this._pos.y - this._bRad < root.lowY)
                this._vel.y = Math.abs(this._vel.y);
            else if (this._pos.y + this._bRad > root.highY)
                this._vel.y = -Math.abs(this._vel.y);
        }
    }
    constrainTo(area, method) {
        this.domain = area ? area.copy() : undefined;
        if (method)
            this.constrainWith(method);
        return this;
    }
    constrainWith(method) {
        if (Number.isFinite(method))
            if (method === WRAP || method === REBOUND || method === PASS_THROUGH)
                this._domainConstraint = method;
    }
    pos(x, y) {
        this._pos.set(x, y);
        return this;
    }
    vel(x, y) {
        this._vel.set(x, y);
        return this;
    }
    mass(m) {
        this._mass = m;
        return this;
    }
    heading(x, y) {
        this._heading.set(x, y);
        this._side = this._heading.getPerp();
        return this;
    }
    headingAtRest(x, y) {
        this._headingAtRest.set(x, y);
        return this;
    }
    maxSpeed(ms) {
        this._maxSpeed = ms;
        return this;
    }
    maxForce(mf) {
        this._maxForce = mf;
        return this;
    }
    maxTurnRate(mtr) {
        this._maxTurnRate = mtr;
        return this;
    }
    viewDistance(vd) {
        this._viewDistance = vd;
        return this;
    }
    viewFOV(fov) {
        this._viewFOV = fov;
        return this;
    }
    getPos() {
        return this._pos;
    }
    getVel() {
        return this._vel;
    }
    getMass() {
        return this._mass;
    }
    getHeading() {
        return this._heading;
    }
    getHeadingAtRest() {
        return this._headingAtRest;
    }
    getMaxSpeed() {
        return this._maxSpeed;
    }
    getMaxForce() {
        return this._maxForce;
    }
    getMaxTurnRate() {
        return this._maxForce;
    }
    getViewDistance() {
        return this._viewDistance;
    }
    getViewFOV() {
        return this._viewDistance;
    }
}
//# sourceMappingURL=Mover.js.map