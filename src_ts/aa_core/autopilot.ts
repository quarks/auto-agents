class AutoPilot {
    _owner: Vehicle;
    get owner(): Vehicle { return this._owner; }
    set owner(owner: Vehicle) { this._owner = owner; }

    _world: World;
    _flags = 0;
    _forceCalcMethod: symbol;

    constructor(owner: Vehicle, world: World) {
        this._owner = owner;
        this._world = world;
        this.forceCalculator = WEIGHTED_PRIORITIZED;
    }

    // ########################################################################
    //                            PROPERTIES
    // ########################################################################

    // ************    SEEK / ARRIVVE    ********************
    _target = new Vector2D();   // Target for both arrive and seek behaviours
    setTarget(t: Vector2D): AutoPilot { this._target.set(t); return this; }
    set target(t: Vector2D) { this._target.set(t); }
    get target(): Vector2D { return this._target; }

    // Deceleration rate for arrive
    _arriveRate: number = NORMAL;
    setArriveRate(n: number): AutoPilot {
        if (n == SLOW || n == FAST) this._arriveRate = n; else this._arriveRate = NORMAL;
        return this;
    }
    set arriveRate(n: number) { this._arriveRate = n; }
    get arriveRate(): number { return this._arriveRate; }

    _arriveDist = 1;
    set arriveDist(n: number) { this._arriveDist = n; }
    get arriveDist(): number { return this._arriveDist; }

    // ****************      FLEE      **********************
    __fleeTarget = new Vector2D();
    setFleeTarget(t: Vector2D): AutoPilot { this.__fleeTarget.set(t); return this; }
    set fleeTarget(t: Vector2D) { this.__fleeTarget.set(t); }
    get fleeTarget(): Vector2D { return this.__fleeTarget; }

    // Panic distance squared for flee to be effective
    __fleeRadius = 100;
    get fleeRadius(): number { return this.__fleeRadius; }
    set fleeRadius(n: number) { this.__fleeRadius = n; }

    // ****************  PATH FINDING  **********************
    // Used in path following
    // LinkedList<GraphNode> path = new LinkedList<GraphNode>();
    _pathSeekDist = 20;
    _pathArriveDist = 0.5;

    // ****************     PURSUE / EVADE    **********************
    // [AGENT0, AGENT1, AGENT_TO_PURSUE, AGENT_TO_EVADE]
    _agents: Array<Mover> = new Array(NBR_AGENT_ARRAY);

    setAgent0(a: Mover): AutoPilot { this._agents[0] = a; return this; }
    get agent0(): Mover { return this._agents[0]; }
    set agent0(a: Mover) { this._agents[0] = a; }

    setAgent1(a: Mover): AutoPilot { this._agents[1] = a; return this; }
    set agent1(a: Mover) { this._agents[1] = a; }
    get agent1(): Mover { return this._agents[1]; }

    setPursueAgent(a: Mover): AutoPilot { this._agents[2] = a; return this; }
    set pursueAgent(a: Mover) { this._agents[2] = a; }
    get pursueAgent(): Mover { return this._agents[2]; }

    setEvadeAgent(a: Mover): AutoPilot { this._agents[3] = a; return this; }
    set evadeAgent(a: Mover) { this._agents[3] = a; }
    get evadeAgent(): Mover { return this._agents[3]; }

    _pursueOffset = new Vector2D();
    setPursueOffset(v: Vector2D): AutoPilot { this._pursueOffset.set(v); return this; }
    set pursueOffset(v: Vector2D) { this._pursueOffset.set(v); }
    get pursueOffset(): Vector2D { return this._pursueOffset; }

    // *******************    WANDER    **********************
    // radius of the constraining circle for the wander behaviour
    __wanderRadius = 50.0;
    get wanderRadius() { return this.__wanderRadius; }
    set wanderRadius(n: number) { this.__wanderRadius = n; }
    setWanderRadius(n: number): AutoPilot { this.__wanderRadius = n; return this; }

    // distance the wander circle is projected in front of the agent
    __wanderDist = 70.0;
    get wanderDist() { return this.__wanderDist; }
    set wanderDist(n: number) { this.__wanderDist = n; }
    setWanderDist(n: number): AutoPilot { this.__wanderDist = n; return this; }

    // Maximum jitter per update
    __wanderJitter = 20;
    get wanderJitter() { return this.__wanderJitter; }
    set wanderJitter(n: number) { this.__wanderJitter = n; }
    setWanderJitter(n: number): AutoPilot { this.__wanderJitter = n; return this; }

    // The target lies on the circumference of the wander circle
    _wanderTarget: Vector2D = new Vector2D();
    get wanderTarget(): Vector2D { return this._wanderTarget; }


    // ########################################################################
    //                            BEHAVIOURS
    // ########################################################################

    // *******************    WALL AVOID    *******************
    // Cats whiskers used for wall avoidance
    __nbrWhiskers = 5;
    __whiskerFOV = Math.PI; // radians
    __whiskerLength = 30;
    __ovalEnvelope = false;

    // ****************    OBSTACLE AVOID    *****************
    // Obstacle avoidance
    __detectBoxLength = 20.0;

    // The maximum distance between moving entities for them to be considered
    // as neighbours. Used for group behaviours
    __neighbourDist = 100.0;

    /**
     * Set any of the properties 
     * @param props 
     * @returns 
     */
    setProperties(props: object): AutoPilot {
        if (!props || typeof props !== 'object') return this;
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
    allOff(): AutoPilot {
        this._flags = 0;
        return this;
    }

    /*
     * ======================================================================
     * SEEK
     * ======================================================================
     */

    /** Switch off seek */
    seekOff(): AutoPilot {
        this._flags &= (ALL_SB_MASK - SEEK);
        return this;
    }

    /**
     * Switch on seek and change target if provided
     * @return this auto-pilot object
     */
    seekOn(target?: Array<number> | Position): AutoPilot {
        this._flags |= SEEK;
        if (target)
            this.target.set(target);
        return this;
    }

    /** Is seek switched on? */
    get isSeekOn(): boolean { return (this._flags & SEEK) != 0; }

    seek(owner: Vehicle, target: Vector2D) {
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
    fleeOff(): AutoPilot {
        this._flags &= (ALL_SB_MASK - FLEE);
        return this;
    }

    /**
     * Switch on seek and change target if provided
     * @return this auto-pilot object
     */
    fleeOn(target?: Array<number> | Position): AutoPilot {
        this._flags |= FLEE;
        if (target)
            this.__fleeTarget.set(target);
        return this;
    }

    /** Is seek switched on? */
    get isFleeOn(): boolean { return (this._flags & FLEE) != 0; }

    flee(owner: Vehicle, target: Vector2D) {
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
    arriveOff(): AutoPilot {
        this._flags &= (ALL_SB_MASK - ARRIVE); return this;
    }

    /**
     * 
     * @param target the position to arrive at
     * @param rate rate of approach (SLOW, NORMAL or FAST)
     * @returns this auto-pilot object
     */
    arriveOn(target?: Array<number>, rate?: number): AutoPilot {
        this._flags |= ARRIVE;
        if (target) this.target.set(target);
        if (rate) this._arriveRate = rate;
        return this;
    }

    /** Is arrive switched on?   */
    get isArriveOn(): boolean { return (this._flags & ARRIVE) != 0; }

    arrive(owner: Vehicle, target: Vector2D) {
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
    evadeOff(): AutoPilot {
        this._flags &= (ALL_SB_MASK - EVADE); return this;
    }

    /**
     * @param agent the agent to evade
     * @returns this auto-pilot object
     */
    evadeOn(agent: Mover): AutoPilot {
        this._flags |= EVADE;
        this.evadeAgent = agent;
        return this;
    }

    /** Is evade switched on?   */
    get isEvadeOn(): boolean { return (this._flags & EVADE) != 0; }

    evade(owner: Vehicle, pursuer: Mover) {
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
    pursuitOff(): AutoPilot {
        this._flags &= (ALL_SB_MASK - PURSUIT); return this;
    }

    /**
     * @param agent the agent to pursue
     * @returns this auto-pilot object
     */
    pursuitOn(agent: Mover): AutoPilot {
        this._flags |= PURSUIT;
        this.pursueAgent = agent;
        return this;
    }

    /** Is pursuit switched off? */
    get isPusuitOn(): boolean { return (this._flags & PURSUIT) != 0; }

    pursuit(owner: Vehicle, toPursue: Mover) {
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
    wanderOff(): AutoPilot {
        this._flags &= (ALL_SB_MASK - WANDER);
        return this;
    }

    /**
     * @return this auto-pilot object
     */
    wanderOn(): AutoPilot {
        // Calculate iniitial wander target to directly ahead of of owner
        this._wanderTarget = this.owner.heading.resize(this.__wanderRadius);
        this._flags |= WANDER;
        return this;
    }

    /** Is wander switched on?    */
    get isWanderOn(): boolean { return (this._flags & WANDER) != 0; }

    wander(owner: Vehicle, elapsedTime: number) {
        function rnd(n: number) {
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

    // ########################################################################
    //                          FORCE CALCULATOR TYPES
    // ########################################################################

    calculateForce: Function;

    set forceCalculator(type: Symbol) {
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

    calculatePrioritized(elapsedTime: number, world: World): Vector2D {
        let owner: Vehicle = this.owner;
        let maxForce = owner.maxForce;
        let recorder: ForceRecorder = owner.recorder;
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
    accumulateForce(totalForceSoFar: Vector2D, forceToAdd: Vector2D, maxForce: number): boolean {
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
        } else {
            forceToAdd = forceToAdd.normalize();
            forceToAdd = forceToAdd.mult(magLeft);
            // add it to the steering force
            totalForceSoFar.set([totalForceSoFar.x + forceToAdd.x, totalForceSoFar.y + forceToAdd.y]);
            return false;
        }
    }

    off(behaviours: number) {
        this._flags &= (ALL_SB_MASK - behaviours);
        return this;
    }

    on(behaviours: number) {
        this._flags |= (ALL_SB_MASK & behaviours);
        return this;
    }

    setWeighting(bhvr: number, weight: number): AutoPilot {
        if (Number.isFinite(bhvr) && Number.isFinite(weight)) {
            if (bhvr > 0 && bhvr < NBR_BEHAVIOURS)
                this._weight[bhvr] = weight;
            else
                console.error(`Uanble to set the weighting for behaiour ID ${bhvr}`);
        }
        return this;
    }

    getWeighting(bhvr: number): number {
        if (Number.isFinite(bhvr) && bhvr > 0 && bhvr < NBR_BEHAVIOURS)
            return this._weight[bhvr];
        else
            return 0;
    }

    /** Default values for steering behaviour objects. */
    _weight: Array<number> = [
        220.0, // wall avoidance weight
        80.0, // obstacle avoidance weight
        5.0, // evade weight
        0.5, // flee weight
        1.0, // separation weight
        4.0, // alignment weight
        15.0, // cohesion weight
        0.5, // seek weight
        1.0, // arrive weight
        1.0, // wander weight
        20.0, // pursuit weight
        10.0, // offset pursuit weight
        10.0, // interpose weight
        10.0, // hide weight
        20.0, // follow path weight
        1.0 // flock weight
    ];

    // _weight: Array<number> = [
    //     220.0, // wall avoidance weight
    //     80.0, // obstacle avoidance weight
    //     1.0, // evade weight
    //     20.0, // flee weight
    //     1.0, // separation weight
    //     4.0, // alignment weight
    //     15.0, // cohesion weight
    //     20.0, // seek weight
    //     20.0, // arrive weight
    //     5.0, // wander weight
    //     100.0, // pursuit weight
    //     10.0, // offset pursuit weight
    //     10.0, // interpose weight
    //     10.0, // hide weight
    //     20.0, // follow path weight
    //     1.0 // flock weight
    // ];


}