abstract class Entity {

    static NEXT_ID = 0;

    _type = ENTITY;
    _id: number;
    _tag: string | number
    _world: World;

    _fsm: FiniteStateMachine;
    _painter: Function;
    _visible = true;
    _pos: Vector2D = new Vector2D();

    _zorder: number = 0;
    _colRad: number = 0;

    constructor(position: Array<number> | Position, colRadius = 1) {
        this._id = Entity.NEXT_ID++;
        this._pos = Vector2D.from(position);
        this._colRad = colRadius;
    }

    /** Position coordinates */
    get x(): number { return this._pos.x; }
    get y(): number { return this._pos.y; }
    get pos(): Vector2D { return this._pos };

    /** The colision radius */
    get world(): World { return this._world; }
    set world(world: World) { this._world = world; }

    /** The colision radius */
    get colRad(): number { return this._colRad; }
    set colRad(value) { this._colRad = value; }

    /** Get the id property */
    get id(): number { return this._id; }

    /** Get the entity type  */
    get type(): symbol { return this._type; }

    /** The tag property */
    get tag(): string | number { return this._tag; }
    set tag(value) { this._tag = value; }

    /** The finite state machine */
    get fsm(): FiniteStateMachine { return this._fsm; }
    set fsm(value) { this._fsm = value; }

    /** Set the renderer */
    set painter(painter: Function) { this._painter = painter; }

    /** Get the z-order property */
    get Z(): number { return this._zorder; }
    /** Set the z-order property */
    set Z(value) { this._zorder = value; }

    isInDomain(d: Domain, inclusive = true) {
        if (this.x >= d.lowX && this.y >= d.lowY) {
            return inclusive ?
                (this.x <= d.highX && this.y <= d.highY) :
                (this.x < d.highX && this.y < d.highY);
        }
        return false;
    }

    fitsInside(lowX: number, lowY: number, highX: number, highY: number): boolean {
        let p = this._pos, cr = this._colRad;
        return p.x - cr >= lowX && p.x + cr <= highX && p.y - cr >= lowY && p.y + cr <= highY;
    }

    update(elapsedTime: number, world: World): void { }

    changeState(newState: State) {
        this._fsm?.changeState(newState);
    }

    revertToPreviousState() {
        this._fsm?.revertToPreviousState();
    }

    render() {
        this._painter?.call(this);
    }


    /** See if entity has FSM */
    hasFSM() {
        return this._fsm ? true : false;
    }

    colDetect(e, elist) { return false; }
}

