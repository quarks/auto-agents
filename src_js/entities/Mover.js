class Mover extends Entity {
    constructor(position, colRadius = 0) {
        super(position, colRadius);
        this._type = MOVER;
        this._domainConstraint = WRAP;
        // World position after last update
        this._prevPos = new Vector2D();
        // Current velocity vector (controls speed and direction of travel)
        this._vel = new Vector2D();
        // a normalised vector pointing in the direction the entity is heading / facing. 
        this._heading = new Vector2D(1, 0); // facing East;
        // a normalised vector pointing in the entity's rest heading. 
        this._headingAtRest = new Vector2D(1, 0); // facing East;
        // The maximum speed this entity may travel at.
        this._maxSpeed = 50;
        // The maximum force this entity can use to power itself 
        this._maxForce = 10000;
        // The maximum rate (radians per second) this vehicle can rotate         
        this._maxTurnRate = 1;
        // The current rate of turn (radians per second)         
        this._currTurnRate = 0;
        // The previous rate of turn i.e. on last update (radians per second)         
        this._prevTurnRate = 0;
        // The distance that the entity can see another moving entity
        this._viewDistance = 50;
        // Field of view (radians)
        this._viewFOV = 1.047; // Default is 60 degrees
        this._prevPos.set(this._pos);
        this._mass = this._colRad * this._colRad;
        this._side = this._heading.getPerp();
    }
    /** Position */
    set pos(v) { this._pos = v; }
    ;
    get pos() { return this._pos; }
    ;
    /** Prev position */
    set prevPos(v) { this._prevPos = v; }
    ;
    get prevPos() { return this._prevPos; }
    ;
    /** Velocity */
    set vel(v) { this._vel = v; }
    ;
    get vel() { return this._vel; }
    ;
    /** Speed */
    get speed() { return this._vel.length(); }
    get speedSq() { return this._vel.lengthSq(); }
    /** Heading / facing */
    set heading(v) { this._heading = v; }
    get heading() { return this._heading; }
    /** Heading / facing angle */
    set headingAngle(n) { this._heading.x = Math.cos(n); this._heading.x = Math.sin(n); }
    get headingAngle() { return this.heading.angle; }
    /** Heading at rest */
    set headingAtRest(v) { this._heading = v; }
    get headingAtRest() { return this._heading; }
    /** Heading at rest angle */
    set headingAtRestAngle(n) { this._heading.x = Math.cos(n); this._heading.x = Math.sin(n); }
    get headingAtRestAngle() { return this.heading.angle; }
    /** Perpendiclar to heading */
    get side() { return this._heading.getPerp(); }
    /** Mass */
    set mass(n) { this._mass = n; }
    get mass() { return this._mass; }
    /** Max speed */
    set maxSpeed(n) { this._maxSpeed = n; }
    get maxSpeed() { return this._maxSpeed; }
    /** Max force */
    set maxForce(n) { this._maxForce = n; }
    get maxForce() { return this._maxForce; }
    /** Max turn rate */
    set maxTurnRate(n) { this._maxTurnRate = n; }
    get maxTurnRate() { return this._maxTurnRate; }
    /** Current turn rate */
    set currTurnRate(n) { this._currTurnRate = n; }
    get currTurnRate() { return this._currTurnRate; }
    /** Previous turn rate */
    set prevTurnRate(n) { this._prevTurnRate = n; }
    get prevTurnRate() { return this._prevTurnRate; }
    /** View distance */
    set viewDistance(n) { this._viewDistance = n; }
    get viewDistance() { return this._viewDistance; }
    /** View distance */
    set viewFOV(n) { this._viewFOV = n; }
    get viewFOV() { return this._viewFOV; }
    fits_inside(lowX, lowY, highX, highY) {
        let fits = (this._pos.x - this._colRad >= lowX)
            && (this._pos.x + this._colRad <= highX)
            && (this._pos.y - this._colRad >= lowY)
            && (this._pos.y + this._colRad <= highY);
        return fits;
    }
    constrainTo(area, method) {
        this._domain = area ? area.copy() : undefined;
        if (method)
            this.constrainWith(method);
        return this;
    }
    constrainWith(method) {
        if (method === WRAP || method === REBOUND || method === PASS_THROUGH)
            this._domainConstraint = method;
    }
    /**
     * See if the current speed exceeds the maximum speed permitted.
     * @return true if the speed is greater or equal to the max speed.
     */
    isSpeedMaxedOut() {
        return this._vel.lengthSq() >= this._maxSpeed * this._maxSpeed;
    }
    /**
     * After calculating the entity's position it is then constrained by
     * the domain constraint WRAP or REBOUND
     */
    applyDomainConstraint() {
        switch (this._domainConstraint) {
            case WRAP:
                if (this._pos.x < this._domain._lowX)
                    this._pos.x += this._domain._width;
                else if (this._pos.x > this._domain._highX)
                    this._pos.x -= this._domain._width;
                if (this._pos.y < this._domain._lowY)
                    this._pos.y += this._domain._height;
                else if (this._pos.y > this._domain._highY)
                    this._pos.y -= this._domain._height;
                break;
            case REBOUND:
                if (this._pos.x < this._domain._lowX)
                    this._vel.x = Math.abs(this._vel.x);
                else if (this._pos.x > this._domain._highX)
                    this._vel.x = -Math.abs(this._vel.x);
                if (this._pos.y < this._domain._lowY)
                    this._vel.y = Math.abs(this._vel.y);
                else if (this._pos.y > this._domain._highY)
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
     * @param x0 x position of first point of interest
     * @param y0 y position of first point of interest
     * @param x1 x position of second point of interest
     * @param y1 y position of second point of interest
     * @return true if the points are either side else false
     */
    isEitherSide(x0, y0, x1, y1) {
        return Geom2D.line_circle(x0, y0, x1, y1, this._pos.x, this._pos.y, this._colRad);
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
     * @param deltaTime time (seconds) to turn entity
     * @param allignTo vector to align entities heading with
     * @return true if facing alignment vector
     */
    rotateHeadingToAlignWith(deltaTime, allignTo) {
        // Calculate the angle between the heading vector and the target
        let angleBetween = this._heading.angleBetween(allignTo);
        // Return true if the player is virtually facing the target
        if (Math.abs(angleBetween) < EPSILON)
            return true;
        // Calculate the amount of turn possible in time allowed
        let angleToTurn = this._currTurnRate * deltaTime;
        // Prevent over steer by clamping the amount to turn to the angle angle 
        // between the heading vector and the target
        if (angleToTurn > angleBetween)
            angleToTurn = angleBetween;
        // The next few lines use a rotation matrix to rotate the player's heading
        // vector accordingly
        let rotMatrix = new Matrix2D();
        // The direction of rotation is needed to create the rotation matrix
        rotMatrix.rotate(angleToTurn * allignTo.sign(this._heading));
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
     * @param deltaTime elapsed time since last update
     * @param world the game world object
     */
    update(deltaTime, world) {
        // Remember the starting position
        this._prevPos.set(this._pos);
        // Update position
        this._pos = new Vector2D(this._pos.x + this._vel.x * deltaTime, this._pos.y + this._vel.y * deltaTime);
        // Apply domain constraints
        if (this._domain)
            this.applyDomainConstraint();
        // Update heading
        if (this._vel.lengthSq() > 0.01)
            this.rotateHeadingToAlignWith(deltaTime, this._vel);
        else {
            this._vel.set([0, 0]);
            if (this._headingAtRest)
                this.rotateHeadingToAlignWith(deltaTime, this._headingAtRest);
        }
        // Ensure heading and side are normalised
        this._heading.normalize();
        this._side = this._heading.getPerp();
    }
}
//# sourceMappingURL=mover.js.map