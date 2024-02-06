class Mover extends Entity {
    constructor(position, colRadius = 0) {
        super(position, colRadius);
        /** Prev world position */
        this._prevPos = new Vector2D();
        /** Velocity */
        this._vel = new Vector2D();
        /** Heading / facing (normalised) */
        this._heading = new Vector2D(1, 0); // facing East;
        /** Mass */
        this._mass = 1;
        /** Max speed */
        this._maxSpeed = 100;
        /** Max force */
        this._maxForce = 200;
        /** Current turn rate */
        this._turnRate = 2;
        /** Distance a moving entity can see another one */
        this._viewDistance = 50;
        /** Field of view (radians) */
        this._viewFOV = 1.047; // Default is 60 degrees
        this._prevPos.set(this._pos);
        this._mass = 1;
        this._side = this._heading.getPerp();
    }
    set domain(d) { this._domain = d; }
    get domain() { return this._domain; }
    set domainConstraint(c) { this._domain?.setConstraint(c); }
    set prevPos(v) { this._prevPos = v; }
    get prevPos() { return this._prevPos; }
    set vel(v) { this._vel = v; }
    get vel() { return this._vel; }
    get velAngle() { return this._vel.angle; }
    /** Speed */
    get speed() { return this._vel.length(); }
    get speedSq() { return this._vel.lengthSq(); }
    set heading(v) { this._heading = v; }
    get heading() { return this._heading; }
    /** Heading / facing angle */
    set headingAngle(n) { this._heading.x = Math.cos(n); this._heading.x = Math.sin(n); }
    get headingAngle() { return this.heading.angle; }
    set headingAtRest(v) { this._heading = v; }
    get headingAtRest() { return this._heading; }
    /** Heading at rest angle */
    set headingAtRestAngle(n) { this._heading.x = Math.cos(n); this._heading.x = Math.sin(n); }
    get headingAtRestAngle() { return this.heading.angle; }
    get side() { return this._heading.getPerp(); }
    set mass(n) { this._mass = n; }
    get mass() { return this._mass; }
    set maxSpeed(n) { this._maxSpeed = n; }
    get maxSpeed() { return this._maxSpeed; }
    set maxForce(n) { this._maxForce = n; }
    get maxForce() { return this._maxForce; }
    set turnRate(n) { this._turnRate = Math.min(Math.max(n, 0), MAX_TURN_RATE); }
    get turnRate() { return this._turnRate; }
    set viewDistance(n) { this._viewDistance = n; }
    get viewDistance() { return this._viewDistance; }
    set viewFOV(n) { this._viewFOV = n; }
    get viewFOV() { return this._viewFOV; }
    /**
     * See if the current speed exceeds the maximum speed permitted.
     * @return true if the speed is greater or equal to the max speed.
     */
    isSpeedMaxedOut() {
        return this._vel.lengthSq() >= this._maxSpeed * this._maxSpeed;
    }
    /**
     * After calculating the entity's position it is then constrained by
     * the domain constraint REBOUND, WRAP or PASS_THROUGH (not constrained)
     */
    applyDomainConstraint(domain) {
        if (domain)
            switch (domain._constraint) {
                case WRAP:
                    if (this._pos.x < domain._lowX)
                        this._pos.x += domain._width;
                    else if (this._pos.x > domain._highX)
                        this._pos.x -= domain._width;
                    if (this._pos.y < domain._lowY)
                        this._pos.y += domain._height;
                    else if (this._pos.y > domain._highY)
                        this._pos.y -= domain._height;
                    break;
                case REBOUND:
                    if (this._pos.x < domain._lowX)
                        this._vel.x = Math.abs(this._vel.x);
                    else if (this._pos.x > domain._highX)
                        this._vel.x = -Math.abs(this._vel.x);
                    if (this._pos.y < domain._lowY)
                        this._vel.y = Math.abs(this._vel.y);
                    else if (this._pos.y > domain._highY)
                        this._vel.y = -Math.abs(this._vel.y);
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
        let toTarget = new Vector2D(x0 - this._pos.x, y0 - this._pos.y);
        // See if in view range
        let distToTarget = toTarget.length();
        if (distToTarget > this._viewDistance)
            return false;
        // See if in field of view
        toTarget.div(distToTarget); // normalise toTarget
        let cosAngle = this._heading.dot(toTarget);
        if (cosAngle < Math.cos(this._viewFOV / 2))
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
        let alignTo = faceTarget.sub(this._pos); // Vector2D.sub(faceTarget, this._pos);
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
        let angleBetween = this._heading.angleBetween(alignTo);
        // Return true if the player is virtually facing the target
        if (Math.abs(angleBetween) < EPSILON)
            return true;
        // Calculate the amount of turn possible in time allowed
        let angleToTurn = this._turnRate * elapsedTime;
        // Prevent over steer by clamping the amount to turn to the angle angle 
        // between the heading vector and the target
        if (angleToTurn > angleBetween)
            angleToTurn = angleBetween;
        // The next few lines use a rotation matrix to rotate the player's heading
        // vector accordingly
        let rotMatrix = new Matrix2D();
        // The direction of rotation is needed to create the rotation matrix
        rotMatrix.rotate(angleToTurn * alignTo.sign(this._heading));
        // Rotate heading
        this._heading = rotMatrix.transformVector(this._heading);
        this._heading.normalize();
        // Calculate new side
        this._side = this._heading.getPerp();
        return false;
    }
    /**
     * Determine whether this moving entity is inside or part inside the domain. This method is
     * used by the world draw method to see if this entity should be drawn.
     * @param view the world domain
     * @return true if any part of this entity is inside the domain
     */
    isInDomain(view) {
        return (this._pos.x >= view._lowX && this._pos.x <= view._highX
            && this._pos.y >= view._lowY && this._pos.y <= view._highY);
    }
    /**
     * Determines whether a point is over this entity's collision circle
     */
    isOver(px, py) {
        return ((this._pos.x - px) * (this._pos.x - px) + (this._pos.y - py) * (this._pos.y - py))
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
        this._prevPos.set(this._pos);
        // Update position
        this._pos = this._pos.add(this._vel.mult(elapsedTime));
        // Apply domain constraint
        this.applyDomainConstraint(this._domain ? this._domain : world._domain);
        // Update heading
        if (this._vel.lengthSq() > 0.01)
            this.rotateHeadingToAlignWith(elapsedTime, this._vel);
        else {
            this._vel.set([0, 0]);
            if (this._headingAtRest)
                this.rotateHeadingToAlignWith(elapsedTime, this._headingAtRest);
        }
        // Ensure heading and side are normalised
        this._heading.normalize();
        this._side = this._heading.getPerp();
    }
}
//# sourceMappingURL=mover.js.map