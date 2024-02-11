class Entity {
    static #NEXT_ID = 0;
    constructor(position, colRadius = 1) {
        this.#id = Entity.#NEXT_ID++;
        this.#pos = Vector2D.from(position);
        this._colRad = colRadius;
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
    #world;
    get world() { return this.#world; }
    set world(world) { this.#world = world; }
    /** The colision radius */
    _colRad = 0;
    get colRad() { return this._colRad; }
    set colRad(value) { this._colRad = value; }
    setColRad(value) { this._colRad = value; return this; }
    /** The tag property */
    #tag;
    get tag() { return this.#tag; }
    set tag(value) { this.#tag = value; }
    setTag(value) { this.#tag = value; return this; }
    /** The finite state machine */
    #fsm;
    get fsm() { return this.#fsm; }
    set fsm(value) { this.#fsm = value; }
    setFsm(value) { this.#fsm = value; return this; }
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
    #zorder = 0;
    get Z() { return this.#zorder; }
    set Z(value) { this.#zorder = value; }
    born(births, world) {
        births.push(this);
    }
    dies(deaths, world) {
        deaths.push(this);
    }
    fitsInside(lowX, lowY, highX, highY) {
        let p = this.#pos, cr = this._colRad;
        return p.x - cr >= lowX && p.x + cr <= highX && p.y - cr >= lowY && p.y + cr <= highY;
    }
    isEitherSide(p0, p1) {
        return Geom2D.line_circle(p0.x, p0.y, p1.x, p1.y, this.pos.x, this.pos.y, this.colRad);
    }
    update(elapsedTime, world) { }
    changeState(newState) { this.#fsm?.changeState(newState); }
    revertToPreviousState() { this.#fsm?.revertToPreviousState(); }
    hasFSM() { return this.#fsm ? true : false; }
    render() { if (this.isVisible)
        this.#painter?.call(this); }
    $$(len = 5) {
        console.log(this.$(len));
        return this.toString(len);
    }
    $(len = 5) {
        return this.toString(len);
    }
    toString(len = 5) {
        function fmt(n, nd, bufferLength) {
            let s = n.toFixed(nd).toString();
            while (s.length < bufferLength)
                s = ' ' + s;
            return s;
        }
        let s = `${this.constructor.name} ID: ${fmt(this.id, 0, 2)}`;
        s += ` @ [${fmt(this.x, 0, len)}, ${fmt(this.y, 0, len)}]`;
        return s;
    }
}
//# sourceMappingURL=entity.js.map