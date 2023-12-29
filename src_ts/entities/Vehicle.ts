class Vehicle extends Mover {
    _type = VEHICLE;

    constructor(position: Vector2D, radius: number) {
        super(position, radius);
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
     * 
     */
    forceRecorderOn(): Vehicle {
        //forceRecorder = new ForceRecorder(this);
        return this;
    }

    /**
     * Dump the force recorder on for this Vehicle. Any collected 
     * data will be lost.<br>
     */
    // public Vehicle forceRecorderOff(){
    // 	forceRecorder = null;
    // 	return this;
    // }

    /**
     * Get the force recorder if this vehicle has one. This is used by the World class
     * when displaying all force logs
     * @return the force logger or null if it doesn't exist
     */
    // public ForceRecorder forceRecorder(){
    // 	return forceRecorder;
    // }

    /**
     * See if this vehicle has a force recorder.
     * 
     * @return true if force logger exists
     */
    // public boolean hasForceRecorder(){
    // 	return forceRecorder != null;
    // }

    /**
     * Display the steering force data for this Vehicle. If there is no 
     * recorder or no data has been collected for this Vehicle then
     * nothing is displayed.
     */
    // public void printForceData(){
    // 	if(forceRecorder != null && forceRecorder.hasData())
    // 		System.out.println(forceRecorder);
    // }

    _force = new Vector2D();
    _accel = new Vector2D();
    _ap;

    /**
     * Update method for any moving entity in the world that is under
     * the influence of a steering behaviour.
     * @param deltaTime elapsed time since last update
     * @param world the game world object
     */
    update(deltaTime: number, world: World): void {
        // Remember the starting position
        this._prevPos.set(this._pos);
        // Accumulator for forces
        this._force.set([0, 0]);
        this._accel.set([0, 0]);
        if (this._ap != null) {
            this._force.set(this._ap.calculateForce(deltaTime, world));
            this._force.truncate(this._maxForce);
            //this._accel.set(Vector2D.div(this._force, this._mass));
            this._accel = this._force.div(this._mass);
            // this._accel.set(this._force);
            // this._accel.div(this._mass);
            // Change velocity according to acceleration and elapsed time
            this._accel.mult(deltaTime);
            this._vel.add(this._accel);
        }
        // Make sure we don't exceed maximum speed
        this._vel.truncate(this._maxSpeed);
        // Change position according to velocity and elapsed time
        //this._pos.add(Vector2D.mult(this._vel, deltaTime));
        this._pos = this._pos.add(this._vel.mult(deltaTime));
        // Apply domain constraints
        this.applyDomainConstraint(this._domain ? this._domain : world._domain);
        // Update heading
        if (this._vel.lengthSq() > 0.25)
            this.rotateHeadingToAlignWith(deltaTime, this._vel);
        else {
            this._vel.set([0, 0]);
            if (this._headingAtRest)
                this.rotateHeadingToAlignWith(deltaTime, this._headingAtRest);
        }
        // Ensure heading and side are normalised
        this._heading.normalize();
        this._side.set([-this._heading.y, this._heading.x]);
    }
}