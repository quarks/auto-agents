abstract class Entity {

    static #NEXT_ID = 0;

    _id: number;
    _tag: string | number
    _world: World;

    _pos: Vector2D = new Vector2D();
    _fsm: FiniteStateMachine;
    _painter: Function;
    _visible = true;

    _zorder: number = 0;
    _colRad: number = 0;

    constructor(position: Array<number> | _XY_, colRadius = 1) {
        this._id = Entity.#NEXT_ID++;
        this._pos = Vector2D.from(position);
        this._colRad = colRadius;
    }

    /** Position coordinates */
    get x(): number { return this._pos.x; }
    get y(): number { return this._pos.y; }
    /** Position */
    get pos(): Vector2D { return this._pos }
    set pos(v: Vector2D) { this._pos = v; }
    setPos(v: Vector2D) { this._pos = v; return this; }

    /** The colision radius */
    get world(): World { return this._world; }
    set world(world: World) { this._world = world; }
    setWorld(world: World): Entity { this._world = world; return this; }

    /** The colision radius */
    get colRad(): number { return this._colRad; }
    set colRad(value) { this._colRad = value; }
    setColRad(value: number): Entity { this._colRad = value; return this; }

    /** Get the id property */
    get id(): number { return this._id; }

    /** The tag property */
    get tag(): string | number { return this._tag; }
    set tag(value) { this._tag = value; }
    setTag(value: number | number): Entity { this._tag = value; return this; }

    /** The finite state machine */
    get fsm(): FiniteStateMachine { return this._fsm; }
    set fsm(value) { this._fsm = value; }
    setFsm(value: FiniteStateMachine): Entity { this._fsm = value; return this; }

    /** Set the renderer */
    set painter(painter: Function) { this._painter = painter; }
    setPainter(painter: Function): Entity { this._painter = painter; return this; }

    /** The z-order display order property */
    get Z(): number { return this._zorder; }
    set Z(value) { this._zorder = value; }

    fitsInside(lowX: number, lowY: number, highX: number, highY: number): boolean {
        let p = this._pos, cr = this._colRad;
        return p.x - cr >= lowX && p.x + cr <= highX && p.y - cr >= lowY && p.y + cr <= highY;
    }

    isEitherSide(p0: Vector2D, p1: Vector2D): boolean {
        return Geom2D.line_circle(p0.x, p0.y, p1.x, p1.y,
            this.pos.x, this.pos.y, this.colRad);
    }

    update(elapsedTime: number, world: World): void { }

    changeState(newState: State) { this._fsm?.changeState(newState); }

    revertToPreviousState() { this._fsm?.revertToPreviousState(); }

    hasFSM() { return this._fsm ? true : false; }

    render() { this._painter?.call(this); }

    $$(len: number = 5) {
        console.log(this.$(len));
        return this.toString(len);
    }

    $(len: number = 5): string {
        return this.toString(len);
    }

    toString(len: number = 5): string {
        function fmt(n: number, nd: number, bufferLength: number) {
            let s = n.toFixed(nd).toString();
            while (s.length < bufferLength) s = ' ' + s;
            return s;
        }
        let s = `${this.constructor.name} ID: ${fmt(this.id, 0, 2)}`;
        s += ` @ [${fmt(this.x, 0, len)}, ${fmt(this.y, 0, len)}]`;
        return s;
    }
}

