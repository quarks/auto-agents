abstract class Entity {

    static #NEXT_ID = 0;

    constructor(position: Array<number> | _XY_, colRadius = 1) {
        this.#id = Entity.#NEXT_ID++;
        this.#pos = Vector2D.from(position);
        this._colRad = colRadius;
    }

    /** Every entity should be given a unique ID number */
    #id: number;
    get id(): number { return this.#id; }

    /** Position */
    #pos: Vector2D = new Vector2D();
    get pos(): Vector2D { return this.#pos }
    set pos(v: Vector2D) { this.#pos = v; }
    setPos(v: Vector2D) { this.#pos = v; return this; }
    /** Position coordinates */
    get x(): number { return this.#pos.x; }
    get y(): number { return this.#pos.y; }

    /** The colision radius */
    #world: World;
    get world(): World { return this.#world; }
    set world(world: World) { this.#world = world; }

    /** The colision radius */
    _colRad: number = 0;
    get colRad(): number { return this._colRad; }
    set colRad(value) { this._colRad = value; }
    setColRad(value: number): Entity { this._colRad = value; return this; }

    /** The tag property */
    #tag: string | number;
    get tag(): string | number { return this.#tag; }
    set tag(value) { this.#tag = value; }
    setTag(value: number | number): Entity { this.#tag = value; return this; }

    /** The finite state machine */
    #fsm: FiniteStateMachine;
    get fsm(): FiniteStateMachine { return this.#fsm; }
    set fsm(value) { this.#fsm = value; }
    setFsm(value: FiniteStateMachine): Entity { this.#fsm = value; return this; }

    /** Set the renderer */
    #painter: Function;
    set painter(painter: Function) { this.#painter = painter; }
    setPainter(painter: Function): Entity { this.#painter = painter; return this; }

    /** visibility */
    #visible = true;
    show() { this.#visible = true; }
    hide() { this.#visible = false; }
    isVisible() { return this.#visible; }

    /** The z-order display order property */
    #zorder: number = 0;
    get Z(): number { return this.#zorder; }
    set Z(value) { this.#zorder = value; }

    fitsInside(lowX: number, lowY: number, highX: number, highY: number): boolean {
        let p = this.#pos, cr = this._colRad;
        return p.x - cr >= lowX && p.x + cr <= highX && p.y - cr >= lowY && p.y + cr <= highY;
    }

    isEitherSide(p0: Vector2D, p1: Vector2D): boolean {
        return Geom2D.line_circle(p0.x, p0.y, p1.x, p1.y,
            this.pos.x, this.pos.y, this.colRad);
    }

    update(elapsedTime: number, world: World): void { }

    changeState(newState: State) { this.#fsm?.changeState(newState); }

    revertToPreviousState() { this.#fsm?.revertToPreviousState(); }

    hasFSM() { return this.#fsm ? true : false; }

    render() { if (this.isVisible) this.#painter?.call(this); }

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

