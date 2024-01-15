class Entity {
    constructor(position, colRadius = 1) {
        this._pos = new Vector2D();
        this._visible = true;
        this._zorder = 0;
        this._colRad = 0;
        this._type = ENTITY;
        this._id = Entity.NEXT_ID++;
        this._pos = Vector2D.from(position);
        this._colRad = colRadius;
    }
    get type() { return this._type; }
    ;
    get type$() { return Symbol.keyFor(this.type); }
    ;
    /** Position coordinates */
    get x() { return this._pos.x; }
    get y() { return this._pos.y; }
    /** Position */
    get pos() { return this._pos; }
    set pos(v) { this._pos = v; }
    setPos(v) { this._pos = v; return this; }
    /** The colision radius */
    get world() { return this._world; }
    set world(world) { this._world = world; }
    setWorld(world) { this._world = world; return this; }
    /** The colision radius */
    get colRad() { return this._colRad; }
    set colRad(value) { this._colRad = value; }
    setColRad(value) { this._colRad = value; return this; }
    /** Get the id property */
    get id() { return this._id; }
    /** The tag property */
    get tag() { return this._tag; }
    set tag(value) { this._tag = value; }
    setTag(value) { this._tag = value; return this; }
    /** The finite state machine */
    get fsm() { return this._fsm; }
    set fsm(value) { this._fsm = value; }
    setFsm(value) { this._fsm = value; return this; }
    /** Set the renderer */
    set painter(painter) { this._painter = painter; }
    setPainter(painter) { this._painter = painter; return this; }
    /** The z-order display order property */
    get Z() { return this._zorder; }
    set Z(value) { this._zorder = value; }
    fitsInside(lowX, lowY, highX, highY) {
        let p = this._pos, cr = this._colRad;
        return p.x - cr >= lowX && p.x + cr <= highX && p.y - cr >= lowY && p.y + cr <= highY;
    }
    update(elapsedTime, world) { }
    changeState(newState) { this._fsm?.changeState(newState); }
    revertToPreviousState() { this._fsm?.revertToPreviousState(); }
    hasFSM() { return this._fsm ? true : false; }
    render() { this._painter?.call(this); }
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
        let s = `${this.type$} ID: ${fmt(this.id, 0, 2)}`;
        s += ` @ [${fmt(this.x, 0, len)}, ${fmt(this.y, 0, len)}]`;
        return s;
    }
}
Entity.NEXT_ID = 0;
//# sourceMappingURL=entity.js.map