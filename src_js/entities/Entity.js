var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _a, _Entity_NEXT_ID;
class Entity {
    constructor(position, colRadius = 1) {
        var _b, _c, _d;
        this._pos = new Vector2D();
        this._visible = true;
        this._zorder = 0;
        this._colRad = 0;
        this._id = (__classPrivateFieldSet(_b = Entity, _a, (_d = __classPrivateFieldGet(_b, _a, "f", _Entity_NEXT_ID), _c = _d++, _d), "f", _Entity_NEXT_ID), _c);
        this._pos = Vector2D.from(position);
        this._colRad = colRadius;
    }
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
    isEitherSide(p0, p1) {
        return Geom2D.line_circle(p0.x, p0.y, p1.x, p1.y, this.pos.x, this.pos.y, this.colRad);
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
        let s = `${this.constructor.name} ID: ${fmt(this.id, 0, 2)}`;
        s += ` @ [${fmt(this.x, 0, len)}, ${fmt(this.y, 0, len)}]`;
        return s;
    }
}
_a = Entity;
_Entity_NEXT_ID = { value: 0 };
//# sourceMappingURL=entity.js.map