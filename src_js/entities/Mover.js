var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Mover_domain, _Mover_prevPos, _Mover_vel, _Mover_heading, _Mover_headingAtRest, _Mover_side, _Mover_mass, _Mover_maxSpeed, _Mover_maxForce, _Mover_turnRate, _Mover_viewDistance, _Mover_viewFOV;
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
        _Mover_heading.set(this, new Vector2D(1, 0)); // facing East;
        /** Heading at rest (normalised */
        _Mover_headingAtRest.set(this, void 0); //= new Vector2D(1, 0); // facing East;
        /** Perpendiclar to heading (normalised) */
        _Mover_side.set(this, void 0);
        /** Mass */
        _Mover_mass.set(this, 1);
        /** Max speed */
        _Mover_maxSpeed.set(this, 100);
        /** Max force */
        _Mover_maxForce.set(this, 200);
        /** Current turn rate */
        _Mover_turnRate.set(this, 2);
        /** Distance a moving entity can see another one */
        _Mover_viewDistance.set(this, 50);
        /** Field of view (radians) */
        _Mover_viewFOV.set(this, 1.047); // Default is 60 degrees
        __classPrivateFieldGet(this, _Mover_prevPos, "f").set(this.pos);
        __classPrivateFieldSet(this, _Mover_mass, 1, "f");
        __classPrivateFieldSet(this, _Mover_side, __classPrivateFieldGet(this, _Mover_heading, "f").getPerp(), "f");
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
    set heading(v) { __classPrivateFieldSet(this, _Mover_heading, v, "f"); }
    get heading() { return __classPrivateFieldGet(this, _Mover_heading, "f"); }
    /** Heading / facing angle */
    set headingAngle(n) { __classPrivateFieldGet(this, _Mover_heading, "f").x = Math.cos(n); __classPrivateFieldGet(this, _Mover_heading, "f").x = Math.sin(n); }
    get headingAngle() { return this.heading.angle; }
    set headingAtRest(v) { __classPrivateFieldSet(this, _Mover_heading, v, "f"); }
    get headingAtRest() { return __classPrivateFieldGet(this, _Mover_heading, "f"); }
    /** Heading at rest angle */
    set headingAtRestAngle(n) { __classPrivateFieldGet(this, _Mover_heading, "f").x = Math.cos(n); __classPrivateFieldGet(this, _Mover_heading, "f").x = Math.sin(n); }
    get headingAtRestAngle() { return this.heading.angle; }
    get side() { return __classPrivateFieldGet(this, _Mover_side, "f"); }
    set side(n) { __classPrivateFieldSet(this, _Mover_side, n, "f"); }
    set mass(n) { __classPrivateFieldSet(this, _Mover_mass, n, "f"); }
    get mass() { return __classPrivateFieldGet(this, _Mover_mass, "f"); }
    set maxSpeed(n) { __classPrivateFieldSet(this, _Mover_maxSpeed, n, "f"); }
    get maxSpeed() { return __classPrivateFieldGet(this, _Mover_maxSpeed, "f"); }
    set maxForce(n) { __classPrivateFieldSet(this, _Mover_maxForce, n, "f"); }
    get maxForce() { return __classPrivateFieldGet(this, _Mover_maxForce, "f"); }
    set turnRate(n) { __classPrivateFieldSet(this, _Mover_turnRate, Math.min(Math.max(n, 0), MAX_TURN_RATE), "f"); }
    get turnRate() { return __classPrivateFieldGet(this, _Mover_turnRate, "f"); }
    set viewDistance(n) { __classPrivateFieldSet(this, _Mover_viewDistance, n, "f"); }
    get viewDistance() { return __classPrivateFieldGet(this, _Mover_viewDistance, "f"); }
    set viewFOV(n) { __classPrivateFieldSet(this, _Mover_viewFOV, n, "f"); }
    get viewFOV() { return __classPrivateFieldGet(this, _Mover_viewFOV, "f"); }
    /**
     * See if the current speed exceeds the maximum speed permitted.
     * @return true if the speed is greater or equal to the max speed.
     */
    isSpeedMaxedOut() {
        return __classPrivateFieldGet(this, _Mover_vel, "f").lengthSq() >= __classPrivateFieldGet(this, _Mover_maxSpeed, "f") * __classPrivateFieldGet(this, _Mover_maxSpeed, "f");
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
     * @param x0 the x position of the location to test
     * @param y0 the y position of the location to test
     * @return true if the entity can see the location
     */
    canSee(world, x0, y0) {
        let toTarget = new Vector2D(x0 - this.pos.x, y0 - this.pos.y);
        // See if in view range
        let distToTarget = toTarget.length();
        if (distToTarget > __classPrivateFieldGet(this, _Mover_viewDistance, "f"))
            return false;
        // See if in field of view
        toTarget.div(distToTarget); // normalise toTarget
        let cosAngle = __classPrivateFieldGet(this, _Mover_heading, "f").dot(toTarget);
        if (cosAngle < Math.cos(__classPrivateFieldGet(this, _Mover_viewFOV, "f") / 2))
            return false;
        // If we get here then the position is within range and field of view, but do we have an obstruction.
        // First check for an intervening wall 
        // Set < Wall > walls = world.getWalls(this, x0, y0);
        // if (walls != null && !walls.isEmpty()) {
        //     for (Wall wall : walls) {
        //         if (wall.isEitherSide(pos.x, pos.y, x0, y0))
        //             return false;
        //     }
        // }
        // // Next check for an intervening obstacle 
        // Set < Obstacle > obstacles = world.getObstacles(this, x0, y0);
        // if (obstacles != null && !obstacles.isEmpty()) {
        //     for (Obstacle obstacle : obstacles) {
        //         if (obstacle.isEitherSide(pos.x, pos.y, x0, y0))
        //             return false;
        //     }
        // }
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
    // public boolean canSee(World world, Vector2D pos) {
    //     if (pos == null)
    //         return false;
    //     else
    //         return canSee(world, pos.x, pos.y);
    // }
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
        let angleBetween = __classPrivateFieldGet(this, _Mover_heading, "f").angleBetween(alignTo);
        // Return true if the player is virtually facing the target
        if (Math.abs(angleBetween) < EPSILON)
            return true;
        // Calculate the amount of turn possible in time allowed
        let angleToTurn = __classPrivateFieldGet(this, _Mover_turnRate, "f") * elapsedTime;
        // Prevent over steer by clamping the amount to turn to the angle angle 
        // between the heading vector and the target
        if (angleToTurn > angleBetween)
            angleToTurn = angleBetween;
        // The next few lines use a rotation matrix to rotate the player's heading
        // vector accordingly
        let rotMatrix = new Matrix2D();
        // The direction of rotation is needed to create the rotation matrix
        rotMatrix.rotate(angleToTurn * alignTo.sign(__classPrivateFieldGet(this, _Mover_heading, "f")));
        // Rotate heading
        __classPrivateFieldSet(this, _Mover_heading, rotMatrix.transformVector(__classPrivateFieldGet(this, _Mover_heading, "f")), "f");
        __classPrivateFieldGet(this, _Mover_heading, "f").normalize();
        // Calculate new side
        __classPrivateFieldSet(this, _Mover_side, __classPrivateFieldGet(this, _Mover_heading, "f").getPerp(), "f");
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
            <= (this._colRad * this._colRad);
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
            if (__classPrivateFieldGet(this, _Mover_headingAtRest, "f"))
                this.rotateHeadingToAlignWith(elapsedTime, __classPrivateFieldGet(this, _Mover_headingAtRest, "f"));
        }
        // Ensure heading and side are normalised
        __classPrivateFieldGet(this, _Mover_heading, "f").normalize();
        __classPrivateFieldSet(this, _Mover_side, __classPrivateFieldGet(this, _Mover_heading, "f").getPerp(), "f");
    }
}
_Mover_domain = new WeakMap(), _Mover_prevPos = new WeakMap(), _Mover_vel = new WeakMap(), _Mover_heading = new WeakMap(), _Mover_headingAtRest = new WeakMap(), _Mover_side = new WeakMap(), _Mover_mass = new WeakMap(), _Mover_maxSpeed = new WeakMap(), _Mover_maxForce = new WeakMap(), _Mover_turnRate = new WeakMap(), _Mover_viewDistance = new WeakMap(), _Mover_viewFOV = new WeakMap();
//# sourceMappingURL=mover.js.map