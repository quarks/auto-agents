class Vehicle extends Mover {
    #autopilot;
    get pilot() { return this.#autopilot; }
    #forceRecorder;
    get recorder() { return this.#forceRecorder; }
    #force = new Vector2D();
    setForce(force) { this.#force.set(force); return this; }
    set force(force) { this.#force.set(force); }
    get force() { return this.#force; }
    #accel = new Vector2D();
    setAccel(accel) { this.#accel.set(accel); return this; }
    set accel(accel) { this.#accel.set(accel); }
    get accel() { return this.#accel; }
    constructor(position, radius) {
        super(position, radius);
        this.Z = 144;
        this.#autopilot = new AutoPilot(this);
    }
    fits_inside(lowX, lowY, highX, highY) {
        let fits = (this.pos.x - this.colRad >= lowX)
            && (this.pos.x + this.colRad <= highX)
            && (this.pos.y - this.colRad >= lowY)
            && (this.pos.y + this.colRad <= highY);
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
            this.#forceRecorder = new ForceRecorder(this);
        return this;
    }
    forceRecorderOff() {
        console.log(this.recorder.toString());
        this.#forceRecorder = undefined;
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
        this.prevPos.set(this.pos);
        // Init accumulator variables
        this.#force.set([0, 0]);
        this.#accel.set([0, 0]);
        if (this.#autopilot) {
            this.#force.set(this.#autopilot.calculateForce(elapsedTime, world));
            this.#force = this.#force.truncate(this.maxForce);
            this.#accel = this.#force.mult(elapsedTime / this.mass);
            this.vel = this.vel.add(this.#accel);
        }
        // Make sure we don't exceed maximum speed
        this.vel = this.vel.truncate(this.maxSpeed);
        // Change position according to velocity and elapsed time
        this.pos = this.pos.add(this.vel.mult(elapsedTime));
        // Apply domain constraints
        this.applyDomainConstraint(this.domain ? this.domain : world.domain);
        // Update heading
        if (this.vel.lengthSq() > 0.02)
            this.rotateHeadingToAlignWith(elapsedTime, this.vel);
        else {
            this.vel.set([0, 0]);
            if (this.headingAtRest)
                this.rotateHeadingToAlignWith(elapsedTime, this.headingAtRest);
        }
        // Ensure heading and side are normalised
        this.heading = this.heading.normalize();
        this.side.set([-this.heading.y, this.heading.x]);
    }
}
//# sourceMappingURL=vehicle.js.map