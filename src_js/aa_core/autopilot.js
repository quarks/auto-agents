class AutoPilot {
    constructor(owner, world) {
        this._flags = 0;
        // ########################################################################
        //                            PROPERTIES
        // ########################################################################
        // ************    SEEK / ARRIVVE    ********************
        this._target = new Vector2D(); // Target for both arrive and seek behaviours
        // Deceleration rate for arrive
        this._arriveRate = NORMAL;
        this._arriveDist = 1;
        // ****************      FLEE      **********************
        this.__fleeTarget = new Vector2D();
        // Panic distance squared for flee to be effective
        this.__fleeRadius = 100;
        // ****************  PATH FINDING  **********************
        // Used in path following
        // LinkedList<GraphNode> path = new LinkedList<GraphNode>();
        this._pathSeekDist = 20;
        this._pathArriveDist = 0.5;
        // ****************     PURSUE / EVADE    **********************
        // [AGENT0, AGENT1, AGENT_TO_PURSUE, AGENT_TO_EVADE]
        this._agents = new Array(NBR_AGENT_ARRAY);
        this._pursueOffset = new Vector2D();
        // *******************    WANDER    **********************
        // radius of the constraining circle for the wander behaviour
        this.__wanderRadius = 50.0;
        // distance the wander circle is projected in front of the agent
        this.__wanderDist = 70.0;
        // Maximum jitter per update
        this.__wanderJitter = 20;
        // The target lies on the circumference of the wander circle
        this._wanderTarget = new Vector2D();
        // ########################################################################
        //                            BEHAVIOURS
        // ########################################################################
        // *******************    WALL AVOID    *******************
        // Cats whiskers used for wall avoidance
        this.__nbrWhiskers = 5;
        this.__whiskerFOV = Math.PI; // radians
        this.__whiskerLength = 30;
        this.__ovalEnvelope = false;
        // ****************    OBSTACLE AVOID    *****************
        // Obstacle avoidance
        this.__detectBoxLength = 20.0;
        // The maximum distance between moving entities for them to be considered
        // as neighbours. Used for group behaviours
        this.__neighbourDist = 100.0;
        /** Default values for steering behaviour objects. */
        this._weight = [
            220.0,
            80.0,
            5.0,
            0.5,
            1.0,
            4.0,
            15.0,
            0.5,
            1.0,
            1.0,
            20.0,
            10.0,
            10.0,
            10.0,
            20.0,
            1.0 // flock weight
        ];
        this._owner = owner;
        this._world = world;
        this.forceCalculator = WEIGHTED_PRIORITIZED;
    }
    get owner() { return this._owner; }
    set owner(owner) { this._owner = owner; }
    setTarget(t) { this._target.set(t); return this; }
    set target(t) { this._target.set(t); }
    get target() { return this._target; }
    setArriveRate(n) {
        if (n == SLOW || n == FAST)
            this._arriveRate = n;
        else
            this._arriveRate = NORMAL;
        return this;
    }
    set arriveRate(n) { this._arriveRate = n; }
    get arriveRate() { return this._arriveRate; }
    set arriveDist(n) { this._arriveDist = n; }
    get arriveDist() { return this._arriveDist; }
    setFleeTarget(t) { this.__fleeTarget.set(t); return this; }
    set fleeTarget(t) { this.__fleeTarget.set(t); }
    get fleeTarget() { return this.__fleeTarget; }
    get fleeRadius() { return this.__fleeRadius; }
    set fleeRadius(n) { this.__fleeRadius = n; }
    setAgent0(a) { this._agents[0] = a; return this; }
    get agent0() { return this._agents[0]; }
    set agent0(a) { this._agents[0] = a; }
    setAgent1(a) { this._agents[1] = a; return this; }
    set agent1(a) { this._agents[1] = a; }
    get agent1() { return this._agents[1]; }
    setPursueAgent(a) { this._agents[2] = a; return this; }
    set pursueAgent(a) { this._agents[2] = a; }
    get pursueAgent() { return this._agents[2]; }
    setEvadeAgent(a) { this._agents[3] = a; return this; }
    set evadeAgent(a) { this._agents[3] = a; }
    get evadeAgent() { return this._agents[3]; }
    setPursueOffset(v) { this._pursueOffset.set(v); return this; }
    set pursueOffset(v) { this._pursueOffset.set(v); }
    get pursueOffset() { return this._pursueOffset; }
    get wanderRadius() { return this.__wanderRadius; }
    set wanderRadius(n) { this.__wanderRadius = n; }
    setWanderRadius(n) { this.__wanderRadius = n; return this; }
    get wanderDist() { return this.__wanderDist; }
    set wanderDist(n) { this.__wanderDist = n; }
    setWanderDist(n) { this.__wanderDist = n; return this; }
    get wanderJitter() { return this.__wanderJitter; }
    set wanderJitter(n) { this.__wanderJitter = n; }
    setWanderJitter(n) { this.__wanderJitter = n; return this; }
    get wanderTarget() { return this._wanderTarget; }
    /**
     * Set any of the properties
     * @param props
     * @returns
     */
    setProperties(props) {
        if (!props || typeof props !== 'object')
            return this;
        for (let p in props) {
            let pname = '__' + p;
            if (this.hasOwnProperty(pname))
                this[pname] = props[p];
            else
                console.error(`"${p} " is not a valid property name for a pilot.`);
        }
        return this;
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
            this.target.set(target);
        return this;
    }
    /** Is seek switched on? */
    get isSeekOn() { return (this._flags & SEEK) != 0; }
    seek(owner, target) {
        let desiredVelocity = target.sub(this.owner.pos);
        desiredVelocity = desiredVelocity.normalize();
        desiredVelocity = desiredVelocity.mult(owner.maxSpeed);
        return desiredVelocity.sub(owner.vel);
    }
    /*
     * ======================================================================
     * FLEE
     * ======================================================================
     */
    /** Switch off seek */
    fleeOff() {
        this._flags &= (ALL_SB_MASK - FLEE);
        return this;
    }
    /**
     * Switch on seek and change target if provided
     * @return this auto-pilot object
     */
    fleeOn(target) {
        this._flags |= FLEE;
        if (target)
            this.__fleeTarget.set(target);
        return this;
    }
    /** Is seek switched on? */
    get isFleeOn() { return (this._flags & FLEE) != 0; }
    flee(owner, target) {
        let panicDist = Vector2D.dist(owner.pos, target);
        if (panicDist >= this.__fleeRadius)
            return Vector2D.ZERO;
        let desiredVelocity = this.owner.pos.sub(target);
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
            this.target.set(target);
        if (rate)
            this._arriveRate = rate;
        return this;
    }
    /** Is arrive switched on?   */
    get isArriveOn() { return (this._flags & ARRIVE) != 0; }
    arrive(owner, target) {
        let toTarget = target.sub(owner.pos), dist = toTarget.length();
        if (dist > this._arriveDist) {
            let rate = dist / DECEL_TWEEK[this._arriveRate];
            let speed = Math.min(owner.maxSpeed, rate);
            let desiredVelocity = toTarget.mult(speed / dist);
            return desiredVelocity.sub(owner.vel);
        }
        return new Vector2D();
    }
    /*
     * ======================================================================
     * EVADE
     * ======================================================================
     */
    /** Switch off evade  */
    evadeOff() {
        this._flags &= (ALL_SB_MASK - EVADE);
        return this;
    }
    /**
     * @param agent the agent to evade
     * @returns this auto-pilot object
     */
    evadeOn(agent) {
        this._flags |= EVADE;
        this.evadeAgent = agent;
        return this;
    }
    /** Is evade switched on?   */
    get isEvadeOn() { return (this._flags & EVADE) != 0; }
    evade(owner, pursuer) {
        let fromAgent = pursuer.pos.sub(owner.pos);
        let lookAheadTime = fromAgent.length() / (owner.maxSpeed + pursuer.vel.length());
        let target = pursuer.pos.add(pursuer.vel.mult(lookAheadTime));
        return this.flee(owner, target);
    }
    /*
     * ======================================================================
     * PURSUIT
     * ======================================================================
     */
    /** Switch off pursuit  */
    pursuitOff() {
        this._flags &= (ALL_SB_MASK - PURSUIT);
        return this;
    }
    /**
     * @param agent the agent to pursue
     * @returns this auto-pilot object
     */
    pursuitOn(agent) {
        this._flags |= PURSUIT;
        this.pursueAgent = agent;
        return this;
    }
    /** Is pursuit switched off? */
    get isPusuitOn() { return (this._flags & PURSUIT) != 0; }
    pursuit(owner, toPursue) {
        let toAgent = toPursue.pos.sub(owner.pos);
        let relativeHeading = owner.heading.dot(toPursue.heading);
        if (toAgent.dot(owner.heading) > 0 && relativeHeading > -0.95) // acos(0.95)=18 degs
            return this.seek(owner, toPursue.pos);
        let lookAheadTime = toAgent.length() / (owner.maxSpeed + toPursue.vel.length());
        let target = toPursue.pos.add(toPursue.vel.mult(lookAheadTime));
        return this.seek(owner, target);
    }
    /*
     * ======================================================================
     * WANDER
     * ======================================================================
     */
    /**
     * @return this auto-pilot object
     */
    wanderOff() {
        this._flags &= (ALL_SB_MASK - WANDER);
        return this;
    }
    /**
     * @return this auto-pilot object
     */
    wanderOn() {
        // Calculate iniitial wander target to directly ahead of of owner
        this._wanderTarget = this.owner.heading.resize(this.__wanderRadius);
        this._flags |= WANDER;
        return this;
    }
    /** Is wander switched on?    */
    get isWanderOn() { return (this._flags & WANDER) != 0; }
    wander(owner, elapsedTime) {
        function rnd(n) {
            return (Math.random() - Math.random()) * n;
        }
        let delta = this.__wanderJitter;
        // Add small displacement to wander target
        this._wanderTarget = this._wanderTarget.add(rnd(delta), rnd(delta));
        // Project target on to wander circle
        this._wanderTarget = this._wanderTarget.resize(this.__wanderRadius);
        // Get local target position
        let targetLocal = this._wanderTarget.add(this.__wanderDist, 0);
        // Calculate the world position based on owner
        let targetWorld = Transformations.pointToWorldSpace(targetLocal, owner.heading.normalize(), owner.side.normalize(), owner.pos);
        return targetWorld.sub(owner.pos);
    }
    set forceCalculator(type) {
        switch (type) {
            case WEIGHTED:
                this._forceCalcMethod = WEIGHTED;
                break;
            case WEIGHTED_PRIORITIZED:
                this._forceCalcMethod = WEIGHTED_PRIORITIZED;
                this.calculateForce = this.calculatePrioritized;
                break;
            case PRIORITIZED_DITHERING:
                this._forceCalcMethod = PRIORITIZED_DITHERING;
                break;
            default:
                console.error(`Invalid force calculator`);
        }
    }
    calculatePrioritized(elapsedTime, world) {
        let owner = this.owner;
        let maxForce = owner.maxForce;
        let recorder = owner.recorder;
        let accumulator = new Vector2D();
        if (this.isEvadeOn) {
            let f = this.evade(owner, this.evadeAgent);
            f = f.mult(this._weight[BIT_EVADE]);
            recorder?.addData(BIT_EVADE, f);
            if (!this.accumulateForce(accumulator, f, maxForce))
                return accumulator;
        }
        if (this.isFleeOn) {
            let f = this.flee(owner, this.fleeTarget);
            f = f.mult(this._weight[BIT_FLEE]);
            recorder?.addData(BIT_FLEE, f);
            if (!this.accumulateForce(accumulator, f, maxForce))
                return accumulator;
        }
        if (this.isSeekOn) {
            let f = this.seek(owner, this.target);
            f = f.mult(this._weight[BIT_SEEK]);
            recorder?.addData(BIT_SEEK, f);
            if (!this.accumulateForce(accumulator, f, maxForce))
                return accumulator;
        }
        if (this.isArriveOn) {
            let f = this.arrive(owner, this.target);
            f = f.mult(this._weight[BIT_ARRIVE]);
            recorder?.addData(BIT_ARRIVE, f);
            if (!this.accumulateForce(accumulator, f, maxForce))
                return accumulator;
        }
        if (this.isWanderOn) {
            let f = this.wander(owner, elapsedTime);
            f = f.mult(this._weight[BIT_WANDER]);
            recorder?.addData(BIT_WANDER, f);
            if (!this.accumulateForce(accumulator, f, maxForce))
                return accumulator;
        }
        if (this.isPusuitOn) {
            let f = this.pursuit(owner, this.pursueAgent);
            f = f.mult(this._weight[BIT_PURSUIT]);
            recorder?.addData(BIT_PURSUIT, f);
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
    off(behaviours) {
        this._flags &= (ALL_SB_MASK - behaviours);
        return this;
    }
    on(behaviours) {
        this._flags |= (ALL_SB_MASK & behaviours);
        return this;
    }
    setWeighting(bhvr, weight) {
        if (Number.isFinite(bhvr) && Number.isFinite(weight)) {
            if (bhvr > 0 && bhvr < NBR_BEHAVIOURS)
                this._weight[bhvr] = weight;
            else
                console.error(`Uanble to set the weighting for behaiour ID ${bhvr}`);
        }
        return this;
    }
    getWeighting(bhvr) {
        if (Number.isFinite(bhvr) && bhvr > 0 && bhvr < NBR_BEHAVIOURS)
            return this._weight[bhvr];
        else
            return 0;
    }
}
//# sourceMappingURL=autopilot.js.map