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
var _a, _Entity_NEXT_ID, _Entity_id, _Entity_pos, _Entity_colRad, _Entity_tag, _Entity_fsm, _Entity_painter, _Entity_visible;
class Entity {
    constructor(position = Vector2D.ZERO, colRadius = 1) {
        var _b, _c, _d;
        /** Every entity should be given a unique ID number */
        _Entity_id.set(this, void 0);
        /** Position */
        _Entity_pos.set(this, new Vector2D());
        /** The colision radius */
        _Entity_colRad.set(this, 0);
        /** The tag property */
        _Entity_tag.set(this, void 0);
        /** The finite state machine */
        _Entity_fsm.set(this, void 0);
        /** Set the renderer */
        _Entity_painter.set(this, void 0);
        /** visibility */
        _Entity_visible.set(this, true);
        /** The z-order display order property */
        this.__Z = 0;
        __classPrivateFieldSet(this, _Entity_id, (__classPrivateFieldSet(_b = Entity, _a, (_d = __classPrivateFieldGet(_b, _a, "f", _Entity_NEXT_ID), _c = _d++, _d), "f", _Entity_NEXT_ID), _c), "f");
        __classPrivateFieldSet(this, _Entity_pos, Vector2D.from(position), "f");
        __classPrivateFieldSet(this, _Entity_colRad, colRadius, "f");
    }
    get id() { return __classPrivateFieldGet(this, _Entity_id, "f"); }
    get pos() { return __classPrivateFieldGet(this, _Entity_pos, "f"); }
    set pos(v) { __classPrivateFieldSet(this, _Entity_pos, v, "f"); }
    setPos(v) { __classPrivateFieldSet(this, _Entity_pos, v, "f"); return this; }
    /** Position coordinates */
    get x() { return __classPrivateFieldGet(this, _Entity_pos, "f").x; }
    get y() { return __classPrivateFieldGet(this, _Entity_pos, "f").y; }
    get colRad() { return __classPrivateFieldGet(this, _Entity_colRad, "f"); }
    set colRad(value) { __classPrivateFieldSet(this, _Entity_colRad, value, "f"); }
    setColRad(value) { __classPrivateFieldSet(this, _Entity_colRad, value, "f"); return this; }
    get tag() { return __classPrivateFieldGet(this, _Entity_tag, "f"); }
    set tag(value) { __classPrivateFieldSet(this, _Entity_tag, value, "f"); }
    setTag(value) { __classPrivateFieldSet(this, _Entity_tag, value, "f"); return this; }
    get fsm() { return __classPrivateFieldGet(this, _Entity_fsm, "f"); }
    enableFsm(owner, world) { __classPrivateFieldSet(this, _Entity_fsm, new FiniteStateMachine(owner, world), "f"); }
    ;
    set painter(painter) { __classPrivateFieldSet(this, _Entity_painter, painter, "f"); }
    setPainter(painter) { __classPrivateFieldSet(this, _Entity_painter, painter, "f"); return this; }
    show() { __classPrivateFieldSet(this, _Entity_visible, true, "f"); }
    hide() { __classPrivateFieldSet(this, _Entity_visible, false, "f"); }
    isVisible() { return __classPrivateFieldGet(this, _Entity_visible, "f"); }
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
        let p = __classPrivateFieldGet(this, _Entity_pos, "f"), cr = __classPrivateFieldGet(this, _Entity_colRad, "f");
        return p.x - cr >= lowX && p.x + cr <= highX && p.y - cr >= lowY && p.y + cr <= highY;
    }
    isEitherSide(p0, p1) {
        return Geom2D.line_circle(p0.x, p0.y, p1.x, p1.y, this.pos.x, this.pos.y, this.colRad);
    }
    update(elapsedTime, world) { }
    changeState(newState) { __classPrivateFieldGet(this, _Entity_fsm, "f")?.changeState(newState); }
    revertToPreviousState() { __classPrivateFieldGet(this, _Entity_fsm, "f")?.revertToPreviousState(); }
    hasFSM() { return __classPrivateFieldGet(this, _Entity_fsm, "f") ? true : false; }
    render(elapsedTime, world) { if (this.isVisible)
        __classPrivateFieldGet(this, _Entity_painter, "f")?.call(this, elapsedTime, world); }
    $$() {
        console.log(this.toString());
    }
    $() {
        return this.toString();
    }
    toString() {
        return `${this.constructor.name}  @  [${this.x.toFixed(2)}, ${this.y.toFixed(2)}]  Col. radius: ${this.colRad.toFixed(2)}`;
    }
}
_a = Entity, _Entity_id = new WeakMap(), _Entity_pos = new WeakMap(), _Entity_colRad = new WeakMap(), _Entity_tag = new WeakMap(), _Entity_fsm = new WeakMap(), _Entity_painter = new WeakMap(), _Entity_visible = new WeakMap();
_Entity_NEXT_ID = { value: 0 };
//# sourceMappingURL=entity.js.map