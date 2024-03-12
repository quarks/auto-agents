var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AutoPilot_instances, _AutoPilot_owner, _AutoPilot_flags, _AutoPilot_boxLength, _AutoPilot_target, _AutoPilot_arriveRate, _AutoPilot_arriveDist, _AutoPilot_fleeTarget, _AutoPilot_fleeRadius, _AutoPilot_evadeAgent, _AutoPilot_hideFromAgent, _AutoPilot_pursueAgent, _AutoPilot_pursueOffset, _AutoPilot_agent0, _AutoPilot_agent1, _AutoPilot_getPathEdges, _AutoPilot_pathTarget, _AutoPilot_path, _AutoPilot_edges, _AutoPilot_cyclicPath, _AutoPilot_psd, _AutoPilot_pad, _AutoPilot_currEdge, _AutoPilot_weight;
class AutoPilot {
    constructor(owner) {
        _AutoPilot_instances.add(this);
        _AutoPilot_owner.set(this, void 0);
        _AutoPilot_flags.set(this, 0);
        // Extra variables needed to draw hints
        _AutoPilot_boxLength.set(this, 0);
        _AutoPilot_target.set(this, new Vector2D()); // Target for both arrive and seek behaviours
        // Deceleration rate for arrive
        _AutoPilot_arriveRate.set(this, NORMAL);
        _AutoPilot_arriveDist.set(this, 1);
        _AutoPilot_fleeTarget.set(this, new Vector2D());
        // Panic distance squared for flee to be effective
        _AutoPilot_fleeRadius.set(this, 100);
        _AutoPilot_evadeAgent.set(this, void 0);
        _AutoPilot_hideFromAgent.set(this, void 0);
        this.__hideSearchRange = 100;
        this.__hideStandoffDist = 20;
        _AutoPilot_pursueAgent.set(this, void 0);
        _AutoPilot_pursueOffset.set(this, new Vector2D());
        _AutoPilot_agent0.set(this, void 0);
        _AutoPilot_agent1.set(this, void 0);
        // radius of the constraining circle for the wander behaviour
        this.__wanderRadius = 20.0;
        // distance the wander circle is projected in front of the agent
        this.__wanderDist = 80.0;
        // Maximum jitter per update
        this.__wanderJitter = 40;
        // The following fields have public getters for drawing hints
        this._wanderAngle = 0;
        this._wanderAngleDelta = 0;
        this._wanderTarget = new Vector2D();
        this.__detectBoxLength = 20;
        this.__nbrFeelers = 5;
        this.__feelerFOV = Math.PI; // radians
        this.__feelerLength = 30;
        this.__ovalEnvelope = false;
        // The maximum distance between moving entities for them to be considered
        // as neighbours. Used for group behaviours
        this.__neighbourDist = 100.0;
        _AutoPilot_pathTarget.set(this, void 0);
        _AutoPilot_path.set(this, []);
        _AutoPilot_edges.set(this, []);
        _AutoPilot_cyclicPath.set(this, false);
        _AutoPilot_psd.set(this, 20);
        _AutoPilot_pad.set(this, 1);
        _AutoPilot_currEdge.set(this, void 0);
        /** Default values for steering behaviour objects. */
        _AutoPilot_weight.set(this, [
            200.0,
            80.0,
            5.0,
            0.5,
            1.0,
            4.0,
            15.0,
            0.5,
            1.0,
            5.0,
            20.0,
            10.0,
            10.0,
            10.0,
            20.0,
            4.0 // flock weight
        ]);
        __classPrivateFieldSet(this, _AutoPilot_owner, owner, "f");
    }
    get owner() { return __classPrivateFieldGet(this, _AutoPilot_owner, "f"); }
    set owner(owner) { __classPrivateFieldSet(this, _AutoPilot_owner, owner, "f"); }
    setBoxLength(n) { __classPrivateFieldSet(this, _AutoPilot_boxLength, n, "f"); return this; }
    set boxLength(n) { __classPrivateFieldSet(this, _AutoPilot_boxLength, n, "f"); }
    get boxLength() { return __classPrivateFieldGet(this, _AutoPilot_boxLength, "f"); }
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
    setWeights(weights) {
        if (!weights || typeof weights !== 'object')
            return this;
        for (let w in weights) {
            let index = WEIGHTS_INDEX.get(w);
            if (index)
                __classPrivateFieldGet(this, _AutoPilot_weight, "f")[index] = weights[w];
            else
                console.error(`Cannot set the weighting for "${w}" it is not a recognised steering behaviour.`);
        }
        return this;
    }
    /**
     * Switch off all steering behaviours
     * @return this auto-pilot object
     */
    allOff() {
        __classPrivateFieldSet(this, _AutoPilot_flags, 0, "f");
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
    seek(owner, target) {
        let desiredVelocity = target.sub(this.owner.pos);
        desiredVelocity = desiredVelocity.normalize();
        desiredVelocity = desiredVelocity.mult(owner.maxSpeed);
        return desiredVelocity.sub(owner.vel);
    }
    /** Switch off seek behaviour   */
    seekOff() {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") & (ALL_SB_MASK - SEEK), "f");
        return this;
    }
    /** Switch on seek behaviour and change target if anothe is provided    */
    seekOn(target) {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") | SEEK, "f");
        __classPrivateFieldSet(this, _AutoPilot_target, Vector2D.from(target), "f");
        return this;
    }
    /** Is seek switched on?   */
    get isSeekOn() { return (__classPrivateFieldGet(this, _AutoPilot_flags, "f") & SEEK) != 0; }
    setTarget(t) { __classPrivateFieldGet(this, _AutoPilot_target, "f").set(t); return this; }
    set target(t) { __classPrivateFieldGet(this, _AutoPilot_target, "f").set(t); }
    get target() { return __classPrivateFieldGet(this, _AutoPilot_target, "f"); }
    /*
     * ======================================================================
     * ARRIVE
     * ======================================================================
     */
    arrive(owner, target, tweak = __classPrivateFieldGet(this, _AutoPilot_arriveRate, "f")) {
        let toTarget = target.sub(owner.pos), dist = toTarget.length();
        if (dist > __classPrivateFieldGet(this, _AutoPilot_arriveDist, "f")) {
            let rate = dist / DECEL_TWEEK[tweak];
            let speed = Math.min(owner.maxSpeed, rate);
            let desiredVelocity = toTarget.mult(speed / dist);
            return desiredVelocity.sub(owner.vel);
        }
        return Vector2D.ZERO;
    }
    /** Switch off arrive  behaviour   */
    arriveOff() {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") & (ALL_SB_MASK - ARRIVE), "f");
        return this;
    }
    /**
     * Switch on arrive behaviour
     * @param target the position to arrive at
     * @param rate rate of approach (SLOW, NORMAL or FAST)
     */
    arriveOn(target, rate) {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") | ARRIVE, "f");
        __classPrivateFieldSet(this, _AutoPilot_target, Vector2D.from(target), "f");
        if (rate)
            __classPrivateFieldSet(this, _AutoPilot_arriveRate, rate, "f");
        return this;
    }
    /** Is arrive switched on?   */
    get isArriveOn() { return (__classPrivateFieldGet(this, _AutoPilot_flags, "f") & ARRIVE) != 0; }
    setArriveRate(n) {
        if (n == SLOW || n == FAST)
            __classPrivateFieldSet(this, _AutoPilot_arriveRate, n, "f");
        else
            __classPrivateFieldSet(this, _AutoPilot_arriveRate, NORMAL, "f");
        return this;
    }
    set arriveRate(n) { __classPrivateFieldSet(this, _AutoPilot_arriveRate, n, "f"); }
    get arriveRate() { return __classPrivateFieldGet(this, _AutoPilot_arriveRate, "f"); }
    set arriveDist(n) { __classPrivateFieldSet(this, _AutoPilot_arriveDist, n, "f"); }
    get arriveDist() { return __classPrivateFieldGet(this, _AutoPilot_arriveDist, "f"); }
    /*
     * ======================================================================
     * FLEE
     * ======================================================================
     */
    flee(owner, target) {
        let panicDist = Vector2D.dist(owner.pos, target);
        if (panicDist >= __classPrivateFieldGet(this, _AutoPilot_fleeRadius, "f"))
            return Vector2D.ZERO;
        let desiredVelocity = this.owner.pos.sub(target);
        desiredVelocity = desiredVelocity.normalize();
        desiredVelocity = desiredVelocity.mult(owner.maxSpeed);
        return desiredVelocity.sub(owner.vel);
    }
    /** Switch off flee behaviour   */
    fleeOff() {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") & (ALL_SB_MASK - FLEE), "f");
        return this;
    }
    /** Switch on flee behaviour and change flee target if provided.    */
    fleeOn(target, fleeRadius) {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") | FLEE, "f");
        __classPrivateFieldSet(this, _AutoPilot_fleeTarget, Vector2D.from(target), "f");
        if (fleeRadius)
            __classPrivateFieldSet(this, _AutoPilot_fleeRadius, fleeRadius, "f");
        return this;
    }
    /** Is seek switched on?   */
    get isFleeOn() { return (__classPrivateFieldGet(this, _AutoPilot_flags, "f") & FLEE) != 0; }
    setFleeTarget(t) { __classPrivateFieldGet(this, _AutoPilot_fleeTarget, "f").set(t); return this; }
    set fleeTarget(t) { __classPrivateFieldGet(this, _AutoPilot_fleeTarget, "f").set(t); }
    get fleeTarget() { return __classPrivateFieldGet(this, _AutoPilot_fleeTarget, "f"); }
    get fleeRadius() { return __classPrivateFieldGet(this, _AutoPilot_fleeRadius, "f"); }
    set fleeRadius(n) { __classPrivateFieldSet(this, _AutoPilot_fleeRadius, n, "f"); }
    /*
     * ======================================================================
     * EVADE
     * ======================================================================
     */
    evade(owner, pursuer) {
        let fromAgent = pursuer.pos.sub(owner.pos);
        let lookAheadTime = fromAgent.length() / (owner.maxSpeed + pursuer.vel.length());
        let target = pursuer.pos.add(pursuer.vel.mult(lookAheadTime));
        return this.flee(owner, target);
    }
    /** Switch off evade  */
    evadeOff() {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") & (ALL_SB_MASK - EVADE), "f");
        return this;
    }
    /**
     * @param agent the agent to evade
     * @returns this auto-pilot object
     */
    evadeOn(agent) {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") | EVADE, "f");
        this.evadeAgent = agent;
        return this;
    }
    /** Is evade switched on?   */
    get isEvadeOn() { return (__classPrivateFieldGet(this, _AutoPilot_flags, "f") & EVADE) != 0; }
    setEvadeAgent(a) { __classPrivateFieldSet(this, _AutoPilot_evadeAgent, a, "f"); return this; }
    set evadeAgent(a) { __classPrivateFieldSet(this, _AutoPilot_evadeAgent, a, "f"); }
    get evadeAgent() { return __classPrivateFieldGet(this, _AutoPilot_evadeAgent, "f"); }
    /*
     * ======================================================================
     * HIDE
     * ======================================================================
     */
    hide(owner, world, hideFrom) {
        // Calculate the search distance for obstacles
        let sd = this.__hideSearchRange + world.maxObstacleSize;
        // Get all obstacles inside search distance
        let pos = owner.pos;
        let result = world.tree.getItemsInRegion(pos.x - sd, pos.y - sd, pos.x + sd, pos.y + sd);
        let obs = result.entities.filter(e => e instanceof Obstacle);
        // console.log(`Found ${obs.length} obstacles for hiding behind`);
        let distToNearest = Number.MAX_VALUE;
        let bestHidingSpot;
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
    getHidingPosition(owner, hideFrom, ob) {
        let toOb = ob.pos.sub(hideFrom.pos).normalize();
        let hidingSpot = toOb.mult(ob.colRad + owner.colRad + this.hideStandoffDist).add(ob.pos);
        return hidingSpot;
    }
    /** Switch off evade  */
    hideOff() {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") & (ALL_SB_MASK - HIDE), "f");
        return this;
    }
    /**
     * @param agent the agent to hide from
     * @returns this auto-pilot object
     */
    hideOn(agent) {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") | HIDE, "f");
        this.hideFromAgent = agent;
        return this;
    }
    /** Is hide switched on?   */
    get isHideOn() { return (__classPrivateFieldGet(this, _AutoPilot_flags, "f") & HIDE) != 0; }
    setHideFromAgent(m) { __classPrivateFieldSet(this, _AutoPilot_hideFromAgent, m, "f"); return this; }
    set hideFromAgent(m) { __classPrivateFieldSet(this, _AutoPilot_hideFromAgent, m, "f"); }
    get hideFromAgent() { return __classPrivateFieldGet(this, _AutoPilot_hideFromAgent, "f"); }
    setHideSearchRange(n) { this.__hideSearchRange = n; return this; }
    set hideSearchRange(n) { this.__hideSearchRange = n; }
    get hideSearchRange() { return this.__hideSearchRange; }
    setHideStandoffDist(n) { this.__hideStandoffDist = n; return this; }
    set hideStandoffDist(n) { this.__hideStandoffDist = n; }
    get hideStandoffDist() { return this.__hideStandoffDist; }
    /*
     * ======================================================================
     * PURSUIT
     * ======================================================================
     */
    pursuit(owner, toPursue) {
        let toAgent = toPursue.pos.sub(owner.pos);
        let relativeHeading = owner.heading.dot(toPursue.heading);
        if (toAgent.dot(owner.heading) > 0 && relativeHeading > -0.95) // acos(0.95)=18 degs
            return this.seek(owner, toPursue.pos);
        let lookAheadTime = toAgent.length() / (owner.maxSpeed + toPursue.vel.length());
        let target = toPursue.pos.add(toPursue.vel.mult(lookAheadTime));
        return this.seek(owner, target);
    }
    /** Switch off pursuit behaviour */
    pursuitOff() {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") & (ALL_SB_MASK - PURSUIT), "f");
        return this;
    }
    /** Switch on pursuit behaviour and set agent to pursue     */
    pursuitOn(agent) {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") | PURSUIT, "f");
        this.pursueAgent = agent;
        return this;
    }
    /** Is pursuit switched off? */
    get isPusuitOn() { return (__classPrivateFieldGet(this, _AutoPilot_flags, "f") & PURSUIT) != 0; }
    setPursueAgent(a) { __classPrivateFieldSet(this, _AutoPilot_pursueAgent, a, "f"); return this; }
    set pursueAgent(a) { __classPrivateFieldSet(this, _AutoPilot_pursueAgent, a, "f"); }
    get pursueAgent() { return __classPrivateFieldGet(this, _AutoPilot_pursueAgent, "f"); }
    /*
     * ======================================================================
     * OFFSET PURSUIT
     * ======================================================================
     */
    offsetPursuit(owner, leader, offset) {
        // calculate the offset's position in world space
        let worldOffsetPos = Transform.pointToWorldSpace(offset, leader.heading, leader.side, leader.pos);
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
    /** Switch off pursuit behaviour */
    offsetPursuitOff() {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") & (ALL_SB_MASK - OFFSET_PURSUIT), "f");
        return this;
    }
    /** Switch on pursuit behaviour and set agent to pursue     */
    offsetPursuitOn(agent, offset) {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") | OFFSET_PURSUIT, "f");
        this.pursueAgent = agent;
        this.pursueOffset = offset;
        return this;
    }
    /** Is pursuit switched off? */
    get isOffsetPusuitOn() { return (__classPrivateFieldGet(this, _AutoPilot_flags, "f") & OFFSET_PURSUIT) != 0; }
    setPursueOffset(v) { __classPrivateFieldGet(this, _AutoPilot_pursueOffset, "f").set(v); return this; }
    set pursueOffset(v) { __classPrivateFieldGet(this, _AutoPilot_pursueOffset, "f").set(v); }
    get pursueOffset() { return __classPrivateFieldGet(this, _AutoPilot_pursueOffset, "f"); }
    /*
     * ======================================================================
     * INTERPOSE
     * ======================================================================
     */
    interpose(owner, agent0, agent1) {
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
    interposeOff() {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") & (ALL_SB_MASK - INTERPOSE), "f");
        return this;
    }
    /** Switch on interpose behaviour     */
    interposeOn(agent0, other) {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") | INTERPOSE, "f");
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
    get isInterposeOn() { return (__classPrivateFieldGet(this, _AutoPilot_flags, "f") & INTERPOSE) != 0; }
    setAgent0(a) { __classPrivateFieldSet(this, _AutoPilot_agent0, a, "f"); return this; }
    get agent0() { return __classPrivateFieldGet(this, _AutoPilot_agent0, "f"); }
    set agent0(a) { __classPrivateFieldSet(this, _AutoPilot_agent0, a, "f"); }
    setAgent1(a) { __classPrivateFieldSet(this, _AutoPilot_agent1, a, "f"); return this; }
    set agent1(a) { __classPrivateFieldSet(this, _AutoPilot_agent1, a, "f"); }
    get agent1() { return __classPrivateFieldGet(this, _AutoPilot_agent1, "f"); }
    /*
     * ======================================================================
     * WANDER
     * ======================================================================
     */
    wander(owner, elapsedTime) {
        function rnd() { return (Math.random() - Math.random()); }
        // this behaviour is dependent on the update rate, so this line must
        // be included when using time independent frame rate.
        this._wanderAngleDelta = this.__wanderJitter * elapsedTime;
        this._wanderAngle += this._wanderAngleDelta * rnd();
        // Not really essential considering the range of the type double.
        if (this._wanderAngle < WANDER_MIN_ANGLE)
            this._wanderAngle += WANDER_ANGLE_RANGE;
        else if (this._wanderAngle > WANDER_MAX_ANGLE)
            this._wanderAngle -= WANDER_ANGLE_RANGE;
        // Calculate position on wander circle
        this._wanderTarget = new Vector2D(this.__wanderRadius * Math.cos(this._wanderAngle), this.__wanderRadius * Math.sin(this._wanderAngle));
        // Add wander distance
        this._wanderTarget = this._wanderTarget.add(this.__wanderDist, 0);
        // project the target into world space
        let targetWorld = Transform.pointToWorldSpace(this._wanderTarget, owner.heading.normalize(), owner.side.normalize(), owner.pos);
        // and steer towards it
        return targetWorld.sub(owner.pos);
    }
    /** Switch off wander behaviour */
    wanderOff() {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") & (ALL_SB_MASK - WANDER), "f");
        return this;
    }
    /** Switch on wander behaviour */
    wanderOn() {
        // Calculate iniitial wander target to directly ahead of of owner
        this._wanderTarget = this.owner.heading.resize(this.__wanderRadius);
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") | WANDER, "f");
        return this;
    }
    /** Is wander switched on?    */
    get isWanderOn() { return (__classPrivateFieldGet(this, _AutoPilot_flags, "f") & WANDER) != 0; }
    setWanderRadius(n) { this.__wanderRadius = n; return this; }
    set wanderRadius(n) { this.__wanderRadius = n; }
    get wanderRadius() { return this.__wanderRadius; }
    setWanderDist(n) { this.__wanderDist = n; return this; }
    set wanderDist(n) { this.__wanderDist = n; }
    get wanderDist() { return this.__wanderDist; }
    setWanderJitter(n) { this.__wanderJitter = n; return this; }
    set wanderJitter(n) { this.__wanderJitter = n; }
    get wanderJitter() { return this.__wanderJitter; }
    get wanderAngle() { return this._wanderAngle; }
    get wanderAngleDelta() { return this._wanderAngleDelta; }
    get wanderTarget() { return this._wanderTarget; }
    /*
     * ======================================================================
     * OBSTACLE AVOIDANCE
     * ======================================================================
     */
    obstacleAvoidance(owner, world, elapsedTime) {
        // Calculate the length of the detection box
        this.boxLength = this.detectBoxLength * (1 + owner.speed / owner.maxSpeed);
        // Calculate the search distance for obstacles
        let sd = this.boxLength + world.maxObstacleSize;
        // Get all obstacles inside search distance
        let pos = owner.pos;
        let result = world.tree.getItemsInRegion(pos.x - sd, pos.y - sd, pos.x + sd, pos.y + sd);
        let obs = result.entities.filter(e => e instanceof Obstacle);
        this.testObstaclesFound = [...obs]; // ============================   TEST TEST  
        // Get vehicle velocity and side vectors (normalized)
        if (owner.vel.lengthSq() < EPSILON)
            return Vector2D.ZERO;
        let velocity = owner.vel.normalize();
        let vside = velocity.getPerp();
        // Details of  closest obstacle and closest intersection point
        let closestIO;
        let localPosOfClosestIO;
        let distToClosestIP = Number.MAX_VALUE;
        for (let ob of obs) {
            let localPos = Transform.pointToLocalSpace(ob.pos, velocity, vside, pos);
            let cX = localPos.x, cY = localPos.y;
            let expandedRadius = ob.colRad + owner.colRad;
            if (cX >= 0 && cX < this.boxLength + expandedRadius && Math.abs(cY) < expandedRadius) {
                let sqrtPart = Math.sqrt(expandedRadius * expandedRadius - cY * cY);
                let ip = cX - sqrtPart;
                if (ip <= 0)
                    ip = localPos.x + sqrtPart;
                if (ip < distToClosestIP) {
                    distToClosestIP = ip;
                    closestIO = ob;
                    localPosOfClosestIO = localPos;
                }
            }
        }
        this.testClosestObstacle = closestIO; // ============================   TEST TEST  
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
    obsAvoidOff() {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") & (ALL_SB_MASK - OBSTACLE_AVOID), "f");
        return this;
    }
    /**
     * @return this auto-pilot object
     */
    obsAvoidOn() {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") | OBSTACLE_AVOID, "f");
        return this;
    }
    /** Is obstacle avoidance switched on?    */
    get isObsAvoidOn() { return (__classPrivateFieldGet(this, _AutoPilot_flags, "f") & OBSTACLE_AVOID) != 0; }
    setDetectBoxLength(n) { this.__detectBoxLength = n; return this; }
    set detectBoxLength(n) { this.__detectBoxLength = n; }
    get detectBoxLength() { return this.__detectBoxLength; }
    /*
     * ======================================================================
     * WALL AVOIDANCE
     * ======================================================================
     */
    wallAvoidance(owner, world, elapsedTime) {
        let pos = owner.pos, fl = this.__feelerLength;
        let result = world.tree.getItemsInRegion(pos.x - fl, pos.y - fl, pos.x + fl, pos.y + fl);
        //this.testWallsConsidered = result.entities.filter(w => w instanceof Wall);      // ============================   TEST TEST  
        let walls = result.entities.filter(w => w instanceof Wall &&
            Geom2D.line_circle(w.start.x, w.start.y, w.end.x, w.end.y, pos.x, pos.y, fl));
        //this.testWallsFound = [...walls];                                               // ============================   TEST TEST  
        // Details of  closest wall and closest intersection point
        let closestWall;
        let closestPoint;
        let distToClosestIP = Number.MAX_VALUE;
        let feeler;
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
            let v_side = Geom2D.which_side_pp(closestWall.start.x, closestWall.start.y, closestWall.end.x, closestWall.end.y, pos.x, pos.y);
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
    wallAvoidOff() {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") & (ALL_SB_MASK - WALL_AVOID), "f");
        return this;
    }
    /** Switch on wander behaviour     */
    wallAvoidOn() {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") | WALL_AVOID, "f");
        return this;
    }
    /** Is wall avoidance switched on?    */
    get isWallAvoidOn() { return (__classPrivateFieldGet(this, _AutoPilot_flags, "f") & WALL_AVOID) != 0; }
    /**
     * Calculates and returns an array of feelers around the vehicle that
     * owns this steering behaviour.
     */
    getFeelers(owner = this.owner) {
        return this._createFeelers(this.__nbrFeelers, // Number of feelers
        this.__feelerLength, // Feeler length
        this.__feelerFOV, // fov
        owner.heading, // facing
        owner.pos // origin
        );
    }
    setNbrFeelers(n) { this.__nbrFeelers = n; return this; }
    set nbrFeelers(n) { this.__nbrFeelers = n; }
    get nbrFeelers() { return this.__nbrFeelers; }
    setFeelerFOV(n) { this.__feelerFOV = n; return this; }
    set feelerFOV(n) { this.__feelerFOV = n; }
    get feelerFOV() { return this.__feelerFOV; }
    setFeelerLength(n) { this.__feelerLength = n; return this; }
    set feelerLength(n) { this.__feelerLength = n; }
    get feelerLength() { return this.__feelerLength; }
    setOvalEnvelope(b) { this.__ovalEnvelope = b; return this; }
    set ovalEnvelope(b) { this.__ovalEnvelope = b; }
    get ovalEnvelope() { return this.__ovalEnvelope; }
    ;
    _createFeelers(nbrFeelers, // Number of feelers
    feelerLength, // Feeler length
    fov, // Field of view (radians)  between extreme feelers
    facing, // vehicle's heading
    origin // vehicle's position
    ) {
        let angleBetweenFeelers = fov / (nbrFeelers - 1);
        let feelers = [];
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
    /*
     * ======================================================================
     * FLOCK
     * ======================================================================
     */
    flock(owner, world, ndist = this.__neighbourDist) {
        let neighbours = this.getNeighbours(owner, world, ndist);
        let nCount = neighbours.length;
        if (nCount > 0) {
            let cohForce = new Vector2D(); // Cohesion
            let sepForce = new Vector2D(); // Separation
            let alnForce = new Vector2D(); // Alignment
            for (let nb of neighbours) {
                let distSq = Vector2D.distSq(owner.pos, nb.pos);
                cohForce = cohForce.add(nb.pos);
                alnForce = alnForce.add(nb.heading);
                sepForce = owner.pos.sub(nb.pos).div(distSq).add(sepForce);
            }
            // Cohesion
            cohForce = cohForce.div(nCount).sub(owner.pos).normalize()
                .mult(owner.maxSpeed).sub(owner.vel).normalize()
                .mult(__classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_COHESION]);
            // Separation
            sepForce = sepForce.mult(__classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_SEPARATION]);
            // Alignment
            alnForce = alnForce.div(nCount).sub(owner.heading)
                .mult(__classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_ALIGNMENT]);
            // Add them to get flock force
            let flockForce = cohForce.add(sepForce).add(alnForce);
            return flockForce;
        }
        return Vector2D.ZERO;
    }
    /** Switch off flocking     */
    flockOff() {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") & (ALL_SB_MASK - FLOCK), "f");
        return this;
    }
    /** Switch on flocking    */
    flockOn(ndist = this.__neighbourDist) {
        this.__neighbourDist = ndist;
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") | FLOCK, "f");
        return this;
    }
    /** Is flocking switched on?    */
    get isFlockOn() { return (__classPrivateFieldGet(this, _AutoPilot_flags, "f") & FLOCK) != 0; }
    setNeighbourDist(n) { this.__neighbourDist = n; return this; }
    set neighbourDist(n) { this.__neighbourDist = n; }
    get neighbourDist() { return this.__neighbourDist; }
    getNeighbours(owner, world, ndist = this.__neighbourDist) {
        let pos = owner.pos;
        let ndist2 = ndist * ndist;
        let items = world.tree.getItemsInRegion(pos.x - ndist, pos.y - ndist, pos.x + ndist, pos.y + ndist);
        let neighbours = items.entities.filter(e => e instanceof Vehicle
            && Vector2D.distSq(e.pos, pos) <= ndist2
            && e != owner && e != this.evadeAgent);
        this.testNeighbours = neighbours; // For test purposes only
        return neighbours;
    }
    /*
     * ======================================================================
     * ALIGNMENT
     * ======================================================================
     */
    alignment(owner, world, ndist = this.__neighbourDist) {
        let avgHeading = new Vector2D();
        let neighbours = this.getNeighbours(owner, world, ndist);
        if (neighbours.length > 0) {
            for (let nb of neighbours)
                avgHeading = avgHeading.add(nb.heading);
            avgHeading.div(neighbours.length).sub(owner.heading);
        }
        return avgHeading;
    }
    /** Switch off alignment     */
    alignmentOff() {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") & (ALL_SB_MASK - ALIGNMENT), "f");
        return this;
    }
    /** Switch on alignment    */
    alignmentOn() {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") | ALIGNMENT, "f");
        return this;
    }
    /** Is wall avoidance switched on?    */
    get isAlignmentOn() { return (__classPrivateFieldGet(this, _AutoPilot_flags, "f") & ALIGNMENT) != 0; }
    /*
     * ======================================================================
     * SEPARATION
     * ======================================================================
     */
    separation(owner, world, ndist = this.__neighbourDist) {
        let sf = new Vector2D();
        let neighbours = this.getNeighbours(owner, world, ndist);
        for (let nb of neighbours) {
            let toAgent = owner.pos.sub(nb.pos);
            let nbf = toAgent.normalize().div(toAgent.length());
            sf = sf.add(nbf);
        }
        //if (neighbours.length > 0) sf = sf.normalize();
        return sf;
    }
    /** Switch off separation     */
    separationOff() {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") & (ALL_SB_MASK - SEPARATION), "f");
        return this;
    }
    /** Switch on separation    */
    separationOn() {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") | SEPARATION, "f");
        return this;
    }
    /** Is separation switched on?    */
    get isSeparationOn() { return (__classPrivateFieldGet(this, _AutoPilot_flags, "f") & SEPARATION) != 0; }
    /*
     * ======================================================================
     * COHESION
     * ======================================================================
     */
    cohesion(owner, world, ndist = this.__neighbourDist) {
        let centreOfMass = new Vector2D(), sf = new Vector2D();
        let neighbours = this.getNeighbours(owner, world, ndist);
        let nCount = neighbours.length;
        if (nCount > 0) {
            for (let nb of neighbours)
                centreOfMass = centreOfMass.add(nb.pos);
            centreOfMass = centreOfMass.div(nCount);
            return this.seek(owner, centreOfMass);
        }
        return sf;
    }
    /** Switch off cohesion     */
    cohesionOff() {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") & (ALL_SB_MASK - COHESION), "f");
        return this;
    }
    /** Switch on cohsion    */
    cohesionOn() {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") | COHESION, "f");
        return this;
    }
    /** Is cohesion switched on?    */
    get isCohesionOn() { return (__classPrivateFieldGet(this, _AutoPilot_flags, "f") & COHESION) != 0; }
    /*
     * ======================================================================
     * PATH
     * ======================================================================
     */
    path(owner, world) {
        //let path = this.#path, edges = this.#edges; //  pathTarget = this.#pathTarget;
        // console.log(this.#path.length, this.#pathTarget)
        if (__classPrivateFieldGet(this, _AutoPilot_pathTarget, "f")) {
            let pd = (__classPrivateFieldGet(this, _AutoPilot_path, "f").length == 1) ? __classPrivateFieldGet(this, _AutoPilot_pad, "f") : __classPrivateFieldGet(this, _AutoPilot_psd, "f");
            if (__classPrivateFieldGet(this, _AutoPilot_pathTarget, "f").distSq(owner.pos) < pd) {
                __classPrivateFieldSet(this, _AutoPilot_currEdge, __classPrivateFieldGet(this, _AutoPilot_edges, "f")[0], "f");
                __classPrivateFieldGet(this, _AutoPilot_cyclicPath, "f") ? __classPrivateFieldGet(this, _AutoPilot_path, "f").push(__classPrivateFieldGet(this, _AutoPilot_path, "f").shift()) : __classPrivateFieldGet(this, _AutoPilot_path, "f").shift();
                // if (this.#path.length > 0)
                //     this.#cyclicPath ? this.#edges.push(this.#edges.shift()) : this.#edges.shift();
                if (__classPrivateFieldGet(this, _AutoPilot_path, "f").length > 0) {
                    __classPrivateFieldGet(this, _AutoPilot_cyclicPath, "f") ? __classPrivateFieldGet(this, _AutoPilot_edges, "f").push(__classPrivateFieldGet(this, _AutoPilot_edges, "f").shift()) : __classPrivateFieldGet(this, _AutoPilot_edges, "f").shift();
                    __classPrivateFieldSet(this, _AutoPilot_pathTarget, Vector2D.from(__classPrivateFieldGet(this, _AutoPilot_path, "f")[0]), "f");
                }
            }
        }
        switch (__classPrivateFieldGet(this, _AutoPilot_path, "f").length) {
            case 0:
                this.pathOff();
                return Vector2D.ZERO;
            case 1: return this.arrive(owner, __classPrivateFieldGet(this, _AutoPilot_pathTarget, "f"), FAST);
            default: return this.seek(owner, __classPrivateFieldGet(this, _AutoPilot_pathTarget, "f"));
        }
    }
    /** Switch off path     */
    pathOff() {
        __classPrivateFieldSet(this, _AutoPilot_pathTarget, undefined, "f");
        __classPrivateFieldSet(this, _AutoPilot_path, [], "f");
        __classPrivateFieldSet(this, _AutoPilot_edges, [], "f");
        this.owner.vel = Vector2D.ZERO;
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") & (ALL_SB_MASK - PATH), "f");
        return this;
    }
    /** Switch on path    */
    pathOn(path, cyclic = false) {
        if (!Array.isArray(path) || path.length <= 1)
            return this;
        __classPrivateFieldSet(this, _AutoPilot_path, [...path], "f");
        __classPrivateFieldSet(this, _AutoPilot_edges, __classPrivateFieldGet(this, _AutoPilot_instances, "m", _AutoPilot_getPathEdges).call(this, __classPrivateFieldGet(this, _AutoPilot_path, "f"), cyclic), "f");
        let isOwnerAtStart = __classPrivateFieldGet(this, _AutoPilot_owner, "f").pos.equals(Vector2D.from(path[0]));
        if (isOwnerAtStart)
            cyclic ? __classPrivateFieldGet(this, _AutoPilot_path, "f").push(__classPrivateFieldGet(this, _AutoPilot_path, "f").shift()) : __classPrivateFieldGet(this, _AutoPilot_path, "f").shift();
        __classPrivateFieldSet(this, _AutoPilot_cyclicPath, cyclic && (__classPrivateFieldGet(this, _AutoPilot_path, "f").length == __classPrivateFieldGet(this, _AutoPilot_edges, "f").length || __classPrivateFieldGet(this, _AutoPilot_edges, "f").length == 0), "f");
        __classPrivateFieldSet(this, _AutoPilot_pathTarget, Vector2D.from(__classPrivateFieldGet(this, _AutoPilot_path, "f")[0]), "f");
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") | PATH, "f");
        return this;
    }
    /** Is path switched on?    */
    get isPathOn() { return (__classPrivateFieldGet(this, _AutoPilot_flags, "f") & PATH) != 0; }
    get pathNodes() { return [...__classPrivateFieldGet(this, _AutoPilot_path, "f")]; }
    ;
    get pathEdges() { return [...__classPrivateFieldGet(this, _AutoPilot_edges, "f")]; }
    ;
    get isPathCyclic() { return __classPrivateFieldGet(this, _AutoPilot_cyclicPath, "f"); }
    setPathSeekDist(n) { __classPrivateFieldSet(this, _AutoPilot_psd, n * n, "f"); return this; }
    set pathSeekDist(n) { __classPrivateFieldSet(this, _AutoPilot_psd, n * n, "f"); }
    get pathSeekDist() { return Math.sqrt(__classPrivateFieldGet(this, _AutoPilot_psd, "f")); }
    setPathArriveDist(n) { __classPrivateFieldSet(this, _AutoPilot_pad, n * n, "f"); return this; }
    set pathArriveDist(n) { __classPrivateFieldSet(this, _AutoPilot_pad, n * n, "f"); }
    get pathArriveDist() { return Math.sqrt(__classPrivateFieldGet(this, _AutoPilot_pad, "f")); }
    get nextEdge() { return __classPrivateFieldGet(this, _AutoPilot_edges, "f").length > 0 ? __classPrivateFieldGet(this, _AutoPilot_edges, "f")[0] : undefined; }
    get currNode() { return __classPrivateFieldGet(this, _AutoPilot_path, "f").length > 0 ? __classPrivateFieldGet(this, _AutoPilot_path, "f")[0] : undefined; }
    get currEdge() { return __classPrivateFieldGet(this, _AutoPilot_currEdge, "f"); }
    // ########################################################################
    //                          FORCE CALCULATOR
    // ########################################################################
    calculateForce(elapsedTime, world) {
        let owner = this.owner;
        let maxForce = owner.maxForce;
        let recorder = owner.recorder;
        let sumForces = { x: 0, y: 0 };
        if (this.isWallAvoidOn) {
            let f = this.wallAvoidance(owner, world, elapsedTime);
            f = f.mult(__classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_WALL_AVOID]);
            recorder?.addData(IDX_WALL_AVOID, f, __classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_WALL_AVOID]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        if (this.isObsAvoidOn) {
            let f = this.obstacleAvoidance(owner, world, elapsedTime);
            f = f.mult(__classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_OBSTACLE_AVOID]);
            recorder?.addData(IDX_OBSTACLE_AVOID, f, __classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_OBSTACLE_AVOID]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        if (this.isEvadeOn) {
            let f = this.evade(owner, this.evadeAgent);
            f = f.mult(__classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_EVADE]);
            recorder?.addData(IDX_EVADE, f, __classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_EVADE]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        if (this.isFleeOn) {
            let f = this.flee(owner, this.fleeTarget);
            f = f.mult(__classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_FLEE]);
            recorder?.addData(IDX_FLEE, f, __classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_FLEE]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        if (this.isFlockOn) {
            let f = this.flock(owner, world);
            f = f.mult(__classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_FLOCK]);
            recorder?.addData(IDX_FLOCK, f, __classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_FLOCK]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        else {
            if (this.isSeparationOn) {
                let f = this.separation(owner, world);
                f.mult(__classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_SEPARATION]);
                recorder?.addData(IDX_SEPARATION, f, __classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_SEPARATION]);
                if (!this.accumulateForce(sumForces, f, maxForce))
                    return Vector2D.from(sumForces);
            }
            if (this.isAlignmentOn) {
                let f = this.alignment(owner, world);
                f.mult(__classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_ALIGNMENT]);
                recorder?.addData(IDX_ALIGNMENT, f, __classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_ALIGNMENT]);
                if (!this.accumulateForce(sumForces, f, maxForce))
                    return Vector2D.from(sumForces);
            }
            if (this.isCohesionOn) {
                let f = this.cohesion(owner, world);
                f.mult(__classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_COHESION]);
                recorder?.addData(IDX_COHESION, f, __classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_COHESION]);
                if (!this.accumulateForce(sumForces, f, maxForce))
                    return Vector2D.from(sumForces);
            }
        }
        if (this.isSeekOn) {
            let f = this.seek(owner, this.target);
            f = f.mult(__classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_SEEK]);
            recorder?.addData(IDX_SEEK, f, __classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_SEEK]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        if (this.isArriveOn) {
            let f = this.arrive(owner, this.target);
            f = f.mult(__classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_ARRIVE]);
            recorder?.addData(IDX_ARRIVE, f, __classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_ARRIVE]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        if (this.isWanderOn) {
            let f = this.wander(owner, elapsedTime);
            f = f.mult(__classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_WANDER]);
            recorder?.addData(IDX_WANDER, f, __classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_WANDER]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        if (this.isPusuitOn) {
            let f = this.pursuit(owner, this.pursueAgent);
            f = f.mult(__classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_PURSUIT]);
            recorder?.addData(IDX_PURSUIT, f, __classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_PURSUIT]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        if (this.isOffsetPusuitOn) {
            let f = this.offsetPursuit(owner, this.pursueAgent, this.pursueOffset);
            f = f.mult(__classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_OFFSET_PURSUIT]);
            recorder?.addData(IDX_OFFSET_PURSUIT, f, __classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_OFFSET_PURSUIT]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        if (this.isInterposeOn) {
            let f = this.interpose(owner, this.agent0, this.agent1);
            f = f.mult(__classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_INTERPOSE]);
            recorder?.addData(IDX_INTERPOSE, f, __classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_INTERPOSE]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        if (this.isHideOn) {
            let f = this.hide(owner, world, this.hideFromAgent);
            f = f.mult(__classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_HIDE]);
            recorder?.addData(IDX_HIDE, f, __classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_HIDE]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        if (this.isPathOn) {
            let f = this.path(owner, world);
            f = f.mult(__classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_PATH]);
            recorder?.addData(IDX_PATH, f, __classPrivateFieldGet(this, _AutoPilot_weight, "f")[IDX_PATH]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        return Vector2D.from(sumForces);
    }
    /**
     * This method is used by the PRIORITISED force calculation method. <br>
     * For each active behaviour in turn it calculates how much of the
     * maximum steering force is left then adds that amount of to the accumulator.
     *
     * @param forceSoFar   running total of calculated forces
     * @param forceToAdd   the force we want to add from the current behaviour
     * @param maxForce     the maximum force available.
     * @return true if we have not reached the maximum permitted force.
     */
    accumulateForce(forceSoFar, forceToAdd, maxForce) {
        // calculate how much steering force the vehicle has used so far
        //       let magSoFar = totalForceSoFar.length();
        let magSoFar = Math.sqrt(forceSoFar.x * forceSoFar.x + forceSoFar.y * forceSoFar.y);
        // calculate how much steering force remains to be used by this vehicle
        let magLeft = maxForce - magSoFar;
        // calculate the magnitude of the force we want to add
        let magToAdd = forceToAdd.length();
        // if the magnitude of the sum of ForceToAdd and the running total
        // does not exceed the maximum force available to this vehicle, just
        // add together. Otherwise add as much of the ForceToAdd vector is
        // possible without going over the max.
        if (magToAdd < magLeft) {
            forceSoFar.x = forceSoFar.x + forceToAdd.x;
            forceSoFar.y = forceSoFar.y + forceToAdd.y;
            return true;
        }
        else {
            forceToAdd = forceToAdd.normalize();
            forceToAdd = forceToAdd.mult(magLeft);
            // add it to the steering force
            forceSoFar.x = forceSoFar.x + forceToAdd.x;
            forceSoFar.y = forceSoFar.y + forceToAdd.y;
            return false;
        }
    }
    off(behaviours) {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") & (ALL_SB_MASK - behaviours), "f");
        return this;
    }
    on(behaviours) {
        __classPrivateFieldSet(this, _AutoPilot_flags, __classPrivateFieldGet(this, _AutoPilot_flags, "f") | (ALL_SB_MASK & behaviours), "f");
        return this;
    }
    setWeighting(bhvrIdx, weight) {
        if (Number.isFinite(bhvrIdx) && Number.isFinite(weight)) {
            if (bhvrIdx > 0 && bhvrIdx < NBR_BEHAVIOURS)
                __classPrivateFieldGet(this, _AutoPilot_weight, "f")[bhvrIdx] = weight;
            else
                console.error(`Uanble to set the weighting for behaiour ID ${bhvrIdx}`);
        }
        return this;
    }
    getWeighting(bhvrIdx) {
        if (Number.isFinite(bhvrIdx) && bhvrIdx > 0 && bhvrIdx < NBR_BEHAVIOURS)
            return __classPrivateFieldGet(this, _AutoPilot_weight, "f")[bhvrIdx];
        else
            return 0;
    }
    get weightsArray() { return __classPrivateFieldGet(this, _AutoPilot_weight, "f"); }
    ;
}
_AutoPilot_owner = new WeakMap(), _AutoPilot_flags = new WeakMap(), _AutoPilot_boxLength = new WeakMap(), _AutoPilot_target = new WeakMap(), _AutoPilot_arriveRate = new WeakMap(), _AutoPilot_arriveDist = new WeakMap(), _AutoPilot_fleeTarget = new WeakMap(), _AutoPilot_fleeRadius = new WeakMap(), _AutoPilot_evadeAgent = new WeakMap(), _AutoPilot_hideFromAgent = new WeakMap(), _AutoPilot_pursueAgent = new WeakMap(), _AutoPilot_pursueOffset = new WeakMap(), _AutoPilot_agent0 = new WeakMap(), _AutoPilot_agent1 = new WeakMap(), _AutoPilot_pathTarget = new WeakMap(), _AutoPilot_path = new WeakMap(), _AutoPilot_edges = new WeakMap(), _AutoPilot_cyclicPath = new WeakMap(), _AutoPilot_psd = new WeakMap(), _AutoPilot_pad = new WeakMap(), _AutoPilot_currEdge = new WeakMap(), _AutoPilot_weight = new WeakMap(), _AutoPilot_instances = new WeakSet(), _AutoPilot_getPathEdges = function _AutoPilot_getPathEdges(path, cyclic) {
    let nodes = path.filter(n => n instanceof GraphNode);
    let edges = [], nl = cyclic ? nodes.length : nodes.length;
    for (let idx = 0; idx < nl; idx++) {
        let edge = nodes[idx].edge(nodes[(idx + 1) % nl].id);
        if (edge)
            edges.push(edge);
    }
    return edges;
};
//# sourceMappingURL=autopilot.js.map