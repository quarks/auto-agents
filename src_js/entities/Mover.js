class Mover extends Entity {
    /** Movement domain - if none provided the world domain is used */
    #domain;
    set domain(d) { this.#domain = d; }
    get domain() { return this.#domain; }
    set domainConstraint(c) { this.#domain?.setConstraint(c); }
    /** Prev world position */
    #prevPos = new Vector2D();
    set prevPos(v) { this.#prevPos = v; }
    get prevPos() { return this.#prevPos; }
    /** Velocity */
    #vel = new Vector2D();
    set vel(v) { this.#vel = v; }
    get vel() { return this.#vel; }
    get velAngle() { return this.#vel.angle; }
    /** Speed */
    get speed() { return this.#vel.length(); }
    get speedSq() { return this.#vel.lengthSq(); }
    /** Heading / facing (normalised) */
    #heading = new Vector2D(1, 0); // facing East;
    set heading(v) { this.#heading = v; }
    get heading() { return this.#heading; }
    /** Heading / facing angle */
    set headingAngle(n) { this.#heading.x = Math.cos(n); this.#heading.x = Math.sin(n); }
    get headingAngle() { return this.heading.angle; }
    /** Heading at rest (normalised */
    #headingAtRest; //= new Vector2D(1, 0); // facing East;
    set headingAtRest(v) { this.#heading = v; }
    get headingAtRest() { return this.#heading; }
    /** Heading at rest angle */
    set headingAtRestAngle(n) { this.#heading.x = Math.cos(n); this.#heading.x = Math.sin(n); }
    get headingAtRestAngle() { return this.heading.angle; }
    /** Perpendiclar to heading (normalised) */
    #side;
    get side() { return this.#side; }
    set side(n) { this.#side = n; }
    /** Mass */
    #mass = 1;
    set mass(n) { this.#mass = n; }
    get mass() { return this.#mass; }
    /** Max speed */
    #maxSpeed = 100;
    set maxSpeed(n) { this.#maxSpeed = n; }
    get maxSpeed() { return this.#maxSpeed; }
    /** Max force */
    #maxForce = 200;
    set maxForce(n) { this.#maxForce = n; }
    get maxForce() { return this.#maxForce; }
    /** Current turn rate */
    #turnRate = 2;
    set turnRate(n) { this.#turnRate = Math.min(Math.max(n, 0), MAX_TURN_RATE); }
    get turnRate() { return this.#turnRate; }
    /** Distance a moving entity can see another one */
    #viewDistance = 50;
    set viewDistance(n) { this.#viewDistance = n; }
    get viewDistance() { return this.#viewDistance; }
    /** Field of view (radians) */
    #viewFOV = 1.047; // Default is 60 degrees
    set viewFOV(n) { this.#viewFOV = n; }
    get viewFOV() { return this.#viewFOV; }
    constructor(position, colRadius = 0) {
        super(position, colRadius);
        this.Z = 128;
        this.#prevPos.set(this.pos);
        this.#mass = 1;
        this.#side = this.#heading.getPerp();
    }
    /**
     * See if the current speed exceeds the maximum speed permitted.
     * @return true if the speed is greater or equal to the max speed.
     */
    isSpeedMaxedOut() {
        return this.#vel.lengthSq() >= this.#maxSpeed * this.#maxSpeed;
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
                        this.#vel.x = Math.abs(this.#vel.x);
                    else if (this.pos.x > domain.highX)
                        this.#vel.x = -Math.abs(this.#vel.x);
                    if (this.pos.y < domain.lowY)
                        this.#vel.y = Math.abs(this.#vel.y);
                    else if (this.pos.y > domain.highY)
                        this.#vel.y = -Math.abs(this.#vel.y);
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
        if (distToTarget > this.#viewDistance)
            return false;
        // See if in field of view
        toTarget.div(distToTarget); // normalise toTarget
        let cosAngle = this.#heading.dot(toTarget);
        if (cosAngle < Math.cos(this.#viewFOV / 2))
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
        let angleBetween = this.#heading.angleBetween(alignTo);
        // Return true if the player is virtually facing the target
        if (Math.abs(angleBetween) < EPSILON)
            return true;
        // Calculate the amount of turn possible in time allowed
        let angleToTurn = this.#turnRate * elapsedTime;
        // Prevent over steer by clamping the amount to turn to the angle angle 
        // between the heading vector and the target
        if (angleToTurn > angleBetween)
            angleToTurn = angleBetween;
        // The next few lines use a rotation matrix to rotate the player's heading
        // vector accordingly
        let rotMatrix = new Matrix2D();
        // The direction of rotation is needed to create the rotation matrix
        rotMatrix.rotate(angleToTurn * alignTo.sign(this.#heading));
        // Rotate heading
        this.#heading = rotMatrix.transformVector(this.#heading);
        this.#heading.normalize();
        // Calculate new side
        this.#side = this.#heading.getPerp();
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
        this.#prevPos.set(this.pos);
        // Update position
        this.pos = this.pos.add(this.#vel.mult(elapsedTime));
        // Apply domain constraint
        this.applyDomainConstraint(this.#domain ? this.#domain : world.domain);
        // Update heading
        if (this.#vel.lengthSq() > 0.01)
            this.rotateHeadingToAlignWith(elapsedTime, this.#vel);
        else {
            this.#vel.set([0, 0]);
            if (this.#headingAtRest)
                this.rotateHeadingToAlignWith(elapsedTime, this.#headingAtRest);
        }
        // Ensure heading and side are normalised
        this.#heading.normalize();
        this.#side = this.#heading.getPerp();
    }
}
//# sourceMappingURL=mover.js.map