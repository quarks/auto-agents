class Vehicle extends Mover {

    #autopilot: AutoPilot;
    get pilot() { return this.#autopilot; }

    #forceRecorder: ForceRecorder;
    get recorder() { return this.#forceRecorder; }

    #force = new Vector2D();
    setForce(force: Vector2D): Vehicle { Vector2D.mutate(this.#force, force); return this; } //{ this.#force.set(force); return this; }
    set force(force: Vector2D) { Vector2D.mutate(this.#force, force); }   //this.#force.set(force); }
    get force() { return this.#force; }

    #accel = new Vector2D();
    setAccel(accel: Vector2D): Vehicle { Vector2D.mutate(this.#accel, accel); return this; } //this.#accel.set(accel); return this; }
    set accel(accel: Vector2D) { Vector2D.mutate(this.#accel, accel); }  //this.#accel.set(accel); }
    get accel() { return this.#accel; }

    constructor(position: Vector2D, radius: number) {
        super(position, radius);
        this.Z = 144;
        this.#autopilot = new AutoPilot(this);
    }

    fits_inside(lowX: number, lowY: number, highX: number, highY: number): boolean {
        let fits: boolean =
            (this.pos.x - this.colRad >= lowX)
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
    forceRecorderOn(): Vehicle {
        if (this.pilot)
            this.#forceRecorder = new ForceRecorder(this);
        return this;
    }

    forceRecorderOff(): Vehicle {
        console.log(this.recorder.toString())
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
    update(elapsedTime: number, world: World): void {
        // Remember the starting position
        Vector2D.mutate(this.prevPos, this.pos); //         this.prevPos.set(this.pos);
        // Init accumulator variables
        Vector2D.mutate(this.#force, [0, 0]); Vector2D.mutate(this.#accel, [0, 0]);    //  this.#force.set([0, 0]); this.#accel.set([0, 0]);
        if (this.#autopilot) {
            Vector2D.mutate(this.#force, this.#autopilot.calculateForce(elapsedTime, world));  // this.#force.set(this.#autopilot.calculateForce(elapsedTime, world));
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
        let velSq = this.vel.lengthSq();
        if (velSq < 1 && this.headingAtRest)
            this.rotateHeadingToAlignWith(elapsedTime, this.headingAtRest);
        else if (velSq > 0.000001)
            this.rotateHeadingToAlignWith(elapsedTime, this.vel);
        else
            Vector2D.mutate(this.vel, [0, 0]); //this.vel.set([0, 0]);
        // Ensure heading and side are normalised
        this.heading = this.heading.normalize();
        Vector2D.mutate(this.side, [-this.heading.y, this.heading.x]);  //this.side.set([-this.heading.y, this.heading.x]);
    }

}