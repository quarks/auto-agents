class Vehicle extends Mover {

    _autopilot: AutoPilot;
    _forceRecorder: ForceRecorder;
    _force = new Vector2D();
    _accel = new Vector2D();

    get pilot() { return this._autopilot; }
    // set pilot(pilot: AutoPilot) { this._autopilot = pilot; this._autopilot.owner = this; }
    // setPilot(pilot: AutoPilot): Vehicle { this._autopilot = pilot; this._autopilot.owner = this; return this; }

    get recorder() { return this._forceRecorder; }

    get force() { return this._force; }
    set force(force: Vector2D) { this._force.set(force); }
    setForce(force: Vector2D): Vehicle { this._force.set(force); return this; }

    get accel() { return this._accel; }
    set accel(accel: Vector2D) { this._accel.set(accel); }
    setAccel(accel: Vector2D): Vehicle { this._accel.set(accel); return this; }

    constructor(position: Vector2D, radius: number, world?: World) {
        super(position, radius); this._type = VEHICLE;
        if (world) this._autopilot = new AutoPilot(this, world);
    }

    addAutoPilot(world: World) {
        this._autopilot = new AutoPilot(this, world);
    }

    fits_inside(lowX: number, lowY: number, highX: number, highY: number): boolean {
        let fits: boolean =
            (this._pos.x - this._colRad >= lowX)
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
    forceRecorderOn(): Vehicle {
        if (this.pilot) {
            this._forceRecorder = new ForceRecorder(this, this.pilot._weight);
        }
        return this;
    }
    forceRecorderOff(): Vehicle {
        console.log(this.recorder.toString())
        this._forceRecorder = undefined;
        return this;
    }
    /**
     * Display the steering force data for this Vehicle. If there is no 
     * recorder or no data has been collected for this Vehicle then
     * nothing is displayed.
     */
    // public void printForceData(){
    // 	if(forceRecorder != null && forceRecorder.hasData())
    // 		System.out.println(forceRecorder);
    // }


    /**
     * Update method for any moving entity in the world that is under
     * the influence of a steering behaviour.
     * @param elapsedTime elapsed time since last update
     * @param world the game world object
     */
    update(elapsedTime: number, world: World): void {
        // Remember the starting position
        this._prevPos.set(this._pos);
        // Init accumulator variables
        this._force.set([0, 0]); this._accel.set([0, 0]);
        if (this._autopilot) {
            this._force.set(this._autopilot.calculateForce(elapsedTime, world));
            //console.log(this._force.length(), this.maxForce)
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
        if (this._vel.lengthSq() > 1)
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