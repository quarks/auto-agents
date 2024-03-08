class Entity {
    static #NEXT_ID = 0;
    constructor(position = Vector2D.ZERO, colRadius = 1) {
        this.#id = Entity.#NEXT_ID++;
        this.#pos = Vector2D.from(position);
        this.#colRad = colRadius;
    }
    /** Every entity should be given a unique ID number */
    #id;
    get id() { return this.#id; }
    /** Position */
    #pos = new Vector2D();
    get pos() { return this.#pos; }
    set pos(v) { this.#pos = v; }
    setPos(v) { this.#pos = v; return this; }
    /** Position coordinates */
    get x() { return this.#pos.x; }
    get y() { return this.#pos.y; }
    /** The colision radius */
    #colRad = 0;
    get colRad() { return this.#colRad; }
    set colRad(value) { this.#colRad = value; }
    setColRad(value) { this.#colRad = value; return this; }
    /** The tag property */
    #tag;
    get tag() { return this.#tag; }
    set tag(value) { this.#tag = value; }
    setTag(value) { this.#tag = value; return this; }
    /** The finite state machine */
    #fsm;
    get fsm() { return this.#fsm; }
    enableFsm(owner, world) { this.#fsm = new FiniteStateMachine(owner, world); }
    ;
    /** Set the renderer */
    #painter;
    set painter(painter) { this.#painter = painter; }
    setPainter(painter) { this.#painter = painter; return this; }
    /** visibility */
    #visible = true;
    show() { this.#visible = true; }
    hide() { this.#visible = false; }
    isVisible() { return this.#visible; }
    /** The z-order display order property */
    __Z = 0;
    get Z() { return this.__Z; }
    set Z(value) { this.__Z = value; }
    /** Override this in entities reqiiring special actions e.g. Obstacle, Fence */
    born(world) {
        world.births.push(this);
    }
    /** Override this in entities reqiiring special actions e.g. Fence */
    dies(world) {
        world.deaths.push(this);
    }
    fitsInside(lowX, lowY, highX, highY) {
        let p = this.#pos, cr = this.#colRad;
        return p.x - cr >= lowX && p.x + cr <= highX && p.y - cr >= lowY && p.y + cr <= highY;
    }
    isEitherSide(p0, p1) {
        return Geom2D.line_circle(p0.x, p0.y, p1.x, p1.y, this.pos.x, this.pos.y, this.colRad);
    }
    update(elapsedTime, world) { }
    changeState(newState) { this.#fsm?.changeState(newState); }
    revertToPreviousState() { this.#fsm?.revertToPreviousState(); }
    hasFSM() { return this.#fsm ? true : false; }
    render(elapsedTime, world) { if (this.isVisible)
        this.#painter?.call(this, elapsedTime, world); }
    $$() {
        console.log(this.toString());
    }
    $() {
        return this.toString();
    }
    toString() {
        return `${this.constructor.name}  @  [${this.x.toFixed(FXD)}, ${this.y.toFixed(FXD)}]  Col. radius: ${this.colRad.toFixed(FXD)}`;
    }
}
//# sourceMappingURL=entity.js.map