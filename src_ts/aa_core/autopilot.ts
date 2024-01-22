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

    // ****************  PATH FINDING  **********************
    // Used in path following
    // LinkedList<GraphNode> path = new LinkedList<GraphNode>();
    _pathSeekDist = 20;
    _pathArriveDist = 0.5;

    // The maximum distance between moving entities for them to be considered
    // as neighbours. Used for group behaviours
    __neighbourDist = 100.0;


    // Valiables used during testing
    testObstaclesFound: Array<Entity>;
    testWallsFound: Array<Entity>;
    testClosestObstacle: Entity;

    // Extra variables needed to draw hints
    _boxLength = 0;
    set boxLength(n: number) { this._boxLength = n; }
    get boxLength(): number { return this._boxLength; }

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

    // ########################################################################
    //                            BEHAVIOURS
    // ########################################################################

    /*
     * ======================================================================
     * SEEK
     * ======================================================================
     */
    seek(owner: Vehicle, target: Vector2D) {
        let desiredVelocity = target.sub(this.owner.pos);
        desiredVelocity = desiredVelocity.normalize();
        desiredVelocity = desiredVelocity.mult(owner.maxSpeed);
        return desiredVelocity.sub(owner.vel);
    }

    /** Switch off seek behaviour   */
    seekOff(): AutoPilot {
        this._flags &= (ALL_SB_MASK - SEEK);
        return this;
    }

    /** Switch on seek behaviour and change target if provided    */
    seekOn(target?: Array<number> | Position): AutoPilot {
        this._flags |= SEEK;
        if (target) this.target.set(target);
        return this;
    }

    /** Is seek switched on?   */
    get isSeekOn(): boolean { return (this._flags & SEEK) != 0; }

    _target = new Vector2D();   // Target for both arrive and seek behaviours
    setTarget(t: Vector2D): AutoPilot { this._target.set(t); return this; }
    set target(t: Vector2D) { this._target.set(t); }
    get target(): Vector2D { return this._target; }


    /*
     * ======================================================================
     * FLEE
     * ======================================================================
     */
    flee(owner: Vehicle, target: Vector2D) {
        let panicDist = Vector2D.dist(owner.pos, target);
        if (panicDist >= this.__fleeRadius)
            return Vector2D.ZERO;
        let desiredVelocity = this.owner.pos.sub(target);
        desiredVelocity = desiredVelocity.normalize();
        desiredVelocity = desiredVelocity.mult(owner.maxSpeed);
        return desiredVelocity.sub(owner.vel);
    }

    /** Switch off flee behaviour   */
    fleeOff(): AutoPilot {
        this._flags &= (ALL_SB_MASK - FLEE);
        return this;
    }

    /** Switch on flee behaviour and change flee target if provided.    */
    fleeOn(target?: Array<number> | Position): AutoPilot {
        this._flags |= FLEE;
        if (target) this.__fleeTarget.set(target);
        return this;
    }

    /** Is seek switched on?   */
    get isFleeOn(): boolean { return (this._flags & FLEE) != 0; }

    __fleeTarget = new Vector2D();
    setFleeTarget(t: Vector2D): AutoPilot { this.__fleeTarget.set(t); return this; }
    set fleeTarget(t: Vector2D) { this.__fleeTarget.set(t); }
    get fleeTarget(): Vector2D { return this.__fleeTarget; }

    // Panic distance squared for flee to be effective
    __fleeRadius = 100;
    get fleeRadius(): number { return this.__fleeRadius; }
    set fleeRadius(n: number) { this.__fleeRadius = n; }


    /*
     * ======================================================================
     * ARRIVE
     * ======================================================================
     */
    arrive(owner: Vehicle, target: Vector2D, tweak = this._arriveRate) {
        let toTarget = target.sub(owner.pos), dist = toTarget.length();
        if (dist > this._arriveDist) {
            let rate = dist / DECEL_TWEEK[tweak];
            let speed = Math.min(owner.maxSpeed, rate);
            let desiredVelocity = toTarget.mult(speed / dist);
            return desiredVelocity.sub(owner.vel);
        }
        return new Vector2D();
    }

    /** Switch off arrive  behaviour   */
    arriveOff(): AutoPilot {
        this._flags &= (ALL_SB_MASK - ARRIVE); return this;
    }

    /**
     * Switch on arrive behaviour
     * @param target the position to arrive at
     * @param rate rate of approach (SLOW, NORMAL or FAST)
     */
    arriveOn(target?: Array<number>, rate?: number): AutoPilot {
        this._flags |= ARRIVE;
        if (target) this.target.set(target);
        if (rate) this._arriveRate = rate;
        return this;
    }

    /** Is arrive switched on?   */
    get isArriveOn(): boolean { return (this._flags & ARRIVE) != 0; }


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


    /*
     * ======================================================================
     * EVADE
     * ======================================================================
     */
    evade(owner: Vehicle, pursuer: Mover) {
        let fromAgent = pursuer.pos.sub(owner.pos);
        let lookAheadTime = fromAgent.length() / (owner.maxSpeed + pursuer.vel.length());
        let target = pursuer.pos.add(pursuer.vel.mult(lookAheadTime));
        return this.flee(owner, target);
    }

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

    _evadeAgent: Mover;
    setEvadeAgent(a: Mover): AutoPilot { this._evadeAgent = a; return this; }
    set evadeAgent(a: Mover) { this._evadeAgent = a; }
    get evadeAgent(): Mover { return this._evadeAgent; }


    /*
     * ======================================================================
     * HIDE
     * ======================================================================
     */
    hide(owner: Vehicle, world: World, hideFrom: Mover) {
        // Calculate the search distance for obstacles
        let sd = this.__hideSearchRange + world._biggestObsColRad;
        // Get all obstacles inside search distance
        let pos = owner.pos;
        let result = world.tree.getItemsInRegion(pos.x - sd, pos.y - sd, pos.x + sd, pos.y + sd);
        let obs = result.entities.filter(e => e instanceof Obstacle);
        console.log(`Found ${obs.length} obstacles for hiding behind`)
        let distToNearest = Number.MAX_VALUE;
        let bestHidingSpot: Vector2D;

        for (let ob of obs) {
            let spot = this.getHidingPosition(owner, hideFrom, ob);
            let dist = Vector2D.distSq(spot, owner.pos);

            if (dist < distToNearest) {
                distToNearest = dist;
                bestHidingSpot = spot;
            }
        }
        // if no suitable obstacles found then Evade the hunter
        if (bestHidingSpot)
            return this.arrive(owner, bestHidingSpot, FAST);
        else
            return this.evade(owner, hideFrom);
    }

    getHidingPosition(owner: Mover, hideFrom: Mover, ob: Obstacle): Vector2D {
        let toOb = ob.pos.sub(hideFrom.pos).normalize();
        let hidingSpot = toOb.mult(ob.colRad + owner.colRad + this.hideStandoffDist).add(ob.pos);
        return hidingSpot;
    }

    /** Switch off evade  */
    hideOff(): AutoPilot {
        this._flags &= (ALL_SB_MASK - HIDE); return this;
    }

    /**
     * @param agent the agent to hide from
     * @returns this auto-pilot object
     */
    hideOn(agent: Mover): AutoPilot {
        this._flags |= HIDE;
        this.hideFromAgent = agent;
        return this;
    }

    /** Is hide switched on?   */
    get isHideOn(): boolean { return (this._flags & HIDE) != 0; }

    _hideFromAgent: Mover;
    setHideFromAgent(m: Mover): AutoPilot { this._hideFromAgent = m; return this; }
    set hideFromAgent(m: Mover) { this._hideFromAgent = m; }
    get hideFromAgent(): Mover { return this._hideFromAgent; }

    __hideSearchRange: number
    setHideSearchRange(n: number): AutoPilot { this.__hideSearchRange = n; return this; }
    set hideSearchRange(n: number) { this.__hideSearchRange = n; }
    get hideSearchRange(): number { return this.__hideSearchRange; }

    __hideStandoffDist = 20;
    setHideStandoffDist(n: number): AutoPilot { this.__hideStandoffDist = n; return this; }
    set hideStandoffDist(n: number) { this.__hideStandoffDist = n; }
    get hideStandoffDist(): number { return this.__hideStandoffDist; }


    /*
     * ======================================================================
     * PURSUIT
     * ======================================================================
     */
    pursuit(owner: Vehicle, toPursue: Mover) {
        let toAgent = toPursue.pos.sub(owner.pos);
        let relativeHeading = owner.heading.dot(toPursue.heading);

        if (toAgent.dot(owner.heading) > 0 && relativeHeading > -0.95) // acos(0.95)=18 degs
            return this.seek(owner, toPursue.pos);

        let lookAheadTime = toAgent.length() / (owner.maxSpeed + toPursue.vel.length());
        let target = toPursue.pos.add(toPursue.vel.mult(lookAheadTime));
        return this.seek(owner, target);
    }

    /** Switch off pursuit behaviour */
    pursuitOff(): AutoPilot {
        this._flags &= (ALL_SB_MASK - PURSUIT); return this;
    }

    /** Switch on pursuit behaviour and set agent to pursue     */
    pursuitOn(agent: Mover): AutoPilot {
        this._flags |= PURSUIT;
        this.pursueAgent = agent;
        return this;
    }

    /** Is pursuit switched off? */
    get isPusuitOn(): boolean { return (this._flags & PURSUIT) != 0; }

    _pursueAgent: Mover;
    setPursueAgent(a: Mover): AutoPilot { this._pursueAgent = a; return this; }
    set pursueAgent(a: Mover) { this._pursueAgent = a; }
    get pursueAgent(): Mover { return this._pursueAgent; }


    /*
     * ======================================================================
     * OFFSET PURSUIT
     * ======================================================================
     */
    offsetPursuit(owner: Vehicle, leader: Mover, offset: Vector2D) {
        // calculate the offset's position in world space
        let worldOffsetPos = Transform.pointToWorldSpace(offset,
            leader.heading, leader.side, leader.pos);
        // Owner to offset vector
        let toOffset = worldOffsetPos.sub(owner.pos);

        // the lookahead time is proportional to the distance between the leader
        // and the pursuer; and is inversely proportional to the sum of both
        // agent's velocities
        let lookAheadTime = toOffset.length() / (owner.maxSpeed + leader.speed);

        // now Arrive at the predicted future position of the offset
        let target = leader.vel.mult(lookAheadTime).add(worldOffsetPos);
        return this.arrive(owner, target, FAST);
    }

    /*
    protected Vector2D offsetPursuit(MovingEntity me, MovingEntity leader, Vector2D offset) {
        // calculate the offset's position in world space
        Vector2D worldOffsetPos = Transformations.pointToWorldSpace(offset, leader.heading(), leader.side(), leader.pos());
        Vector2D toOffset = Vector2D.sub(worldOffsetPos, me.pos());

        // the lookahead time is proportional to the distance between the leader and the
        // pursuer; and is inversely proportional to the sum of both agent's velocities
        double lookAheadTime = toOffset.length() / (me.maxSpeed() + leader.speed());

        // now Arrive at the predicted future position of the offset
        Vector2D target = new Vector2D(leader.velocity());
        target.mult(lookAheadTime);
        target.add(worldOffsetPos);

        return arrive(me, target, FAST);
    }
    */

    /** Switch off pursuit behaviour */
    offsetPursuitOff(): AutoPilot {
        this._flags &= (ALL_SB_MASK - OFFSET_PURSUIT); return this;
    }

    /** Switch on pursuit behaviour and set agent to pursue     */
    offsetPursuitOn(agent: Mover, offset: Vector2D): AutoPilot {
        this._flags |= OFFSET_PURSUIT;
        this.pursueAgent = agent;
        this.pursueOffset = offset;
        return this;
    }

    /** Is pursuit switched off? */
    get isOffsetPusuitOn(): boolean { return (this._flags & OFFSET_PURSUIT) != 0; }

    __pursueOffset = new Vector2D();
    setPursueOffset(v: Vector2D): AutoPilot { this.__pursueOffset.set(v); return this; }
    set pursueOffset(v: Vector2D) { this.__pursueOffset.set(v); }
    get pursueOffset(): Vector2D { return this.__pursueOffset; }


    /*
     * ======================================================================
     * INTERPOSE
     * ======================================================================
     */
    interpose(owner: Vehicle, agent0: Mover, agent1: Mover) {
        // first we need to figure out where the two agents are going to be at
        // time T in the future. This is approximated by determining the time
        // taken to reach the mid way point at the current time at at max speed.
        let currMidPoint = agent0.pos.add(agent1.pos).div(2);
        let timeToReachMidPoint = Vector2D.dist(owner.pos, currMidPoint) / owner.maxSpeed;

        // now we have T, we assume that agent A and agent B will continue on a
        // straight trajectory and extrapolate to get their future positions
        let agent0Pos = agent0.vel.mult(timeToReachMidPoint).add(agent0.pos);
        let agent1Pos = agent1.vel.mult(timeToReachMidPoint).add(agent1.pos);
        let target = agent0Pos.add(agent1Pos).div(2);

        return this.arrive(owner, target, FAST);
    }

    /** Switch off pursuit behaviour */
    interposeOff(): AutoPilot {
        this._flags &= (ALL_SB_MASK - INTERPOSE); return this;
    }

    /** Switch on interpose behaviour     */
    interposeOn(agent0: Mover, other: Entity | Vector2D | Position): AutoPilot {
        this._flags |= INTERPOSE;
        this.agent0 = agent0;
        // Create a dummy Mover with zero velocity to simplify calculations if needed
        if (other instanceof Mover)
            this.agent1 = other;
        else if (other instanceof Entity)
            this.agent1 = new Mover(other.pos);
        else
            this.agent1 = new Mover(Vector2D.from(other));
        return this;
    }

    /** Is pursuit switched off? */
    get isInterposeOn(): boolean { return (this._flags & INTERPOSE) != 0; }

    _agent0: Mover;
    setAgent0(a: Mover): AutoPilot { this._agent0 = a; return this; }
    get agent0(): Mover { return this._agent0; }
    set agent0(a: Mover) { this._agent0 = a; }

    _agent1: Mover;
    setAgent1(a: Mover): AutoPilot { this._agent1 = a; return this; }
    set agent1(a: Mover) { this._agent1 = a; }
    get agent1(): Mover { return this._agent1; }


    /*
     * ======================================================================
     * WANDER
     * ======================================================================
     */
    wander(owner: Vehicle, elapsedTime: number) {
        function rnd(n: number) { return (Math.random() - Math.random()) * n; }
        let delta = this.__wanderJitter;
        // Add small displacement to wander target
        this._wanderTarget = this._wanderTarget.add(rnd(delta), rnd(delta));
        // Project target on to wander circle
        this._wanderTarget = this._wanderTarget.resize(this.__wanderRadius);
        // Get local target position
        let targetLocal = this._wanderTarget.add(this.__wanderDist, 0);
        // Calculate the world position based on owner
        let targetWorld = Transform.pointToWorldSpace(targetLocal, owner.heading.normalize(), owner.side.normalize(), owner.pos);
        return targetWorld.sub(owner.pos);
    }

    /** Switch off wander behaviour */
    wanderOff(): AutoPilot {
        this._flags &= (ALL_SB_MASK - WANDER);
        return this;
    }

    /** Switch on wander behaviour */
    wanderOn(): AutoPilot {
        // Calculate iniitial wander target to directly ahead of of owner
        this._wanderTarget = this.owner.heading.resize(this.__wanderRadius);
        this._flags |= WANDER;
        return this;
    }

    /** Is wander switched on?    */
    get isWanderOn(): boolean { return (this._flags & WANDER) != 0; }

    // radius of the constraining circle for the wander behaviour
    __wanderRadius = 30.0;
    setWanderRadius(n: number): AutoPilot { this.__wanderRadius = n; return this; }
    set wanderRadius(n: number) { this.__wanderRadius = n; }
    get wanderRadius() { return this.__wanderRadius; }

    // distance the wander circle is projected in front of the agent
    __wanderDist = 80.0;
    setWanderDist(n: number): AutoPilot { this.__wanderDist = n; return this; }
    set wanderDist(n: number) { this.__wanderDist = n; }
    get wanderDist() { return this.__wanderDist; }

    // Maximum jitter per update
    __wanderJitter = 2.5;
    setWanderJitter(n: number): AutoPilot { this.__wanderJitter = n; return this; }
    set wanderJitter(n: number) { this.__wanderJitter = n; }
    get wanderJitter() { return this.__wanderJitter; }

    // The target lies on the circumference of the wander circle
    _wanderTarget: Vector2D = new Vector2D();
    get wanderTarget(): Vector2D { return this._wanderTarget; }


    /*
     * ======================================================================
     * OBSTACLE AVOIDANCE
     * ======================================================================
     */

    obstacleAvoidance(owner: Vehicle, world: World, elapsedTime: number) {
        // Calculate the length of the detection box
        this.boxLength = this.detectBoxLength * (1 + owner.speed / owner.maxSpeed);
        // Calculate the search distance for obstacles
        let sd = this.boxLength + world._biggestObsColRad;
        // Get all obstacles inside search distance
        let pos = owner.pos;
        let result = world.tree.getItemsInRegion(pos.x - sd, pos.y - sd, pos.x + sd, pos.y + sd);
        //let obs = result.entities.filter(e => e.type == OBSTACLE);
        let obs = result.entities.filter(e => e instanceof Obstacle);
        this.testObstaclesFound = [...obs]; // ============================   TEST TEST  
        // Get vehicle velocity and side vectors (normalized)
        if (owner.vel.lengthSq() < EPSILON) return Vector2D.ZERO;
        let velocity = owner.vel.normalize();
        let vside = velocity.getPerp();
        // Details of  closest obstacle and closest intersection point
        let closestIO: Entity;
        let localPosOfClosestIO: Vector2D;
        let distToClosestIP = Number.MAX_VALUE;
        for (let ob of obs) {
            let localPos = Transform.pointToLocalSpace(ob.pos, velocity, vside, pos);
            let cX = localPos.x, cY = localPos.y
            let expandedRadius = ob.colRad + owner.colRad;
            if (cX >= 0 && cX < this.boxLength + expandedRadius && Math.abs(cY) < expandedRadius) {
                let sqrtPart = Math.sqrt(expandedRadius * expandedRadius - cY * cY);
                let ip = cX - sqrtPart;
                if (ip <= 0) ip = localPos.x + sqrtPart
                if (ip < distToClosestIP) {
                    distToClosestIP = ip;
                    closestIO = ob;
                    localPosOfClosestIO = localPos;
                }
            }
        }
        this.testClosestObstacle = closestIO;  // ============================   TEST TEST  
        if (closestIO) {
            let multiplier = 1 + (this.boxLength - localPosOfClosestIO.x) / this.boxLength;
            let fy = (closestIO.colRad - localPosOfClosestIO.y) * multiplier; // * 0.5;
            let brakingWeight = 0.01;
            let fx = (closestIO.colRad - localPosOfClosestIO.x) * brakingWeight;
            return Transform.vectorToWorldSpace(new Vector2D(fx, fy), velocity, vside);
        }
        return Vector2D.ZERO;
    }

    /**
     * @return this auto-pilot object
     */
    obsAvoidOff(): AutoPilot {
        this._flags &= (ALL_SB_MASK - OBSTACLE_AVOID);
        return this;
    }

    /**
     * @return this auto-pilot object
     */
    obsAvoidOn(): AutoPilot {
        this._flags |= OBSTACLE_AVOID;
        return this;
    }

    /** Is obstacle avoidance switched on?    */
    get isObsAvoidOn(): boolean { return (this._flags & OBSTACLE_AVOID) != 0; }

    __detectBoxLength = 20;
    setDetectBoxLength(n: number): AutoPilot { this.__detectBoxLength = n; return this; }
    set detectBoxLength(n: number) { this.__detectBoxLength = n; }
    get detectBoxLength(): number { return this.__detectBoxLength; }


    /*
     * ======================================================================
     * WALL AVOIDANCE
     * ======================================================================
     */

    wallAvoidance(owner: Vehicle, world: World, elapsedTime: number) {
        let pos = owner.pos, fl = this.__feelerLength;
        let result = world.tree.getItemsInRegion(pos.x - fl, pos.y - fl, pos.x + fl, pos.y + fl);
        let walls = result.entities.filter(w => w.type == WALL &&
            Geom2D.line_circle(w.start.x, w.start.y, w.end.x, w.end.y, pos.x, pos.y, fl));
        this.testWallsFound = [...walls]; // ============================   TEST TEST  
        // Details of  closest wall and closest intersection point
        let closestWall: Wall;
        let closestPoint: Vector2D;
        let distToClosestIP = Number.MAX_VALUE;
        let feeler: Vector2D;
        let feelers = owner.pilot.getFeelers();
        for (let wall of walls) {
            for (let flr of feelers) {
                let intercept = Geom2D.line_line_pv(owner.pos, flr, wall.start, wall.end);
                if (intercept) {
                    let distToThisIP = Vector2D.dist(intercept, pos);
                    if (distToThisIP < distToClosestIP) {
                        closestWall = wall;
                        closestPoint = intercept;
                        feeler = flr;
                    }
                }
            }
        }
        if (closestWall && closestWall.repelSide != NO_SIDE) {
            let v_side = Geom2D.which_side_pp(
                closestWall.start.x, closestWall.start.y,
                closestWall.end.x, closestWall.end.y,
                pos.x, pos.y);
            let r_side = closestWall.repelSide;
            let overShootLength = feeler.sub(closestPoint).length();
            if (v_side == Geom2D.PLANE_OUTSIDE && (r_side == OUTSIDE || r_side == BOTH_SIDES))
                return closestWall.norm.mult(overShootLength);
            else if (v_side == Geom2D.PLANE_INSIDE && (r_side == INSIDE || r_side == BOTH_SIDES))
                return closestWall.norm.mult(-overShootLength);
        }
        return Vector2D.ZERO;

    }

    /** Switch off wander behaviour     */
    wallAvoidOff(): AutoPilot {
        this._flags &= (ALL_SB_MASK - WALL_AVOID);
        return this;
    }

    /** Switch on wander behaviour     */
    wallAvoidOn(): AutoPilot {
        this._flags |= WALL_AVOID;
        return this;
    }

    /** Is wall avoidance switched on?    */
    get isWallAvoidOn(): boolean { return (this._flags & WALL_AVOID) != 0; }

    /**
     * Calculates and returns an array of feelers around the vehicle that
     * owns this steering behaviour.
     */
    getFeelers(owner = this.owner): Array<Vector2D> {
        return this.createFeelers(
            this.__nbrFeelers, // Number of feelers
            this.__feelerLength, // Whisker length
            this.__feelerFOV, // fov
            owner.heading, // facing
            owner.pos // origin
        );
    }

    // *******************    WALL AVOID    *******************
    __nbrFeelers = 5;
    setNbrFeelers(n: number): AutoPilot { this.__nbrFeelers = n; return this; }
    set nbrFeelers(n: number) { this.__nbrFeelers = n; }
    get nbrFeelers(): number { return this.__nbrFeelers; }

    __feelerFOV = Math.PI; // radians
    setFeelerFOV(n: number): AutoPilot { this.__feelerFOV = n; return this; }
    set feelerFOV(n: number) { this.__feelerFOV = n; }
    get feelerFOV(): number { return this.__feelerFOV; }

    __feelerLength = 30;
    setFeelerLength(n: number): AutoPilot { this.__feelerLength = n; return this; }
    set feelerLength(n: number) { this.__feelerLength = n; }
    get feelerLength(): number { return this.__feelerLength; }

    __ovalEnvelope = false;
    setOvalEnvelope(b: boolean): AutoPilot { this.__ovalEnvelope = b; return this; }
    set ovalEnvelope(b: boolean) { this.__ovalEnvelope = b; }
    get ovalEnvelope(): boolean { return this.__ovalEnvelope };


    /**
     * Used internally by the getFeelers() methods. <br>
     * Given an origin, a facing direction, a 'field of view' describing the
     * limit of the outer feelers, a whisker length and the number of feelers
     * this method returns a vector containing the end positions of a series
     * of feelers radiating away from the origin and with equal distance between
     * them. (like the spokes of a wheel clipped to a specific segment size)
     * 
     * @param nbrFeelers   number of feelers (>=1)
     * @param feelerLength (the length of the feelers)
     * @param fov           the 'field of view'
     * @param facing        the vehicle's heading
     * @param origin        the vehicle's position
     * @return an array of feelers for wall avoidance
     */
    createFeelers(
        nbrFeelers: number,
        feelerLength: number,
        fov: number,
        facing: Vector2D,
        origin: Vector2D): Array<Vector2D> {

        // this is the magnitude of the angle separating each whisker
        let angleBetweenFeelers = fov / (nbrFeelers - 1);
        let feelers: Array<Vector2D> = [];
        let angle = -fov * 0.5;
        for (let w = 0; w < nbrFeelers; ++w) {
            let temp = Transform.vec2DRotateAroundOrigin(facing, angle);
            if (this.__ovalEnvelope)
                temp = temp.mult(feelerLength * (0.75 + 0.25 * Math.abs(Math.cos(angle))));
            else
                temp = temp.mult(feelerLength);
            temp = temp.add(origin);
            feelers.push(temp);
            angle += angleBetweenFeelers;
        }
        return feelers;
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

        if (this.isWallAvoidOn) {
            let f = this.wallAvoidance(owner, world, elapsedTime);
            f = f.mult(this._weight[BIT_WALL_AVOID]);
            recorder?.addData(BIT_WALL_AVOID, f);
            if (!this.accumulateForce(accumulator, f, maxForce))
                return accumulator;
        }
        if (this.isObsAvoidOn) {
            let f = this.obstacleAvoidance(owner, world, elapsedTime);
            f = f.mult(this._weight[BIT_OBSTACLE_AVOID]);
            recorder?.addData(BIT_OBSTACLE_AVOID, f);
            if (!this.accumulateForce(accumulator, f, maxForce))
                return accumulator;
        }
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
        if (this.isOffsetPusuitOn) {
            console.log('offset pursuit calculate')
            let f = this.offsetPursuit(owner, this.pursueAgent, this.pursueOffset);
            f = f.mult(this._weight[BIT_OFFSET_PURSUIT]);
            recorder?.addData(BIT_OFFSET_PURSUIT, f);
            if (!this.accumulateForce(accumulator, f, maxForce))
                return accumulator;
        }
        if (this.isInterposeOn) {
            let f = this.interpose(owner, this.agent0, this.agent1);
            f = f.mult(this._weight[BIT_INTERPOSE]);
            recorder?.addData(BIT_INTERPOSE, f);
            if (!this.accumulateForce(accumulator, f, maxForce))
                return accumulator;
        }
        if (this.isHideOn) {
            let f = this.hide(owner, world, this.hideFromAgent);
            f = f.mult(this._weight[BIT_HIDE]);
            recorder?.addData(BIT_HIDE, f);
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
        40.0, // obstacle avoidance weight
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
        5.0, // hide weight
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