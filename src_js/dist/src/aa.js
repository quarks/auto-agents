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
var _AutoPilot_instances, _AutoPilot_owner, _AutoPilot_flags, _AutoPilot_boxLength, _AutoPilot_target, _AutoPilot_arriveRate, _AutoPilot_arriveDist, _AutoPilot_fleeTarget, _AutoPilot_fleeRadius, _AutoPilot_evadeAgent, _AutoPilot_hideFromAgent, _AutoPilot_pursueAgent, _AutoPilot_pursueOffset, _AutoPilot_agent0, _AutoPilot_agent1, _AutoPilot_getPathEdges, _AutoPilot_pathTarget, _AutoPilot_path, _AutoPilot_edges, _AutoPilot_cyclicPath, _AutoPilot_psd, _AutoPilot_pad, _AutoPilot_currEdge, _AutoPilot_weight, _Domain_lowX, _Domain_highX, _Domain_lowY, _Domain_highY, _Domain_cX, _Domain_cY, _Domain_width, _Domain_height, _Domain_constraint, _QPart_instances, _QPart_entities, _QPart_parent, _QPart_children, _QPart_level, _QPart_depth, _QPart_lowX, _QPart_highX, _QPart_lowY, _QPart_highY, _QPart_cX, _QPart_cY, _QPart_childAt, _World_instances, _World_births, _World_deaths, _World_domain, _World_population, _World_dispatcher, _World_painter, _World_width, _World_height, _World_tree, _World_elapsedTime, _World_maxObstacleSize, _World_preventOverlap, _World_addEntity, _World_delEntity, _World_ensureNoOverlap, _World_testForOverlap, _Vector2D_p, _Artefact_lowX, _Artefact_highX, _Artefact_lowY, _Artefact_highY, _Artefact_width, _Artefact_height, _a, _Entity_NEXT_ID, _Entity_id, _Entity_pos, _Entity_colRad, _Entity_tag, _Entity_fsm, _Entity_painter, _Entity_visible, _Fence_lowX, _Fence_lowY, _Fence_highX, _Fence_highY, _Fence_tri, _Fence_walls, _Fence_contour, _Mover_domain, _Mover_prevPos, _Mover_vel, _Mover_side, _Vehicle_autopilot, _Vehicle_forceRecorder, _Vehicle_force, _Vehicle_accel, _Wall_start, _Wall_end, _Wall_norm, _Wall_repelSide, _FiniteStateMachine_owner, _FiniteStateMachine_currentState, _FiniteStateMachine_previousState, _FiniteStateMachine_globalState, _Telegram_sender, _Telegram_receiver, _Telegram_msgID, _Telegram_delay, _Telegram_extraInfo, _Dispatcher_telegrams, _Dispatcher_world, _State_name, _State_world, _GraphEdge_from, _GraphEdge_to, _GraphEdge_name, _GraphEdge_cost, _GraphNode_edges, _GraphNode_id, _GraphNode_p, _GraphNode_graphCost, _GraphNode_fullCost, _Graph_instances, _Graph_nodes, _Graph_floatingEdges, _Graph_name, _Graph_searchDFS, _Graph_searchBFS, _Graph_searchDijkstra, _Graph_searchAstar, _Graph_isSearchValid, _ForceRecorder_owner, _ForceRecorder_forces, _ForceRecorder_nbrReadings, _Force_forceName, _Force_min, _Force_max, _Force_s1, _Force_s2, _Force_n, _Force_weight;
export { AutoPilot, sceneFromJSON, graphFromJSON, Graph, Entity, Artefact };
class AutoPilot {
    constructor(owner) {
        _AutoPilot_instances.add(this);
        _AutoPilot_owner.set(this, void 0);
        // _world: World;
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
const ENTITY = Symbol.for('Entity');
const ARTEFACT = Symbol.for('Artefact');
const MOVER = Symbol.for('Mover');
const VEHICLE = Symbol.for('Vehicle');
const OBSTACLE = Symbol.for('Obstacle');
const WALL = Symbol.for('Wall');
const FENCE = Symbol.for('Fence');
// Bit positions for flags for internal library use.
// These are used to index the force
const IDX_WALL_AVOID = 0;
const IDX_OBSTACLE_AVOID = 1;
const IDX_EVADE = 2;
const IDX_FLEE = 3;
const IDX_SEPARATION = 4; // These three
const IDX_ALIGNMENT = 5; // together for
const IDX_COHESION = 6; // flocking
const IDX_SEEK = 7;
const IDX_ARRIVE = 8;
const IDX_WANDER = 9;
const IDX_PURSUIT = 10;
const IDX_OFFSET_PURSUIT = 11;
const IDX_INTERPOSE = 12;
const IDX_HIDE = 13;
const IDX_PATH = 14;
const IDX_FLOCK = 15;
const WEIGHTS_INDEX = new Map()
    .set('Wall Avoid', '0').set('Obstacle Avoid', 1).set('Evade', 2).set(`Flee`, 3)
    .set('Separation', 4).set('Alignment', 5).set('Cohesion', 6).set('Seek', 7)
    .set('Arrive', 8).set('Wander', 9).set('Pursuit', 10).set('Offset Pursuit', 11)
    .set('Interpose', 12).set('Hide', 13).set('Path', 14).set('Flock', 15);
const NBR_BEHAVIOURS = 16;
// Behaviour identifier constants (flag values)
const WALL_AVOID = 1 << IDX_WALL_AVOID;
const OBSTACLE_AVOID = 1 << IDX_OBSTACLE_AVOID;
const EVADE = 1 << IDX_EVADE;
const FLEE = 1 << IDX_FLEE;
const SEPARATION = 1 << IDX_SEPARATION; //  These three
const ALIGNMENT = 1 << IDX_ALIGNMENT; //  together for
const COHESION = 1 << IDX_COHESION; //      flocking
const SEEK = 1 << IDX_SEEK;
const ARRIVE = 1 << IDX_ARRIVE;
const WANDER = 1 << IDX_WANDER;
const PURSUIT = 1 << IDX_PURSUIT;
const OFFSET_PURSUIT = 1 << IDX_OFFSET_PURSUIT;
const INTERPOSE = 1 << IDX_INTERPOSE;
const HIDE = 1 << IDX_HIDE;
const PATH = 1 << IDX_PATH;
const FLOCK = 1 << IDX_FLOCK;
// All behaviours mask used when switching off a behaviour
const ALL_SB_MASK = 0x0000ffff;
// Arrive
const DECEL_TWEEK = [0.0, 0.3, 0.6, 0.9];
const FAST = 1;
const NORMAL = 2;
const SLOW = 3;
// Wander
const WANDER_MIN_ANGLE = -Math.PI;
const WANDER_MAX_ANGLE = Math.PI;
const WANDER_ANGLE_RANGE = WANDER_MAX_ANGLE - WANDER_MIN_ANGLE;
// Wall avoid
const NO_SIDE = Symbol.for('noside');
const INSIDE = Symbol.for('inside');
const OUTSIDE = Symbol.for('outside');
const BOTH_SIDES = Symbol.for('bothsides');
const MAX_TURN_RATE = 25;
// Domain
const PASS_THROUGH = Symbol.for('passthrough');
const WRAP = Symbol.for('wrap');
const REBOUND = Symbol.for('rebound');
const EPSILON = 1E-10;
const PREC = 5;
const FXD = 2;
class Domain {
    constructor(lowX, lowY, highX, highY, constraint = REBOUND) {
        _Domain_lowX.set(this, void 0);
        _Domain_highX.set(this, void 0);
        _Domain_lowY.set(this, void 0);
        _Domain_highY.set(this, void 0);
        _Domain_cX.set(this, void 0);
        _Domain_cY.set(this, void 0);
        _Domain_width.set(this, void 0);
        _Domain_height.set(this, void 0);
        _Domain_constraint.set(this, REBOUND);
        __classPrivateFieldSet(this, _Domain_lowX, lowX, "f");
        __classPrivateFieldSet(this, _Domain_lowY, lowY, "f");
        __classPrivateFieldSet(this, _Domain_highX, highX, "f");
        __classPrivateFieldSet(this, _Domain_highY, highY, "f");
        __classPrivateFieldSet(this, _Domain_width, highX - lowX, "f");
        __classPrivateFieldSet(this, _Domain_height, highY - lowY, "f");
        __classPrivateFieldSet(this, _Domain_cX, (lowX + highX) / 2, "f");
        __classPrivateFieldSet(this, _Domain_cY, (lowY + highY) / 2, "f");
        __classPrivateFieldSet(this, _Domain_constraint, constraint, "f");
    }
    /**
     * Create a Domain object given the top-left and bottom-right coordinates.
     * @param lowX
     * @param lowY
     * @param highX
     * @param highY
     */
    // Domain attribute getters
    get lowX() { return __classPrivateFieldGet(this, _Domain_lowX, "f"); }
    get highX() { return __classPrivateFieldGet(this, _Domain_highX, "f"); }
    get lowY() { return __classPrivateFieldGet(this, _Domain_lowY, "f"); }
    get highY() { return __classPrivateFieldGet(this, _Domain_highY, "f"); }
    get cX() { return __classPrivateFieldGet(this, _Domain_cX, "f"); }
    get cY() { return __classPrivateFieldGet(this, _Domain_cY, "f"); }
    get width() { return __classPrivateFieldGet(this, _Domain_width, "f"); }
    get height() { return __classPrivateFieldGet(this, _Domain_height, "f"); }
    get constraint() { return __classPrivateFieldGet(this, _Domain_constraint, "f"); }
    set constraint(c) {
        if (c == REBOUND || c == WRAP || c == PASS_THROUGH)
            __classPrivateFieldSet(this, _Domain_constraint, c, "f");
    }
    setConstraint(c) {
        if (c == REBOUND || c == WRAP || c == PASS_THROUGH)
            __classPrivateFieldSet(this, _Domain_constraint, c, "f");
        return this;
    }
    /** returns a copy of this domain object */
    copy() {
        return new Domain(__classPrivateFieldGet(this, _Domain_lowX, "f"), __classPrivateFieldGet(this, _Domain_lowY, "f"), __classPrivateFieldGet(this, _Domain_highX, "f"), __classPrivateFieldGet(this, _Domain_highY, "f"), __classPrivateFieldGet(this, _Domain_constraint, "f"));
    }
    /**
     * Create a Domain that is a copy of another one.
     * @param d domain to be copied
     */
    set_d(d) {
        __classPrivateFieldSet(this, _Domain_lowX, __classPrivateFieldGet(d, _Domain_lowX, "f"), "f");
        __classPrivateFieldSet(this, _Domain_lowY, __classPrivateFieldGet(d, _Domain_lowY, "f"), "f");
        __classPrivateFieldSet(this, _Domain_highX, __classPrivateFieldGet(d, _Domain_highX, "f"), "f");
        __classPrivateFieldSet(this, _Domain_highY, __classPrivateFieldGet(d, _Domain_highY, "f"), "f");
        __classPrivateFieldSet(this, _Domain_width, __classPrivateFieldGet(d, _Domain_width, "f"), "f");
        __classPrivateFieldSet(this, _Domain_height, __classPrivateFieldGet(d, _Domain_height, "f"), "f");
        __classPrivateFieldSet(this, _Domain_cX, __classPrivateFieldGet(d, _Domain_cX, "f"), "f");
        __classPrivateFieldSet(this, _Domain_cY, __classPrivateFieldGet(d, _Domain_cY, "f"), "f");
        __classPrivateFieldSet(this, _Domain_constraint, __classPrivateFieldGet(d, _Domain_constraint, "f"), "f");
    }
    /**
     * Set the domain size.
     * @param lowX top-left x coordinate
     * @param lowY top-left y coordinate
     * @param width domain width
     * @param height domain height
     */
    set_xywh(lowX, lowY, width, height) {
        __classPrivateFieldSet(this, _Domain_lowX, lowX, "f");
        __classPrivateFieldSet(this, _Domain_lowY, lowY, "f");
        __classPrivateFieldSet(this, _Domain_width, width, "f");
        __classPrivateFieldSet(this, _Domain_height, height, "f");
        __classPrivateFieldSet(this, _Domain_highX, lowX + width, "f");
        __classPrivateFieldSet(this, _Domain_highY, lowY + height, "f");
        __classPrivateFieldSet(this, _Domain_cX, (__classPrivateFieldGet(this, _Domain_lowX, "f") + __classPrivateFieldGet(this, _Domain_highX, "f")) / 2, "f");
        __classPrivateFieldSet(this, _Domain_cY, (__classPrivateFieldGet(this, _Domain_lowY, "f") + __classPrivateFieldGet(this, _Domain_highY, "f")) / 2, "f");
    }
    /**
     * Centre the domain about the given world position.
     * @param wx world x position
     * @param wy world y position
     */
    move_centre_xy_to(wx, wy) {
        __classPrivateFieldSet(this, _Domain_cX, wx, "f");
        __classPrivateFieldSet(this, _Domain_cY, wy, "f");
        __classPrivateFieldSet(this, _Domain_lowX, __classPrivateFieldGet(this, _Domain_cX, "f") - __classPrivateFieldGet(this, _Domain_width, "f") / 2, "f");
        __classPrivateFieldSet(this, _Domain_lowY, __classPrivateFieldGet(this, _Domain_cY, "f") - __classPrivateFieldGet(this, _Domain_height, "f") / 2, "f");
        __classPrivateFieldSet(this, _Domain_highX, __classPrivateFieldGet(this, _Domain_lowX, "f") + __classPrivateFieldGet(this, _Domain_width, "f"), "f");
        __classPrivateFieldSet(this, _Domain_highY, __classPrivateFieldGet(this, _Domain_lowY, "f") + __classPrivateFieldGet(this, _Domain_height, "f"), "f");
    }
    /**
     * Centre the domain about the given horizontal position.
     * @param wx world x position
     */
    move_centre_x_to(wx) {
        this.move_centre_xy_to(wx, __classPrivateFieldGet(this, _Domain_cY, "f"));
    }
    /**
     * Centre the domain about the given vertical position.
     * @param wy world y position
     */
    move_centre_y_to(wy) {
        this.move_centre_xy_to(__classPrivateFieldGet(this, _Domain_cX, "f"), wy);
    }
    /**
     * Centre the domain about the given position.
     * @param wx world x centre position
     * @param wy world y centre position
     */
    move_centre_xy_by(wx, wy) {
        __classPrivateFieldSet(this, _Domain_cX, __classPrivateFieldGet(this, _Domain_cX, "f") - wx, "f");
        __classPrivateFieldSet(this, _Domain_cY, __classPrivateFieldGet(this, _Domain_cY, "f") - wy, "f");
        __classPrivateFieldSet(this, _Domain_lowX, __classPrivateFieldGet(this, _Domain_lowX, "f") - wx, "f");
        __classPrivateFieldSet(this, _Domain_lowY, __classPrivateFieldGet(this, _Domain_lowY, "f") - wy, "f");
        __classPrivateFieldSet(this, _Domain_highX, __classPrivateFieldGet(this, _Domain_lowX, "f") + __classPrivateFieldGet(this, _Domain_width, "f"), "f");
        __classPrivateFieldSet(this, _Domain_highY, __classPrivateFieldGet(this, _Domain_lowY, "f") + __classPrivateFieldGet(this, _Domain_height, "f"), "f");
    }
    /**
     * Move the domain centre horizontally by the world distance given.
     * @param wx world x centre position
     */
    move_centre_x_by(wx) {
        this.move_centre_xy_by(wx, 0);
    }
    /**
     * Move the domain centre vertically by the world distance given.
     * @param wy world y centre position
     */
    move_centre_y_by(wy) {
        this.move_centre_xy_by(0, wy);
    }
    /**
     * See if this point is within the domain
     * @param x the x position or point to test
     * @param y the y position (optional)
     * @return true if the point is on or inside the boundary of this domain
     */
    contains(x, y) {
        if (x instanceof Vector2D) {
            y = x.y;
            x = x.x;
        }
        return (x >= __classPrivateFieldGet(this, _Domain_lowX, "f") && x <= __classPrivateFieldGet(this, _Domain_highX, "f") && y >= __classPrivateFieldGet(this, _Domain_lowY, "f") && y <= __classPrivateFieldGet(this, _Domain_highY, "f"));
    }
    /**
     * See if this point is within a box scaled by the second parameter. <br>
     * fraction must be >0 otherwise the function always returns false. A value
     * of 1 will test against the full size domain and a value of 0.5 means the
     * point p must be in the middle half both horizontally and vertically. <br>
     *
     * @param p the point to test
     * @param fraction the scale of the domain to consider
     * @return true if the point is on or inside the boundary of this scaled domain
     */
    // contains(p: Vector2D, fraction: number = 1) {
    // 	let dx = Math.abs(p.x - this.centre.x) / this.width;
    // 	let dy = Math.abs(p.y - this.centre.y) / this.height;
    // 	return (dx < fraction && dy < fraction);
    // }
    /**
     * Return the Domain as a String
     */
    toString() {
        let s = `Domain from ${__classPrivateFieldGet(this, _Domain_lowX, "f")}, ${__classPrivateFieldGet(this, _Domain_lowY, "f")} to ${__classPrivateFieldGet(this, _Domain_highX, "f")}, ${__classPrivateFieldGet(this, _Domain_highY, "f")}  `;
        s += `Size ${__classPrivateFieldGet(this, _Domain_width, "f")}, ${__classPrivateFieldGet(this, _Domain_height, "f")}  `;
        s += `Constraint: ${Symbol.keyFor(__classPrivateFieldGet(this, _Domain_constraint, "f"))}`;
        return s;
    }
}
_Domain_lowX = new WeakMap(), _Domain_highX = new WeakMap(), _Domain_lowY = new WeakMap(), _Domain_highY = new WeakMap(), _Domain_cX = new WeakMap(), _Domain_cY = new WeakMap(), _Domain_width = new WeakMap(), _Domain_height = new WeakMap(), _Domain_constraint = new WeakMap();
class QPart {
    /**
     * Creates a single partition in a quadtree structure.
     *
     * To create a quadtree data structure use the QPart.makeTree(...)
     * function.
     */
    constructor(parent, lowX, lowY, highX, highY, level, depth) {
        _QPart_instances.add(this);
        _QPart_entities.set(this, void 0);
        _QPart_parent.set(this, void 0);
        _QPart_children.set(this, void 0);
        _QPart_level.set(this, void 0);
        _QPart_depth.set(this, void 0);
        _QPart_lowX.set(this, void 0);
        _QPart_highX.set(this, void 0);
        _QPart_lowY.set(this, void 0);
        _QPart_highY.set(this, void 0);
        _QPart_cX.set(this, void 0);
        _QPart_cY.set(this, void 0);
        __classPrivateFieldSet(this, _QPart_parent, parent, "f");
        __classPrivateFieldSet(this, _QPart_lowX, lowX, "f");
        __classPrivateFieldSet(this, _QPart_lowY, lowY, "f");
        __classPrivateFieldSet(this, _QPart_highX, highX, "f");
        __classPrivateFieldSet(this, _QPart_highY, highY, "f");
        __classPrivateFieldSet(this, _QPart_cX, (__classPrivateFieldGet(this, _QPart_lowX, "f") + __classPrivateFieldGet(this, _QPart_highX, "f")) / 2, "f");
        __classPrivateFieldSet(this, _QPart_cY, (__classPrivateFieldGet(this, _QPart_lowY, "f") + __classPrivateFieldGet(this, _QPart_highY, "f")) / 2, "f");
        __classPrivateFieldSet(this, _QPart_level, level, "f");
        __classPrivateFieldSet(this, _QPart_depth, depth, "f");
        __classPrivateFieldSet(this, _QPart_entities, new Set(), "f");
    }
    get entities() { return [...__classPrivateFieldGet(this, _QPart_entities, "f")]; }
    get parent() { return __classPrivateFieldGet(this, _QPart_parent, "f"); }
    get children() { return __classPrivateFieldGet(this, _QPart_children, "f"); }
    get level() { return __classPrivateFieldGet(this, _QPart_level, "f"); }
    get depth() { return __classPrivateFieldGet(this, _QPart_depth, "f"); }
    get lowX() { return __classPrivateFieldGet(this, _QPart_lowX, "f"); }
    get highX() { return __classPrivateFieldGet(this, _QPart_highX, "f"); }
    get lowY() { return __classPrivateFieldGet(this, _QPart_lowY, "f"); }
    get highY() { return __classPrivateFieldGet(this, _QPart_highY, "f"); }
    get cX() { return __classPrivateFieldGet(this, _QPart_cX, "f"); }
    get cY() { return __classPrivateFieldGet(this, _QPart_cY, "f"); }
    get partSize() { return __classPrivateFieldGet(this, _QPart_highX, "f") - __classPrivateFieldGet(this, _QPart_lowX, "f"); }
    get treeSize() { return this.getRoot().partSize; }
    get leafSize() {
        return this.getRoot().partSize / 2 ** (__classPrivateFieldGet(this, _QPart_depth, "f") - 1);
    }
    get isLeaf() { return !__classPrivateFieldGet(this, _QPart_children, "f"); }
    get isRoot() { return !__classPrivateFieldGet(this, _QPart_parent, "f"); }
    get hasChildren() { return Boolean(__classPrivateFieldGet(this, _QPart_children, "f")); }
    getRoot() {
        return this.isRoot ? this : __classPrivateFieldGet(this, _QPart_parent, "f").getRoot();
    }
    // Find the partition that encompasses the specifies region. The specified region will be 
    // trimmed to fit inside the root if necessary.
    getEnclosingPartition(lowX, lowY, highX, highY) {
        function findPartition(p, x0, y0, x1, y1) {
            if ((x0 >= p.lowX && x1 <= p.highX && y0 >= p.lowY && y1 <= p.highY)) {
                if (p.hasChildren) {
                    let q = ((x0 < __classPrivateFieldGet(p, _QPart_cX, "f")) ? 0 : 1) + ((y0 < __classPrivateFieldGet(p, _QPart_cY, "f")) ? 0 : 2);
                    return findPartition(__classPrivateFieldGet(p, _QPart_children, "f")[q], x0, y0, x1, y1);
                }
                else
                    return p;
            }
            else
                return (p.isRoot ? p : __classPrivateFieldGet(p, _QPart_parent, "f"));
        }
        let root = this.getRoot();
        let a = Geom2D.box_box_p(lowX, lowY, highX, highY, root.lowX, root.lowY, root.highX, root.highY);
        if (a.length > 0) {
            [lowX, lowY, highX, highY] = a;
            return findPartition(root, lowX, lowY, highX, highY);
        }
        return root;
    }
    getItemsInRegion(lowX, lowY, highX, highY) {
        function getParent(part) {
            if (!part)
                return;
            parts.push(part);
            ents.push(...__classPrivateFieldGet(part, _QPart_entities, "f"));
            getParent(__classPrivateFieldGet(part, _QPart_parent, "f"));
        }
        function getChildren(part) {
            parts.push(part);
            ents.push(...__classPrivateFieldGet(part, _QPart_entities, "f"));
            if (part.hasChildren)
                for (let child of __classPrivateFieldGet(part, _QPart_children, "f"))
                    if (Geom2D.box_box(lowX, lowY, highX, highY, child.lowX, child.lowY, child.highX, child.highY))
                        getChildren(child);
            return;
        }
        let parts = [], ents = [];
        let encPart = this.getEnclosingPartition(lowX, lowY, highX, highY);
        getParent(__classPrivateFieldGet(encPart, _QPart_parent, "f"));
        getChildren(encPart);
        return { partitions: parts, entities: ents, enc_partition: encPart };
    }
    addEntity(entity) {
        function findPartition(part, entity) {
            if (entity.fitsInside(part.lowX, part.lowY, part.highX, part.highY)) {
                if (part.hasChildren)
                    findPartition(__classPrivateFieldGet(part, _QPart_instances, "m", _QPart_childAt).call(part, part, entity), entity);
                else
                    __classPrivateFieldGet(part, _QPart_entities, "f").add(entity);
            }
            else
                part.isRoot ? __classPrivateFieldGet(part, _QPart_entities, "f").add(entity) : __classPrivateFieldGet(__classPrivateFieldGet(part, _QPart_parent, "f"), _QPart_entities, "f").add(entity);
        }
        findPartition(this.getRoot(), entity);
    }
    delEntity(entity) {
        function findPartition(part, entity) {
            if (__classPrivateFieldGet(part, _QPart_entities, "f").delete(entity))
                return true;
            if (part.hasChildren)
                return findPartition(__classPrivateFieldGet(part, _QPart_instances, "m", _QPart_childAt).call(part, part, entity), entity);
            else
                return false;
        }
        return findPartition(this.getRoot(), entity);
    }
    countEntities() {
        function entityCount(part) {
            count += __classPrivateFieldGet(part, _QPart_entities, "f").size;
            if (part.hasChildren)
                for (let child of __classPrivateFieldGet(part, _QPart_children, "f"))
                    entityCount(child);
        }
        let count = 0;
        entityCount(this.getRoot());
        return count;
    }
    correctPartitionContents() {
        function processPartition(part, root) {
            // Only need to consider entiies that can move i.e. a Mover or Vehicle
            let me = [...__classPrivateFieldGet(part, _QPart_entities, "f")].filter(x => x instanceof Mover);
            for (let e of me) {
                if (e.fitsInside(part.lowX, part.lowY, part.highX, part.highY)) {
                    // Fits inside this partition attempt to move down as far as possible
                    if (part.hasChildren) {
                        let sp = __classPrivateFieldGet(part, _QPart_instances, "m", _QPart_childAt).call(part, part, e);
                        if (e.fitsInside(sp.lowX, sp.lowY, sp.highX, sp.highY)) {
                            __classPrivateFieldGet(part, _QPart_entities, "f").delete(e);
                            sp.addEntity(e);
                        }
                    }
                }
                else {
                    // Does not fit inside partition. If this is not the root then remove 
                    // from this partion and add back to tree
                    if (part != root) {
                        __classPrivateFieldGet(part, _QPart_entities, "f").delete(e);
                        root.addEntity(e);
                    }
                }
            }
            __classPrivateFieldGet(part, _QPart_children, "f")?.forEach(p => processPartition(p, root));
        }
        let root = this.getRoot();
        processPartition(root, root);
    }
    getTreeLevelData() {
        function CountEntitiesByLevel(part) {
            let s = 0;
            __classPrivateFieldGet(part, _QPart_entities, "f").forEach(e => { if (e instanceof Artefact)
                s++; });
            levelArtefact[0] += s;
            levelArtefact[part.level] += s;
            s = 0;
            __classPrivateFieldGet(part, _QPart_entities, "f").forEach(e => { if (e instanceof Fence)
                s++; });
            levelFence[0] += s;
            levelFence[part.level] += s;
            s = 0;
            __classPrivateFieldGet(part, _QPart_entities, "f").forEach(e => { if (e instanceof Wall)
                s++; });
            levelWall[0] += s;
            levelWall[part.level] += s;
            s = 0;
            __classPrivateFieldGet(part, _QPart_entities, "f").forEach(e => { if (e instanceof Obstacle)
                s++; });
            levelObstacle[0] += s;
            levelObstacle[part.level] += s;
            s = 0;
            __classPrivateFieldGet(part, _QPart_entities, "f").forEach(e => { if (e instanceof Mover)
                s++; });
            levelMover[0] += s;
            levelMover[part.level] += s;
            if (part.hasChildren)
                for (let child of part.children)
                    CountEntitiesByLevel(child);
        }
        let levelArtefact = new Array(this.depth + 1).fill(0);
        let levelMover = new Array(this.depth + 1).fill(0);
        let levelFence = new Array(this.depth + 1).fill(0);
        let levelWall = new Array(this.depth + 1).fill(0);
        let levelObstacle = new Array(this.depth + 1).fill(0);
        CountEntitiesByLevel(this.getRoot());
        return {
            'movers': levelMover, 'obstacles': levelObstacle, 'walls': levelWall,
            'fences': levelFence, 'artefacts': levelArtefact,
            'depth': this.depth, 'treesize': this.treeSize,
            'leafsize': this.leafSize, 'lowX': this.lowX, 'lowY': this.lowY
        };
    }
    $$(len = 5) {
        console.log(this.$(len));
        return this.toString(len);
    }
    $(len = 5) {
        return this.toString(len);
    }
    toString(len = 5) {
        function fmt(n, nd, bufferLength) {
            let s = n.toFixed(nd).toString();
            while (s.length < bufferLength)
                s = ' ' + s;
            return s;
        }
        let p = this, t = '', s = `Partition Lvl: ${fmt(__classPrivateFieldGet(p, _QPart_level, "f"), 0, 2)}`;
        s += `    @ [${fmt(p.lowX, 0, 5)}, ${fmt(p.lowY, 0, 5)}]`;
        s += ` to [${fmt(p.highX, 0, 5)}, ${fmt(p.highY, 0, 5)}]`;
        s += ` contains ${__classPrivateFieldGet(this, _QPart_entities, "f").size}  entities`;
        if (__classPrivateFieldGet(p, _QPart_entities, "f").size > 0)
            t = [...__classPrivateFieldGet(p, _QPart_entities, "f")].map(x => x.id).reduce((x, y) => x + ' ' + y, '  ### ');
        return s + t;
    }
    static makeTree(lowX, lowY, size, depth) {
        function buildSubTree(parent, level, depth) {
            if (level <= depth) {
                let x0 = __classPrivateFieldGet(parent, _QPart_lowX, "f"), x2 = __classPrivateFieldGet(parent, _QPart_highX, "f"), x1 = (x0 + x2) / 2;
                let y0 = __classPrivateFieldGet(parent, _QPart_lowY, "f"), y2 = __classPrivateFieldGet(parent, _QPart_highY, "f"), y1 = (y0 + y2) / 2;
                __classPrivateFieldSet(parent, _QPart_children, [], "f");
                let a = __classPrivateFieldGet(parent, _QPart_children, "f");
                a[0] = new QPart(parent, x0, y0, x1, y1, level, depth);
                a[1] = new QPart(parent, x1, y0, x2, y1, level, depth);
                a[2] = new QPart(parent, x0, y1, x1, y2, level, depth);
                a[3] = new QPart(parent, x1, y1, x2, y2, level, depth);
                buildSubTree(a[0], level + 1, depth);
                buildSubTree(a[1], level + 1, depth);
                buildSubTree(a[2], level + 1, depth);
                buildSubTree(a[3], level + 1, depth);
            }
        }
        let level = 1, root = new QPart(undefined, lowX, lowY, lowX + size, lowY + size, level, depth);
        buildSubTree(root, level + 1, depth);
        return root;
    }
}
_QPart_entities = new WeakMap(), _QPart_parent = new WeakMap(), _QPart_children = new WeakMap(), _QPart_level = new WeakMap(), _QPart_depth = new WeakMap(), _QPart_lowX = new WeakMap(), _QPart_highX = new WeakMap(), _QPart_lowY = new WeakMap(), _QPart_highY = new WeakMap(), _QPart_cX = new WeakMap(), _QPart_cY = new WeakMap(), _QPart_instances = new WeakSet(), _QPart_childAt = function _QPart_childAt(part, entity) {
    let q = ((entity.pos.x < __classPrivateFieldGet(part, _QPart_cX, "f")) ? 0 : 1) + ((entity.pos.y < __classPrivateFieldGet(part, _QPart_cY, "f")) ? 0 : 2);
    return __classPrivateFieldGet(part, _QPart_children, "f")[q];
};
class World {
    constructor(wsizeX, wsizeY, depth = 1, border = 0) {
        _World_instances.add(this);
        _World_births.set(this, void 0);
        _World_deaths.set(this, void 0);
        _World_domain.set(this, void 0);
        _World_population.set(this, void 0);
        _World_dispatcher.set(this, void 0);
        _World_painter.set(this, void 0);
        _World_width.set(this, void 0);
        _World_height.set(this, void 0);
        _World_tree.set(this, void 0);
        _World_elapsedTime.set(this, void 0);
        // Largest obstacle collision radius
        _World_maxObstacleSize.set(this, 0);
        _World_preventOverlap.set(this, true);
        __classPrivateFieldSet(this, _World_width, wsizeX, "f");
        __classPrivateFieldSet(this, _World_height, wsizeY, "f");
        __classPrivateFieldSet(this, _World_dispatcher, new Dispatcher(this), "f");
        __classPrivateFieldSet(this, _World_population, new Map(), "f");
        __classPrivateFieldSet(this, _World_births, [], "f");
        __classPrivateFieldSet(this, _World_deaths, [], "f");
        __classPrivateFieldSet(this, _World_domain, new Domain(0, 0, wsizeX, wsizeY), "f");
        let ts = Math.max(wsizeX, wsizeY) + 2 * border;
        __classPrivateFieldSet(this, _World_tree, QPart.makeTree(-(ts - wsizeX) / 2, -(ts - wsizeY) / 2, ts, depth), "f");
    }
    get births() { return __classPrivateFieldGet(this, _World_births, "f"); }
    get deaths() { return __classPrivateFieldGet(this, _World_deaths, "f"); }
    get domain() { return __classPrivateFieldGet(this, _World_domain, "f"); }
    set domain(d) { __classPrivateFieldSet(this, _World_domain, d, "f"); }
    get populationMap() { return __classPrivateFieldGet(this, _World_population, "f"); }
    get population() { return [...__classPrivateFieldGet(this, _World_population, "f").values()]; }
    get dispatcher() { return __classPrivateFieldGet(this, _World_dispatcher, "f"); }
    set painter(painter) { __classPrivateFieldSet(this, _World_painter, painter, "f"); }
    get width() { return __classPrivateFieldGet(this, _World_width, "f"); }
    get height() { return __classPrivateFieldGet(this, _World_height, "f"); }
    get tree() { return __classPrivateFieldGet(this, _World_tree, "f"); }
    get maxObstacleSize() { return __classPrivateFieldGet(this, _World_maxObstacleSize, "f"); }
    set maxObstacleSize(n) { __classPrivateFieldSet(this, _World_maxObstacleSize, Math.max(__classPrivateFieldGet(this, _World_maxObstacleSize, "f"), n), "f"); }
    get isPreventOverlapOn() { return __classPrivateFieldGet(this, _World_preventOverlap, "f"); }
    ;
    set preventOverlap(b) { __classPrivateFieldSet(this, _World_preventOverlap, b, "f"); }
    birth(entity) {
        let a = [];
        Array.isArray(entity) ? a = entity : a = [entity];
        a.forEach(ent => ent.born(this));
    }
    death(entity) {
        let a = [];
        Array.isArray(entity) ? a = entity : a = [entity];
        a.forEach(ent => {
            if (Number.isFinite(ent))
                ent = __classPrivateFieldGet(this, _World_population, "f").get(Number(entity));
            if (ent instanceof Entity)
                ent.dies(this);
        });
        // if (Number.isFinite(entity))
        //     entity = this.#population.get(Number(entity));
        // if (entity instanceof Entity)
        //     entity.dies(this);
    }
    update(elapsedTime) {
        __classPrivateFieldSet(this, _World_elapsedTime, elapsedTime, "f");
        // ====================================================================
        // Births and deaths
        while (__classPrivateFieldGet(this, _World_births, "f").length > 0)
            __classPrivateFieldGet(this, _World_instances, "m", _World_addEntity).call(this, __classPrivateFieldGet(this, _World_births, "f").pop());
        while (__classPrivateFieldGet(this, _World_deaths, "f").length > 0)
            __classPrivateFieldGet(this, _World_instances, "m", _World_delEntity).call(this, __classPrivateFieldGet(this, _World_deaths, "f").pop());
        // ====================================================================
        // Process telegrams
        __classPrivateFieldGet(this, _World_dispatcher, "f")?.update(elapsedTime);
        // ====================================================================
        // Update FSMs
        [...__classPrivateFieldGet(this, _World_population, "f").values()]
            .forEach(v => v.fsm?.update(elapsedTime));
        // ====================================================================
        // Update all entities
        [...__classPrivateFieldGet(this, _World_population, "f").values()]
            .forEach(v => v.update(elapsedTime, this));
        // ====================================================================
        // Ensure Zero Overlap?
        if (__classPrivateFieldGet(this, _World_preventOverlap, "f"))
            __classPrivateFieldGet(this, _World_instances, "m", _World_ensureNoOverlap).call(this);
        // ====================================================================
        // Correct partition data
        __classPrivateFieldGet(this, _World_tree, "f").correctPartitionContents();
    }
    render() {
        __classPrivateFieldGet(this, _World_painter, "f")?.call(this);
        let ents = [...__classPrivateFieldGet(this, _World_population, "f").values()].sort((a, b) => a.Z - b.Z);
        for (let e of ents)
            e.render(__classPrivateFieldGet(this, _World_elapsedTime, "f"), this);
    }
    quadtreeAnalysis() {
        let array = [];
        let d = this.tree.getTreeLevelData();
        //console.log(d);
        let m = d.movers, o = d.obstacles, w = d.walls, f = d.fences, a = d.artefacts;
        array.push('#########   Quadtree Analysis Data   #########');
        array.push(`Depth    :   ${d.depth} level(s)`);
        array.push(`Position :   X ${d.lowX.toFixed(2)}   Y ${d.lowY.toFixed(2)}`);
        array.push(`Size     :   Tree ${d.treesize.toFixed(1)}   Leaf ${d.leafsize.toFixed(1)}`);
        if (m[0].length > 0) {
            let mvrs = this.population.filter(e => e instanceof Mover);
            let minCR = mvrs[0].colRad, maxCR = mvrs[0].colRad;
            mvrs.forEach(m => {
                minCR = Math.min(minCR, m.colRad);
                maxCR = Math.max(maxCR, m.colRad);
            });
            array.push(`Movers col. radius :  Min ${minCR.toFixed(1)}   Max ${maxCR.toFixed(1)}`);
        }
        let hr = '===================';
        let r0 = '  Levels > |  All |';
        let r1 = '-----------+------+';
        for (let i = 1; i <= d.depth; i++) {
            r0 += i.toString().padStart(4, ' ') + '  |';
            r1 += '------+';
            hr += '=======';
        }
        let r4 = 'Artefacts  |', r5 = 'Fences     |', r7 = 'Obstacles  |', r6 = 'Walls      |', r8 = 'Movers     |';
        for (let i = 0; i <= d.depth; i++) {
            r4 += a[i].toString().padStart(5, ' ') + ' |';
            r5 += f[i].toString().padStart(5, ' ') + ' |';
            r6 += w[i].toString().padStart(5, ' ') + ' |';
            r7 += o[i].toString().padStart(5, ' ') + ' |';
            r8 += m[i].toString().padStart(5, ' ') + ' |';
        }
        array.push(hr, r0, r1, r4, r5, r6, r7, r8, hr);
        console.log(array.join('\n'));
        return array;
    }
}
_World_births = new WeakMap(), _World_deaths = new WeakMap(), _World_domain = new WeakMap(), _World_population = new WeakMap(), _World_dispatcher = new WeakMap(), _World_painter = new WeakMap(), _World_width = new WeakMap(), _World_height = new WeakMap(), _World_tree = new WeakMap(), _World_elapsedTime = new WeakMap(), _World_maxObstacleSize = new WeakMap(), _World_preventOverlap = new WeakMap(), _World_instances = new WeakSet(), _World_addEntity = function _World_addEntity(entity) {
    __classPrivateFieldGet(this, _World_population, "f").set(entity.id, entity);
    __classPrivateFieldGet(this, _World_tree, "f").addEntity(entity);
    // entity.world = this;
}, _World_delEntity = function _World_delEntity(entity) {
    __classPrivateFieldGet(this, _World_population, "f").delete(entity.id);
    __classPrivateFieldGet(this, _World_tree, "f").delEntity(entity);
    // entity.world = undefined;
}, _World_ensureNoOverlap = function _World_ensureNoOverlap() {
    function processPartitionData(part, w) {
        if (part.hasChildren)
            for (let child of part.children)
                processPartitionData(child, w);
        // Process this partition
        let mvrs = [...part.entities].filter(e => e instanceof Mover);
        let np = mvrs.length;
        if (np > 0) {
            for (let i = 0; i < np - 1; i++)
                for (let j = i + 1; j < np; j++)
                    __classPrivateFieldGet(w, _World_instances, "m", _World_testForOverlap).call(w, mvrs[i], mvrs[j]);
            //Process movers in parent patitions
            let pmvrs = [];
            let parentPart = part.parent;
            while (parentPart) {
                pmvrs.push(...parentPart.entities);
                parentPart = parentPart.parent;
            }
            pmvrs = pmvrs.filter(e => e instanceof Mover);
            let npp = pmvrs.length;
            if (npp > 0)
                for (let i = 0; i < np; i++)
                    for (let j = 0; j < npp; j++)
                        __classPrivateFieldGet(w, _World_instances, "m", _World_testForOverlap).call(w, mvrs[i], pmvrs[j]);
        }
    }
    processPartitionData(this.tree, this);
}, _World_testForOverlap = function _World_testForOverlap(mvr0, mvr1) {
    let cnLen = Vector2D.dist(mvr1.pos, mvr0.pos);
    let overlap = mvr0.colRad + mvr1.colRad - cnLen;
    if (overlap > 0 && cnLen > 0) {
        let cnVec = mvr1.pos.sub(mvr0.pos).div(cnLen);
        let mass = mvr0.mass + mvr1.mass;
        mvr0.pos = mvr0.pos.sub(cnVec.mult(overlap * mvr1.mass / mass));
        mvr1.pos = mvr1.pos.add(cnVec.mult(overlap * mvr0.mass / mass));
    }
};
const GEOM2D = '14 Feb 2024';
class Geom2D {
    /**
     * Rotate a vector (clockwise) about the origin [0,0] by the given ang.
     * The vector 'v' is unchanged.
     * @param ang angle to rotate vector
     * @param v the vector to rotate
     * @param origin the origin to rotate about
     * @returns the rotated vector
     */
    static rotate_av(ang, v, origin = Vector2D.ZERO) {
        let cosa = Math.cos(ang), sina = Math.sin(ang);
        let dx = v.x - origin.x, dy = v.y - origin.y;
        let x = origin.x + dx * cosa - dy * sina;
        let y = origin.y + dy * cosa + dx * sina;
        return new Vector2D(x, y);
    }
    /**
     *
     * @param ang angle to rotate vector
     * @param vx vector x coordinate
     * @param vy vector x coordinate
     * @param ox origin x coordinate
     * @param oy origin y coordinate
     * @returns the rotated position
     */
    static rotate_axy(ang, vx, vy, ox = 0, oy = 0) {
        let cosa = Math.cos(ang), sina = Math.sin(ang);
        let dx = vx - ox, dy = vy - oy;
        let x = ox + dx * cosa - dy * sina;
        let y = oy + dy * cosa + dx * sina;
        return { x: x, y: y };
    }
    /**
     * Calculates the squared distance between 2 points
     * @param x0 point 1
     * @param y0 point 1
     * @param x1 point 2
     * @param y1 point 2
     * @return the distance between the pos squared
     */
    static distance_sq(x0, y0, x1, y1) {
        return (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
    }
    /**
     * Calculates the distance between 2 points
     * @param x0 point 1
     * @param y0 point 1
     * @param x1 point 2
     * @param y1 point 2
     * @return the distance between the pos squared
     */
    static distance(x0, y0, x1, y1) {
        return Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
    }
    /**
     * This sets the distance used to decide whether a point is 'near, a line. This
     * is initially set at 1.0 <br>
     * @param nearness must be >0 otherwise it is unchanged
     */
    static po_to_line_dist(nearness) {
        if (nearness > 0)
            Geom2D.NEARNESS = nearness;
    }
    /**
     * See if point is near the finite line. <br>
     *
     * @param v0 line start
     * @param v1 line end
     * @param p point to consider
     * @param vp filled with xy position of the nearest point on finite line (if provided)
     * @return true if p is near the line
     */
    static is_po_near_line(v0, v1, p, vp) {
        let pnl = Geom2D.po_nearest_line(v0, v1, p);
        if (pnl) {
            let d = Math.sqrt((p.x - pnl.x) * (p.x - pnl.x) + (p.y - pnl.y) * (p.y - pnl.y));
            if (vp)
                vp.set(pnl);
            if (d <= Geom2D.NEARNESS)
                return true;
        }
        return false;
    }
    /**
     * See if point is near the infinite line. <br>
     *
     * @param v0 line passes through this po
     * @param v1 line passes through this po
     * @param p point to consider
     * @param vp filled with xy position of the nearest point on line (must not be undefined)
     * @return true if p is near the line
     */
    static is_po_near_infinite_line(v0, v1, p, vp) {
        let pnl = Geom2D.po_nearest_infinite_line(v0, v1, p);
        if (pnl) {
            let d = Math.sqrt((p.x - pnl.x) * (p.x - pnl.x) + (p.y - pnl.y) * (p.y - pnl.y));
            if (vp)
                vp.set(pnl);
            if (d <= Geom2D.NEARNESS)
                return true;
        }
        return false;
    }
    /**
     * Given a point find the nearest position on a finite line.
     *
     * @param v0 line start
     * @param v1 line end
     * @param p point to consider
     * @return returns undefined if the line is undefined or if the nearest point is not on the line
     */
    static po_nearest_line(v0, v1, p) {
        let vp = undefined;
        let the_line = v1.sub(v0); // Vector2D.sub(v1, v0);
        let lineMag = the_line.length();
        lineMag = lineMag * lineMag;
        if (lineMag > 0.0) {
            let pv0_line = p.sub(v0); //Vector2D.sub(p, v0);
            let t = pv0_line.dot(the_line) / lineMag;
            if (t >= 0 && t <= 1) {
                vp = new Vector2D();
                vp.x = the_line.x * t + v0.x;
                vp.y = the_line.y * t + v0.y;
            }
        }
        return vp;
    }
    /**
     * Given a point find the nearest position on an infinite line.
     * @param v0 line start
     * @param v1 line end
     * @param p point to consider
     * @return returns undefined if the line is undefined else the nearest position
     */
    static po_nearest_infinite_line(v0, v1, p) {
        let vp = undefined;
        let the_line = v1.sub(v0); // Vector2D.sub(v1, v0);
        let lineMag = the_line.length();
        lineMag = lineMag * lineMag;
        if (lineMag > 0.0) {
            vp = new Vector2D();
            let pv0_line = p.sub(v0); // Vector2D.sub(p, v0);
            let t = pv0_line.dot(the_line) / lineMag;
            vp.x = the_line.x * t + v0.x;
            vp.y = the_line.y * t + v0.y;
        }
        return vp;
    }
    /**
     * Sees if a line intersects with the circumference of a circle.
     *
     * @param x0
     * @param y0
     * @param x1
     * @param y1
     * @param cx centre of circle x position
     * @param cy centre of circle y position
     * @param r radius of circle
     * @return true if the line intersects the circle else false
     */
    static line_circle(x0, y0, x1, y1, cx, cy, r) {
        let f = (x1 - x0);
        let g = (y1 - y0);
        let fSQ = f * f;
        let gSQ = g * g;
        let fgSQ = fSQ + gSQ;
        let rSQ = r * r;
        let xc0 = cx - x0;
        let yc0 = cy - y0;
        let xc1 = cx - x1;
        let yc1 = cy - y1;
        let lineInside = xc0 * xc0 + yc0 * yc0 < rSQ && xc1 * xc1 + yc1 * yc1 < rSQ;
        let fygx = f * yc0 - g * xc0;
        let root = r * r * fgSQ - fygx * fygx;
        if (root > Geom2D.ACCY && !lineInside) {
            let fxgy = f * xc0 + g * yc0;
            let t = fxgy / fgSQ;
            if (t >= 0 && t <= 1)
                return true;
            // Circle intersects with one end then return true
            if ((xc0 * xc0 + yc0 * yc0 < rSQ) || (xc1 * xc1 + yc1 * yc1 < rSQ))
                return true;
        }
        return false;
    }
    /**
     * Calculate the pos of intersection between a line and a circle. <br>
     * An array is returned that contains the intersection pos in x, y order.
     * If the array is of length: <br>
     * 0 then there is no intersection <br>
     * 2 there is just one intersection (the line is a tangent to the circle) <br>
     * 4 there are two intersections <br>
     *
     * @param x0 start of line
     * @param y0 start of line
     * @param x1 end of line
     * @param y1 end of line
     * @param cx centre of circle x position
     * @param cy centre of circle y position
     * @param r radius of circle
     * @return the intersection pos as an array (2 elements per intersection)
     */
    static line_circle_p(x0, y0, x1, y1, cx, cy, r) {
        let result = [];
        let f = (x1 - x0);
        let g = (y1 - y0);
        let fSQ = f * f;
        let gSQ = g * g;
        let fgSQ = fSQ + gSQ;
        let xc0 = cx - x0;
        let yc0 = cy - y0;
        let fygx = f * yc0 - g * xc0;
        let root = r * r * fgSQ - fygx * fygx;
        if (root > -Geom2D.ACCY) {
            let fxgy = f * xc0 + g * yc0;
            if (root < Geom2D.ACCY) { // tangent so just one po
                let t = fxgy / fgSQ;
                if (t >= 0 && t <= 1) {
                    result.push(x0 + f * t);
                    result.push(y0 + g * t);
                }
            }
            else { // possibly two intersections
                root = Math.sqrt(root);
                let t = (fxgy - root) / fgSQ;
                if (t >= 0 && t <= 1) {
                    result = [x0 + f * t, y0 + g * t];
                }
                t = (fxgy + root) / fgSQ;
                if (t >= 0 && t <= 1) {
                    result.push(x0 + f * t);
                    result.push(y0 + g * t);
                }
            }
        }
        return result;
    }
    /**
     * See if two lines intersect <br>
     * @param x0 start of line 1
     * @param y0 start of line 1
     * @param x1 end of line 1
     * @param y1 end of line 1
     * @param x2 start of line 2
     * @param y2 start of line 2
     * @param x3 end of line 2
     * @param y3 end of line 2
     * @return true if the lines ersect
     */
    static line_line(x0, y0, x1, y1, x2, y2, x3, y3) {
        let f1 = (x1 - x0);
        let g1 = (y1 - y0);
        let f2 = (x3 - x2);
        let g2 = (y3 - y2);
        let f1g2 = f1 * g2;
        let f2g1 = f2 * g1;
        let det = f2g1 - f1g2;
        if (Math.abs(det) > Geom2D.ACCY) {
            let s = (f2 * (y2 - y0) - g2 * (x2 - x0)) / det;
            let t = (f1 * (y2 - y0) - g1 * (x2 - x0)) / det;
            return (s >= 0 && s <= 1 && t >= 0 && t <= 1);
        }
        return false;
    }
    /**
     * Find the point of intersection between two lines. <br>
     * This method uses Vector2D objects to represent the line end pos.
     * @param v0 start of line 1
     * @param v1 end of line 1
     * @param v2 start of line 2
     * @param v3 end of line 2
     * @return a Vector2D object holding the intersection coordinates else undefined if no intersection
     */
    static line_line_pv(v0, v1, v2, v3) {
        let intercept = undefined;
        let f1 = (v1.x - v0.x);
        let g1 = (v1.y - v0.y);
        let f2 = (v3.x - v2.x);
        let g2 = (v3.y - v2.y);
        let f1g2 = f1 * g2;
        let f2g1 = f2 * g1;
        let det = f2g1 - f1g2;
        if (Math.abs(det) > Geom2D.ACCY) {
            let s = (f2 * (v2.y - v0.y) - g2 * (v2.x - v0.x)) / det;
            let t = (f1 * (v2.y - v0.y) - g1 * (v2.x - v0.x)) / det;
            if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
                intercept = new Vector2D(v0.x + f1 * s, v0.y + g1 * s);
        }
        return intercept;
    }
    /**
     * Find the point of intersection between two lines. <br>
     * An array is returned that contains the intersection pos in x, y order.
     * If the array is of length: <br>
     * 0 then there is no intersection <br>
     * 2 these are the x/y coordinates of the intersection po. <br>
     * @param x0 start of line 1
     * @param y0 start of line 1
     * @param x1 end of line 1
     * @param y1 end of line 1
     * @param x2 start of line 2
     * @param y2 start of line 2
     * @param x3 end of line 2
     * @param y3 end of line 2
     * @return an array of coordinates for the intersection if any
     */
    static line_line_p(x0, y0, x1, y1, x2, y2, x3, y3) {
        let result = [];
        let f1 = (x1 - x0);
        let g1 = (y1 - y0);
        let f2 = (x3 - x2);
        let g2 = (y3 - y2);
        let f1g2 = f1 * g2;
        let f2g1 = f2 * g1;
        let det = f2g1 - f1g2;
        if (Math.abs(det) > Geom2D.ACCY) {
            let s = (f2 * (y2 - y0) - g2 * (x2 - x0)) / det;
            let t = (f1 * (y2 - y0) - g1 * (x2 - x0)) / det;
            if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
                result = [x0 + f1 * s, y0 + g1 * s];
        }
        return result;
    }
    /**
     * Find the intersection point between two infinite lines that
     * pass through the pos (v0,v1) and (v2,v3)
     * @return a Vector2D object of the intercept or undefoned if parallel
     */
    static line_line_infinite_pv(v0, v1, v2, v3) {
        let intercept = undefined;
        let f1 = (v1.x - v0.x);
        let g1 = (v1.y - v0.y);
        let f2 = (v3.x - v2.x);
        let g2 = (v3.y - v2.y);
        let f1g2 = f1 * g2;
        let f2g1 = f2 * g1;
        let det = f2g1 - f1g2;
        if (Math.abs(det) > Geom2D.ACCY) {
            let s = (f2 * (v2.y - v0.y) - g2 * (v2.x - v0.x)) / det;
            intercept = new Vector2D(v0.x + f1 * s, v0.y + g1 * s);
        }
        return intercept;
    }
    /**
     * Find the point of intersection between two infinite lines that pass through the pos
     * ([x0,y0],[x1,y1]) and ([x2,y2],[x3,y3]). <br>
     * An array is returned that contains the intersection pos in x, y order.
     * If the array is of length: <br>
     * 0 then there is no intersection <br>
     * 2 these are the x/y coordinates of the intersection po. <br>
     * @return an array of coordinates for the intersection if any
     */
    static line_line_infinite_p(x0, y0, x1, y1, x2, y2, x3, y3) {
        let result = [];
        let f1 = (x1 - x0);
        let g1 = (y1 - y0);
        let f2 = (x3 - x2);
        let g2 = (y3 - y2);
        let f1g2 = f1 * g2;
        let f2g1 = f2 * g1;
        let det = f2g1 - f1g2;
        if (Math.abs(det) > Geom2D.ACCY) {
            let s = (f2 * (y2 - y0) - g2 * (x2 - x0)) / det;
            result = [x0 + f1 * s, y0 + g1 * s];
        }
        return result;
    }
    /**
     * Calculate the intersection pos between a line and a collection of lines. <br>
     * This will calculate all the intersection pos between a given line
     * and the lines formed from the pos in the array xy. <br>
     * If the parameter continuous = true the pos form a continuous line so the <br>
     * <pre>
     * line 1 is from xy[0],xy[1] to xy[2],xy[3] and
     * line 2 is from xy[2],xy[3] to xy[4],xy[5] and so on
     * </pre>
     * and if continuous is false then each set of four array elements form their
     * own line <br>
     * <pre>
     * line 1 is from xy[0],xy[1] to xy[2],xy[3] and
     * line 2 is from xy[4],xy[5] to xy[6],xy[7] and so on
     * </pre>
     *
     * @param x0 x position of the line start
     * @param y0 y position of the line start
     * @param x1 x position of the line end
     * @param y1 y position of the line end
     * @param xy array of x/y coordinates
     * @param continuous if true the pos makes a continuous line
     * @return an array with all the intersection coordinates
     */
    static line_lines_p(x0, y0, x1, y1, xy, continuous) {
        let result = [];
        let stride = continuous ? 2 : 4;
        let f1, g1, f2, g2, f1g2, f2g1, det;
        f1 = (x1 - x0);
        g1 = (y1 - y0);
        for (let i = 0; i < xy.length - 3; i += stride) {
            f2 = (xy[i + 2] - xy[i]);
            g2 = (xy[i + 3] - xy[i + 1]);
            f1g2 = f1 * g2;
            f2g1 = f2 * g1;
            det = f2g1 - f1g2;
            if (Math.abs(det) > Geom2D.ACCY) {
                let s = (f2 * (xy[i + 1] - y0) - g2 * (xy[i] - x0)) / det;
                let t = (f1 * (xy[i + 1] - y0) - g1 * (xy[i] - x0)) / det;
                if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
                    result.push(x0 + f1 * s);
                    result.push(y0 + g1 * s);
                }
            }
        }
        return result;
    }
    /**
     * Determine if the circumferences of two circles intersect
     * @param cx0 centre of first circle x position
     * @param cy0 centre of first circle y position
     * @param r0 radius of first circle
     * @param cx1 centre of second circle x position
     * @param cy1 centre of second circle y position
     * @param r1 radius of second circle
     * @return true if the circumferences intersect
     */
    static circle_circle(cx0, cy0, r0, cx1, cy1, r1) {
        let dxSQ = (cx1 - cx0) * (cx1 - cx0);
        let dySQ = (cy1 - cy0) * (cy1 - cy0);
        let rSQ = (r0 + r1) * (r0 + r1);
        let drSQ = (r0 - r1) * (r0 - r1);
        return (dxSQ + dySQ <= rSQ && dxSQ + dySQ >= drSQ);
    }
    /**
     * Calculate the intersection pos between two circles. <br>
     * If the array is of length: <br>
     * 0 then there is no intersection <br>
     * 2 there is just one intersection (the circles are touching) <br>
     * 4 there are two intersections <br>
     *
     * @param cx0 centre of first circle x position
     * @param cy0 centre of first circle y position
     * @param r0 radius of first circle
     * @param cx1 centre of second circle x position
     * @param cy1 centre of second circle y position
     * @param r1 radius of second circle
     * @return an array with the intersection pos
     */
    static circle_circle_p(cx0, cy0, r0, cx1, cy1, r1) {
        let result = [];
        let dx = cx1 - cx0;
        let dy = cy1 - cy0;
        let distSQ = dx * dx + dy * dy;
        if (distSQ > Geom2D.ACCY) {
            let r0SQ = r0 * r0;
            let r1SQ = r1 * r1;
            let diffRSQ = (r1SQ - r0SQ);
            let root = 2 * (r1SQ + r0SQ) * distSQ - distSQ * distSQ - diffRSQ * diffRSQ;
            if (root > -Geom2D.ACCY) {
                let distINV = 0.5 / distSQ;
                let scl = 0.5 - diffRSQ * distINV;
                let x = dx * scl + cx0;
                let y = dy * scl + cy0;
                if (root < Geom2D.ACCY) {
                    result = [x, y];
                }
                else {
                    root = distINV * Math.sqrt(root);
                    let xfac = dx * root;
                    let yfac = dy * root;
                    result = [x - yfac, y + xfac, x + yfac, y - xfac];
                }
            }
        }
        return result;
    }
    /**
     * Calculate the tangents from a po. <br>
     * If the array is of length: <br>
     * 0 then there is no tangent the point is inside the circle <br>
     * 2 there is just one intersection (the point is on the circumference) <br>
     * 4  there are two pos.
     *
     * @param x x position for point of interest
     * @param y y position for point of interest
     * @param cx centre of circle x position
     * @param cy centre of circle y position
     * @param r radius of circle
     * @return an array of the tangent point coordinates
     */
    static tangents_to_circle(x, y, cx, cy, r) {
        let result = [];
        let dx = cx - x;
        let dy = cy - y;
        let dxSQ = dx * dx;
        let dySQ = dy * dy;
        let denom = dxSQ + dySQ;
        let root = denom - r * r;
        if (root > -Geom2D.ACCY) {
            let denomINV = 1.0 / denom;
            let A, B;
            if (root < Geom2D.ACCY) { // point is on circle
                A = -r * dx * denomINV;
                B = -r * dy * denomINV;
                result = [cx + A * r, cy + B * r];
            }
            else {
                root = Math.sqrt(root);
                A = (-dy * root - r * dx) * denomINV;
                B = (dx * root - r * dy) * denomINV;
                result.push(cx + A * r);
                result.push(cy + B * r);
                A = (dy * root - r * dx) * denomINV;
                B = (-dx * root - r * dy) * denomINV;
                result.push(cx + A * r);
                result.push(cy + B * r);
            }
        }
        return result;
    }
    /**
     * Will calculate the contact pos for both outer and inner tangents. <br>
     * There are no tangents if one circle is completely inside the other.
     * If the circles eract only the outer tangents exist. When the circles
     * do not ersect there will be 4 tangents (outer and inner), the array
     * has the outer pair first.
     *
     * @param cx0 x position for the first circle
     * @param cy0 y position for the first circle
     * @param r0 radius of the first circle
     * @param cx1 x position for the second circle
     * @param cy1 y position for the second circle
     * @param r1 radius of the second circle
     * @return an array of tangent contact pos
     */
    static tangents_between_circles(cx0, cy0, r0, cx1, cy1, r1) {
        let result = [];
        let dxySQ = (cx0 - cx1) * (cx0 - cx1) + (cy0 - cy1) * (cy0 - cy1);
        if (dxySQ <= (r0 - r1) * (r0 - r1))
            return result;
        let d = Math.sqrt(dxySQ);
        let vx = (cx1 - cx0) / d;
        let vy = (cy1 - cy0) / d;
        for (let sign1 = +1; sign1 >= -1; sign1 -= 2) {
            let c = (r0 - sign1 * r1) / d;
            if (c * c > 1)
                continue;
            let h = Math.sqrt(Math.max(0.0, 1.0 - c * c));
            for (let sign2 = +1; sign2 >= -1; sign2 -= 2) {
                let nx = vx * c - sign2 * h * vy;
                let ny = vy * c + sign2 * h * vx;
                result.push(cx0 + r0 * nx);
                result.push(cy0 + r0 * ny);
                result.push(cx1 + sign1 * r1 * nx);
                result.push(cy1 + sign1 * r1 * ny);
            }
        }
        return result;
    }
    /**
     * Outside is in the same direction of the plane normal. <br>
     * The first four parameters represent the start and end position
     * for a line segment (finite plane).
     *
     * @param x0 x start of the line
     * @param y0 y start of the line
     * @param x1 x end of the line
     * @param y1 y end of the line
     * @param px x position of the point to test
     * @param py y position of the point to test
     * @return returns either PLANE_INSIDE, PLANE_OUTSIDE or ON_PLANE
     */
    static which_side_pp(x0, y0, x1, y1, px, py) {
        let side;
        let dot = (y0 - y1) * (px - x0) + (x1 - x0) * (py - y0);
        if (dot < -Geom2D.ACCY)
            side = Geom2D.PLANE_INSIDE;
        else if (dot > Geom2D.ACCY)
            side = Geom2D.PLANE_OUTSIDE;
        else
            side = Geom2D.ON_PLANE;
        return side;
    }
    /**
      * Check whether a vector ov lies between the vectors oa and ob. The origin of all vectors
      * is [0, 0] unless a different origin is specified in the parameters ox, oy.
      * All vectors lie in XY plane (z = 0) or projected onto the XY (z != 0 but is ignored).
      * @param vx x coordinate of the vector to test
      * @param vy y coordinate of the vector to test
      * @param ax x coordinate of the first vector
      * @param ay y coordinate of the first vector
      * @param bx x coordinate of the second vector
      * @param by y coordinate of the second vector
      * @param ox x coordinate of the vectors' origin (default = 0)
      * @param oy y coordinate of the vectors' origin (default = 0)
      * @returns
      */
    static lies_between(vx, vy, ax, ay, bx, by, ox = 0, oy = 0) {
        // tranlate vector origin
        vx -= ox;
        ax -= ox;
        bx -= ox;
        vy -= oy;
        ay -= oy;
        by -= oy;
        // Calculate cross product of ab [0, 0, abz]
        let abz = ax * by - ay * bx;
        return (ax * vy - ay * vx) * abz > 0 && (by * vx - bx * vy) * abz > 0;
    }
    /**
     * Given an arc enclosed by the two angles a0 and a1, this function checks whether
     * a third angle is within that arc.
     * The angle subtended by the arc will be less than Pi radians for all values of
     * a0 and a1.
     * The angles do not have to be constrained to a particular range but can be any
     * real number.
     *
     * @param angle the angle to test
     * @param a0 the angle for one end of the arc
     * @param a1 the angle for the other end of the arc
     * @returns true if the angle is inside the arc
     */
    static is_in_arc(angle, a0, a1) {
        let c = Math.cos;
        let s = Math.sin;
        return Geom2D.lies_between(c(angle), s(angle), c(a0), s(a0), c(a1), s(a1));
    }
    /**
     * Outside is in the same direction of the plane normal. <br>
     * This version requires a single point on the plane and the normal
     * direction. Useful for an infinite plane or for testing many
     * pos against a single plane when the plane normal does not have
     * to be calculated each time.
     *
     * @param x0 x position of a point on the plane
     * @param y0 y position of a point on the plane
     * @param nx x value of normal vector
     * @param ny y value of normal vector
     * @param px x position of the point to test
     * @param py y position of the point to test
     * @return returns either PLANE_INSIDE, PLANE_OUTSIDE or ON_PLANE
     */
    static which_side_pn(x0, y0, nx, ny, px, py) {
        let side;
        let dot = nx * (px - x0) + ny * (py - y0);
        if (dot < -Geom2D.ACCY)
            side = Geom2D.PLANE_INSIDE;
        else if (dot > Geom2D.ACCY)
            side = Geom2D.PLANE_OUTSIDE;
        else
            side = Geom2D.ON_PLANE;
        return side;
    }
    /**
     * Code copied from {@link java.awt.geom.Rectangle2D#ersectsLine(, , , )}
     */
    static _outcode(pX, pY, rectX, rectY, rectWidth, rectHeight) {
        let out = 0;
        if (rectWidth <= 0) {
            out |= Geom2D.OUT_LEFT | Geom2D.OUT_RIGHT;
        }
        else if (pX < rectX) {
            out |= Geom2D.OUT_LEFT;
        }
        else if (pX > rectX + rectWidth) {
            out |= Geom2D.OUT_RIGHT;
        }
        if (rectHeight <= 0) {
            out |= Geom2D.OUT_TOP | Geom2D.OUT_BOTTOM;
        }
        else if (pY < rectY) {
            out |= Geom2D.OUT_TOP;
        }
        else if (pY > rectY + rectHeight) {
            out |= Geom2D.OUT_BOTTOM;
        }
        return out;
    }
    /**
     * Determine whether a line intersects with any part of a box. <br>
     * The box is represented by the top-left and bottom-right corner coordinates.
     * @param lx0 start of line
     * @param ly0 start of line
     * @param lx1 end of line
     * @param ly1 end of line
     * @param rx0 top-left corner of rectangle
     * @param ry0 top-left corner of rectangle
     * @param rx1 bottom-right corner of rectangle
     * @param ry1  bottom-right corner of rectangle
     * @return true if they intersect else false
     */
    static line_box_xyxy(lx0, ly0, lx1, ly1, rx0, ry0, rx1, ry1) {
        let out1, out2;
        let rectWidth = rx1 - rx0;
        let rectHeight = ry1 - ry0;
        if ((out2 = Geom2D._outcode(lx1, ly1, rx0, ry0, rectWidth, rectHeight)) == 0) {
            return true;
        }
        while ((out1 = Geom2D._outcode(lx0, ly0, rx0, ry0, rectWidth, rectHeight)) != 0) {
            if ((out1 & out2) != 0) {
                return false;
            }
            if ((out1 & (Geom2D.OUT_LEFT | Geom2D.OUT_RIGHT)) != 0) {
                let x = rx0;
                if ((out1 & Geom2D.OUT_RIGHT) != 0) {
                    x += rectWidth;
                }
                ly0 = ly0 + (x - lx0) * (ly1 - ly0) / (lx1 - lx0);
                lx0 = x;
            }
            else {
                let y = ry0;
                if ((out1 & Geom2D.OUT_BOTTOM) != 0) {
                    y += rectHeight;
                }
                lx0 = lx0 + (y - ly0) * (lx1 - lx0) / (ly1 - ly0);
                ly0 = y;
            }
        }
        return true;
    }
    /**
     * Determine whether a line intersects with any part of a box. <br>
     * The box is represented by the top-left corner coordinates and the box width and height.
     * @param lx0 start of line
     * @param ly0 start of line
     * @param lx1 end of line
     * @param ly1 end of line
     * @param rx0 top-left corner of rectangle
     * @param ry0 top-left corner of rectangle
     * @param rWidth width of rectangle
     * @param rHeight height of rectangle
     * @return true if they intersect else false
     */
    static line_box_xywh(lx0, ly0, lx1, ly1, rx0, ry0, rWidth, rHeight) {
        let out1, out2;
        if ((out2 = Geom2D._outcode(lx1, ly1, rx0, ry0, rWidth, rHeight)) == 0) {
            return true;
        }
        while ((out1 = Geom2D._outcode(lx0, ly0, rx0, ry0, rWidth, rHeight)) != 0) {
            if ((out1 & out2) != 0) {
                return false;
            }
            if ((out1 & (Geom2D.OUT_LEFT | Geom2D.OUT_RIGHT)) != 0) {
                let x = rx0;
                if ((out1 & Geom2D.OUT_RIGHT) != 0) {
                    x += rWidth;
                }
                ly0 = ly0 + (x - lx0) * (ly1 - ly0) / (lx1 - lx0);
                lx0 = x;
            }
            else {
                let y = ry0;
                if ((out1 & Geom2D.OUT_BOTTOM) != 0) {
                    y += rHeight;
                }
                lx0 = lx0 + (y - ly0) * (lx1 - lx0) / (ly1 - ly0);
                ly0 = y;
            }
        }
        return true;
    }
    /**
     * Determine whether two boxes ersect. <br>
     * The boxes are represented by the top-left and bottom-right corner coordinates.
     *
     * @param ax0 top-left corner of rectangle A
     * @param ay0 top-left corner of rectangle A
     * @param ax1 bottom-right corner of rectangle A
     * @param ay1 bottom-right corner of rectangle A
     * @param bx0 top-left corner of rectangle B
     * @param by0 top-left corner of rectangle B
     * @param bx1 bottom-right corner of rectangle B
     * @param by1 bottom-right corner of rectangle B
     * @return true if the boxes intersect
     */
    static box_box(ax0, ay0, ax1, ay1, bx0, by0, bx1, by1) {
        let topA = Math.min(ay0, ay1);
        let botA = Math.max(ay0, ay1);
        let leftA = Math.min(ax0, ax1);
        let rightA = Math.max(ax0, ax1);
        let topB = Math.min(by0, by1);
        let botB = Math.max(by0, by1);
        let leftB = Math.min(bx0, bx1);
        let rightB = Math.max(bx0, bx1);
        if (botA <= topB || botB <= topA || rightA <= leftB || rightB <= leftA)
            return false;
        return true;
    }
    /**
     * If two boxes overlap then the overlap region is another box. This method is used to
     * calculate the coordinates of the overlap. <br>
     * The boxes are represented by the top-left and bottom-right corner coordinates.
     * If the returned array has a length:
     * 0 then they do not overlap <br>
     * 4 then these are the coordinates of the top-left and bottom-right corners of the overlap region.
     *
     * @param ax0 top-left corner of rectangle A
     * @param ay0 top-left corner of rectangle A
     * @param ax1 bottom-right corner of rectangle A
     * @param ay1 bottom-right corner of rectangle A
     * @param bx0 top-left corner of rectangle B
     * @param by0 top-left corner of rectangle B
     * @param bx1 bottom-right corner of rectangle B
     * @param by1 bottom-right corner of rectangle B
     * @return an array with the overlap box coordinates (if any)
     */
    static box_box_p(ax0, ay0, ax1, ay1, bx0, by0, bx1, by1) {
        let result = [];
        let topA = Math.min(ay0, ay1);
        let botA = Math.max(ay0, ay1);
        let leftA = Math.min(ax0, ax1);
        let rightA = Math.max(ax0, ax1);
        let topB = Math.min(by0, by1);
        let botB = Math.max(by0, by1);
        let leftB = Math.min(bx0, bx1);
        let rightB = Math.max(bx0, bx1);
        if (botA <= topB || botB <= topA || rightA <= leftB || rightB <= leftA)
            return result;
        let leftO = (leftA < leftB) ? leftB : leftA;
        let rightO = (rightA > rightB) ? rightB : rightA;
        let botO = (botA > botB) ? botB : botA;
        let topO = (topA < topB) ? topB : topA;
        result = [leftO, topO, rightO, botO];
        return result;
    }
    /**
     * Determine if the point pX/pY is inside triangle defined by triangle ABC whose
     * vertices are given by [ax,ay] [bx,by] [cx,cy]. The triangle vertices should
     * provided in counter-clockwise order.
     * @return true if the point is inside
     */
    static is_in_triangle(aX, aY, bX, bY, cX, cY, pX, pY) {
        let ax = cX - bX;
        let ay = cY - bY;
        let bx = aX - cX;
        let by = aY - cY;
        let cx = bX - aX;
        let cy = bY - aY;
        let apx = pX - aX;
        let apy = pY - aY;
        let bpx = pX - bX;
        let bpy = pY - bY;
        let cpx = pX - cX;
        let cpy = pY - cY;
        let aCROSSbp = ax * bpy - ay * bpx;
        let cCROSSap = cx * apy - cy * apx;
        let bCROSScp = bx * cpy - by * cpx;
        return ((aCROSSbp < 0) && (bCROSScp < 0) && (cCROSSap < 0));
    }
    /**
     * Determine if the point (p) is inside triangle defined by triangle ABC. The
     * triangle vertices should provided in counter-clockwise order.
     *
     * @param a triangle vertex 1
     * @param b triangle vertex 2
     * @param c triangle vertex 3
     * @param p point of interest
     * @return true if inside triangle else false
     */
    static is_in_triangle_v(a, b, c, p) {
        return Geom2D.is_in_triangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y);
    }
    /**
     * Determine if the point pX/pY is inside triangle defined by triangle ABC. The
     * triangle vertices should provided in counter-clockwise order.
     *
     * @param a triangle vertex 1
     * @param b triangle vertex 2
     * @param c triangle vertex 3
     * @param pX x position for point of interest
     * @param pY y position for point of interest
     * @return true if inside triangle else false
     */
    static is_in_triangle_vp(a, b, c, pX, pY) {
        return Geom2D.is_in_triangle(a.x, a.y, b.x, b.y, c.x, c.y, pX, pY);
    }
    /**
     * See if a point is inside the rectangle defined by top-left and bottom right coordinates
     * @param x0 top-left corner of rectangle
     * @param y0 top-left corner of rectangle
     * @param x1 bottom-right corner of rectangle
     * @param y1 bottom-right corner of rectangle
     * @param pX x position of point of interest
     * @param pY y position of point of interest
     * @return true if inside rectangle else false
     */
    static is_in_rectangle_xyxy(x0, y0, x1, y1, pX, pY) {
        return (pX >= x0 && pY >= y0 && pX <= x1 && pY <= y1);
    }
    /**
     * See if this a is inside the rectangle defined by top-left and bottom right coordinates
     * @param v0 top-left corner of rectangle
     * @param v1 bottom-right corner of rectangle
     * @param p point of interest
     * @return true if inside rectangle else false
     */
    static is_in_rectangle_xyxy_v(v0, v1, p) {
        return Geom2D.is_in_rectangle_xyxy(v0.x, v0.y, v1.x, v1.y, p.x, p.y);
    }
    /**
     * See if a point is inside the rectangle defined by top-left and bottom right coordinates
     * @param x0 top-left corner of rectangle
     * @param y0 top-left corner of rectangle
     * @param width width of rectangle
     * @param height height of rectangle
     * @param pX x position of point of interest
     * @param pY y position of point of interest
     * @return true if inside rectangle else false
     */
    static is_in_rectangle_xywh(x0, y0, width, height, pX, pY) {
        return (pX >= x0 && pY >= y0 && pX <= x0 + width && pY <= y0 + height);
    }
    /**
     * See if this a is inside the rectangle defined by top-left and bottom right coordinates
     * @param v0 top-left corner of rectangle
     * @param width width of rectangle
     * @param height height of rectangle
     * @param p point of interest
     * @return true if inside rectangle else false
     */
    static is_in_rectangle_xywh_v(v0, width, height, p) {
        return Geom2D.is_in_rectangle_xyxy(v0.x, v0.y, v0.x + width, v0.y + height, p.x, p.y);
    }
    /**
     * See if the given point is inside a polygon defined by the vertices provided. The shape can be
     * open or closed and the order can be clockwise or counter-clockwise.
     *
     * @param verts the vertices of the shape
     * @param x0 x position
     * @param y0 y position
     * @return true if x0, y0 is inside polygon else returns false
     */
    static is_in_polygon(verts, x0, y0) {
        let oddNodes = false;
        for (let i = 0, j = verts.length - 1; i < verts.length; j = i, i++) {
            let vi = verts[i];
            let vj = verts[j];
            if ((vi.y < y0 && vj.y >= y0 || vj.y < y0 && vi.y >= y0) && (vi.x + (y0 - vi.y) / (vj.y - vi.y) * (vj.x - vi.x) < x0))
                oddNodes = !oddNodes;
        }
        return oddNodes;
    }
    /**
     * Create a set of triangles from a concave/convex polygon with no holes and no
     * intersecting sides.
     *
     * @param contour an array of vertices that make up a 2D polygon
     * @param closed true if the polygon is closed i.e. the first and last vertex represent
     * the same 2D position.
     * @return an array of vertex indices (to contour list in counter-clockwise order)
     * in groups of three for the render triangles (counter-clockwise)
     */
    static triangulate(contour, closed = false) {
        let n = closed ? contour.length - 1 : contour.length;
        if (n < 3)
            return [];
        let result = [];
        let vList = [];
        /* We want a counter-clockwise polygon in V based on computer screen coordinates */
        if (Geom2D.area(contour) < 0)
            for (let v = 0; v < n; v++)
                vList[v] = v;
        else
            for (let v = 0; v < n; v++)
                vList[v] = n - 1 - v;
        let nv = n;
        /*  remove (nv-2) Vertices, creating 1 triangle every time */
        let count = 2 * nv; /* error detection */
        for (let v = nv - 1; nv > 2;) {
            /* if we loop, it is probably a non-simple polygon */
            if (0 >= (count--))
                return []; // Triangulation: ERROR - probable bad polygon!
            /* three consecutive vertices in current polygon, <u,v,w> */
            let u = v;
            if (nv <= u)
                u = 0; /* previous */
            v = u + 1;
            if (nv <= v)
                v = 0; /* new v    */
            let w = v + 1;
            if (nv <= w)
                w = 0; /* next     */
            if (Geom2D._snip(contour, u, v, w, nv, vList)) {
                /* true names of the vertices */
                let a = vList[u], b = vList[v], c = vList[w];
                /* output Triangle */
                result.push(a, b, c);
                /* remove v from remaining polygon */
                for (let s = v, t = v + 1; t < nv; s++, t++)
                    vList[s] = vList[t];
                nv--;
                /* reset error detection counter */
                count = 2 * nv;
            }
        }
        return result;
    }
    /**
     * Calculate the area of the polygon.
     * The sign of the area depends on the order the vetices appear on the computer screen.
     * negative : anti-clockwise   <br>
     * positive : clockwise        <br>
     *
     * @param contour an array of vertices that make up an open 2D polygon
     * @return the area of the polygon
     */
    static area(contour) {
        let n = contour.length;
        let areaX2 = 0;
        for (let p = n - 1, q = 0; q < n; p = q++)
            areaX2 += contour[p].x * contour[q].y - contour[q].x * contour[p].y;
        return areaX2 * 0.5;
    }
    static _snip(contour, u, v, w, n, vList) {
        let p;
        let Ax = contour[vList[u]].x;
        let Ay = contour[vList[u]].y;
        let Bx = contour[vList[v]].x;
        let By = contour[vList[v]].y;
        let Cx = contour[vList[w]].x;
        let Cy = contour[vList[w]].y;
        if (Geom2D.ACCY < (((Bx - Ax) * (Cy - Ay)) - ((By - Ay) * (Cx - Ax))))
            return false;
        for (p = 0; p < n; p++) {
            if ((p == u) || (p == v) || (p == w))
                continue;
            let Px = contour[vList[p]].x;
            let Py = contour[vList[p]].y;
            if (Geom2D.is_in_triangle(Ax, Ay, Bx, By, Cx, Cy, Px, Py))
                return false;
        }
        return true;
    }
}
Geom2D.ACCY = 1E-30;
Geom2D.ON_PLANE = 0b10000;
Geom2D.PLANE_INSIDE = 0b10001;
Geom2D.PLANE_OUTSIDE = 0b10010;
Geom2D.OUT_LEFT = 0b0001;
Geom2D.OUT_TOP = 0b0010;
Geom2D.OUT_RIGHT = 0b0100;
Geom2D.OUT_BOTTOM = 0b1000;
Geom2D.NEARNESS = 1.0;
const MATRIX2D = '1 # 06 Nov 2022';
// Some problems with translation yet to iron out
// should this class be immutable
/**
* Class to represent a 2D matrix that can be used to create transformed
* Vector2D objects.
*/
class Matrix2D {
    constructor() {
        this.matrix = new Matrix();
        this.matrix.identity();
    }
    set(n) {
        this.matrix.set(n);
    }
    /**
     * Create a new list of vectors from the provided list after being
     * transformed by this this.matrix.
     *
     * @param vList the original list of vectors
     * @return a list of transformed vectors.
     */
    transformVectors(vList) {
        return vList.map((v) => { return this.transformVector(v); });
    }
    // transformVectors(vList: Array<Vector2D>): Array<Vector2D> {
    //     return vList.map((v) => {
    //         let x = (this.matrix._11 * v.x) + (this.matrix._21 * v.y) + (this.matrix._31);
    //         let y = (this.matrix._12 * v.x) + (this.matrix._22 * v.y) + (this.matrix._32);
    //         return new Vector2D(x, y);
    //     });
    // }
    /**
     * Create a new vector from the provided vector after being transformed
     * by the matrix.
     *
     * @param vPoint the original vector
     * @return the transformed vector
     */
    transformVector(vPoint) {
        let x = (this.matrix._11 * vPoint.x) + (this.matrix._21 * vPoint.y) + (this.matrix._31);
        let y = (this.matrix._12 * vPoint.x) + (this.matrix._22 * vPoint.y) + (this.matrix._32);
        return new Vector2D(x, y);
    }
    /**
     * Initialise the matrix to the identity matrix. This will erase the previous
     * matrix element data.
     */
    identity() {
        this.matrix._11 = 1;
        this.matrix._12 = 0;
        this.matrix._13 = 0;
        this.matrix._21 = 0;
        this.matrix._22 = 1;
        this.matrix._23 = 0;
        this.matrix._31 = 0;
        this.matrix._32 = 0;
        this.matrix._33 = 1;
        return this;
    }
    /**
     * Translate the matrix by the amount specified in
     * x and y.
     *
     * @param x x-translation value
     * @param y y-translation value
     */
    translate(x, y) {
        let mat = new Matrix();
        mat._11 = 1;
        mat._12 = 0;
        mat._13 = 0;
        mat._21 = 0;
        mat._22 = 1;
        mat._23 = 0;
        mat._31 = x;
        mat._32 = y;
        mat._33 = 1;
        this._matrixMultiply(mat);
    }
    /**
     * Scale the matrix in the x and y directions.
     * @param xScale scale x by this
     * @param yScale scale y by this
     */
    scale(xScale, yScale) {
        let mat = new Matrix();
        mat._11 = xScale;
        mat._12 = 0;
        mat._13 = 0;
        mat._21 = 0;
        mat._22 = yScale;
        mat._23 = 0;
        mat._31 = 0;
        mat._32 = 0;
        mat._33 = 1;
        this._matrixMultiply(mat);
        return this;
    }
    /**
     * Rotate the matrix
     * @param p0 the angle of rotation (radians) or the forward vector
     * @param p1 the side vector
     */
    rotate(p0, p1) {
        if (typeof p0 === 'object' && typeof p1 === 'object')
            this._rotVectors(p0, p1);
        else if (typeof p0 === 'number' && Number.isFinite(p0))
            this._rotAngle(p0);
        return this;
    }
    /**
     * Rotation implementation given an angle.
     * @hidden
     */
    _rotAngle(rot) {
        let mat = new Matrix();
        let sinA = Math.sin(rot);
        let cosA = Math.cos(rot);
        mat._11 = cosA;
        mat._12 = sinA;
        mat._13 = 0;
        mat._21 = -sinA;
        mat._22 = cosA;
        mat._23 = 0;
        mat._31 = 0;
        mat._32 = 0;
        mat._33 = 1;
        this._matrixMultiply(mat);
    }
    /**
      * Rotation implementation given forward and side vectore.
      * @phidden
      */
    _rotVectors(fwd, side) {
        let mat = new Matrix();
        mat._11 = fwd.x;
        mat._12 = fwd.y;
        mat._13 = 0;
        mat._21 = side.x;
        mat._22 = side.y;
        mat._23 = 0;
        mat._31 = 0;
        mat._32 = 0;
        mat._33 = 1;
        this._matrixMultiply(mat);
    }
    /**
     * Multiply this matrix by another
     * @param mIn the multiplying matrix
     * @hidden
     */
    _matrixMultiply(mIn) {
        let mat = new Matrix();
        // Row 1
        mat._11 = (this.matrix._11 * mIn._11) + (this.matrix._12 * mIn._21) + (this.matrix._13 * mIn._31);
        mat._12 = (this.matrix._11 * mIn._12) + (this.matrix._12 * mIn._22) + (this.matrix._13 * mIn._32);
        mat._13 = (this.matrix._11 * mIn._13) + (this.matrix._12 * mIn._23) + (this.matrix._13 * mIn._33);
        // Row 2
        mat._21 = (this.matrix._21 * mIn._11) + (this.matrix._22 * mIn._21) + (this.matrix._23 * mIn._31);
        mat._22 = (this.matrix._21 * mIn._12) + (this.matrix._22 * mIn._22) + (this.matrix._23 * mIn._32);
        mat._23 = (this.matrix._21 * mIn._13) + (this.matrix._22 * mIn._23) + (this.matrix._23 * mIn._33);
        // Row 3
        mat._31 = (this.matrix._31 * mIn._11) + (this.matrix._32 * mIn._21) + (this.matrix._33 * mIn._31);
        mat._32 = (this.matrix._31 * mIn._12) + (this.matrix._32 * mIn._22) + (this.matrix._33 * mIn._32);
        mat._33 = (this.matrix._31 * mIn._13) + (this.matrix._32 * mIn._23) + (this.matrix._33 * mIn._33);
        this.matrix = mat;
    }
    // /**
    //  * Multiply this matrix by another
    //  * @param mIn the multiplying matrix
    //  * @hidden
    //  */
    // _matMultiply2D(m: Matrix2D) :Matr{
    //     let mIn = m.matrix;
    //     let mat = new Matrix();
    //     // Row 1
    //     mat._11 = (this.matrix._11 * mIn._11) + (this.matrix._12 * mIn._21) + (this.matrix._13 * mIn._31);
    //     mat._12 = (this.matrix._11 * mIn._12) + (this.matrix._12 * mIn._22) + (this.matrix._13 * mIn._32);
    //     mat._13 = (this.matrix._11 * mIn._13) + (this.matrix._12 * mIn._23) + (this.matrix._13 * mIn._33);
    //     // Row 2
    //     mat._21 = (this.matrix._21 * mIn._11) + (this.matrix._22 * mIn._21) + (this.matrix._23 * mIn._31);
    //     mat._22 = (this.matrix._21 * mIn._12) + (this.matrix._22 * mIn._22) + (this.matrix._23 * mIn._32);
    //     mat._23 = (this.matrix._21 * mIn._13) + (this.matrix._22 * mIn._23) + (this.matrix._23 * mIn._33);
    //     // Row 3
    //     mat._31 = (this.matrix._31 * mIn._11) + (this.matrix._32 * mIn._21) + (this.matrix._33 * mIn._31);
    //     mat._32 = (this.matrix._31 * mIn._12) + (this.matrix._32 * mIn._22) + (this.matrix._33 * mIn._32);
    //     mat._33 = (this.matrix._31 * mIn._13) + (this.matrix._32 * mIn._23) + (this.matrix._33 * mIn._33);
    //     this.matrix = mat;
    // }
    // setters for the matrix elements
    _11(val) { this.matrix._11 = val; }
    _12(val) { this.matrix._12 = val; }
    _13(val) { this.matrix._13 = val; }
    _21(val) { this.matrix._21 = val; }
    _22(val) { this.matrix._22 = val; }
    _23(val) { this.matrix._23 = val; }
    _31(val) { this.matrix._31 = val; }
    _32(val) { this.matrix._32 = val; }
    _33(val) { this.matrix._33 = val; }
    toString() {
        return this.matrix.toString();
    }
}
/**
 * Handy inner class to hold the intermediate transformation matrices.
 * @hidden
 */
class Matrix {
    /**
     * Ctor initialises to the zero matrix
     */
    constructor() {
        this._11 = 0;
        this._12 = 0;
        this._13 = 0;
        this._21 = 0;
        this._22 = 0;
        this._23 = 0;
        this._31 = 0;
        this._32 = 0;
        this._33 = 0;
    }
    set(n) {
        this._11 = n[0];
        this._12 = n[1];
        this._13 = n[2];
        this._21 = n[3];
        this._22 = n[4];
        this._23 = n[5];
        this._31 = n[6];
        this._32 = n[7];
        this._33 = n[8];
    }
    /**
     * Set to the identity matrix. Erases previous matrix data.
     */
    identity() {
        this._11 = 1.0;
        this._12 = 0.0;
        this._13 = 0.0;
        this._21 = 0.0;
        this._22 = 1.0;
        this._23 = 0.0;
        this._31 = 0.0;
        this._32 = 0.0;
        this._33 = 1.0;
    }
    toString() {
        let s = `[ ${this._11}, ${this._12}, ${this._13} ] `;
        s += `[ ${this._21}, ${this._22}, ${this._23} ] `;
        s += `[ ${this._31}, ${this._32}, ${this._33} ] `;
        return s;
    }
}
class Transform {
    //--------------------------- WorldTransform -----------------------------
    // Given a List of 2D vectors, a position and orientation
    // forward and side should be normalised before calling this method
    // this function transforms the 2D vectors into the object's world space
    //------------------------------------------------------------------------
    static worldTransform(points, pos, forward, side, scale = Vector2D.ONE) {
        // create and initialize the transformation matrix
        let matTransform = new Matrix2D();
        if ((scale.x != 1.0) || (scale.y != 1.0))
            matTransform.scale(scale.x, scale.y);
        matTransform.rotate(forward, side);
        matTransform.translate(pos.x, pos.y);
        return matTransform.transformVectors(points);
    }
    //--------------------- PointToWorldSpace --------------------------------
    // AgentHeading and AgentSide should be normalised first
    // Transforms a point from the agent's local space into world space
    //------------------------------------------------------------------------
    static pointToWorldSpace(point, AgentHeading, AgentSide, AgentPosition) {
        // create and initialize the transformation matrix
        let matTransform = new Matrix2D();
        matTransform.rotate(AgentHeading, AgentSide);
        matTransform.translate(AgentPosition.x, AgentPosition.y);
        return matTransform.transformVector(point);
    }
    //--------------------- VectorToWorldSpace -------------------------------
    // Transforms a vector from the agent's local space into world space
    //------------------------------------------------------------------------
    static vectorToWorldSpace(vec, AgentHeading, AgentSide) {
        // create and initialize the transformation matrix
        let matTransform = new Matrix2D();
        matTransform.rotate(AgentHeading, AgentSide);
        return matTransform.transformVector(vec);
    }
    //--------------------- PointToLocalSpace --------------------------------
    // AgentHeading and AgentSide should be normalised
    //------------------------------------------------------------------------
    static pointToLocalSpace(point, AgentHeading, AgentSide, AgentPosition) {
        // create and initialize the transformation matrix
        let matTransform = new Matrix2D();
        let tx = -AgentPosition.dot(AgentHeading);
        let ty = -AgentPosition.dot(AgentSide);
        matTransform._11(AgentHeading.x);
        matTransform._12(AgentSide.x);
        matTransform._21(AgentHeading.y);
        matTransform._22(AgentSide.y);
        matTransform._31(tx);
        matTransform._32(ty);
        return matTransform.transformVector(point);
    }
    //--------------------- VectorToLocalSpace -------------------------------
    // AgentHeading and AgentSide should be normalised
    //------------------------------------------------------------------------
    static vectorToLocalSpace(vec, AgentHeading, AgentSide) {
        // create and initialize the transformation matrix
        let matTransform = new Matrix2D();
        matTransform._11(AgentHeading.x);
        matTransform._12(AgentSide.x);
        matTransform._21(AgentHeading.y);
        matTransform._22(AgentSide.y);
        return matTransform.transformVector(vec);
    }
    //--------------------- Vec2DRotateAroundOrigin --------------------------
    // v is unchanged
    // rotates a vector ang radians around the origin
    //------------------------------------------------------------------------
    static vec2DRotateAroundOrigin(v, ang) {
        // create and initialize the transformation matrix
        let mat = new Matrix2D();
        mat.rotate(ang);
        return mat.transformVector(v);
    }
}
const VECTOR2D = '2 # 23 Dec 2023';
/**
* Simple 2D vector class
*
* Although it is possible to change the x and y properties with the set
* methods it is not recommended as it changes the actual vector.
*
* Allother methods return a new vector representing the result of the
* operation. For instance the statement
*
* <pre> v0.add(v1);  </pre>
*
* will return a the sum of the 2 vectors v0 and v1 as a new vector and
* will leave v0 unchanged.
*
* To change the vector v0 then you must assign the resukt back to v0
* like this
*
* <pre> v0 = v0.add(v1);  </pre>
*
* Last updated: 18 Nov 2023
*
* @author Peter Lager
*/
class Vector2D {
    /**
     * If no values are passed then a zero vector will be created.
     *
     * @param x x value
     * @param y y value
     */
    constructor(x = 0, y = 0) {
        _Vector2D_p.set(this, new Float64Array(2));
        __classPrivateFieldGet(this, _Vector2D_p, "f")[0] = x;
        __classPrivateFieldGet(this, _Vector2D_p, "f")[1] = y;
    }
    /** X coordinate value */
    get x() { return __classPrivateFieldGet(this, _Vector2D_p, "f")[0]; }
    set x(value) { if (Number.isFinite(value))
        __classPrivateFieldGet(this, _Vector2D_p, "f")[0] = value; }
    /** Y coordinate value */
    get y() { return __classPrivateFieldGet(this, _Vector2D_p, "f")[1]; }
    set y(value) { if (Number.isFinite(value))
        __classPrivateFieldGet(this, _Vector2D_p, "f")[1] = value; }
    /** Angle in 2D plane */
    get angle() { return Math.atan2(__classPrivateFieldGet(this, _Vector2D_p, "f")[1], __classPrivateFieldGet(this, _Vector2D_p, "f")[0]); }
    set angle(n) { __classPrivateFieldGet(this, _Vector2D_p, "f")[0] = Math.cos(n); __classPrivateFieldGet(this, _Vector2D_p, "f")[1] = Math.sin(n); }
    /**
     * Add a displacement (either vector object or 2 scalars )
     * to this vector to create a new vector.
     *
     * @param x a number or a Vector
     * @param y a number
     * @return the sum as a new vector
     */
    add(x, y) {
        let nv = this.copy();
        if (typeof x === 'object') {
            __classPrivateFieldGet(nv, _Vector2D_p, "f")[0] += __classPrivateFieldGet(x, _Vector2D_p, "f")[0];
            __classPrivateFieldGet(nv, _Vector2D_p, "f")[1] += __classPrivateFieldGet(x, _Vector2D_p, "f")[1];
        }
        else if (Number.isFinite(x) && Number.isFinite(y)) {
            __classPrivateFieldGet(nv, _Vector2D_p, "f")[0] += x;
            __classPrivateFieldGet(nv, _Vector2D_p, "f")[1] += y;
        }
        return nv;
    }
    /**
     * Calculate the angle between this and another vector.
     * @param v the other vector
     * @return the angle between in radians
     */
    angleBetween(v) {
        let denom = Math.sqrt(__classPrivateFieldGet(this, _Vector2D_p, "f")[0] * __classPrivateFieldGet(this, _Vector2D_p, "f")[0] + __classPrivateFieldGet(this, _Vector2D_p, "f")[1] * __classPrivateFieldGet(this, _Vector2D_p, "f")[1]) *
            Math.sqrt(__classPrivateFieldGet(v, _Vector2D_p, "f")[0] * __classPrivateFieldGet(v, _Vector2D_p, "f")[0] + __classPrivateFieldGet(v, _Vector2D_p, "f")[1] * __classPrivateFieldGet(v, _Vector2D_p, "f")[1]);
        if (Number.isFinite(denom)) {
            let a = Math.acos((__classPrivateFieldGet(this, _Vector2D_p, "f")[0] * __classPrivateFieldGet(v, _Vector2D_p, "f")[0] + __classPrivateFieldGet(this, _Vector2D_p, "f")[1] * __classPrivateFieldGet(v, _Vector2D_p, "f")[1]) / denom);
            return Number.isFinite(a) ? a : 0;
        }
        return 0;
    }
    /**
     * Creates a new vector object that duplicates this one
     * @returns a copy of this vector
     */
    copy() {
        return new Vector2D(__classPrivateFieldGet(this, _Vector2D_p, "f")[0], __classPrivateFieldGet(this, _Vector2D_p, "f")[1]);
    }
    /**
     * Get the distance between this and an other point.
     * @param v the other point
     * @return distance to other point
     */
    dist(v) {
        let dx = __classPrivateFieldGet(v, _Vector2D_p, "f")[0] - __classPrivateFieldGet(this, _Vector2D_p, "f")[0];
        let dy = __classPrivateFieldGet(v, _Vector2D_p, "f")[1] - __classPrivateFieldGet(this, _Vector2D_p, "f")[1];
        return Math.sqrt(dx * dx + dy * dy);
    }
    /**
     * Get the distance squared between this and another
     * point.
     * @param v the other point
     * @return distance to other point squared
     */
    distSq(v) {
        let dx = __classPrivateFieldGet(v, _Vector2D_p, "f")[0] - __classPrivateFieldGet(this, _Vector2D_p, "f")[0];
        let dy = __classPrivateFieldGet(v, _Vector2D_p, "f")[1] - __classPrivateFieldGet(this, _Vector2D_p, "f")[1];
        return dx * dx + dy * dy;
    }
    /**
     * Divide the vector by a scalar to create a new vector.
     * @param s scalar value to divide by
     * @return the quotient as a new number
     */
    div(s) {
        if (s == 0)
            throw new Error('Cannot divide vector by zero)');
        return new Vector2D(__classPrivateFieldGet(this, _Vector2D_p, "f")[0] / s, __classPrivateFieldGet(this, _Vector2D_p, "f")[1] / s);
    }
    /**
     * Calculate the dot product between two un-normalised vectors.
     * @param v the other vector
     * @return the dot product
     */
    dot(v) {
        return (__classPrivateFieldGet(this, _Vector2D_p, "f")[0] * __classPrivateFieldGet(v, _Vector2D_p, "f")[0] + __classPrivateFieldGet(this, _Vector2D_p, "f")[1] * __classPrivateFieldGet(v, _Vector2D_p, "f")[1]);
    }
    /**
     * Calculate the dot product between two vectors using normalised values
     * i.e. the cosine of the angle between them
     * @param v the other vector
     * @return the cosine of angle between them
     */
    dotNorm(v) {
        let denom = Math.sqrt(__classPrivateFieldGet(this, _Vector2D_p, "f")[0] * __classPrivateFieldGet(this, _Vector2D_p, "f")[0] + __classPrivateFieldGet(this, _Vector2D_p, "f")[1] * __classPrivateFieldGet(this, _Vector2D_p, "f")[1]) *
            Math.sqrt(__classPrivateFieldGet(v, _Vector2D_p, "f")[0] * __classPrivateFieldGet(v, _Vector2D_p, "f")[0] + __classPrivateFieldGet(v, _Vector2D_p, "f")[1] * __classPrivateFieldGet(v, _Vector2D_p, "f")[1]);
        return (__classPrivateFieldGet(this, _Vector2D_p, "f")[0] * __classPrivateFieldGet(v, _Vector2D_p, "f")[0] + __classPrivateFieldGet(this, _Vector2D_p, "f")[1] * __classPrivateFieldGet(v, _Vector2D_p, "f")[1]) / denom;
    }
    /**
     * This vector is considered equal to v if their x and y positions are
     * closer than Vecor2D.EPSILON.
     *
     * @param v the other vector
     * @returns true if this vector 'equals' v
     */
    equals(v) {
        return (Math.abs(__classPrivateFieldGet(this, _Vector2D_p, "f")[0] - __classPrivateFieldGet(v, _Vector2D_p, "f")[0]) <= Vector2D.EPSILON
            && Math.abs(__classPrivateFieldGet(this, _Vector2D_p, "f")[1] - __classPrivateFieldGet(v, _Vector2D_p, "f")[1]) <= Vector2D.EPSILON);
    }
    /**
     * Get a vector perpendicular to this one.
     * @return a perpendicular vector
     */
    getPerp() {
        return new Vector2D(-__classPrivateFieldGet(this, _Vector2D_p, "f")[1], __classPrivateFieldGet(this, _Vector2D_p, "f")[0]);
    }
    /**
     * Return the reflection of this vector about the norm
     * @param norm
     * @return the reflected vector
     */
    getReflect(norm, normalize = false) {
        if (normalize)
            norm = norm.normalize();
        let dot = this.dot(norm);
        let nx = __classPrivateFieldGet(this, _Vector2D_p, "f")[0] + (-2 * dot * __classPrivateFieldGet(norm, _Vector2D_p, "f")[0]);
        let ny = __classPrivateFieldGet(this, _Vector2D_p, "f")[1] + (-2 * dot * __classPrivateFieldGet(norm, _Vector2D_p, "f")[1]);
        return new Vector2D(nx, ny);
    }
    /**
     * Get a vector that is the reverse of this vector
     * @return the reverse vector
     */
    getReverse() {
        return new Vector2D(-__classPrivateFieldGet(this, _Vector2D_p, "f")[0], -__classPrivateFieldGet(this, _Vector2D_p, "f")[1]);
    }
    /**
     * Get the vector length
     */
    length() {
        return Math.sqrt(__classPrivateFieldGet(this, _Vector2D_p, "f")[0] * __classPrivateFieldGet(this, _Vector2D_p, "f")[0] + __classPrivateFieldGet(this, _Vector2D_p, "f")[1] * __classPrivateFieldGet(this, _Vector2D_p, "f")[1]);
    }
    /**
     * Get the vector length squared
     */
    lengthSq() {
        return __classPrivateFieldGet(this, _Vector2D_p, "f")[0] * __classPrivateFieldGet(this, _Vector2D_p, "f")[0] + __classPrivateFieldGet(this, _Vector2D_p, "f")[1] * __classPrivateFieldGet(this, _Vector2D_p, "f")[1];
    }
    /**
     * Multiply the vector by a scalar to create a new vector.
     * @param s scalar value to multiply by
     * @return the product as a new number
     */
    mult(s) {
        let nv = this.copy();
        __classPrivateFieldGet(nv, _Vector2D_p, "f")[0] *= s;
        __classPrivateFieldGet(nv, _Vector2D_p, "f")[1] *= s;
        return nv;
    }
    /**
     * Multiplies this vetor by -1 effectively reversing
     * the vector direction.
     *
     * @return the negated version as a new vector
     */
    negate() {
        return new Vector2D(-__classPrivateFieldGet(this, _Vector2D_p, "f")[0], -__classPrivateFieldGet(this, _Vector2D_p, "f")[1]);
    }
    /**
     * Normalise this vector
     */
    normalize() {
        let mag = this.length();
        if (!Number.isFinite(mag) || mag == 0)
            throw new Error('Cannot normalise a vector of zero or infinite length');
        return new Vector2D(__classPrivateFieldGet(this, _Vector2D_p, "f")[0] / mag, __classPrivateFieldGet(this, _Vector2D_p, "f")[1] / mag);
    }
    resize(size) {
        let mag = this.length();
        if (!Number.isFinite(mag) || mag == 0)
            throw new Error('Cannot resize a vector of zero or infinite length');
        let ratio = size / mag;
        return new Vector2D(__classPrivateFieldGet(this, _Vector2D_p, "f")[0] * ratio, __classPrivateFieldGet(this, _Vector2D_p, "f")[1] * ratio);
    }
    /**
     * =============   MUTATES VECTOR    ====================
     * @param position change the coordinates to match position
     * @returns the changed vetor
     */
    set(position) {
        if (position instanceof Array) {
            __classPrivateFieldGet(this, _Vector2D_p, "f")[0] = position[0];
            __classPrivateFieldGet(this, _Vector2D_p, "f")[1] = position[1];
        }
        else {
            __classPrivateFieldGet(this, _Vector2D_p, "f")[0] = position.x;
            __classPrivateFieldGet(this, _Vector2D_p, "f")[1] = position.y;
        }
        return this;
    }
    /**
     * Determines whether vector v is clockwise of this vector. <br>
     * @param v a vector
     * @return positive (+1) if clockwise else negative (-1)
     */
    sign(v) {
        if (__classPrivateFieldGet(this, _Vector2D_p, "f")[1] * __classPrivateFieldGet(v, _Vector2D_p, "f")[0] > __classPrivateFieldGet(this, _Vector2D_p, "f")[0] * __classPrivateFieldGet(v, _Vector2D_p, "f")[1])
            return Vector2D.CLOCKWISE;
        else
            return Vector2D.ANTI_CLOCKWISE;
    }
    /**
     * Subtract a displacement (either vector object or 2 scalars )
     * to this vector  to create a new vector.
     *
     * @param x a number or a Vector
     * @param y a number
     * @return the difference as a new vector
     */
    sub(x, y) {
        let nv = this.copy();
        if (typeof x === 'object') {
            __classPrivateFieldGet(nv, _Vector2D_p, "f")[0] -= __classPrivateFieldGet(x, _Vector2D_p, "f")[0];
            __classPrivateFieldGet(nv, _Vector2D_p, "f")[1] -= __classPrivateFieldGet(x, _Vector2D_p, "f")[1];
        }
        else if (Number.isFinite(x) && Number.isFinite(y)) {
            __classPrivateFieldGet(nv, _Vector2D_p, "f")[0] -= x;
            __classPrivateFieldGet(nv, _Vector2D_p, "f")[1] -= y;
        }
        return nv;
    }
    /**
     * Truncate this vector so its length is no greater than
     * the value provided and return as a new vector.
     * @param max maximum size for the new vector
     * @return the new truncated vector
     */
    truncate(max) {
        let nv = this.copy();
        let mag = nv.length();
        if (Number.isFinite(mag) && mag > max)
            nv = nv.mult(max / mag);
        return nv;
    }
    /**
     * Get the x,y coordinates as an array.
     */
    toArray() {
        return [__classPrivateFieldGet(this, _Vector2D_p, "f")[0], __classPrivateFieldGet(this, _Vector2D_p, "f")[1]];
    }
    /**       +++++++++++++ CLASS METHODS +++++++++++++++        */
    /**
     * @returns true if these vectors have the same coordinates
     */
    static areEqual(v0, v1) {
        return (Math.abs(__classPrivateFieldGet(v1, _Vector2D_p, "f")[0] - __classPrivateFieldGet(v0, _Vector2D_p, "f")[0]) <= Vector2D.EPSILON && Math.abs(__classPrivateFieldGet(v1, _Vector2D_p, "f")[1] - __classPrivateFieldGet(v0, _Vector2D_p, "f")[1]) <= Vector2D.EPSILON);
    }
    /**
     * The distance between two vectors
     * @param v0 the first vector
     * @param v1 the second vector
     * @return the distance between them
     */
    static dist(v0, v1) {
        return Math.sqrt(Vector2D.distSq(v0, v1));
    }
    /**
     * The square of the distance between two vectors
     * @param v0 the first vector
     * @param v1 the second vector
     * @return square of the distance between them
     */
    static distSq(v0, v1) {
        let dx = __classPrivateFieldGet(v1, _Vector2D_p, "f")[0] - __classPrivateFieldGet(v0, _Vector2D_p, "f")[0];
        let dy = __classPrivateFieldGet(v1, _Vector2D_p, "f")[1] - __classPrivateFieldGet(v0, _Vector2D_p, "f")[1];
        return dx * dx + dy * dy;
    }
    /**
     * Calculate the angle between two vectors.
     * @param v0 first vector
     * @param v1 second vector
     * @return the angle between in radians
     */
    static angleBetween(v0, v1) {
        let denom = Math.sqrt(__classPrivateFieldGet(v0, _Vector2D_p, "f")[0] * __classPrivateFieldGet(v0, _Vector2D_p, "f")[0] + __classPrivateFieldGet(v0, _Vector2D_p, "f")[1] * __classPrivateFieldGet(v0, _Vector2D_p, "f")[1]) * Math.sqrt(__classPrivateFieldGet(v1, _Vector2D_p, "f")[0] * __classPrivateFieldGet(v1, _Vector2D_p, "f")[0] + __classPrivateFieldGet(v1, _Vector2D_p, "f")[1] * __classPrivateFieldGet(v1, _Vector2D_p, "f")[1]);
        if (Number.isFinite(denom)) {
            let a = Math.acos((__classPrivateFieldGet(v0, _Vector2D_p, "f")[0] * __classPrivateFieldGet(v1, _Vector2D_p, "f")[0] + __classPrivateFieldGet(v0, _Vector2D_p, "f")[1] * __classPrivateFieldGet(v1, _Vector2D_p, "f")[1]) / denom);
            return Number.isFinite(a) ? a : 0;
        }
        return 0;
    }
    /**
     * Determines whether entity 2 is visible from entity 1.
     * @param pos1 position of first entity
     * @param facing1 direction first entity is facing
     * @param fov1 field of view (radians) of first entity
     * @param pos2 position of second entity
     * @return true if second entity is inside 'visible' to the first entity
     */
    static isSecondInFOVofFirst(pos1, facing1, fov1, pos2) {
        let toTarget = pos2.sub(pos1); // Vector2D.sub(pos2, pos1);
        let dd = toTarget.length() * facing1.length();
        let angle = facing1.dot(toTarget) / dd;
        return angle >= Math.cos(fov1 / 2);
    }
    /**
     * Create a randomly orientated vector whose magnitude is in the range provided.
     * @param mag0 minimum magnitude
     * @param mag1 maximum magnitude
     * @return the randomised vector
     */
    static fromRandom(mag0 = 1, mag1 = 1) {
        let a = 2 * Math.PI * Math.random();
        let m = Math.random() * (mag1 - mag0) + mag0;
        return new Vector2D(m * Math.cos(a), m * Math.sin(a));
    }
    /**
     *
     * @param position
     * @param colRadius
     * @returns
     */
    static from(position) {
        if (position instanceof Array)
            return new Vector2D(position[0], position[1]);
        else
            return new Vector2D(position.x, position.y);
    }
    print(precision = 16) {
        console.log(this.$(precision));
        return this;
    }
    // Return vector as array string su
    $(precision = 16) {
        let xv = this.x.toPrecision(precision);
        let yv = this.y.toPrecision(precision);
        return `[${xv}, ${yv}]`;
    }
    toString() {
        return this.$();
    }
}
_Vector2D_p = new WeakMap();
/** Null vector (coordinates: 0, 0). */
Vector2D.ZERO = new Vector2D(0, 0);
/** Null vector (coordinates: 1, 1). */
Vector2D.ONE = new Vector2D(1, 1);
/** First canonical vector (coordinates: 1, 0). */
Vector2D.PLUS_I = new Vector2D(1, 0);
/** Opposite of the first canonical vector (coordinates: -1, 0). */
Vector2D.MINUS_I = new Vector2D(-1, 0);
/** Second canonical vector (coordinates: 0, 1). */
Vector2D.PLUS_J = new Vector2D(0, 1);
/** Opposite of the second canonical vector (coordinates: 0, -1). */
Vector2D.MINUS_J = new Vector2D(0, -1);
/** A vector with all coordinates set to positive infinity. */
Vector2D.POSITIVE_INFINITY = new Vector2D(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
/** A vector with all coordinates set to negative infinity. */
Vector2D.NEGATIVE_INFINITY = new Vector2D(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
Vector2D.EPSILON = 1E-10;
Vector2D.CLOCKWISE = 1;
Vector2D.ANTI_CLOCKWISE = -1;
class Artefact extends Entity {
    constructor(center, width, height) {
        super(center);
        _Artefact_lowX.set(this, void 0);
        _Artefact_highX.set(this, void 0);
        _Artefact_lowY.set(this, void 0);
        _Artefact_highY.set(this, void 0);
        _Artefact_width.set(this, void 0);
        _Artefact_height.set(this, void 0);
        this.Z = 8;
        __classPrivateFieldSet(this, _Artefact_width, width, "f");
        __classPrivateFieldSet(this, _Artefact_height, height, "f");
        __classPrivateFieldSet(this, _Artefact_lowX, center.x - width / 2, "f");
        __classPrivateFieldSet(this, _Artefact_lowY, center.y - height / 2, "f");
        __classPrivateFieldSet(this, _Artefact_highX, center.x + width / 2, "f");
        __classPrivateFieldSet(this, _Artefact_highY, center.y + height / 2, "f");
    }
    get lowX() { return __classPrivateFieldGet(this, _Artefact_lowX, "f"); }
    get highX() { return __classPrivateFieldGet(this, _Artefact_highX, "f"); }
    get lowY() { return __classPrivateFieldGet(this, _Artefact_lowY, "f"); }
    get highY() { return __classPrivateFieldGet(this, _Artefact_highY, "f"); }
    get width() { return __classPrivateFieldGet(this, _Artefact_width, "f"); }
    get height() { return __classPrivateFieldGet(this, _Artefact_height, "f"); }
    fits_inside(lowX, lowY, highX, highY) {
        let fits = (__classPrivateFieldGet(this, _Artefact_lowX, "f") >= lowX) && (__classPrivateFieldGet(this, _Artefact_highX, "f") <= highX)
            && (__classPrivateFieldGet(this, _Artefact_lowY, "f") >= lowY) && (__classPrivateFieldGet(this, _Artefact_highY, "f") <= highY);
        return fits;
    }
    toString() {
        let s = `Artefact: [${__classPrivateFieldGet(this, _Artefact_lowX, "f")}, ${__classPrivateFieldGet(this, _Artefact_lowY, "f")}] - [${__classPrivateFieldGet(this, _Artefact_highX, "f")}, ${__classPrivateFieldGet(this, _Artefact_highY, "f")}]`;
        s += `    Size: ${__classPrivateFieldGet(this, _Artefact_width, "f")} x ${__classPrivateFieldGet(this, _Artefact_height, "f")}`;
        return s;
    }
}
_Artefact_lowX = new WeakMap(), _Artefact_highX = new WeakMap(), _Artefact_lowY = new WeakMap(), _Artefact_highY = new WeakMap(), _Artefact_width = new WeakMap(), _Artefact_height = new WeakMap();
class Entity {
    constructor(position = Vector2D.ZERO, colRadius = 1) {
        var _b, _c, _d;
        /** Every entity should be given a unique ID number */
        _Entity_id.set(this, void 0);
        /** Position */
        _Entity_pos.set(this, new Vector2D());
        /** The colision radius */
        _Entity_colRad.set(this, 0);
        /** The tag property */
        _Entity_tag.set(this, void 0);
        /** The finite state machine */
        _Entity_fsm.set(this, void 0);
        /** Set the renderer */
        _Entity_painter.set(this, void 0);
        /** visibility */
        _Entity_visible.set(this, true);
        /** The z-order display order property */
        this.__Z = 0;
        __classPrivateFieldSet(this, _Entity_id, (__classPrivateFieldSet(_b = Entity, _a, (_d = __classPrivateFieldGet(_b, _a, "f", _Entity_NEXT_ID), _c = _d++, _d), "f", _Entity_NEXT_ID), _c), "f");
        __classPrivateFieldSet(this, _Entity_pos, Vector2D.from(position), "f");
        __classPrivateFieldSet(this, _Entity_colRad, colRadius, "f");
    }
    get id() { return __classPrivateFieldGet(this, _Entity_id, "f"); }
    get pos() { return __classPrivateFieldGet(this, _Entity_pos, "f"); }
    set pos(v) { __classPrivateFieldSet(this, _Entity_pos, v, "f"); }
    setPos(v) { __classPrivateFieldSet(this, _Entity_pos, v, "f"); return this; }
    /** Position coordinates */
    get x() { return __classPrivateFieldGet(this, _Entity_pos, "f").x; }
    get y() { return __classPrivateFieldGet(this, _Entity_pos, "f").y; }
    get colRad() { return __classPrivateFieldGet(this, _Entity_colRad, "f"); }
    set colRad(value) { __classPrivateFieldSet(this, _Entity_colRad, value, "f"); }
    setColRad(value) { __classPrivateFieldSet(this, _Entity_colRad, value, "f"); return this; }
    get tag() { return __classPrivateFieldGet(this, _Entity_tag, "f"); }
    set tag(value) { __classPrivateFieldSet(this, _Entity_tag, value, "f"); }
    setTag(value) { __classPrivateFieldSet(this, _Entity_tag, value, "f"); return this; }
    get fsm() { return __classPrivateFieldGet(this, _Entity_fsm, "f"); }
    enableFsm(owner, world) { __classPrivateFieldSet(this, _Entity_fsm, new FiniteStateMachine(owner, world), "f"); }
    ;
    set painter(painter) { __classPrivateFieldSet(this, _Entity_painter, painter, "f"); }
    setPainter(painter) { __classPrivateFieldSet(this, _Entity_painter, painter, "f"); return this; }
    show() { __classPrivateFieldSet(this, _Entity_visible, true, "f"); }
    hide() { __classPrivateFieldSet(this, _Entity_visible, false, "f"); }
    isVisible() { return __classPrivateFieldGet(this, _Entity_visible, "f"); }
    get Z() { return this.__Z; }
    set Z(value) { this.__Z = value; }
    /** Override this in entities reqiiring special actions e.g. Obstacle, Fence */
    born(world) {
        world.births.push(this);
    }
    /** Override this in entities reqiiring special actions e.g. Fence */
    dies(world) {
        world.deaths.push(this);
    }
    fitsInside(lowX, lowY, highX, highY) {
        let p = __classPrivateFieldGet(this, _Entity_pos, "f"), cr = __classPrivateFieldGet(this, _Entity_colRad, "f");
        return p.x - cr >= lowX && p.x + cr <= highX && p.y - cr >= lowY && p.y + cr <= highY;
    }
    isEitherSide(p0, p1) {
        return Geom2D.line_circle(p0.x, p0.y, p1.x, p1.y, this.pos.x, this.pos.y, this.colRad);
    }
    update(elapsedTime, world) { }
    changeState(newState) { __classPrivateFieldGet(this, _Entity_fsm, "f")?.changeState(newState); }
    revertToPreviousState() { __classPrivateFieldGet(this, _Entity_fsm, "f")?.revertToPreviousState(); }
    hasFSM() { return __classPrivateFieldGet(this, _Entity_fsm, "f") ? true : false; }
    render(elapsedTime, world) { if (this.isVisible)
        __classPrivateFieldGet(this, _Entity_painter, "f")?.call(this, elapsedTime, world); }
    $$() {
        console.log(this.toString());
    }
    $() {
        return this.toString();
    }
    toString() {
        return `${this.constructor.name}  @  [${this.x.toFixed(FXD)}, ${this.y.toFixed(FXD)}]  Col. radius: ${this.colRad.toFixed(FXD)}`;
    }
}
_a = Entity, _Entity_id = new WeakMap(), _Entity_pos = new WeakMap(), _Entity_colRad = new WeakMap(), _Entity_tag = new WeakMap(), _Entity_fsm = new WeakMap(), _Entity_painter = new WeakMap(), _Entity_visible = new WeakMap();
_Entity_NEXT_ID = { value: 0 };
class Fence extends Entity {
    /**
     * A series of walls joined end-to-end making a fence or enclosure.
     *
     * The contour should be an open list of vectors for the 'fence posts'. For
     * consistant behaviour when using wall avoidance they should be in listed
     * in anti-clockwise order.
     *
     * An 'open' list is one where the first and last elements are not the same
     * position.
     *
     * A wall will be created between all adjacent elements in the array. So a
     * contour (array) of length 'n' will create 'n-1' walls. To create a wall
     * between the first and last element of the contour the second parameter
     * should be true.
     *
     *
     * @param contour an open list of vertices
     * @param makeEnclosure make the fence a closed enclosure.
     * @param repelSide which side of the wall is detectable to moving entities.
     */
    constructor(contour, makeEnclosure = false, repelSide = BOTH_SIDES, noWallAt = []) {
        // Find XY limits
        let lowX = contour[0].x, lowY = contour[0].y;
        let highX = contour[0].x, highY = contour[0].y;
        contour.forEach(v => {
            lowX = Math.min(lowX, v.x);
            lowY = Math.min(lowY, v.y);
            highX = Math.max(highX, v.x);
            highY = Math.max(highY, v.y);
        });
        super([(lowX + highX) / 2, (lowY + highY) / 2], 1);
        _Fence_lowX.set(this, void 0);
        _Fence_lowY.set(this, void 0);
        _Fence_highX.set(this, void 0);
        _Fence_highY.set(this, void 0);
        _Fence_tri.set(this, void 0);
        _Fence_walls.set(this, new Map());
        _Fence_contour.set(this, void 0);
        __classPrivateFieldSet(this, _Fence_lowX, lowX, "f");
        __classPrivateFieldSet(this, _Fence_lowY, lowY, "f");
        __classPrivateFieldSet(this, _Fence_highX, highX, "f");
        __classPrivateFieldSet(this, _Fence_highY, highY, "f");
        for (let i = 1; i < contour.length; i++)
            __classPrivateFieldGet(this, _Fence_walls, "f").set(i - 1, new Wall(contour[i - 1], contour[i], repelSide));
        if (makeEnclosure)
            __classPrivateFieldGet(this, _Fence_walls, "f").set(contour.length - 1, new Wall(contour[contour.length - 1], contour[0], repelSide));
        noWallAt.forEach(idx => __classPrivateFieldGet(this, _Fence_walls, "f").delete(idx));
        let closed = contour[0].equals(contour[contour.length - 1]);
        __classPrivateFieldSet(this, _Fence_tri, Geom2D.triangulate(contour, closed).map(idx => contour[idx]), "f");
        __classPrivateFieldSet(this, _Fence_contour, contour, "f");
    }
    get lowX() { return __classPrivateFieldGet(this, _Fence_lowX, "f"); }
    get lowY() { return __classPrivateFieldGet(this, _Fence_lowY, "f"); }
    get highX() { return __classPrivateFieldGet(this, _Fence_highX, "f"); }
    get highY() { return __classPrivateFieldGet(this, _Fence_highY, "f"); }
    get triangles() { return __classPrivateFieldGet(this, _Fence_tri, "f"); }
    get walls() { return [...__classPrivateFieldGet(this, _Fence_walls, "f").values()]; }
    get contour() { return __classPrivateFieldGet(this, _Fence_contour, "f"); }
    /** Overrides entity.born */
    born(world) {
        world.births.push(this);
        world.births.push(...__classPrivateFieldGet(this, _Fence_walls, "f").values());
    }
    /** Overrides entity.dies */
    dies(world) {
        world.deaths.push(this);
        world.deaths.push(...__classPrivateFieldGet(this, _Fence_walls, "f").values());
    }
    deleteWall(idx, world) {
        let wall = __classPrivateFieldGet(this, _Fence_walls, "f").get(idx);
        if (world && wall)
            world.deaths.push(wall);
    }
    wallRepelSide(idx, repelSide) {
        let wall = __classPrivateFieldGet(this, _Fence_walls, "f").get(idx);
        console.log(`Fence clss: ${String(repelSide)}`);
        wall?.setRepelSide(repelSide);
    }
    fitsInside(lowX, lowY, highX, highY) {
        return __classPrivateFieldGet(this, _Fence_lowX, "f") >= lowX && __classPrivateFieldGet(this, _Fence_lowY, "f") >= lowY && __classPrivateFieldGet(this, _Fence_highX, "f") <= highX && __classPrivateFieldGet(this, _Fence_highY, "f") <= highY;
    }
    update(elapsedTime) {
        // Use enity method?
    }
}
_Fence_lowX = new WeakMap(), _Fence_lowY = new WeakMap(), _Fence_highX = new WeakMap(), _Fence_highY = new WeakMap(), _Fence_tri = new WeakMap(), _Fence_walls = new WeakMap(), _Fence_contour = new WeakMap();
class Mover extends Entity {
    constructor(position, colRadius = 0) {
        super(position, colRadius);
        /** Movement domain - if none provided the world domain is used */
        _Mover_domain.set(this, void 0);
        /** Prev world position */
        _Mover_prevPos.set(this, new Vector2D());
        /** Velocity */
        _Mover_vel.set(this, new Vector2D());
        /** Heading / facing (normalised) */
        this.__heading = new Vector2D(1, 0); // facing East;
        /** Perpendiclar to heading (normalised) */
        _Mover_side.set(this, void 0);
        /** Mass */
        this.__mass = 1;
        /** Max speed */
        this.__maxSpeed = 100;
        /** Max force */
        this.__maxForce = 200;
        /** Current turn rate */
        this.__turnRate = 2;
        /** Distance a moving entity can see another one */
        this.__viewDistance = 125;
        /** Field of view (radians) */
        this.__viewFOV = 1.047; // Default is 60 degrees
        this.Z = 128;
        __classPrivateFieldGet(this, _Mover_prevPos, "f").set(this.pos);
        this.__mass = 1;
        __classPrivateFieldSet(this, _Mover_side, this.__heading.getPerp(), "f");
    }
    set domain(d) { __classPrivateFieldSet(this, _Mover_domain, d, "f"); }
    get domain() { return __classPrivateFieldGet(this, _Mover_domain, "f"); }
    set domainConstraint(c) { __classPrivateFieldGet(this, _Mover_domain, "f")?.setConstraint(c); }
    set prevPos(v) { __classPrivateFieldSet(this, _Mover_prevPos, v, "f"); }
    get prevPos() { return __classPrivateFieldGet(this, _Mover_prevPos, "f"); }
    set vel(v) { __classPrivateFieldSet(this, _Mover_vel, v, "f"); }
    get vel() { return __classPrivateFieldGet(this, _Mover_vel, "f"); }
    get velAngle() { return __classPrivateFieldGet(this, _Mover_vel, "f").angle; }
    /** Speed */
    get speed() { return __classPrivateFieldGet(this, _Mover_vel, "f").length(); }
    get speedSq() { return __classPrivateFieldGet(this, _Mover_vel, "f").lengthSq(); }
    set heading(v) { this.__heading = v; }
    get heading() { return this.__heading; }
    /** Heading / facing angle */
    set headingAngle(n) { this.__heading.x = Math.cos(n); this.__heading.x = Math.sin(n); }
    get headingAngle() { return this.heading.angle; }
    set headingAtRest(v) { this.__headingAtRest = v; }
    get headingAtRest() { return this.__headingAtRest; }
    /** Heading at rest angle */
    set headingAtRestAngle(n) { this.__heading.x = Math.cos(n); this.__heading.x = Math.sin(n); }
    get headingAtRestAngle() { return this.heading.angle; }
    get side() { return __classPrivateFieldGet(this, _Mover_side, "f"); }
    set side(n) { __classPrivateFieldSet(this, _Mover_side, n, "f"); }
    set mass(n) { this.__mass = n; }
    get mass() { return this.__mass; }
    set maxSpeed(n) { this.__maxSpeed = n; }
    get maxSpeed() { return this.__maxSpeed; }
    set maxForce(n) { this.__maxForce = n; }
    get maxForce() { return this.__maxForce; }
    set turnRate(n) { this.__turnRate = Math.min(Math.max(n, 0), MAX_TURN_RATE); }
    get turnRate() { return this.__turnRate; }
    set viewDistance(n) { this.__viewDistance = n; }
    get viewDistance() { return this.__viewDistance; }
    set viewFOV(n) { this.__viewFOV = n; }
    get viewFOV() { return this.__viewFOV; }
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
                console.error(`"${p} " is not a valid property name for a vehicle.`);
        }
        return this;
    }
    /**
     * See if the current speed exceeds the maximum speed permitted.
     * @return true if the speed is greater or equal to the max speed.
     */
    isSpeedMaxedOut() {
        return __classPrivateFieldGet(this, _Mover_vel, "f").lengthSq() >= this.__maxSpeed * this.__maxSpeed;
    }
    /**
     * After calculating the entity's position it is then constrained by
     * the domain constraint REBOUND, WRAP or PASS_THROUGH (not constrained)
     */
    applyDomainConstraint(domain) {
        if (domain)
            switch (domain.constraint) {
                case WRAP:
                    if (this.pos.x < domain.lowX)
                        this.pos.x += domain.width;
                    else if (this.pos.x > domain.highX)
                        this.pos.x -= domain.width;
                    if (this.pos.y < domain.lowY)
                        this.pos.y += domain.height;
                    else if (this.pos.y > domain.highY)
                        this.pos.y -= domain.height;
                    break;
                case REBOUND:
                    if (this.pos.x < domain.lowX)
                        __classPrivateFieldGet(this, _Mover_vel, "f").x = Math.abs(__classPrivateFieldGet(this, _Mover_vel, "f").x);
                    else if (this.pos.x > domain.highX)
                        __classPrivateFieldGet(this, _Mover_vel, "f").x = -Math.abs(__classPrivateFieldGet(this, _Mover_vel, "f").x);
                    if (this.pos.y < domain.lowY)
                        __classPrivateFieldGet(this, _Mover_vel, "f").y = Math.abs(__classPrivateFieldGet(this, _Mover_vel, "f").y);
                    else if (this.pos.y > domain.highY)
                        __classPrivateFieldGet(this, _Mover_vel, "f").y = -Math.abs(__classPrivateFieldGet(this, _Mover_vel, "f").y);
                    break;
                default:
                    break;
            }
    }
    /**
     * Determines whether two points are either side of this moving entity. If they are
     * then they cannot 'see' each other.
     *
     * @param p0 x position of first point of interest
     * @param y1 y position of first point of interest
     * @return true if the points are either side else false
     */
    isEitherSide(p0, p1) {
        return Geom2D.line_circle(p0.x, p0.y, p1.x, p1.y, this.pos.x, this.pos.y, this.colRad);
    }
    /**
     * This method determines whether this entity can see a particular location in the world. <br>
     * It first checks to see if it is within this entity's view distance and field of view (FOV).
     * If it is then it checks to see if there are any walls or obstacles between them.
     *
     * @param world the world responsible for this entity
     * @param position the location to test
     * @return true if the entity can see the location
     */
    canSee(world, position) {
        let pos = this.pos;
        let target = Vector2D.from(position);
        let toTarget = target.sub(pos);
        // See if in view range
        let distToTarget = toTarget.length();
        if (distToTarget > this.viewDistance)
            return false;
        // See if in field of view
        toTarget = toTarget.div(distToTarget); // normalise toTarget
        let cosAngle = this.heading.dot(toTarget);
        if (cosAngle < Math.cos(this.viewFOV / 2))
            return false;
        // Do we have an obstruction?
        let lowX = Math.min(pos.x, target.x), lowY = Math.min(pos.y, target.y);
        let highX = Math.max(pos.x, target.x), highY = Math.max(pos.y, target.y);
        let ents = world.tree.getItemsInRegion(lowX, lowY, highX, highY)
            .entities.filter(e => e instanceof Obstacle || e instanceof Wall);
        for (let entity of ents)
            if (entity.isEitherSide(pos, target))
                return false;
        return true;
    }
    /**
     * This method determines whether this entity can see a particular location in the world. <br>
     * It first checks to see if it is within this entity's view distance and field of view (FOV).
     * If it is then it checks to see if there are any walls or obstacles between them.
     *
     * @param world the world responsible for this entity
     * @param pos the location to test
     * @return true if the entity can see the location
     */
    /**
     * ----------------------- RotateHeadingToFacePosition ------------------
     *
     * given a target position, this method rotates the entity's heading and
     * side vectors by an amount not greater than m_dMaxTurnRate until it
     * directly faces the target.
     *
     * @param deltaTime time
     * @param faceTarget the world position to face
     * @return true when the heading is facing in the desired direction
     */
    rotateHeadingToFacePosition(deltaTime, faceTarget) {
        // Calculate the normalised vetor to the face target
        let alignTo = faceTarget.sub(this.pos); // Vector2D.sub(faceTarget, this._pos);
        alignTo.normalize();
        return this.rotateHeadingToAlignWith(deltaTime, alignTo);
    }
    /**
     * Rotate this entities heading to align with a vector over a given time period
     * @param elapsedTime time (seconds) to turn entity
     * @param alignTo vector to align entities heading with
     * @return true if facing alignment vector
     */
    rotateHeadingToAlignWith(elapsedTime, alignTo) {
        // Calculate the angle between the heading vector and the target
        let angleBetween = this.__heading.angleBetween(alignTo);
        // Return true if the player is virtually facing the target
        if (Math.abs(angleBetween) < EPSILON)
            return true;
        // Calculate the amount of turn possible in time allowed
        let angleToTurn = this.__turnRate * elapsedTime;
        // Prevent over steer by clamping the amount to turn to the angle angle 
        // between the heading vector and the target
        if (angleToTurn > angleBetween)
            angleToTurn = angleBetween;
        // The next few lines use a rotation matrix to rotate the player's heading
        // vector accordingly
        let rotMatrix = new Matrix2D();
        // The direction of rotation is needed to create the rotation matrix
        rotMatrix.rotate(angleToTurn * alignTo.sign(this.__heading));
        // Rotate heading
        this.__heading = rotMatrix.transformVector(this.__heading);
        this.__heading.normalize();
        // Calculate new side
        __classPrivateFieldSet(this, _Mover_side, this.__heading.getPerp(), "f");
        return false;
    }
    /**
     * Determine whether this moving entity is inside or part inside the domain. This method is
     * used by the world draw method to see if this entity should be drawn.
     * @param view the world domain
     * @return true if any part of this entity is inside the domain
     */
    isInDomain(view) {
        return (this.pos.x >= view.lowX && this.pos.x <= view.highX
            && this.pos.y >= view.lowY && this.pos.y <= view.highY);
    }
    /**
     * Determines whether a point is over this entity's collision circle
     */
    isOver(px, py) {
        return ((this.pos.x - px) * (this.pos.x - px) + (this.pos.y - py) * (this.pos.y - py))
            <= (this.colRad * this.colRad);
    }
    /**
     * Update method for any moving entity in the world that is not under
     * the influence of a steering behaviour.
     * @param elapsedTime elapsed time since last update (milliseconds)
     * @param world the game world object
     */
    update(elapsedTime, world) {
        // Remember the starting position
        __classPrivateFieldGet(this, _Mover_prevPos, "f").set(this.pos);
        // Update position
        this.pos = this.pos.add(__classPrivateFieldGet(this, _Mover_vel, "f").mult(elapsedTime));
        // Apply domain constraint
        this.applyDomainConstraint(__classPrivateFieldGet(this, _Mover_domain, "f") ? __classPrivateFieldGet(this, _Mover_domain, "f") : world.domain);
        // Update heading
        if (__classPrivateFieldGet(this, _Mover_vel, "f").lengthSq() > 0.01)
            this.rotateHeadingToAlignWith(elapsedTime, __classPrivateFieldGet(this, _Mover_vel, "f"));
        else {
            __classPrivateFieldGet(this, _Mover_vel, "f").set([0, 0]);
            if (this.headingAtRest)
                this.rotateHeadingToAlignWith(elapsedTime, this.headingAtRest);
        }
        // Ensure heading and side are normalised
        this.heading = this.heading.normalize();
        __classPrivateFieldSet(this, _Mover_side, this.heading.getPerp(), "f");
    }
}
_Mover_domain = new WeakMap(), _Mover_prevPos = new WeakMap(), _Mover_vel = new WeakMap(), _Mover_side = new WeakMap();
class Obstacle extends Entity {
    constructor(position, colRadius = 1) {
        super(position, colRadius);
        this.Z = 80;
    }
    born(world) {
        world.births.push(this);
        world.maxObstacleSize = this.colRad;
    }
    isEitherSide(p0, p1) {
        // console.log(` Sight line Position ${p0.$(4)}   Target ${p1.$(4)}`)
        return Geom2D.line_circle(p0.x, p0.y, p1.x, p1.y, this.pos.x, this.pos.y, this.colRad);
    }
}
class Vehicle extends Mover {
    constructor(position, radius) {
        super(position, radius);
        _Vehicle_autopilot.set(this, void 0);
        _Vehicle_forceRecorder.set(this, void 0);
        _Vehicle_force.set(this, new Vector2D());
        _Vehicle_accel.set(this, new Vector2D());
        this.Z = 144;
        __classPrivateFieldSet(this, _Vehicle_autopilot, new AutoPilot(this), "f");
    }
    get pilot() { return __classPrivateFieldGet(this, _Vehicle_autopilot, "f"); }
    get recorder() { return __classPrivateFieldGet(this, _Vehicle_forceRecorder, "f"); }
    setForce(force) { __classPrivateFieldGet(this, _Vehicle_force, "f").set(force); return this; }
    set force(force) { __classPrivateFieldGet(this, _Vehicle_force, "f").set(force); }
    get force() { return __classPrivateFieldGet(this, _Vehicle_force, "f"); }
    setAccel(accel) { __classPrivateFieldGet(this, _Vehicle_accel, "f").set(accel); return this; }
    set accel(accel) { __classPrivateFieldGet(this, _Vehicle_accel, "f").set(accel); }
    get accel() { return __classPrivateFieldGet(this, _Vehicle_accel, "f"); }
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
            __classPrivateFieldSet(this, _Vehicle_forceRecorder, new ForceRecorder(this), "f");
        return this;
    }
    forceRecorderOff() {
        console.log(this.recorder.toString());
        __classPrivateFieldSet(this, _Vehicle_forceRecorder, undefined, "f");
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
        __classPrivateFieldGet(this, _Vehicle_force, "f").set([0, 0]);
        __classPrivateFieldGet(this, _Vehicle_accel, "f").set([0, 0]);
        if (__classPrivateFieldGet(this, _Vehicle_autopilot, "f")) {
            __classPrivateFieldGet(this, _Vehicle_force, "f").set(__classPrivateFieldGet(this, _Vehicle_autopilot, "f").calculateForce(elapsedTime, world));
            __classPrivateFieldSet(this, _Vehicle_force, __classPrivateFieldGet(this, _Vehicle_force, "f").truncate(this.maxForce), "f");
            __classPrivateFieldSet(this, _Vehicle_accel, __classPrivateFieldGet(this, _Vehicle_force, "f").mult(elapsedTime / this.mass), "f");
            this.vel = this.vel.add(__classPrivateFieldGet(this, _Vehicle_accel, "f"));
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
_Vehicle_autopilot = new WeakMap(), _Vehicle_forceRecorder = new WeakMap(), _Vehicle_force = new WeakMap(), _Vehicle_accel = new WeakMap();
class Wall extends Entity {
    constructor(start, end, repelSide = BOTH_SIDES) {
        let vs = Vector2D.from(start), ve = Vector2D.from(end);
        super(vs.add(ve).div(2), 1);
        _Wall_start.set(this, void 0);
        _Wall_end.set(this, void 0);
        _Wall_norm.set(this, void 0);
        _Wall_repelSide.set(this, void 0);
        this.Z = 64;
        __classPrivateFieldSet(this, _Wall_start, vs, "f");
        __classPrivateFieldSet(this, _Wall_end, ve, "f");
        __classPrivateFieldSet(this, _Wall_norm, new Vector2D(-(__classPrivateFieldGet(this, _Wall_end, "f").y - __classPrivateFieldGet(this, _Wall_start, "f").y), __classPrivateFieldGet(this, _Wall_end, "f").x - __classPrivateFieldGet(this, _Wall_start, "f").x), "f");
        __classPrivateFieldSet(this, _Wall_norm, __classPrivateFieldGet(this, _Wall_norm, "f").normalize(), "f");
        this.repelSide = repelSide;
    }
    get start() { return __classPrivateFieldGet(this, _Wall_start, "f"); }
    ;
    get end() { return __classPrivateFieldGet(this, _Wall_end, "f"); }
    ;
    get norm() { return __classPrivateFieldGet(this, _Wall_norm, "f"); }
    ;
    setRepelSide(s) { __classPrivateFieldSet(this, _Wall_repelSide, s, "f"); return this; }
    set repelSide(s) { __classPrivateFieldSet(this, _Wall_repelSide, s, "f"); }
    get repelSide() { return __classPrivateFieldGet(this, _Wall_repelSide, "f"); }
    fitsInside(lowX, lowY, highX, highY) {
        let x0 = Math.min(this.start.x, this.end.x), y0 = Math.min(this.start.y, this.end.y);
        let x1 = Math.max(this.start.x, this.end.x), y1 = Math.max(this.start.y, this.end.y);
        return x0 >= lowX && y0 >= lowY && x1 <= highX && y1 <= highY;
    }
    isEitherSide(p0, p1) {
        return Geom2D.line_line(p0.x, p0.y, p1.x, p1.y, this.start.x, this.start.y, this.end.x, this.end.y);
    }
    toString() {
        let s = `${this.constructor.name}  @  [${this.start.x.toFixed(FXD)}, ${this.start.y.toFixed(FXD)}]  `;
        s += `from [${this.start.x.toFixed(FXD)}, ${this.start.y.toFixed(FXD)}]  `;
        s += `to [${this.end.x.toFixed(FXD)}, ${this.end.y.toFixed(FXD)}]  `;
        return s;
    }
}
_Wall_start = new WeakMap(), _Wall_end = new WeakMap(), _Wall_norm = new WeakMap(), _Wall_repelSide = new WeakMap();
class FiniteStateMachine {
    constructor(owner, world, currentState, previousState, globalState) {
        _FiniteStateMachine_owner.set(this, void 0);
        _FiniteStateMachine_currentState.set(this, void 0);
        _FiniteStateMachine_previousState.set(this, void 0);
        _FiniteStateMachine_globalState.set(this, void 0);
        __classPrivateFieldSet(this, _FiniteStateMachine_owner, owner, "f");
        __classPrivateFieldSet(this, _FiniteStateMachine_currentState, currentState, "f");
        __classPrivateFieldSet(this, _FiniteStateMachine_previousState, previousState, "f");
        __classPrivateFieldSet(this, _FiniteStateMachine_globalState, globalState, "f");
    }
    get owner() { return __classPrivateFieldGet(this, _FiniteStateMachine_owner, "f"); }
    set currentState(state) { __classPrivateFieldSet(this, _FiniteStateMachine_currentState, state, "f"); }
    get currentState() { return __classPrivateFieldGet(this, _FiniteStateMachine_currentState, "f"); }
    set previousState(state) { __classPrivateFieldSet(this, _FiniteStateMachine_previousState, state, "f"); }
    get previousState() { return __classPrivateFieldGet(this, _FiniteStateMachine_previousState, "f"); }
    set globalState(state) { __classPrivateFieldSet(this, _FiniteStateMachine_globalState, state, "f"); }
    get globalState() { return __classPrivateFieldGet(this, _FiniteStateMachine_globalState, "f"); }
    update(elapsedTime) {
        // if there is a global state call it
        this.globalState?.execute(__classPrivateFieldGet(this, _FiniteStateMachine_owner, "f"), elapsedTime);
        // same with the current state
        __classPrivateFieldGet(this, _FiniteStateMachine_currentState, "f")?.execute(__classPrivateFieldGet(this, _FiniteStateMachine_owner, "f"), elapsedTime);
    }
    onMessage(tgram) {
        // See if the global state can accept telegram
        if (__classPrivateFieldGet(this, _FiniteStateMachine_currentState, "f")?.onMessage(__classPrivateFieldGet(this, _FiniteStateMachine_owner, "f"), tgram))
            return true;
        // See if the global state can accept telegram
        if (__classPrivateFieldGet(this, _FiniteStateMachine_globalState, "f")?.onMessage(__classPrivateFieldGet(this, _FiniteStateMachine_owner, "f"), tgram))
            return true;
        // Telegram has not been handled
        return false;
    }
    changeState(newState) {
        // Keep track of the previous state
        __classPrivateFieldSet(this, _FiniteStateMachine_previousState, __classPrivateFieldGet(this, _FiniteStateMachine_currentState, "f"), "f");
        // Exit the current state
        __classPrivateFieldGet(this, _FiniteStateMachine_currentState, "f")?.exit(__classPrivateFieldGet(this, _FiniteStateMachine_owner, "f"));
        // Change the current state
        __classPrivateFieldSet(this, _FiniteStateMachine_currentState, newState, "f");
        // Enter the new current state
        __classPrivateFieldGet(this, _FiniteStateMachine_currentState, "f")?.enter(__classPrivateFieldGet(this, _FiniteStateMachine_owner, "f"));
    }
    revertToPreviousState() {
        this.changeState(__classPrivateFieldGet(this, _FiniteStateMachine_previousState, "f"));
    }
}
_FiniteStateMachine_owner = new WeakMap(), _FiniteStateMachine_currentState = new WeakMap(), _FiniteStateMachine_previousState = new WeakMap(), _FiniteStateMachine_globalState = new WeakMap();
class Telegram {
    constructor(despatchAt, sender, receiver, msg, extraInfo) {
        _Telegram_sender.set(this, void 0);
        _Telegram_receiver.set(this, void 0);
        _Telegram_msgID.set(this, void 0);
        _Telegram_delay.set(this, void 0);
        _Telegram_extraInfo.set(this, void 0);
        __classPrivateFieldSet(this, _Telegram_delay, despatchAt, "f");
        __classPrivateFieldSet(this, _Telegram_sender, sender, "f");
        __classPrivateFieldSet(this, _Telegram_receiver, receiver, "f");
        __classPrivateFieldSet(this, _Telegram_msgID, msg, "f");
        __classPrivateFieldSet(this, _Telegram_extraInfo, extraInfo, "f");
    }
    get sender() { return __classPrivateFieldGet(this, _Telegram_sender, "f"); }
    get receiver() { return __classPrivateFieldGet(this, _Telegram_receiver, "f"); }
    get msgID() { return __classPrivateFieldGet(this, _Telegram_msgID, "f"); }
    get delay() { return __classPrivateFieldGet(this, _Telegram_delay, "f"); }
    reduceeDelayBy(time) { __classPrivateFieldSet(this, _Telegram_delay, __classPrivateFieldGet(this, _Telegram_delay, "f") - time, "f"); }
    get extraInfo() { return __classPrivateFieldGet(this, _Telegram_extraInfo, "f"); }
}
_Telegram_sender = new WeakMap(), _Telegram_receiver = new WeakMap(), _Telegram_msgID = new WeakMap(), _Telegram_delay = new WeakMap(), _Telegram_extraInfo = new WeakMap();
class Dispatcher {
    constructor(world) {
        _Dispatcher_telegrams.set(this, void 0);
        _Dispatcher_world.set(this, void 0);
        __classPrivateFieldSet(this, _Dispatcher_world, world, "f");
        __classPrivateFieldSet(this, _Dispatcher_telegrams, [], "f");
    }
    /**
     * Remember a telegram for later sending.
     * @param delay time to wait before sending in seconds
     * @param sender id of sender
     * @param receiver id of receiver
     * @param msg message string
     * @param extraInfo optional object holding any extra information
     */
    postTelegram(delay, sender, receiver, msg, extraInfo) {
        let pop = __classPrivateFieldGet(this, _Dispatcher_world, "f").populationMap;
        sender = sender instanceof Entity ? sender : pop.get(sender);
        receiver = receiver instanceof Entity ? receiver : pop.get(receiver);
        if (sender && receiver && receiver.hasFSM()) {
            let tgram = new Telegram(delay, sender, receiver, msg, extraInfo);
            __classPrivateFieldGet(this, _Dispatcher_telegrams, "f").push(tgram);
        }
    }
    /** Send the telegram     */
    sendTelegram(tgram) {
        tgram.receiver.fsm.onMessage(tgram);
    }
    /** Send telegram and remove from tem from postnag */
    update(elapsedTime) {
        __classPrivateFieldGet(this, _Dispatcher_telegrams, "f").forEach(tgram => tgram.reduceeDelayBy(elapsedTime));
        let toSend = __classPrivateFieldGet(this, _Dispatcher_telegrams, "f").filter(x => x.delay <= 0);
        for (let tgram of toSend)
            this.sendTelegram(tgram);
        if (toSend.length > 0)
            __classPrivateFieldSet(this, _Dispatcher_telegrams, __classPrivateFieldGet(this, _Dispatcher_telegrams, "f").filter(x => x.delay > 0), "f");
    }
}
_Dispatcher_telegrams = new WeakMap(), _Dispatcher_world = new WeakMap();
class State {
    constructor(world, name) {
        _State_name.set(this, void 0);
        _State_world.set(this, void 0);
        if (!name)
            name = this.constructor.name;
        __classPrivateFieldSet(this, _State_name, name, "f");
        __classPrivateFieldSet(this, _State_world, world, "f");
    }
    set name(n) { __classPrivateFieldSet(this, _State_name, n, "f"); }
    get name() { return __classPrivateFieldGet(this, _State_name, "f"); }
    get world() { return __classPrivateFieldGet(this, _State_world, "f"); }
    get dispatcher() { return __classPrivateFieldGet(this, _State_world, "f").dispatcher; }
    // This will execute when the state is entered.
    enter(user) { }
    ;
    // This is the state's normal update function.
    execute(user, elapsedTime) { }
    // This will execute when the state is exited.
    exit(user) { }
    // This executes if the agent receives a message from the dispatcher.
    // returns true if telegram message is used.
    onMessage(user, tgram) { return false; }
}
_State_name = new WeakMap(), _State_world = new WeakMap();
/**
 * This class is used to represent a directed edge between 2 nodes and the
 * cost of traversing it.
 *
 * @author Peter Lager
 */
class GraphEdge {
    /** If no cost provided cost = distance between nodes   */
    constructor(from, to, cost = 0, name = '') {
        _GraphEdge_from.set(this, void 0);
        _GraphEdge_to.set(this, void 0);
        _GraphEdge_name.set(this, '');
        _GraphEdge_cost.set(this, 0);
        __classPrivateFieldSet(this, _GraphEdge_from, from, "f");
        __classPrivateFieldSet(this, _GraphEdge_to, to, "f");
        __classPrivateFieldSet(this, _GraphEdge_cost, cost, "f");
        __classPrivateFieldSet(this, _GraphEdge_name, name, "f");
    }
    setFrom(v) { __classPrivateFieldSet(this, _GraphEdge_from, v, "f"); return this; }
    set from(v) { __classPrivateFieldSet(this, _GraphEdge_from, v, "f"); }
    get from() { return __classPrivateFieldGet(this, _GraphEdge_from, "f"); }
    setTo(v) { __classPrivateFieldSet(this, _GraphEdge_to, v, "f"); return this; }
    set to(v) { __classPrivateFieldSet(this, _GraphEdge_to, v, "f"); }
    get to() { return __classPrivateFieldGet(this, _GraphEdge_to, "f"); }
    setName(n) { __classPrivateFieldSet(this, _GraphEdge_name, n, "f"); return this; }
    set name(n) { __classPrivateFieldSet(this, _GraphEdge_name, n, "f"); }
    get name() { return __classPrivateFieldGet(this, _GraphEdge_name, "f"); }
    setCost(n) { __classPrivateFieldSet(this, _GraphEdge_cost, n, "f"); return this; }
    set cost(n) { __classPrivateFieldSet(this, _GraphEdge_cost, n, "f"); }
    get cost() { return __classPrivateFieldGet(this, _GraphEdge_cost, "f"); }
    toString() {
        return `"${this.name}" from node: ${this.from} to node: ${this.to}  cost: ${this.cost}`;
    }
}
_GraphEdge_from = new WeakMap(), _GraphEdge_to = new WeakMap(), _GraphEdge_name = new WeakMap(), _GraphEdge_cost = new WeakMap();
/**
 * This class represents a node (vertex) that can be used with the Graph class.
 * The node has a 3D position but for 2D scenarios the z value should be zero. <br>
 * Each node should be given a unique ID number >= 0. Node ID numbers do not
 * need to start at 0 (zero) or be sequential but they must be unique. <br>
 *
 * It is the responsibility of the user to ensure that each node ID is unique
 * as duplicate ID numbers can lead to unpredictable behaviour.
 *
 * @author Peter Lager
 */
class GraphNode {
    /** Create a node with a unique ID and an optional position */
    constructor(id, position = [0, 0, 0], name = '') {
        _GraphNode_edges.set(this, new Map());
        _GraphNode_id.set(this, void 0);
        this._name = '';
        _GraphNode_p.set(this, new Float64Array(3));
        // Used in the Dijkstra and A* search algorithms
        _GraphNode_graphCost.set(this, 0);
        _GraphNode_fullCost.set(this, 0);
        __classPrivateFieldSet(this, _GraphNode_id, id, "f");
        let len = position.length;
        __classPrivateFieldGet(this, _GraphNode_p, "f")[0] = len > 0 ? position[0] : 0;
        __classPrivateFieldGet(this, _GraphNode_p, "f")[1] = len > 1 ? position[1] : 0;
        __classPrivateFieldGet(this, _GraphNode_p, "f")[2] = len > 2 ? position[2] : 0;
        this._name = name;
    }
    get edges() { return [...__classPrivateFieldGet(this, _GraphNode_edges, "f").values()]; }
    get id() { return __classPrivateFieldGet(this, _GraphNode_id, "f"); }
    setName(n) { this._name = n; return this; }
    set name(n) { this._name = n; }
    get name() { return this._name; }
    get pos() { return __classPrivateFieldGet(this, _GraphNode_p, "f"); }
    setX(n) { __classPrivateFieldGet(this, _GraphNode_p, "f")[0] = n; return this; }
    set x(n) { __classPrivateFieldGet(this, _GraphNode_p, "f")[0] = n; }
    get x() { return __classPrivateFieldGet(this, _GraphNode_p, "f")[0]; }
    setY(n) { __classPrivateFieldGet(this, _GraphNode_p, "f")[1] = n; return this; }
    set y(n) { __classPrivateFieldGet(this, _GraphNode_p, "f")[1] = n; }
    get y() { return __classPrivateFieldGet(this, _GraphNode_p, "f")[1]; }
    setZ(n) { __classPrivateFieldGet(this, _GraphNode_p, "f")[2] = n; return this; }
    set z(n) { __classPrivateFieldGet(this, _GraphNode_p, "f")[2] = n; }
    get z() { return __classPrivateFieldGet(this, _GraphNode_p, "f")[2]; }
    set graphCost(n) { __classPrivateFieldSet(this, _GraphNode_graphCost, n, "f"); }
    get graphCost() { return __classPrivateFieldGet(this, _GraphNode_graphCost, "f"); }
    set fullCost(n) { __classPrivateFieldSet(this, _GraphNode_fullCost, n, "f"); }
    get fullCost() { return __classPrivateFieldGet(this, _GraphNode_fullCost, "f"); }
    /**
     * Add an edge to this node. It will replace any previous edge with the smae
     * destination.
     */
    addEdge(edge) {
        console.assert(!__classPrivateFieldGet(this, _GraphNode_edges, "f").has(edge.to), `Duplicate edge from: ${this.id} to ${edge.to} - the original edge has been overwritten`);
        __classPrivateFieldGet(this, _GraphNode_edges, "f").set(edge.to, edge);
    }
    /**
     * Removes the edge to the specified destination
     * @param id the destination node ID
     */
    removeEdge(id) {
        __classPrivateFieldGet(this, _GraphNode_edges, "f").delete(id);
    }
    edge(to) {
        return __classPrivateFieldGet(this, _GraphNode_edges, "f").get(to);
    }
    resetSearchCosts() {
        this.graphCost = this.fullCost = 0;
    }
    toString() {
        return `ID: ${this.id}  Name: "${this.name}" @ [ ${this.x}, ${this.y}, ${this.z}]`;
    }
}
_GraphNode_edges = new WeakMap(), _GraphNode_id = new WeakMap(), _GraphNode_p = new WeakMap(), _GraphNode_graphCost = new WeakMap(), _GraphNode_fullCost = new WeakMap();
const ASTAR = Symbol.for('A*');
const DIJKSTRA = Symbol.for('Dijkstra');
const BFS = Symbol.for('Breadth first');
const DFS = Symbol.for('Depth first');
class Graph {
    constructor(name = '') {
        _Graph_instances.add(this);
        _Graph_nodes.set(this, new Map());
        _Graph_floatingEdges.set(this, new Set());
        _Graph_name.set(this, '');
        __classPrivateFieldSet(this, _Graph_name, name, "f");
    }
    get nodes() { return [...__classPrivateFieldGet(this, _Graph_nodes, "f").values()]; }
    get edges() {
        let e = [];
        this.nodes.forEach(n => e.push(n.edges));
        return e.flat();
    }
    setName(n) { __classPrivateFieldSet(this, _Graph_name, n, "f"); return this; }
    set name(n) { __classPrivateFieldSet(this, _Graph_name, n, "f"); }
    get name() { return __classPrivateFieldGet(this, _Graph_name, "f"); }
    search(nodeIDs, searchType = ASTAR, heuristic = EUCLIDEAN, costFactor = 1) {
        if (!__classPrivateFieldGet(this, _Graph_instances, "m", _Graph_isSearchValid).call(this, nodeIDs, searchType, heuristic))
            return undefined;
        let searchImpl;
        let ash = heuristic(costFactor);
        switch (searchType) {
            case ASTAR:
                searchImpl = __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_searchAstar);
                break;
            case DIJKSTRA:
                searchImpl = __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_searchDijkstra);
                break;
            case BFS:
                searchImpl = __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_searchBFS);
                break;
            case DFS:
                searchImpl = __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_searchDFS);
                break;
        }
        let testedEdges = new Set();
        let path = searchImpl.call(this, nodeIDs[0], nodeIDs[1], testedEdges, ash);
        for (let i = 2; i < nodeIDs.length; i++) {
            let pr = searchImpl.call(this, nodeIDs[i - 1], nodeIDs[i], testedEdges, ash);
            pr.shift();
            path.push(...pr);
        }
        // Now we have the path create list of edges
        let edges = [];
        for (let i = 0; i < path.length - 1; i++)
            edges.push(path[i].edge(path[i + 1].id));
        return { 'path': [...path], 'edges': [...edges], 'testedEdges': [...testedEdges.values()] };
    }
    /** Gets the node for a given id it it exists. */
    node(id) {
        return __classPrivateFieldGet(this, _Graph_nodes, "f").get(id);
    }
    /** Gets the node for a given id it it exists. */
    edge(from, to) {
        return __classPrivateFieldGet(this, _Graph_nodes, "f").get(from)?.edge(to);
    }
    /**
     * Create and add a node. If a z coordinate is not provided then it is
     * set to zero.
     * @param id Create and add a node
     * @param position [x, y] or [x, y, z] position for the node
     * @param name name for this node
     * @returns this graph
     */
    createNode(id, position, name = '') {
        let node = new GraphNode(id, position, name);
        this.addNode(node);
        return this;
    }
    /**
     * Add a previously created node
     * @param node the node to add
     * @returns this graph
     */
    addNode(node) {
        console.assert(!__classPrivateFieldGet(this, _Graph_nodes, "f").has(node.id), `Duplicate node ID: ${node.id} - the original node has been overwritten`);
        __classPrivateFieldGet(this, _Graph_nodes, "f").set(node.id, node);
        return this;
    }
    /**
     * Remove this node and all edges that come to this node.
     * @param id the node id
     * @returns this graph
     */
    removeNode(id) {
        let node = this.node(id);
        if (node) {
            __classPrivateFieldGet(this, _Graph_nodes, "f").delete(node.id);
            [...__classPrivateFieldGet(this, _Graph_nodes, "f").values()].forEach(n => n.removeEdge(node.id));
        }
        return this;
    }
    /**
     * Create and add an edge between two nodes. To create a two-way connection
     * then bidrection should be true.
     * @param from node id
     * @param to  node id
     * @param bidirectional if true then add edge for both directions
     * @param cost array containing edge costs
     * @param name name for this edge
     * @returns this graph
     */
    createEdge(from, to, bidirectional = true, cost = [0, 0], name = '') {
        if (!cost)
            cost = [0, 0];
        if (bidirectional && cost.length == 1)
            cost[1] = cost[0];
        this.addEdge(new GraphEdge(from, to, cost[0], name));
        if (bidirectional)
            this.addEdge(new GraphEdge(to, from, cost[1], name));
        return this;
    }
    /**
     * Add a previously created edge
     * @param edge the edge to add
     * @returns this graph
     */
    addEdge(edge) {
        if (__classPrivateFieldGet(this, _Graph_nodes, "f").has(edge.from) && __classPrivateFieldGet(this, _Graph_nodes, "f").has(edge.to)) {
            if (edge.cost == 0)
                edge.cost = Graph.dist(this.node(edge.from), this.node(edge.to));
            this.node(edge.from).addEdge(edge);
        }
        else
            __classPrivateFieldGet(this, _Graph_floatingEdges, "f").add(edge);
        return this;
    }
    /**
     * Remove the one or both edges between two nodes
     * @param from the edge source
     * @param to the edge destination
     * @param bidirectional if true remove both edges
     * @returns this graph
     */
    removeEdge(from, to, bidirectional = false) {
        this.node(from)?.removeEdge(to);
        if (bidirectional)
            this.node(to)?.removeEdge(from);
        return this;
    }
    nearestNode(x, y, z = 0) {
        let pos = Float64Array.of(x, y, z);
        let nearestDist = Number.MAX_VALUE;
        let nearestNode;
        __classPrivateFieldGet(this, _Graph_nodes, "f").forEach(n => {
            let dist = Graph.distSq(n.pos, pos);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearestNode = n;
            }
        });
        return nearestNode;
    }
    /**
     * Adds all floating edges where the source and destination nodes exist.
     * Any unallocated edges are deleted.
     * @returns this graph
     */
    compact() {
        let nfe = 0, feadded = 0;
        for (let fe of __classPrivateFieldGet(this, _Graph_floatingEdges, "f").values()) {
            nfe++;
            let fromNode = this.node(fe.from), toNode = this.node(fe.to);
            if (fromNode && toNode) {
                feadded++;
                fromNode.addEdge(fe);
            }
        }
        if (nfe > 0) {
            console.log(`Compact:  ${feadded} of ${nfe} floating edges have been added to graph.`);
            if (feadded < nfe) {
                console.log(`          ${nfe - feadded} orphan edge(s) have been deleted.`);
                __classPrivateFieldGet(this, _Graph_floatingEdges, "f").clear();
            }
        }
        return this;
    }
    /** Eclidean distance between two nodes or node positions */
    static dist(n0, n1) {
        return Math.sqrt(Graph.distSq(n0, n1));
    }
    /** Eclidean distance squared between two nodes or node positions */
    static distSq(n0, n1) {
        let pa = n0 instanceof GraphNode ? n0.pos : n0;
        let pb = n1 instanceof GraphNode ? n1.pos : n1;
        let dx = pb[0] - pa[0], dy = pb[1] - pa[1], dz = pb[2] - pb[2];
        return dx * dx + dy * dy + dz * dz;
    }
    /** Eclidean distance between a nodes or node positions and XYZ coordinates */
    static dist_XYZ(n0, x, y, z = 0) {
        return Math.sqrt(Graph.distSq_XYZ(n0, x, y, z));
    }
    /** Eclidean distance squared between a nodes or node positions and XYZ coordinates */
    static distSq_XYZ(n0, x, y, z = 0) {
        let pa = n0 instanceof GraphNode ? n0.pos : n0;
        let dx = pa[0] - x, dy = pa[1] - y, dz = pa[2] - z;
        return dx * dx + dy * dy + dz * dz;
    }
    /** Returns an array of strings listing all nodes and edges */
    getData() {
        let a = [];
        a.push(`GRAPH: "${this.name}"`);
        a.push('Nodes:');
        for (let node of __classPrivateFieldGet(this, _Graph_nodes, "f").values()) {
            a.push(`  ${node.toString()}`);
            for (let edge of node.edges.values())
                a.push(`        ${edge.toString()}`);
        }
        a.push('Floating Edges:');
        for (let edge of __classPrivateFieldGet(this, _Graph_floatingEdges, "f").values())
            a.push(`  ${edge.toString()}`);
        return a;
    }
}
_Graph_nodes = new WeakMap(), _Graph_floatingEdges = new WeakMap(), _Graph_name = new WeakMap(), _Graph_instances = new WeakSet(), _Graph_searchDFS = function _Graph_searchDFS(startID, targetID, testedEdges) {
    console.log('Depth first');
    let partroute = [];
    let start = this.node(startID), target = this.node(targetID);
    if (!start || !target) {
        console.error(`Nodes ${startID} and/or ${targetID} do not exist in this graph.`);
        return partroute;
    }
    let settledNodes = new Map();
    let visited = new Set();
    let next;
    let stack = [];
    stack.push(new GraphEdge(startID, startID, 0));
    while (stack.length > 0) {
        next = stack.pop();
        settledNodes.set(next.to, next.from);
        visited.add(next.to);
        if (next.to == targetID) {
            let parent = targetID;
            partroute.push(this.node(targetID));
            do {
                parent = settledNodes.get(parent);
                partroute.push(this.node(parent));
            } while (parent != startID);
            partroute.reverse();
            return partroute;
        }
        // Examine edges from current node
        this.node(next.to).edges.forEach(e => {
            if (!visited.has(e.to)) {
                stack.push(e);
                testedEdges.add(e);
            }
        });
    }
    return partroute;
}, _Graph_searchBFS = function _Graph_searchBFS(startID, targetID, testedEdges) {
    console.log('Breadth first');
    let partRoute = [];
    let start = this.node(startID), target = this.node(targetID);
    if (start !== target) {
        let settledNodes = new Map();
        let visited = new Set();
        let next;
        let queue = [];
        queue.push(new GraphEdge(startID, startID, 0));
        while (queue.length > 0) {
            next = queue.shift();
            settledNodes.set(next.to, next.from);
            visited.add(next.to);
            if (next.to == targetID) {
                let parent = targetID;
                partRoute.push(this.node(targetID));
                do {
                    parent = settledNodes.get(parent);
                    partRoute.push(this.node(parent));
                } while (parent != startID);
                partRoute.reverse();
                return partRoute;
            }
            // Examine edges from current node
            this.node(next.to).edges.forEach(e => {
                if (!visited.has(e.to)) {
                    queue.push(e);
                    testedEdges.add(e);
                }
            });
        }
    }
    return partRoute;
}, _Graph_searchDijkstra = function _Graph_searchDijkstra(startID, targetID, testedEdges) {
    console.log('Dijkstra');
    this.nodes.forEach(n => n.resetSearchCosts());
    let partroute = [];
    let start = this.node(startID), target = this.node(targetID);
    if (!start || !target) {
        console.error(`Nodes ${startID} and/or ${targetID} do not exist in this graph.`);
        return partroute;
    }
    let unsettledNodes = []; // Use as priority queue
    let settledNodes = new Set();
    let parent = new Map();
    let next, edgeTo;
    unsettledNodes.push(start);
    while (unsettledNodes.length > 0) {
        next = unsettledNodes.shift();
        if (next == target) {
            partroute.push(target);
            while (next !== start) {
                next = parent.get(next);
                partroute.push(next);
            }
            partroute.reverse();
            return partroute;
        }
        settledNodes.add(next);
        next.edges.forEach(e => {
            edgeTo = this.node(e.to);
            let newCost = next.graphCost + e.cost;
            let edgeToCost = edgeTo.graphCost;
            if (!settledNodes.has(edgeTo) && (edgeToCost == 0 || edgeTo.graphCost > newCost)) {
                edgeTo.graphCost = newCost;
                parent.set(edgeTo, next);
                unsettledNodes.push(edgeTo); // Maintain priority queue
                unsettledNodes.sort((a, b) => a.graphCost - b.graphCost);
                testedEdges.add(e);
            }
        });
    }
    return partroute;
}, _Graph_searchAstar = function _Graph_searchAstar(startID, targetID, testedEdges, ash) {
    this.nodes.forEach(n => n.resetSearchCosts());
    let partPath = [];
    let start = this.node(startID), target = this.node(targetID);
    if (start !== target) {
        let unsettledNodes = []; // Use as priority queue
        let settledNodes = new Set();
        let parent = new Map();
        let next, edgeTo;
        start.fullCost = ash(start, target);
        unsettledNodes.push(start);
        while (unsettledNodes.length > 0) {
            next = unsettledNodes.shift();
            if (next === target) {
                partPath.push(target);
                while (next !== start) {
                    next = parent.get(next);
                    partPath.push(next);
                }
                partPath.reverse();
                return partPath;
            }
            settledNodes.add(next);
            next.edges.forEach(e => {
                edgeTo = this.node(e.to);
                let gCost = next.graphCost + e.cost;
                let hCost = ash(edgeTo, target);
                let edgeToCost = edgeTo.graphCost;
                if (!settledNodes.has(edgeTo) && (edgeToCost == 0 || edgeTo.graphCost > gCost + hCost)) {
                    edgeTo.graphCost = gCost;
                    edgeTo.fullCost = gCost + hCost;
                    parent.set(edgeTo, next);
                    unsettledNodes.push(edgeTo); // Maintain priority queue
                    unsettledNodes.sort((a, b) => a.fullCost - b.fullCost);
                    testedEdges.add(e);
                }
            });
        }
    }
    return partPath;
}, _Graph_isSearchValid = function _Graph_isSearchValid(ids, searchType, heuristic) {
    // Make sure we have an array of length >= 2
    if (!Array.isArray(ids) || ids.length <= 1) {
        console.error(`Search error:  invalid array`);
        return false;
    }
    // Ensure all nodes exits
    for (let id of ids)
        if (!this.node(id)) {
            return false;
            break;
        }
    // Check search type
    switch (searchType) {
        case ASTAR: break;
        case DIJKSTRA: break;
        case BFS: break;
        case DFS: break;
        default:
            console.error(`Invalid search algorithm`);
            return false;
    }
    // Check A star heuristic
    switch (heuristic) {
        case EUCLIDEAN:
        case MANHATTAN:
            break;
        default:
            console.error(`Invalid Astar heuristic`);
            return false;
    }
    return true;
};
const EUCLIDEAN = function (factor = 1) {
    return (function Euclidian(node, target) {
        let dx = target.x - node.x;
        let dy = target.y - node.y;
        let dz = target.z - node.z;
        return factor * Math.sqrt(dx * dx + dy * dy + dz * dz);
    });
};
const MANHATTAN = function (factor = 1) {
    return (function Manhattan(node, target) {
        let dx = Math.abs(target.x - node.x);
        let dy = Math.abs(target.y - node.y);
        let dz = Math.abs(target.z - node.z);
        return factor * (dx + dy + dz);
    });
};
class ForceRecorder {
    constructor(owner) {
        _ForceRecorder_owner.set(this, void 0);
        _ForceRecorder_forces.set(this, void 0);
        _ForceRecorder_nbrReadings.set(this, 0);
        __classPrivateFieldSet(this, _ForceRecorder_owner, owner, "f");
        __classPrivateFieldSet(this, _ForceRecorder_forces, ForceRecorder.FORCE_NAME.map((v, i) => new Force(v)), "f");
    }
    addData(idxBhvr, force, weighting) {
        var _b;
        if (idxBhvr >= 0 && idxBhvr < NBR_BEHAVIOURS) {
            __classPrivateFieldSet(this, _ForceRecorder_nbrReadings, (_b = __classPrivateFieldGet(this, _ForceRecorder_nbrReadings, "f"), _b++, _b), "f");
            __classPrivateFieldGet(this, _ForceRecorder_forces, "f")[idxBhvr].addData(force.length(), weighting);
        }
    }
    clearData() {
        __classPrivateFieldSet(this, _ForceRecorder_nbrReadings, 0, "f");
        for (let f of __classPrivateFieldGet(this, _ForceRecorder_forces, "f"))
            f.clearData();
    }
    hasData() { return (__classPrivateFieldGet(this, _ForceRecorder_nbrReadings, "f") > 1); }
    toString() {
        let s = `----------------------------------------------------------------------------------------\n`;
        s += `Owner ID: ${__classPrivateFieldGet(this, _ForceRecorder_owner, "f").id} \n`;
        s += `Force calculator:  Weighted Truncated Running Sum with Prioritization. \n`;
        s += `Max force:  ${__classPrivateFieldGet(this, _ForceRecorder_owner, "f").maxForce} \n`;
        s += '                           Min         Max         Avg     Std Dev   Count   Weighting\n';
        for (let force of __classPrivateFieldGet(this, _ForceRecorder_forces, "f"))
            if (force.hasData())
                s += `   ${force.toString()} \n`;
        s += `----------------------------------------------------------------------------------------\n`;
        return s;
    }
}
_ForceRecorder_owner = new WeakMap(), _ForceRecorder_forces = new WeakMap(), _ForceRecorder_nbrReadings = new WeakMap();
ForceRecorder.FORCE_NAME = [
    'Wall avoid     ', 'Obstacle avoid ', 'Evade          ', 'Flee           ',
    'Separation     ', 'Alignment      ', 'Cohesion       ', 'Seek           ',
    'Arrive         ', 'Wander         ', 'Pursuit        ', 'Offset Pursuit ',
    'Interpose      ', 'Hide           ', 'Path           ', 'Flock          '
];
class Force {
    constructor(forceName) {
        _Force_forceName.set(this, '');
        _Force_min.set(this, Number.MAX_VALUE);
        _Force_max.set(this, 0);
        _Force_s1.set(this, 0);
        _Force_s2.set(this, 0);
        _Force_n.set(this, 0);
        _Force_weight.set(this, 0);
        __classPrivateFieldSet(this, _Force_forceName, forceName, "f");
    }
    clearData() {
        __classPrivateFieldSet(this, _Force_min, Number.MAX_VALUE, "f");
        __classPrivateFieldSet(this, _Force_max, 0, "f");
        __classPrivateFieldSet(this, _Force_s1, 0, "f");
        __classPrivateFieldSet(this, _Force_s2, 0, "f");
        __classPrivateFieldSet(this, _Force_n, 0, "f");
    }
    addData(forceMagnitude, weighting) {
        var _b;
        __classPrivateFieldSet(this, _Force_weight, weighting, "f");
        if (forceMagnitude < __classPrivateFieldGet(this, _Force_min, "f"))
            __classPrivateFieldSet(this, _Force_min, forceMagnitude, "f");
        if (forceMagnitude > __classPrivateFieldGet(this, _Force_max, "f"))
            __classPrivateFieldSet(this, _Force_max, forceMagnitude, "f");
        __classPrivateFieldSet(this, _Force_s1, __classPrivateFieldGet(this, _Force_s1, "f") + forceMagnitude, "f");
        __classPrivateFieldSet(this, _Force_s2, __classPrivateFieldGet(this, _Force_s2, "f") + forceMagnitude * forceMagnitude, "f");
        __classPrivateFieldSet(this, _Force_n, (_b = __classPrivateFieldGet(this, _Force_n, "f"), _b++, _b), "f");
    }
    hasData() { return (__classPrivateFieldGet(this, _Force_n, "f") > 0); }
    getAverage() {
        if (__classPrivateFieldGet(this, _Force_n, "f") > 0)
            return __classPrivateFieldGet(this, _Force_s1, "f") / __classPrivateFieldGet(this, _Force_n, "f");
        return 0;
    }
    getStdDev() {
        if (__classPrivateFieldGet(this, _Force_n, "f") > 0)
            return Math.sqrt(__classPrivateFieldGet(this, _Force_n, "f") * __classPrivateFieldGet(this, _Force_s2, "f") - __classPrivateFieldGet(this, _Force_s1, "f") * __classPrivateFieldGet(this, _Force_s1, "f")) / __classPrivateFieldGet(this, _Force_n, "f");
        return 0;
    }
    toString() {
        function fmt(n, nd, bufferLength) {
            let s = n.toFixed(nd).toString();
            while (s.length < bufferLength)
                s = ' ' + s;
            return s;
        }
        let s = __classPrivateFieldGet(this, _Force_forceName, "f");
        s += `${fmt(__classPrivateFieldGet(this, _Force_min, "f"), 2, 12)}`;
        s += `${fmt(__classPrivateFieldGet(this, _Force_max, "f"), 2, 12)}`;
        s += `${fmt(this.getAverage(), 2, 12)}`;
        s += `${fmt(this.getStdDev(), 2, 12)}`;
        s += `${fmt(__classPrivateFieldGet(this, _Force_n, "f"), 0, 8)}`;
        s += `${fmt(__classPrivateFieldGet(this, _Force_weight, "f"), 2, 12)}`;
        return s;
    }
}
_Force_forceName = new WeakMap(), _Force_min = new WeakMap(), _Force_max = new WeakMap(), _Force_s1 = new WeakMap(), _Force_s2 = new WeakMap(), _Force_n = new WeakMap(), _Force_weight = new WeakMap();
function sceneFromJSON(jsonString) {
    let s = Array.isArray(jsonString) ? jsonString.join('\n') : jsonString;
    let obj = JSON.parse(s);
    let fences = [];
    obj.FENCES?.forEach(d => {
        let repel = Symbol.for(d.repel), contour = [];
        d.contour.forEach(v => contour.push(Vector2D.from(v)));
        let fence = new Fence(contour, d.enclosed, repel, d.no_walls_at);
        fences.push(fence);
    });
    let obstacles = [];
    obj.OBSTACLES?.forEach(d => {
        obstacles.push(new Obstacle(d.pos, d.cr));
    });
    let walls = [];
    obj.WALLS?.forEach(wall => {
        let repel = Symbol.for(wall.repel);
        walls.push(new Wall(wall.start, wall.end, repel));
    });
    return { FENCES: fences, OBSTACLES: obstacles, WALLS: walls };
}
function graphFromJSON(jsonString) {
    let s = Array.isArray(jsonString) ? jsonString.join('\n') : jsonString;
    let obj = JSON.parse(s);
    let nodes = [];
    obj.NODES?.forEach(d => {
        let node = new GraphNode(d.id, d.position, d.name);
        nodes.push(node);
    });
    let edges = [];
    obj.EDGES?.forEach(d => {
        let cost = !d.cost ? [0] : Array.isArray(d.cost) ? d.cost : [d.cost];
        let name = !d.name ? [''] : Array.isArray(d.name) ? d.name : [d.name];
        if (d.bidi && cost.length == 1) {
            cost.push(cost[0]);
            name.push(name[0]);
        }
        edges.push(new GraphEdge(d.from, d.to, cost[0], name[0]));
        if (d.bidi)
            edges.push(new GraphEdge(d.to, d.from, cost[1], name[1]));
    });
    return { NODES: nodes, EDGES: edges };
}
//# sourceMappingURL=aa.js.map