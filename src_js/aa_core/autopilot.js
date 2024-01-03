class AutoPilot {
    constructor(owner, world) {
        this._forceCalcMethod = WEIGHTED_PRIORITIZED;
        this._flags = 0;
        // These are used during force calculations so do not need to be cloned
        // Set<Obstacle> obstacles = null;
        // Set<Wall> walls = null;
        // Set<MovingEntity> movers = null;
        // these values are passed as parameters and are stored at the start
        // of the calculateForce method so do not need to be cloned
        // deltaTime = 0;
        // ======================================================================
        // The following variables need to be cloned as they are unique
        // to the particular behaviour.
        // ======================================================================
        // flags = 0;
        // accum = new Vector2D();
        // f = new Vector2D();
        // steeringForce = new Vector2D();
        /*
         * **********************************************************************
         * **********************************************************************
         *
         * The following section has all the methods to switch on/off and get/set
         * the tweak factors for the various behaviours.
         *
         * **********************************************************************
         * **********************************************************************
         */
        // Target for arrive and seek
        this._gotoTarget = new Vector2D();
        // Deceleration rate for arrive
        this._arriveRate = NORMAL;
        this._arriveDist = 1;
        this._fleeTarget = new Vector2D();
        // Panic distance squared for flee to be effective
        this._fleeRadius = 100;
        // Used in path following
        // LinkedList<GraphNode> path = new LinkedList<GraphNode>();
        this._pathSeekDist = 20;
        this._pathArriveDist = 0.5;
        // Obstacle avoidance
        this._detectBoxLength = 20.0;
        /**
         * the first 2 are used for the interpose
         * AGENT0, AGENT1, AGENT_TO_PURSUE, AGENT_TO_EVADE
         */
        this._agents = new Array(NBR_AGENT_ARRAY);
        this._pursueOffset = new Vector2D();
        // radius of the constraining circle for the wander behaviour
        this._wanderRadius = 50.0;
        // distance the wander circle is projected in front of the agent
        this._wanderDist = 70.0;
        // The target lies on the circumference of the wander circle
        this._wanderTarget = new Vector2D();
        // Maximum jitter per second
        this._maxWanderJitter = 900;
        // Cats whiskers used for wall avoidance
        this._nbrWhiskers = 5;
        this._whiskerFOV = Math.PI; // radians
        this._whiskerLength = 30;
        this._ovalEnvelope = false;
        // The maximum distance between moving entities for them to be considered
        // as neighbours. Used for group behaviours
        this._neighbourDist = 100.0;
        /** Default values for steering behaviour objects. */
        this._weightings = [
            220.0,
            80.0,
            1.0,
            20.0,
            1.0,
            4.0,
            15.0,
            20.0,
            20.0,
            5.0,
            100.0,
            10.0,
            10.0,
            10.0,
            20.0,
            1.0 // flock weight
        ];
        this._owner = owner;
        this._world = world;
    }
    /**
     * Switch off all steering behaviours
     *
     * @return this auto-pilot object
     */
    allOff() {
        this._flags = 0;
        return this;
    }
    /** Get current distance to the seek target position. */
    targetDist(target) {
        if (target)
            return Vector2D.dist(this._owner._pos, target);
        else
            return Vector2D.dist(this._owner._pos, this._gotoTarget);
    }
    /*
     * ======================================================================
     * SEEK
     * ======================================================================
     */
    /** Switch off seek */
    seekOff() {
        this._flags &= (ALL_SB_MASK - SEEK);
        return this;
    }
    /**
     * Switch on seek and change target if provided
     * @return this auto-pilot object
     */
    seekOn(target) {
        this._flags |= SEEK;
        if (target)
            this._gotoTarget.set(target);
        return this;
    }
    /**
     * Set the weight for this behaviour
     *
     * @param weight the weighting to be applied to this behaviour.
     * @return this auto-pilot object
     */
    seekWeight(weight) {
        this._weightings[BIT_SEEK] = weight;
        return this;
    }
    /** Get the weighting for this behaviour */
    getSeekWeight() {
        return this._weightings[BIT_SEEK];
    }
    /** Is seek switched on? */
    isSeekOn() {
        return (this._flags & SEEK) != 0;
    }
    seek(owner, target) {
        let desiredVelocity = target.sub(this._owner._pos);
        desiredVelocity = desiredVelocity.normalize();
        desiredVelocity = desiredVelocity.mult(owner.maxSpeed);
        return desiredVelocity.sub(owner.vel);
    }
    /*
     * ======================================================================
     * ARRIVE
     * ======================================================================
     */
    /** Switch off arrive  */
    arriveOff() {
        this._flags &= (ALL_SB_MASK - ARRIVE);
        return this;
    }
    /**
     *
     * @param target the position to arrive at
     * @param rate rate of approach (SLOW, NORMAL or FAST)
     * @returns this auto-pilot object
     */
    arriveOn(target, rate) {
        this._flags |= ARRIVE;
        if (target)
            this._gotoTarget.set(target);
        if (rate)
            this.arriveRate(rate);
        return this;
    }
    /**
     * Define the rate of approach. This should be SLOW, NORMAL or FAST any
     * other value will default to NORMAL
     * @param rate the approach rate
     * @return this auto-pilot object
     */
    arriveRate(rate) {
        switch (rate) {
            case SLOW:
            case FAST:
                this._arriveRate = rate;
                break;
            default: this._arriveRate = NORMAL;
        }
        return this;
    }
    /** Get current distance to the arrive target position. */
    arriveDistance() {
        return Vector2D.dist(this._owner.pos, this._gotoTarget);
    }
    /**
     * Set the weight for this behaviour
     *
     * @param weight the weighting to be applied to this behaviour.
     * @return this auto-pilot object
     */
    arriveWeight(weight) {
        this._weightings[BIT_ARRIVE] = weight;
        return this;
    }
    /**
     * Get the weighting for this behaviour
     */
    getArriveWeight() {
        return this._weightings[BIT_ARRIVE];
    }
    /**
     * Is arrive switched on?
     */
    isArriveOn() {
        return (this._flags & ARRIVE) != 0;
    }
    arrive(owner, target) {
        let toTarget = target.sub(owner.pos), dist = toTarget.length();
        if (dist > this._arriveDist) {
            let rate = dist / DECEL_TWEEK[this._arriveRate];
            let speed = Math.min(owner.maxSpeed, rate);
            let desiredVelocity = toTarget.mult(speed / dist);
            //console.log(`Dist: ${dist}   Rate: ${rate}  Speed: ${speed}`);
            return desiredVelocity.sub(owner.vel);
        }
        return new Vector2D();
    }
    /*
     * ======================================================================
     * WANDER
     * ======================================================================
     */
    /**
     * Switch off wander
     *
     * @return this auto-pilot object
     */
    wanderOff() {
        this._flags &= (ALL_SB_MASK - WANDER);
        return this;
    }
    /**
     * Switch on wander
     *
     * @return this auto-pilot object
     */
    wanderOn() {
        // Calculate iniitial wander target to directly ahead of of owner
        this._wanderTarget = this._owner.heading.resize(this._wanderRadius);
        this._flags |= WANDER;
        return this;
    }
    /**
     * Set the weight for this behaviour
     *
     * @param weight the weighting to be applied to this behaviour.
     * @return this auto-pilot object
     */
    wanderWeight(weight) {
        this._weightings[BIT_WANDER] = weight;
        return this;
    }
    /**
     * Is wander switched on?
     */
    isWanderOn() {
        return (this._flags & WANDER) != 0;
    }
    wander(owner, elapsedTime) {
        function rnd(n) {
            return (Math.random() - Math.random()) * n;
        }
        let delta = this._maxWanderJitter * elapsedTime;
        // Add small displacement to wander target
        this._wanderTarget = this._wanderTarget.add(rnd(delta), rnd(delta));
        // Project target on to wander circle
        this._wanderTarget = this._wanderTarget.resize(this._wanderRadius);
        // Get local target position
        let targetLocal = this._wanderTarget.add(this._wanderDist, 0);
        // Calculate the world position based on owner
        let targetWorld = Transformations.pointToWorldSpace(targetLocal, owner.heading.normalize(), owner.side.normalize(), owner.pos);
        return targetWorld.sub(owner.pos);
    }
    /**
     * Set some or all of the factors used for wander behaviour. <br>
     * Only provide values for the factors you want to set, pass 'null'
     * for any factor that is to be unchanged. <br>
     * Where appropriate validation will be applied to the value passed
     * and if invalid (eg out of permitted range) will be silently ignored
     * (no warning message) and the factor will remain unchanged.
     *
     * @param dist
     * @param radius
     * @param jitter
     * @return this auto-pilot object
     */
    wanderFactors(factors) {
        if (factors) {
            if (factors['wanderDist'])
                this._wanderDist = factors['wanderDist'];
            if (factors['wanderRadius'])
                this._wanderRadius = factors['wanderRadius'];
            if (factors['maxWanderJitter'])
                this._maxWanderJitter = factors['maxWanderJitter'];
        }
        return this;
    }
    /** gets the wanderRadius */
    get wanderRadius() { return this._wanderRadius; }
    /** gets the wanderDist */
    get wanderDist() { return this._wanderDist; }
    /** Gets the maximum amount of jitter allowed per second  */
    get wanderJitter() { return this._maxWanderJitter; }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    calculateForce(elapsedTime, world) {
        let sf = new Vector2D();
        if (this._flags != 0) {
            switch (this._forceCalcMethod) {
                case WEIGHTED:
                    break;
                case WEIGHTED_PRIORITIZED:
                    sf = this.calculatePrioritized(elapsedTime, world);
                    break;
            }
        }
        return sf;
    }
    calculatePrioritized(elapsedTime, world) {
        let owner = this._owner;
        let maxForce = owner.maxForce;
        let recorder = owner.recorder;
        let accumulator = new Vector2D();
        if (this.isSeekOn()) {
            let f = this.seek(owner, this._gotoTarget);
            recorder?.addData(BIT_SEEK, f);
            if (!this.accumulateForce(accumulator, f, maxForce))
                return accumulator;
        }
        if (this.isArriveOn()) {
            let f = this.arrive(owner, this._gotoTarget);
            recorder?.addData(BIT_ARRIVE, f);
            if (!this.accumulateForce(accumulator, f, maxForce))
                return accumulator;
        }
        if (this.isWanderOn()) {
            let f = this.wander(owner, elapsedTime);
            recorder?.addData(BIT_WANDER, f);
            if (!this.accumulateForce(accumulator, f, maxForce))
                return accumulator;
        }
        return accumulator;
    }
    /**
     * This method is used by the PRIORITISED force calculation method. <br>
     * For each active behaviour in turn it calculates how much of the
     * maximum steering force is left then adds that amount of to the accumulator.
     *
     * @param totalForceSoFar running total
     * @param forceToAdd   the force we want to add from the current behaviour
     * @param maxForce     the maximum force available.
     * @return true if we have not reached the maximum permitted force.
     */
    accumulateForce(totalForceSoFar, forceToAdd, maxForce) {
        // calculate how much steering force the vehicle has used so far
        let magSoFar = totalForceSoFar.length();
        // calculate how much steering force remains to be used by this vehicle
        let magLeft = maxForce - magSoFar;
        // calculate the magnitude of the force we want to add
        let magToAdd = forceToAdd.length();
        // if the magnitude of the sum of ForceToAdd and the running total
        // does not exceed the maximum force available to this vehicle, just
        // add together. Otherwise add as much of the ForceToAdd vector is
        // possible without going over the max.
        if (magToAdd < magLeft) {
            totalForceSoFar.set([totalForceSoFar.x + forceToAdd.x, totalForceSoFar.y + forceToAdd.y]);
            return true;
        }
        else {
            forceToAdd = forceToAdd.normalize();
            forceToAdd = forceToAdd.mult(magLeft);
            // add it to the steering force
            totalForceSoFar.set([totalForceSoFar.x + forceToAdd.x, totalForceSoFar.y + forceToAdd.y]);
            return false;
        }
    }
}
//# sourceMappingURL=autopilot.js.map