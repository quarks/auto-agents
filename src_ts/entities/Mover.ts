class Mover extends Entity {
    /** Movement domain - if none provided the world domain is used */
    #domain: Domain;
    set domain(d: Domain) { this.#domain = d; }
    get domain(): Domain { return this.#domain; }
    set domainConstraint(c: symbol) { this.#domain?.setConstraint(c); }
    setDomain(d: Domain): Mover { this.#domain = d; return this; }

    /** Prev world position */
    #prevPos = new Vector2D();
    set prevPos(v: Vector2D) { this.#prevPos = v; }
    get prevPos(): Vector2D { return this.#prevPos }

    /** Velocity */
    #vel = new Vector2D();
    set vel(v: Vector2D) { this.#vel = v; }
    get vel(): Vector2D { return this.#vel; }
    get velAngle(): number { return this.#vel.angle; }
    setVel(v: Vector2D): Mover { this.#vel = v; return this; }

    /** Speed */
    get speed(): number { return this.#vel.length(); }
    get speedSq(): number { return this.#vel.lengthSq(); }

    /** Heading (normalised) */
    __heading = new Vector2D(1, 0); // facing East;
    set heading(v: Vector2D) { this.__heading = v; }
    get heading(): Vector2D { return this.__heading; }
    /** Heading / facing angle */
    set headingAngle(n: number) { this.__heading = new Vector2D(Math.cos(n), Math.sin(n)); }
    get headingAngle(): number { return this.heading.angle; }

    /** Heading at rest (normalised */
    __headingAtRest;  //= new Vector2D(1, 0); // facing East;
    set headingAtRest(v: Vector2D) { this.__headingAtRest = v; }
    get headingAtRest(): Vector2D { return this.__headingAtRest; }

    /** Heading at rest angle */
    set headingAtRestAngle(n: number) { this.__headingAtRest.x = new Vector2D(Math.cos(n), Math.sin(n)); }
    get headingAtRestAngle(): number { return this.headingAtRest.angle; }

    /** Perpendiclar to heading (normalised) */
    #side: Vector2D;
    get side() { return this.#side; }
    set side(n: Vector2D) { this.#side = n; }

    /** Mass */
    __mass: number = 1;
    set mass(n: number) { this.__mass = n; }
    get mass(): number { return this.__mass; }

    /** Max speed */
    __maxSpeed: number = 100;
    set maxSpeed(n: number) { this.__maxSpeed = n; }
    get maxSpeed(): number { return this.__maxSpeed; }

    /** Max force */
    __maxForce: number = 200;
    set maxForce(n: number) { this.__maxForce = n; }
    get maxForce(): number { return this.__maxForce; }

    /** Current turn rate */
    __turnRate = 2;
    set turnRate(n: number) { this.__turnRate = Math.min(Math.max(n, 0), MAX_TURN_RATE); }
    get turnRate(): number { return this.__turnRate; }

    /** Distance a moving entity can see another one */
    __viewDistance = 125;
    set viewDistance(n: number) { this.__viewDistance = n; }
    get viewDistance(): number { return this.__viewDistance; }

    /** Field of view (radians) */
    __viewFOV = 1.047; // Default is 60 degrees
    set viewFOV(n: number) { this.__viewFOV = n; }
    get viewFOV(): number { return this.__viewFOV; }

    constructor(position: Array<number> | Vector2D, colRadius = 0) {
        super(position, colRadius);
        this.Z = 128;
        this.#prevPos = this.pos;
        this.__mass = 1;
        this.#side = this.__heading.getPerp();
    }

    /**
     * Set any of the properties 
     * @param props 
     * @returns 
     */
    setProperties(props: object): Mover {
        if (!props || typeof props !== 'object') return this;
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
    isSpeedMaxedOut(): boolean {
        return this.#vel.lengthSq() >= this.__maxSpeed * this.__maxSpeed;
    }

    /**
     * After calculating the entity's position it is then constrained by
     * the domain constraint REBOUND, WRAP or PASS_THROUGH (not constrained)
     */
    applyDomainConstraint(domain: Domain): void {
        let nx: number, ny: number;
        if (domain)
            switch (domain.constraint) {
                case WRAP:
                    nx = this.pos.x; ny = this.pos.y;
                    if (this.pos.x < domain.lowX)
                        nx += domain.width;
                    else if (this.pos.x > domain.highX)
                        nx -= domain.width;
                    if (this.pos.y < domain.lowY)
                        ny += domain.height;
                    else if (this.pos.y > domain.highY)
                        ny -= domain.height;
                    Vector2D.mutate(this.pos, [nx, ny]);
                    break;
                case REBOUND:
                    nx = this.vel.x; ny = this.vel.y;
                    if (this.pos.x < domain.lowX)
                        nx = Math.abs(this.#vel.x);
                    else if (this.pos.x > domain.highX)
                        nx = -Math.abs(this.#vel.x);
                    if (this.pos.y < domain.lowY)
                        ny = Math.abs(this.#vel.y);
                    else if (this.pos.y > domain.highY)
                        ny = -Math.abs(this.#vel.y);
                    Vector2D.mutate(this.vel, [nx, ny]);
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
    isEitherSide(p0: Vector2D, p1: Vector2D): boolean {
        return Geom2D.line_circle(p0.x, p0.y, p1.x, p1.y,
            this.pos.x, this.pos.y, this.colRad);
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
    canSee(world: World, position: Array<number> | _XY_): boolean {
        let pos = this.pos;
        let target = Vector2D.from(position);

        let toTarget = target.sub(pos);
        // See if in view range
        let distToTarget = toTarget.length();
        if (distToTarget > this.viewDistance)
            return false;
        // See if in field of view
        toTarget = toTarget.div(distToTarget);	// normalise toTarget
        let cosAngle = this.heading.dot(toTarget);
        if (cosAngle < Math.cos(this.viewFOV / 2))
            return false;
        // Do we have an obstruction?
        let lowX = Math.min(pos.x, target.x), lowY = Math.min(pos.y, target.y);
        let highX = Math.max(pos.x, target.x), highY = Math.max(pos.y, target.y);
        let ents = world.tree.getItemsInRegion(lowX, lowY, highX, highY)
            .entities.filter(e => e instanceof Obstacle || e instanceof Wall);
        for (let entity of ents)
            if (entity.isEitherSide(pos, target)) return false;
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
    rotateHeadingToFacePosition(deltaTime: number, faceTarget: Vector2D): boolean {
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
    rotateHeadingToAlignWith(elapsedTime: number, alignTo: Vector2D): boolean {
        // Calculate the angle between the heading vector and the target
        let angleBetween = this.__heading.angleBetween(alignTo);

        // Return true if the player is virtually facing the target
        if (Math.abs(angleBetween) < EPSILON) return true;

        // Calculate the amount of turn possible in time allowed
        let angleToTurn = this.__turnRate * elapsedTime;

        // Prevent over steer by clamping the amount to turn to the angle angle 
        // between the heading vector and the target
        if (angleToTurn > angleBetween) angleToTurn = angleBetween;

        // The next few lines use a rotation matrix to rotate the player's heading
        // vector accordingly
        let rotMatrix = new Matrix2D();

        // The direction of rotation is needed to create the rotation matrix
        rotMatrix.rotate(angleToTurn * alignTo.sign(this.__heading));
        // Rotate heading
        this.__heading = rotMatrix.transformVector(this.__heading);
        this.__heading.normalize();
        // Calculate new side
        this.#side = this.__heading.getPerp();
        return false;
    }

    /**
     * Determine whether this moving entity is inside or part inside the domain. This method is
     * used by the world draw method to see if this entity should be drawn.
     * @param view the world domain
     * @return true if any part of this entity is inside the domain
     */
    isInDomain(view: Domain): boolean {
        return (this.pos.x >= view.lowX && this.pos.x <= view.highX
            && this.pos.y >= view.lowY && this.pos.y <= view.highY);
    }

    /**
     * Determines whether a point is over this entity's collision circle
     */
    isOver(px: number, py: number): boolean {
        return ((this.pos.x - px) * (this.pos.x - px) + (this.pos.y - py) * (this.pos.y - py))
            <= (this.colRad * this.colRad);
    }

    /**
     * Update method for any moving entity in the world that is not under
     * the influence of a steering behaviour.
     * @param elapsedTime elapsed time since last update (milliseconds)
     * @param world the game world object
     */
    update(elapsedTime: number, world: World) {
        // Remember the starting position
        this.#prevPos = this.pos;
        // Update position
        this.pos = this.pos.add(this.#vel.mult(elapsedTime));
        // Apply domain constraint
        this.applyDomainConstraint(this.#domain ? this.#domain : world.domain);
        // Update heading
        if (this.#vel.lengthSq() > 0.01)
            this.rotateHeadingToAlignWith(elapsedTime, this.#vel);
        else {
            Vector2D.mutate(this.#vel, [0, 0]); //this.#vel = .set([0, 0]);
            if (this.headingAtRest)
                this.rotateHeadingToAlignWith(elapsedTime, this.headingAtRest);
        }
        // Ensure heading and side are normalised
        this.heading = this.heading.normalize();
        this.#side = this.heading.getPerp();
    }

}