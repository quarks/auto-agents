class AutoPilot {
    _owner: Vehicle;
    _world: World;

    _flags = 0;
    _forceCalcMethod: symbol = WEIGHTED_PRIORITIZED;

    constructor(owner: Vehicle, world: World) {
        this._owner = owner;
        this._world = world;
    }

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


    _target = new Vector2D();   // Target for both arrive and seek behaviours
    setSeekTarget(t: Vector2D): AutoPilot { this._target.set(t); return this; }
    set seekTarget(t: Vector2D) { this._target.set(t); }
    get seekTarget(): Vector2D { return this._target; }

    setArriveTarget(t: Vector2D): AutoPilot { this._target.set(t); return this; }
    set arriveTarget(t: Vector2D) { this._target.set(t); }
    get arriveTarget(): Vector2D { return this._target; }

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

    _fleeTarget = new Vector2D();
    setFleeTarget(t: Vector2D): AutoPilot { this._fleeTarget.set(t); return this; }
    set fleeTarget(t: Vector2D) { this._fleeTarget.set(t); }
    get fleeTarget(): Vector2D { return this._fleeTarget; }

    // Panic distance squared for flee to be effective
    _fleeRadius = 100;
    set fleeRadius(n: number) { this._fleeRadius = n; }
    get fleeRadius(): number { return this._fleeRadius; }

    // Used in path following
    // LinkedList<GraphNode> path = new LinkedList<GraphNode>();
    _pathSeekDist = 20;
    _pathArriveDist = 0.5;


    // [AGENT0, AGENT1, AGENT_TO_PURSUE, AGENT_TO_EVADE]
    _agents: Array<Mover> = new Array(NBR_AGENT_ARRAY);

    setAgent0(a: Mover): AutoPilot { this._agents[0] = a; return this; }
    set agent0(a: Mover) { this._agents[0] = a; }
    get agent0(): Mover { return this._agents[0]; }

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

    // radius of the constraining circle for the wander behaviour
    _wanderRadius = 50.0;
    setWanderRadius(n: number): AutoPilot { this._wanderRadius = n; return this; }
    set wanderRadius(n: number) { this._wanderRadius = n; }
    get wanderRadius() { return this._wanderRadius; }
    // distance the wander circle is projected in front of the agent
    _wanderDist = 70.0;
    setWanderDist(n: number): AutoPilot { this._wanderDist = n; return this; }
    set wanderDist(n: number) { this._wanderDist = n; }
    get wanderDist() { return this._wanderDist; }
    // Maximum jitter per update
    _wanderJitter = 20;
    setWanderJitter(n: number): AutoPilot { this._wanderJitter = n; return this; }
    set wanderJitter(n: number) { this._wanderJitter = n; }
    get wanderJitter() { return this._wanderJitter; }
    // The target lies on the circumference of the wander circle
    __wanderTarget: Vector2D = new Vector2D();
    get wanderTarget(): Vector2D { return this.__wanderTarget; }

    // Cats whiskers used for wall avoidance
    _nbrWhiskers = 5;
    _whiskerFOV = Math.PI; // radians
    _whiskerLength = 30;
    _ovalEnvelope = false;

    // Obstacle avoidance
    _detectBoxLength = 20.0;

    // The maximum distance between moving entities for them to be considered
    // as neighbours. Used for group behaviours
    _neighbourDist = 100.0;

    setDetails(d: object): AutoPilot {
        if (!d || typeof d !== 'object') return this;
        for (let p in d) {
            let pname = '_' + p;
            if (this.hasOwnProperty(pname))
                this[pname] = d[p];
            else
                console.error(`"${p} " is not a valid detail name for a pilot.`);
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


    /** Get current distance to the seek / arrive target position. */
    targetDist(target?: Vector2D) {
        if (target)
            return Vector2D.dist(this._owner._pos, target);
        else
            return Vector2D.dist(this._owner._pos, this._target);
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
            this._target.set(target);
        return this;
    }

    /** Is seek switched on? */
    isSeekOn(): boolean {
        return (this._flags & SEEK) != 0;
    }

    seek(owner: Vehicle, target: Vector2D) {
        let desiredVelocity = target.sub(this._owner._pos);
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
        this._flags &= (ALL_SB_MASK - SEEK);
        return this;
    }

    /**
     * Switch on seek and change target if provided
     * @return this auto-pilot object
     */
    fleeOn(target?: Array<number> | Position): AutoPilot {
        this._flags |= SEEK;
        if (target)
            this._fleeTarget.set(target);
        return this;
    }

    /** Is seek switched on? */
    isFleeOn(): boolean {
        return (this._flags & SEEK) != 0;
    }

    flee(owner: Vehicle, target: Vector2D) {
        let panicDist = Vector2D.dist(owner.pos, target);
        if (panicDist >= this._fleeRadius)
            return Vector2D.ZERO;
        let desiredVelocity = this._owner._pos.sub(target); // target.sub(this._owner._pos);
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
        if (target) this._target.set(target);
        if (rate) this._arriveRate = rate;
        return this;
    }

    /**
     * Is arrive switched on?
     */
    isArriveOn(): boolean { return (this._flags & ARRIVE) != 0; }

    arrive(owner: Vehicle, target: Vector2D) {
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
    wanderOff(): AutoPilot {
        this._flags &= (ALL_SB_MASK - WANDER);
        return this;
    }

    /**
     * Switch on wander
     * 
     * @return this auto-pilot object
     */
    wanderOn(): AutoPilot {
        // Calculate iniitial wander target to directly ahead of of owner
        this.__wanderTarget = this._owner.heading.resize(this._wanderRadius);
        this._flags |= WANDER;
        return this;
    }

    /**
     * Set the weight for this behaviour
     * 
     * @param weight the weighting to be applied to this behaviour.
     * @return this auto-pilot object
     */
    wanderWeight(weight: number) {
        this._weight[BIT_WANDER] = weight;
        return this;
    }

    /**
     * Is wander switched on?
     */
    isWanderOn(): boolean {
        return (this._flags & WANDER) != 0;
    }

    wander(owner: Vehicle, elapsedTime: number) {
        function rnd(n: number) {
            return (Math.random() - Math.random()) * n;
        }
        let delta = this._wanderJitter;
        // Add small displacement to wander target
        this.__wanderTarget = this.__wanderTarget.add(rnd(delta), rnd(delta));
        // Project target on to wander circle
        this.__wanderTarget = this.__wanderTarget.resize(this._wanderRadius);
        // Get local target position
        let targetLocal = this.__wanderTarget.add(this._wanderDist, 0);
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
    // wanderFactors(factors: Object) {
    //     if (factors) {
    //         if (factors['wanderDist']) this._wanderDist = factors['wanderDist'];
    //         if (factors['wanderRadius']) this._wanderRadius = factors['wanderRadius'];
    //         if (factors['maxWanderJitter']) this._wanderJitter = factors['maxWanderJitter'];
    //     }
    //     return this;
    // }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    calculateForce(elapsedTime: number, world: World): Vector2D {
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

    calculatePrioritized(elapsedTime: number, world: World): Vector2D {
        let owner: Vehicle = this._owner;
        let maxForce = owner.maxForce;
        let recorder: ForceRecorder = owner.recorder;
        let accumulator = new Vector2D();

        if (this.isFleeOn()) {
            let f = this.seek(owner, this._target);
            f = f.mult(this._weight[BIT_FLEE]);
            recorder?.addData(BIT_FLEE, f);
            if (!this.accumulateForce(accumulator, f, maxForce))
                return accumulator;
        }
        if (this.isSeekOn()) {
            let f = this.seek(owner, this._target);
            f = f.mult(this._weight[BIT_SEEK]);
            recorder?.addData(BIT_SEEK, f);
            if (!this.accumulateForce(accumulator, f, maxForce))
                return accumulator;
        }
        if (this.isArriveOn()) {
            let f = this.arrive(owner, this._target);
            f = f.mult(this._weight[BIT_ARRIVE]);
            recorder?.addData(BIT_ARRIVE, f);
            if (!this.accumulateForce(accumulator, f, maxForce))
                return accumulator;
        }
        if (this.isWanderOn()) {
            let f = this.wander(owner, elapsedTime);
            f = f.mult(this._weight[BIT_WANDER]);
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
        1.0, // evade weight
        20.0, // flee weight
        1.0, // separation weight
        4.0, // alignment weight
        15.0, // cohesion weight
        20.0, // seek weight
        20.0, // arrive weight
        5.0, // wander weight
        100.0, // pursuit weight
        10.0, // offset pursuit weight
        10.0, // interpose weight
        10.0, // hide weight
        20.0, // follow path weight
        1.0 // flock weight
    ];


}