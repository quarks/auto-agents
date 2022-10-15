class Mover extends Entity {
    type = MOVER;
    // The domain the entity is constrained to (if any)
    domain: Domain;
    _domainConstraint = WRAP;

    // World position after last update
    _prevPos = new Vector2D();
    // Bounding radius
    _bRad: number;
    // Current velocity vector
    _vel = new Vector2D();
    // a normalised vector pointing in the direction the entity is heading. 
    _heading = new Vector2D(1, 0); // facing East;
    // a normalised vector pointing in the entity's rest heading. 
    _headingAtRest = new Vector2D(1, 0); // facing East;
    //a normalised vector perpendicular to the heading vector
    _side: Vector2D;
    // The mass of the entity
    _mass: number;
    // The maximum speed this entity may travel at.
    _maxSpeed: number = 50;
    // The maximum force this entity can use to power itself 
    _maxForce: number = 10000;
    // The maximum rate (radians per second) this vehicle can rotate         
    _maxTurnRate: number = 1;
    // The current rate of turn (radians per second)         
    _currTurnRate = 0;
    // The previous rate of turn i.e. on last update (radians per second)         
    _prevTurnRate = 0;
    // The distance that the entity can see another moving entity
    _viewDistance = 50;
    // Field of view (radians)
    _viewFOV = 1.047; // Default is 60 degrees

    constructor(position: Vector2D, radius: number) {
        super(position);
        this._pos.set(position);
        this._prevPos.set(position);
        this._bRad = radius;
        this._mass = this._bRad * this._bRad;
        this._side = this._heading.getPerp();
    }

    fits_inside(lowX: number, lowY: number, highX: number, highY: number): boolean {
        let fits: boolean =
            (this._pos.x - this._bRad >= lowX)
            && (this._pos.x + this._bRad <= highX)
            && (this._pos.y - this._bRad >= lowY)
            && (this._pos.y + this._bRad <= highY);
        return fits;
    }

    update(elapsedTime: number): void {
        this._pos.add(Vector2D.mult(this._vel, elapsedTime));
        // If a quadtree is provided constrain the balls to the limits
        // of the root partition 
        if(this.domain){
            let root = this.domain;
            if (this._pos.x - this._bRad < root.lowX) 
                this._vel.x = Math.abs(this._vel.x);
            else if (this._pos.x + this._bRad > root.highX) 
                this._vel.x = -Math.abs(this._vel.x);
            if (this._pos.y - this._bRad < root.lowY) 
                this._vel.y = Math.abs(this._vel.y);
            else if (this._pos.y + this._bRad > root.highY) 
                this._vel.y = -Math.abs(this._vel.y);
        }
    }

    constrainTo(area: Domain, method?: number): Mover {
        this.domain = area ? area.copy() : undefined;
        if (method) this.constrainWith(method)
        return this;
    }

    constrainWith(method: number) {
        if (Number.isFinite(method))
            if (method === WRAP || method === REBOUND || method === PASS_THROUGH)
                this._domainConstraint = method;
    }

    pos(x: number, y: number): Mover {
        this._pos.set(x, y);
        return this;
    }

    vel(x: number, y: number): Mover {
        this._vel.set(x, y);
        return this;
    }

    mass(m: number): Mover {
        this._mass = m;
        return this;
    }

    heading(x: number, y: number): Mover {
        this._heading.set(x, y);
        this._side = this._heading.getPerp();
        return this;
    }

    headingAtRest(x: number, y: number): Mover {
        this._headingAtRest.set(x, y);
        return this;
    }

    maxSpeed(ms: number): Mover {
        this._maxSpeed = ms;
        return this;
    }

    maxForce(mf: number): Mover {
        this._maxForce = mf;
        return this;
    }

    maxTurnRate(mtr: number): Mover {
        this._maxTurnRate = mtr;
        return this;
    }

    viewDistance(vd: number): Mover {
        this._viewDistance = vd;
        return this;
    }

    viewFOV(fov: number): Mover {
        this._viewFOV = fov;
        return this;
    }

    getPos(): Vector2D {
        return this._pos;
    }

    getVel(): Vector2D {
        return this._vel;
    }

    getMass(): number {
        return this._mass;
    }

    getHeading(): Vector2D {
        return this._heading;
    }

    getHeadingAtRest(): Vector2D {
        return this._headingAtRest;
    }

    getMaxSpeed(): number {
        return this._maxSpeed;
    }

    getMaxForce(): number {
        return this._maxForce;
    }

    getMaxTurnRate(): number {
        return this._maxForce;
    }

    getViewDistance(): number {
        return this._viewDistance;
    }

    getViewFOV(): number {
        return this._viewDistance;
    }


    /*
 public  MovingEntity( 
           String name,
           Vector2D position,
           double   radius,
           Vector2D velocity,
           double   max_speed,
           Vector2D heading,
           double   mass,
           double   max_turn_rate,
           double   max_force)
   {
       super(name, position, radius);
       this.heading.set(heading);
       this.velocity.set(velocity);
       this.prevPos.set(position);
       this.mass = mass;
       this.side = heading.getPerp();
       this.maxSpeed = max_speed;
       this.maxTurnRate = max_turn_rate;
       this.currTurnRate = max_turn_rate;
       this.prevTurnRate = max_turn_rate;
       this.maxForce = max_force;
       visible = true;
   }
    */
}