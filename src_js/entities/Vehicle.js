class Vehicle extends Mover {
    constructor(position, radius, world) {
        super(position, radius);
        this._force = new Vector2D();
        this._accel = new Vector2D();
        this._type = VEHICLE;
        if (world)
            this._autopilot = new AutoPilot(this, world);
    }
    get pilot() { return this._autopilot; }
    addAutoPilot(world) {
        this._autopilot = new AutoPilot(this, world);
    }
    get recorder() { return this._forceRecorder; }
    setForce(force) { this._force.set(force); return this; }
    set force(force) { this._force.set(force); }
    get force() { return this._force; }
    setAccel(accel) { this._accel.set(accel); return this; }
    set accel(accel) { this._accel.set(accel); }
    get accel() { return this._accel; }
    fits_inside(lowX, lowY, highX, highY) {
        let fits = (this._pos.x - this._colRad >= lowX)
            && (this._pos.x + this._colRad <= highX)
            && (this._pos.y - this._colRad >= lowY)
            && (this._pos.y + this._colRad <= highY);
        return fits;
    }
    /**
     * Enable the force recorder on for this Vehicle. This will delete any
     * collected data and start the logger. <br>
     *
     * The recorder will record the minimum, maximum average and number of readings
     * for each steering force. <br>
     *
     * This is useful in tweaking max force values for vehicles and to
     * help decide on the best force calculation method to use. <br>
     *
     * The force recorder should be switched off in the final sketch.
     */
    forceRecorderOn() {
        if (this.pilot)
            this._forceRecorder = new ForceRecorder(this, this.pilot._weight);
        return this;
    }
    forceRecorderOff() {
        console.log(this.recorder.toString());
        this._forceRecorder = undefined;
        return this;
    }
    /** Display the steering force data for this Vehicle.   */
    printForceData() {
        console.log(this.recorder?.toString());
    }
    clearForceData() {
        this.recorder?.clearData();
    }
    /**
     * Update method for any moving entity in the world that is under
     * the influence of a steering behaviour.
     * @param elapsedTime elapsed time since last update
     * @param world the game world object
     */
    update(elapsedTime, world) {
        // Remember the starting position
        this._prevPos.set(this._pos);
        // Init accumulator variables
        this._force.set([0, 0]);
        this._accel.set([0, 0]);
        if (this._autopilot) {
            this._force.set(this._autopilot.calculateForce(elapsedTime, world));
            this._force = this._force.truncate(this._maxForce);
            this._accel = this._force.mult(elapsedTime / this._mass);
            this.vel = this.vel.add(this._accel);
        }
        // Make sure we don't exceed maximum speed
        this._vel = this._vel.truncate(this._maxSpeed);
        // Change position according to velocity and elapsed time
        this._pos = this._pos.add(this._vel.mult(elapsedTime));
        // Apply domain constraints
        this.applyDomainConstraint(this._domain ? this._domain : world._domain);
        // Update heading
        if (this._vel.lengthSq() > 0.02)
            this.rotateHeadingToAlignWith(elapsedTime, this._vel);
        else {
            this._vel.set([0, 0]);
            if (this._headingAtRest)
                this.rotateHeadingToAlignWith(elapsedTime, this._headingAtRest);
        }
        // Ensure heading and side are normalised
        this._heading = this._heading.normalize();
        this._side.set([-this._heading.y, this._heading.x]);
    }
}
//# sourceMappingURL=vehicle.js.map