class AutoPilot {
    #owner;
    get owner() { return this.#owner; }
    set owner(owner) { this.#owner = owner; }
    // _world: World;
    #flags = 0;
    constructor(owner) {
        this.#owner = owner;
    }
    // ########################################################################
    //                            PROPERTIES
    // ########################################################################
    // Valiables used to support testing
    testObstaclesFound;
    testWallsConsidered;
    testWallsFound;
    testClosestObstacle;
    testNeighbours;
    // Extra variables needed to draw hints
    #boxLength = 0;
    setBoxLength(n) { this.#boxLength = n; return this; }
    set boxLength(n) { this.#boxLength = n; }
    get boxLength() { return this.#boxLength; }
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
                this.#weight[index] = weights[w];
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
        this.#flags = 0;
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
        this.#flags &= (ALL_SB_MASK - SEEK);
        return this;
    }
    /** Switch on seek behaviour and change target if anothe is provided    */
    seekOn(target) {
        this.#flags |= SEEK;
        this.#target = Vector2D.from(target);
        return this;
    }
    /** Is seek switched on?   */
    get isSeekOn() { return (this.#flags & SEEK) != 0; }
    #target = new Vector2D(); // Target for both arrive and seek behaviours
    setTarget(t) { this.#target.set(t); return this; }
    set target(t) { this.#target.set(t); }
    get target() { return this.#target; }
    /*
     * ======================================================================
     * ARRIVE
     * ======================================================================
     */
    arrive(owner, target, tweak = this.#arriveRate) {
        let toTarget = target.sub(owner.pos), dist = toTarget.length();
        if (dist > this.#arriveDist) {
            let rate = dist / DECEL_TWEEK[tweak];
            let speed = Math.min(owner.maxSpeed, rate);
            let desiredVelocity = toTarget.mult(speed / dist);
            return desiredVelocity.sub(owner.vel);
        }
        return Vector2D.ZERO;
    }
    /** Switch off arrive  behaviour   */
    arriveOff() {
        this.#flags &= (ALL_SB_MASK - ARRIVE);
        return this;
    }
    /**
     * Switch on arrive behaviour
     * @param target the position to arrive at
     * @param rate rate of approach (SLOW, NORMAL or FAST)
     */
    arriveOn(target, rate) {
        this.#flags |= ARRIVE;
        this.#target = Vector2D.from(target);
        if (rate)
            this.#arriveRate = rate;
        return this;
    }
    /** Is arrive switched on?   */
    get isArriveOn() { return (this.#flags & ARRIVE) != 0; }
    // Deceleration rate for arrive
    #arriveRate = NORMAL;
    setArriveRate(n) {
        if (n == SLOW || n == FAST)
            this.#arriveRate = n;
        else
            this.#arriveRate = NORMAL;
        return this;
    }
    set arriveRate(n) { this.#arriveRate = n; }
    get arriveRate() { return this.#arriveRate; }
    #arriveDist = 1;
    set arriveDist(n) { this.#arriveDist = n; }
    get arriveDist() { return this.#arriveDist; }
    /*
     * ======================================================================
     * FLEE
     * ======================================================================
     */
    flee(owner, target) {
        let panicDist = Vector2D.dist(owner.pos, target);
        if (panicDist >= this.#fleeRadius)
            return Vector2D.ZERO;
        let desiredVelocity = this.owner.pos.sub(target);
        desiredVelocity = desiredVelocity.normalize();
        desiredVelocity = desiredVelocity.mult(owner.maxSpeed);
        return desiredVelocity.sub(owner.vel);
    }
    /** Switch off flee behaviour   */
    fleeOff() {
        this.#flags &= (ALL_SB_MASK - FLEE);
        return this;
    }
    /** Switch on flee behaviour and change flee target if provided.    */
    fleeOn(target, fleeRadius) {
        this.#flags |= FLEE;
        this.#fleeTarget = Vector2D.from(target);
        if (fleeRadius)
            this.#fleeRadius = fleeRadius;
        return this;
    }
    /** Is seek switched on?   */
    get isFleeOn() { return (this.#flags & FLEE) != 0; }
    #fleeTarget = new Vector2D();
    setFleeTarget(t) { this.#fleeTarget.set(t); return this; }
    set fleeTarget(t) { this.#fleeTarget.set(t); }
    get fleeTarget() { return this.#fleeTarget; }
    // Panic distance squared for flee to be effective
    #fleeRadius = 100;
    get fleeRadius() { return this.#fleeRadius; }
    set fleeRadius(n) { this.#fleeRadius = n; }
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
        this.#flags &= (ALL_SB_MASK - EVADE);
        return this;
    }
    /**
     * @param agent the agent to evade
     * @returns this auto-pilot object
     */
    evadeOn(agent) {
        this.#flags |= EVADE;
        this.evadeAgent = agent;
        return this;
    }
    /** Is evade switched on?   */
    get isEvadeOn() { return (this.#flags & EVADE) != 0; }
    #evadeAgent;
    setEvadeAgent(a) { this.#evadeAgent = a; return this; }
    set evadeAgent(a) { this.#evadeAgent = a; }
    get evadeAgent() { return this.#evadeAgent; }
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
        this.#flags &= (ALL_SB_MASK - HIDE);
        return this;
    }
    /**
     * @param agent the agent to hide from
     * @returns this auto-pilot object
     */
    hideOn(agent) {
        this.#flags |= HIDE;
        this.hideFromAgent = agent;
        return this;
    }
    /** Is hide switched on?   */
    get isHideOn() { return (this.#flags & HIDE) != 0; }
    #hideFromAgent;
    setHideFromAgent(m) { this.#hideFromAgent = m; return this; }
    set hideFromAgent(m) { this.#hideFromAgent = m; }
    get hideFromAgent() { return this.#hideFromAgent; }
    __hideSearchRange = 100;
    setHideSearchRange(n) { this.__hideSearchRange = n; return this; }
    set hideSearchRange(n) { this.__hideSearchRange = n; }
    get hideSearchRange() { return this.__hideSearchRange; }
    __hideStandoffDist = 20;
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
        this.#flags &= (ALL_SB_MASK - PURSUIT);
        return this;
    }
    /** Switch on pursuit behaviour and set agent to pursue     */
    pursuitOn(agent) {
        this.#flags |= PURSUIT;
        this.pursueAgent = agent;
        return this;
    }
    /** Is pursuit switched off? */
    get isPusuitOn() { return (this.#flags & PURSUIT) != 0; }
    #pursueAgent;
    setPursueAgent(a) { this.#pursueAgent = a; return this; }
    set pursueAgent(a) { this.#pursueAgent = a; }
    get pursueAgent() { return this.#pursueAgent; }
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
        this.#flags &= (ALL_SB_MASK - OFFSET_PURSUIT);
        return this;
    }
    /** Switch on pursuit behaviour and set agent to pursue     */
    offsetPursuitOn(agent, offset) {
        this.#flags |= OFFSET_PURSUIT;
        this.pursueAgent = agent;
        this.pursueOffset = offset;
        return this;
    }
    /** Is pursuit switched off? */
    get isOffsetPusuitOn() { return (this.#flags & OFFSET_PURSUIT) != 0; }
    #pursueOffset = new Vector2D();
    setPursueOffset(v) { this.#pursueOffset.set(v); return this; }
    set pursueOffset(v) { this.#pursueOffset.set(v); }
    get pursueOffset() { return this.#pursueOffset; }
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
        this.#flags &= (ALL_SB_MASK - INTERPOSE);
        return this;
    }
    /** Switch on interpose behaviour     */
    interposeOn(agent0, other) {
        this.#flags |= INTERPOSE;
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
    get isInterposeOn() { return (this.#flags & INTERPOSE) != 0; }
    #agent0;
    setAgent0(a) { this.#agent0 = a; return this; }
    get agent0() { return this.#agent0; }
    set agent0(a) { this.#agent0 = a; }
    #agent1;
    setAgent1(a) { this.#agent1 = a; return this; }
    set agent1(a) { this.#agent1 = a; }
    get agent1() { return this.#agent1; }
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
        this.#flags &= (ALL_SB_MASK - WANDER);
        return this;
    }
    /** Switch on wander behaviour */
    wanderOn() {
        // Calculate iniitial wander target to directly ahead of of owner
        this._wanderTarget = this.owner.heading.resize(this.__wanderRadius);
        this.#flags |= WANDER;
        return this;
    }
    /** Is wander switched on?    */
    get isWanderOn() { return (this.#flags & WANDER) != 0; }
    // radius of the constraining circle for the wander behaviour
    __wanderRadius = 20.0;
    setWanderRadius(n) { this.__wanderRadius = n; return this; }
    set wanderRadius(n) { this.__wanderRadius = n; }
    get wanderRadius() { return this.__wanderRadius; }
    // distance the wander circle is projected in front of the agent
    __wanderDist = 80.0;
    setWanderDist(n) { this.__wanderDist = n; return this; }
    set wanderDist(n) { this.__wanderDist = n; }
    get wanderDist() { return this.__wanderDist; }
    // Maximum jitter per update
    __wanderJitter = 40;
    setWanderJitter(n) { this.__wanderJitter = n; return this; }
    set wanderJitter(n) { this.__wanderJitter = n; }
    get wanderJitter() { return this.__wanderJitter; }
    // The following fields have public getters for drawing hints
    _wanderAngle = 0;
    get wanderAngle() { return this._wanderAngle; }
    _wanderAngleDelta = 0;
    get wanderAngleDelta() { return this._wanderAngleDelta; }
    _wanderTarget = new Vector2D();
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
        this.#flags &= (ALL_SB_MASK - OBSTACLE_AVOID);
        return this;
    }
    /**
     * @return this auto-pilot object
     */
    obsAvoidOn() {
        this.#flags |= OBSTACLE_AVOID;
        return this;
    }
    /** Is obstacle avoidance switched on?    */
    get isObsAvoidOn() { return (this.#flags & OBSTACLE_AVOID) != 0; }
    __detectBoxLength = 20;
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
        this.#flags &= (ALL_SB_MASK - WALL_AVOID);
        return this;
    }
    /** Switch on wander behaviour     */
    wallAvoidOn() {
        this.#flags |= WALL_AVOID;
        return this;
    }
    /** Is wall avoidance switched on?    */
    get isWallAvoidOn() { return (this.#flags & WALL_AVOID) != 0; }
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
    __nbrFeelers = 5;
    setNbrFeelers(n) { this.__nbrFeelers = n; return this; }
    set nbrFeelers(n) { this.__nbrFeelers = n; }
    get nbrFeelers() { return this.__nbrFeelers; }
    __feelerFOV = Math.PI; // radians
    setFeelerFOV(n) { this.__feelerFOV = n; return this; }
    set feelerFOV(n) { this.__feelerFOV = n; }
    get feelerFOV() { return this.__feelerFOV; }
    __feelerLength = 30;
    setFeelerLength(n) { this.__feelerLength = n; return this; }
    set feelerLength(n) { this.__feelerLength = n; }
    get feelerLength() { return this.__feelerLength; }
    __ovalEnvelope = false;
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
                .mult(this.#weight[IDX_COHESION]);
            // Separation
            sepForce = sepForce.mult(this.#weight[IDX_SEPARATION]);
            // Alignment
            alnForce = alnForce.div(nCount).sub(owner.heading)
                .mult(this.#weight[IDX_ALIGNMENT]);
            // Add them to get flock force
            let flockForce = cohForce.add(sepForce).add(alnForce);
            return flockForce;
        }
        return Vector2D.ZERO;
    }
    /** Switch off flocking     */
    flockOff() {
        this.#flags &= (ALL_SB_MASK - FLOCK);
        return this;
    }
    /** Switch on flocking    */
    flockOn(ndist = this.__neighbourDist) {
        this.__neighbourDist = ndist;
        this.#flags |= FLOCK;
        return this;
    }
    /** Is flocking switched on?    */
    get isFlockOn() { return (this.#flags & FLOCK) != 0; }
    // The maximum distance between moving entities for them to be considered
    // as neighbours. Used for group behaviours
    __neighbourDist = 100.0;
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
        this.#flags &= (ALL_SB_MASK - ALIGNMENT);
        return this;
    }
    /** Switch on alignment    */
    alignmentOn() {
        this.#flags |= ALIGNMENT;
        return this;
    }
    /** Is wall avoidance switched on?    */
    get isAlignmentOn() { return (this.#flags & ALIGNMENT) != 0; }
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
        this.#flags &= (ALL_SB_MASK - SEPARATION);
        return this;
    }
    /** Switch on separation    */
    separationOn() {
        this.#flags |= SEPARATION;
        return this;
    }
    /** Is separation switched on?    */
    get isSeparationOn() { return (this.#flags & SEPARATION) != 0; }
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
        this.#flags &= (ALL_SB_MASK - COHESION);
        return this;
    }
    /** Switch on cohsion    */
    cohesionOn() {
        this.#flags |= COHESION;
        return this;
    }
    /** Is cohesion switched on?    */
    get isCohesionOn() { return (this.#flags & COHESION) != 0; }
    /*
     * ======================================================================
     * PATH
     * ======================================================================
     */
    path(owner, world) {
        //let path = this.#path, edges = this.#edges; //  pathTarget = this.#pathTarget;
        // console.log(this.#path.length, this.#pathTarget)
        if (this.#pathTarget) {
            let pd = (this.#path.length == 1) ? this.#pad : this.#psd;
            if (this.#pathTarget.distSq(owner.pos) < pd) {
                this.#currEdge = this.#edges[0];
                this.#cyclicPath ? this.#path.push(this.#path.shift()) : this.#path.shift();
                // if (this.#path.length > 0)
                //     this.#cyclicPath ? this.#edges.push(this.#edges.shift()) : this.#edges.shift();
                if (this.#path.length > 0) {
                    this.#cyclicPath ? this.#edges.push(this.#edges.shift()) : this.#edges.shift();
                    this.#pathTarget = Vector2D.from(this.#path[0]);
                }
            }
        }
        switch (this.#path.length) {
            case 0:
                this.pathOff();
                return Vector2D.ZERO;
            case 1: return this.arrive(owner, this.#pathTarget, FAST);
            default: return this.seek(owner, this.#pathTarget);
        }
    }
    /** Switch off path     */
    pathOff() {
        this.#pathTarget = undefined;
        this.#path = [];
        this.#edges = [];
        this.owner.vel = Vector2D.ZERO;
        this.#flags &= (ALL_SB_MASK - PATH);
        return this;
    }
    #getPathEdges(path, cyclic) {
        let nodes = path.filter(n => n instanceof GraphNode);
        let edges = [], nl = cyclic ? nodes.length : nodes.length;
        for (let idx = 0; idx < nl; idx++) {
            let edge = nodes[idx].edge(nodes[(idx + 1) % nl].id);
            if (edge)
                edges.push(edge);
        }
        return edges;
    }
    /** Switch on path    */
    pathOn(path, cyclic = false) {
        if (!Array.isArray(path) || path.length <= 1)
            return this;
        this.#path = [...path];
        this.#edges = this.#getPathEdges(this.#path, cyclic);
        let isOwnerAtStart = this.#owner.pos.equals(Vector2D.from(path[0]));
        if (isOwnerAtStart)
            cyclic ? this.#path.push(this.#path.shift()) : this.#path.shift();
        this.#cyclicPath = cyclic && (this.#path.length == this.#edges.length || this.#edges.length == 0);
        this.#pathTarget = Vector2D.from(this.#path[0]);
        this.#flags |= PATH;
        return this;
    }
    /** Is path switched on?    */
    get isPathOn() { return (this.#flags & PATH) != 0; }
    #pathTarget;
    #path = [];
    get pathNodes() { return [...this.#path]; }
    ;
    #edges = [];
    get pathEdges() { return [...this.#edges]; }
    ;
    #cyclicPath = false;
    get isPathCyclic() { return this.#cyclicPath; }
    #psd = 20;
    setPathSeekDist(n) { this.#psd = n * n; return this; }
    set pathSeekDist(n) { this.#psd = n * n; }
    get pathSeekDist() { return Math.sqrt(this.#psd); }
    #pad = 1;
    setPathArriveDist(n) { this.#pad = n * n; return this; }
    set pathArriveDist(n) { this.#pad = n * n; }
    get pathArriveDist() { return Math.sqrt(this.#pad); }
    get nextEdge() { return this.#edges.length > 0 ? this.#edges[0] : undefined; }
    get currNode() { return this.#path.length > 0 ? this.#path[0] : undefined; }
    #currEdge;
    get currEdge() { return this.#currEdge; }
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
            f = f.mult(this.#weight[IDX_WALL_AVOID]);
            recorder?.addData(IDX_WALL_AVOID, f, this.#weight[IDX_WALL_AVOID]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        if (this.isObsAvoidOn) {
            let f = this.obstacleAvoidance(owner, world, elapsedTime);
            f = f.mult(this.#weight[IDX_OBSTACLE_AVOID]);
            recorder?.addData(IDX_OBSTACLE_AVOID, f, this.#weight[IDX_OBSTACLE_AVOID]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        if (this.isEvadeOn) {
            let f = this.evade(owner, this.evadeAgent);
            f = f.mult(this.#weight[IDX_EVADE]);
            recorder?.addData(IDX_EVADE, f, this.#weight[IDX_EVADE]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        if (this.isFleeOn) {
            let f = this.flee(owner, this.fleeTarget);
            f = f.mult(this.#weight[IDX_FLEE]);
            recorder?.addData(IDX_FLEE, f, this.#weight[IDX_FLEE]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        if (this.isFlockOn) {
            let f = this.flock(owner, world);
            f = f.mult(this.#weight[IDX_FLOCK]);
            recorder?.addData(IDX_FLOCK, f, this.#weight[IDX_FLOCK]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        else {
            if (this.isSeparationOn) {
                let f = this.separation(owner, world);
                f.mult(this.#weight[IDX_SEPARATION]);
                recorder?.addData(IDX_SEPARATION, f, this.#weight[IDX_SEPARATION]);
                if (!this.accumulateForce(sumForces, f, maxForce))
                    return Vector2D.from(sumForces);
            }
            if (this.isAlignmentOn) {
                let f = this.alignment(owner, world);
                f.mult(this.#weight[IDX_ALIGNMENT]);
                recorder?.addData(IDX_ALIGNMENT, f, this.#weight[IDX_ALIGNMENT]);
                if (!this.accumulateForce(sumForces, f, maxForce))
                    return Vector2D.from(sumForces);
            }
            if (this.isCohesionOn) {
                let f = this.cohesion(owner, world);
                f.mult(this.#weight[IDX_COHESION]);
                recorder?.addData(IDX_COHESION, f, this.#weight[IDX_COHESION]);
                if (!this.accumulateForce(sumForces, f, maxForce))
                    return Vector2D.from(sumForces);
            }
        }
        if (this.isSeekOn) {
            let f = this.seek(owner, this.target);
            f = f.mult(this.#weight[IDX_SEEK]);
            recorder?.addData(IDX_SEEK, f, this.#weight[IDX_SEEK]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        if (this.isArriveOn) {
            let f = this.arrive(owner, this.target);
            f = f.mult(this.#weight[IDX_ARRIVE]);
            recorder?.addData(IDX_ARRIVE, f, this.#weight[IDX_ARRIVE]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        if (this.isWanderOn) {
            let f = this.wander(owner, elapsedTime);
            f = f.mult(this.#weight[IDX_WANDER]);
            recorder?.addData(IDX_WANDER, f, this.#weight[IDX_WANDER]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        if (this.isPusuitOn) {
            let f = this.pursuit(owner, this.pursueAgent);
            f = f.mult(this.#weight[IDX_PURSUIT]);
            recorder?.addData(IDX_PURSUIT, f, this.#weight[IDX_PURSUIT]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        if (this.isOffsetPusuitOn) {
            let f = this.offsetPursuit(owner, this.pursueAgent, this.pursueOffset);
            f = f.mult(this.#weight[IDX_OFFSET_PURSUIT]);
            recorder?.addData(IDX_OFFSET_PURSUIT, f, this.#weight[IDX_OFFSET_PURSUIT]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        if (this.isInterposeOn) {
            let f = this.interpose(owner, this.agent0, this.agent1);
            f = f.mult(this.#weight[IDX_INTERPOSE]);
            recorder?.addData(IDX_INTERPOSE, f, this.#weight[IDX_INTERPOSE]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        if (this.isHideOn) {
            let f = this.hide(owner, world, this.hideFromAgent);
            f = f.mult(this.#weight[IDX_HIDE]);
            recorder?.addData(IDX_HIDE, f, this.#weight[IDX_HIDE]);
            if (!this.accumulateForce(sumForces, f, maxForce))
                return Vector2D.from(sumForces);
        }
        if (this.isPathOn) {
            let f = this.path(owner, world);
            f = f.mult(this.#weight[IDX_PATH]);
            recorder?.addData(IDX_PATH, f, this.#weight[IDX_PATH]);
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
        this.#flags &= (ALL_SB_MASK - behaviours);
        return this;
    }
    on(behaviours) {
        this.#flags |= (ALL_SB_MASK & behaviours);
        return this;
    }
    setWeighting(bhvrIdx, weight) {
        if (Number.isFinite(bhvrIdx) && Number.isFinite(weight)) {
            if (bhvrIdx > 0 && bhvrIdx < NBR_BEHAVIOURS)
                this.#weight[bhvrIdx] = weight;
            else
                console.error(`Uanble to set the weighting for behaiour ID ${bhvrIdx}`);
        }
        return this;
    }
    getWeighting(bhvrIdx) {
        if (Number.isFinite(bhvrIdx) && bhvrIdx > 0 && bhvrIdx < NBR_BEHAVIOURS)
            return this.#weight[bhvrIdx];
        else
            return 0;
    }
    /** Default values for steering behaviour objects. */
    #weight = [
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
    ];
    get weightsArray() { return this.#weight; }
    ;
}
//# sourceMappingURL=autopilot.js.map