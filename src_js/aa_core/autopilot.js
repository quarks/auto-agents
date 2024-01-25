class AutoPilot {
    constructor(owner, world) {
        this._flags = 0;
        // ########################################################################
        //                            PROPERTIES
        // ########################################################################
        // ****************  PATH FINDING  **********************
        // Used in path following
        // LinkedList<GraphNode> path = new LinkedList<GraphNode>();
        this._pathSeekDist = 20;
        this._pathArriveDist = 0.5;
        // Extra variables needed to draw hints
        this._boxLength = 0;
        this._target = new Vector2D(); // Target for both arrive and seek behaviours
        this.__fleeTarget = new Vector2D();
        // Panic distance squared for flee to be effective
        this.__fleeRadius = 100;
        // Deceleration rate for arrive
        this._arriveRate = NORMAL;
        this._arriveDist = 1;
        this.__hideStandoffDist = 20;
        this.__pursueOffset = new Vector2D();
        // radius of the constraining circle for the wander behaviour
        this.__wanderRadius = 20.0;
        // distance the wander circle is projected in front of the agent
        this.__wanderDist = 80.0;
        // Maximum jitter per update
        this.__wanderJitter = 4;
        // The target lies on the circumference of the wander circle
        this._wanderTarget = new Vector2D();
        this.__detectBoxLength = 20;
        this.__nbrFeelers = 5;
        this.__feelerFOV = Math.PI; // radians
        this.__feelerLength = 30;
        this.__ovalEnvelope = false;
        // The maximum distance between moving entities for them to be considered
        // as neighbours. Used for group behaviours
        this.__neighbourDist = 100.0;
        /** Default values for steering behaviour objects. */
        this._weight = [
            220.0,
            40.0,
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
            5.0,
            20.0,
            1.0 // flock weight
        ];
        this._owner = owner;
        this._world = world;
        this.forceCalculator = WEIGHTED_PRIORITIZED;
    }
    get owner() { return this._owner; }
    set owner(owner) { this._owner = owner; }
    set boxLength(n) { this._boxLength = n; }
    get boxLength() { return this._boxLength; }
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
        this._flags &= (ALL_SB_MASK - SEEK);
        return this;
    }
    /** Switch on seek behaviour and change target if provided    */
    seekOn(target) {
        this._flags |= SEEK;
        if (target)
            this.target.set(target);
        return this;
    }
    /** Is seek switched on?   */
    get isSeekOn() { return (this._flags & SEEK) != 0; }
    setTarget(t) { this._target.set(t); return this; }
    set target(t) { this._target.set(t); }
    get target() { return this._target; }
    /*
     * ======================================================================
     * FLEE
     * ======================================================================
     */
    flee(owner, target) {
        let panicDist = Vector2D.dist(owner.pos, target);
        if (panicDist >= this.__fleeRadius)
            return Vector2D.ZERO;
        let desiredVelocity = this.owner.pos.sub(target);
        desiredVelocity = desiredVelocity.normalize();
        desiredVelocity = desiredVelocity.mult(owner.maxSpeed);
        return desiredVelocity.sub(owner.vel);
    }
    /** Switch off flee behaviour   */
    fleeOff() {
        this._flags &= (ALL_SB_MASK - FLEE);
        return this;
    }
    /** Switch on flee behaviour and change flee target if provided.    */
    fleeOn(target) {
        this._flags |= FLEE;
        if (target)
            this.__fleeTarget.set(target);
        return this;
    }
    /** Is seek switched on?   */
    get isFleeOn() { return (this._flags & FLEE) != 0; }
    setFleeTarget(t) { this.__fleeTarget.set(t); return this; }
    set fleeTarget(t) { this.__fleeTarget.set(t); }
    get fleeTarget() { return this.__fleeTarget; }
    get fleeRadius() { return this.__fleeRadius; }
    set fleeRadius(n) { this.__fleeRadius = n; }
    /*
     * ======================================================================
     * ARRIVE
     * ======================================================================
     */
    arrive(owner, target, tweak = this._arriveRate) {
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
    arriveOff() {
        this._flags &= (ALL_SB_MASK - ARRIVE);
        return this;
    }
    /**
     * Switch on arrive behaviour
     * @param target the position to arrive at
     * @param rate rate of approach (SLOW, NORMAL or FAST)
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
    setEvadeAgent(a) { this._evadeAgent = a; return this; }
    set evadeAgent(a) { this._evadeAgent = a; }
    get evadeAgent() { return this._evadeAgent; }
    /*
     * ======================================================================
     * HIDE
     * ======================================================================
     */
    hide(owner, world, hideFrom) {
        // Calculate the search distance for obstacles
        let sd = this.__hideSearchRange + world._biggestObsColRad;
        // Get all obstacles inside search distance
        let pos = owner.pos;
        let result = world.tree.getItemsInRegion(pos.x - sd, pos.y - sd, pos.x + sd, pos.y + sd);
        let obs = result.entities.filter(e => e instanceof Obstacle);
        console.log(`Found ${obs.length} obstacles for hiding behind`);
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
        this._flags &= (ALL_SB_MASK - HIDE);
        return this;
    }
    /**
     * @param agent the agent to hide from
     * @returns this auto-pilot object
     */
    hideOn(agent) {
        this._flags |= HIDE;
        this.hideFromAgent = agent;
        return this;
    }
    /** Is hide switched on?   */
    get isHideOn() { return (this._flags & HIDE) != 0; }
    setHideFromAgent(m) { this._hideFromAgent = m; return this; }
    set hideFromAgent(m) { this._hideFromAgent = m; }
    get hideFromAgent() { return this._hideFromAgent; }
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
        this._flags &= (ALL_SB_MASK - PURSUIT);
        return this;
    }
    /** Switch on pursuit behaviour and set agent to pursue     */
    pursuitOn(agent) {
        this._flags |= PURSUIT;
        this.pursueAgent = agent;
        return this;
    }
    /** Is pursuit switched off? */
    get isPusuitOn() { return (this._flags & PURSUIT) != 0; }
    setPursueAgent(a) { this._pursueAgent = a; return this; }
    set pursueAgent(a) { this._pursueAgent = a; }
    get pursueAgent() { return this._pursueAgent; }
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
        this._flags &= (ALL_SB_MASK - OFFSET_PURSUIT);
        return this;
    }
    /** Switch on pursuit behaviour and set agent to pursue     */
    offsetPursuitOn(agent, offset) {
        this._flags |= OFFSET_PURSUIT;
        this.pursueAgent = agent;
        this.pursueOffset = offset;
        return this;
    }
    /** Is pursuit switched off? */
    get isOffsetPusuitOn() { return (this._flags & OFFSET_PURSUIT) != 0; }
    setPursueOffset(v) { this.__pursueOffset.set(v); return this; }
    set pursueOffset(v) { this.__pursueOffset.set(v); }
    get pursueOffset() { return this.__pursueOffset; }
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
        this._flags &= (ALL_SB_MASK - INTERPOSE);
        return this;
    }
    /** Switch on interpose behaviour     */
    interposeOn(agent0, other) {
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
    get isInterposeOn() { return (this._flags & INTERPOSE) != 0; }
    setAgent0(a) { this._agent0 = a; return this; }
    get agent0() { return this._agent0; }
    set agent0(a) { this._agent0 = a; }
    setAgent1(a) { this._agent1 = a; return this; }
    set agent1(a) { this._agent1 = a; }
    get agent1() { return this._agent1; }
    /*
     * ======================================================================
     * WANDER
     * ======================================================================
     */
    wander(owner, elapsedTime) {
        function rnd(n) { return (Math.random() - Math.random()) * n; }
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
    wanderOff() {
        this._flags &= (ALL_SB_MASK - WANDER);
        return this;
    }
    /** Switch on wander behaviour */
    wanderOn() {
        // Calculate iniitial wander target to directly ahead of of owner
        this._wanderTarget = this.owner.heading.resize(this.__wanderRadius);
        this._flags |= WANDER;
        return this;
    }
    /** Is wander switched on?    */
    get isWanderOn() { return (this._flags & WANDER) != 0; }
    setWanderRadius(n) { this.__wanderRadius = n; return this; }
    set wanderRadius(n) { this.__wanderRadius = n; }
    get wanderRadius() { return this.__wanderRadius; }
    setWanderDist(n) { this.__wanderDist = n; return this; }
    set wanderDist(n) { this.__wanderDist = n; }
    get wanderDist() { return this.__wanderDist; }
    setWanderJitter(n) { this.__wanderJitter = n; return this; }
    set wanderJitter(n) { this.__wanderJitter = n; }
    get wanderJitter() { return this.__wanderJitter; }
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
        let sd = this.boxLength + world._biggestObsColRad;
        // Get all obstacles inside search distance
        let pos = owner.pos;
        let result = world.tree.getItemsInRegion(pos.x - sd, pos.y - sd, pos.x + sd, pos.y + sd);
        //let obs = result.entities.filter(e => e.type == OBSTACLE);
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
        this._flags &= (ALL_SB_MASK - OBSTACLE_AVOID);
        return this;
    }
    /**
     * @return this auto-pilot object
     */
    obsAvoidOn() {
        this._flags |= OBSTACLE_AVOID;
        return this;
    }
    /** Is obstacle avoidance switched on?    */
    get isObsAvoidOn() { return (this._flags & OBSTACLE_AVOID) != 0; }
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
        let walls = result.entities.filter(w => w instanceof Wall &&
            Geom2D.line_circle(w.start.x, w.start.y, w.end.x, w.end.y, pos.x, pos.y, fl));
        this.testWallsFound = [...walls]; // ============================   TEST TEST  
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
        this._flags &= (ALL_SB_MASK - WALL_AVOID);
        return this;
    }
    /** Switch on wander behaviour     */
    wallAvoidOn() {
        this._flags |= WALL_AVOID;
        return this;
    }
    /** Is wall avoidance switched on?    */
    get isWallAvoidOn() { return (this._flags & WALL_AVOID) != 0; }
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
                .mult(this._weight[BIT_COHESION]);
            // Separation
            //sepForce = sepForce.normalize().mult(this._weight[BIT_SEPARATION]);
            sepForce = sepForce.mult(this._weight[BIT_SEPARATION]);
            // Alignment
            alnForce = alnForce.div(nCount).sub(owner.heading)
                .mult(this._weight[BIT_ALIGNMENT]);
            // Add them to get flock force
            let flockForce = cohForce.add(sepForce).add(alnForce);
            return flockForce;
        }
        return Vector2D.ZERO;
    }
    /** Switch off flocking     */
    flockOff() {
        this._flags &= (ALL_SB_MASK - FLOCK);
        return this;
    }
    /** Switch on flocking    */
    flockOn(ndist = this.__neighbourDist) {
        this.__neighbourDist = ndist;
        this._flags |= FLOCK;
        return this;
    }
    /** Is flocking switched on?    */
    get isFlockOn() { return (this._flags & FLOCK) != 0; }
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
        this._flags &= (ALL_SB_MASK - ALIGNMENT);
        return this;
    }
    /** Switch on alignment    */
    alignmentOn() {
        this._flags |= ALIGNMENT;
        return this;
    }
    /** Is wall avoidance switched on?    */
    get isAlignmentOn() { return (this._flags & ALIGNMENT) != 0; }
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
        this._flags &= (ALL_SB_MASK - SEPARATION);
        return this;
    }
    /** Switch on separation    */
    separationOn() {
        this._flags |= SEPARATION;
        return this;
    }
    /** Is separation switched on?    */
    get isSeparationOn() { return (this._flags & SEPARATION) != 0; }
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
        this._flags &= (ALL_SB_MASK - COHESION);
        return this;
    }
    /** Switch on cohsion    */
    cohesionOn() {
        this._flags |= COHESION;
        return this;
    }
    /** Is cohesion switched on?    */
    get isCohesionOn() { return (this._flags & COHESION) != 0; }
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
        if (this.isFlockOn) {
            let f = this.flock(owner, world);
            f = f.mult(this._weight[BIT_FLOCK]);
            recorder?.addData(BIT_FLOCK, f);
            if (!this.accumulateForce(accumulator, f, maxForce))
                return accumulator;
        }
        else {
            if (this.isSeparationOn) {
                let f = this.separation(owner, world);
                f.mult(this._weight[BIT_SEPARATION]);
                recorder?.addData(BIT_SEPARATION, f);
                if (!this.accumulateForce(accumulator, f, maxForce))
                    return accumulator;
            }
            if (this.isAlignmentOn) {
                let f = this.alignment(owner, world);
                f.mult(this._weight[BIT_ALIGNMENT]);
                recorder?.addData(BIT_ALIGNMENT, f);
                if (!this.accumulateForce(accumulator, f, maxForce))
                    return accumulator;
            }
            if (this.isCohesionOn) {
                let f = this.cohesion(owner, world);
                f.mult(this._weight[BIT_COHESION]);
                recorder?.addData(BIT_COHESION, f);
                if (!this.accumulateForce(accumulator, f, maxForce))
                    return accumulator;
            }
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
            console.log('offset pursuit calculate');
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