var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Wall_start, _Wall_end, _Wall_norm, _Wall_repelSide;
class Wall extends Entity {
    constructor(start, end, repelSide = BOTH_SIDES) {
        let vs = Vector2D.from(start), ve = Vector2D.from(end);
        super(vs.add(ve).div(2), 1);
        _Wall_start.set(this, void 0);
        _Wall_end.set(this, void 0);
        _Wall_norm.set(this, void 0);
        _Wall_repelSide.set(this, void 0);
        this.Z = 64;
        __classPrivateFieldSet(this, _Wall_start, vs, "f");
        __classPrivateFieldSet(this, _Wall_end, ve, "f");
        __classPrivateFieldSet(this, _Wall_norm, new Vector2D(-(__classPrivateFieldGet(this, _Wall_end, "f").y - __classPrivateFieldGet(this, _Wall_start, "f").y), __classPrivateFieldGet(this, _Wall_end, "f").x - __classPrivateFieldGet(this, _Wall_start, "f").x), "f");
        __classPrivateFieldSet(this, _Wall_norm, __classPrivateFieldGet(this, _Wall_norm, "f").normalize(), "f");
        this.repelSide = repelSide;
    }
    get start() { return __classPrivateFieldGet(this, _Wall_start, "f"); }
    ;
    get end() { return __classPrivateFieldGet(this, _Wall_end, "f"); }
    ;
    get norm() { return __classPrivateFieldGet(this, _Wall_norm, "f"); }
    ;
    setRepelSide(s) { __classPrivateFieldSet(this, _Wall_repelSide, s, "f"); return this; }
    set repelSide(s) { __classPrivateFieldSet(this, _Wall_repelSide, s, "f"); }
    get repelSide() { return __classPrivateFieldGet(this, _Wall_repelSide, "f"); }
    fitsInside(lowX, lowY, highX, highY) {
        let x0 = Math.min(this.start.x, this.end.x), y0 = Math.min(this.start.y, this.end.y);
        let x1 = Math.max(this.start.x, this.end.x), y1 = Math.max(this.start.y, this.end.y);
        return x0 >= lowX && y0 >= lowY && x1 <= highX && y1 <= highY;
    }
    isEitherSide(p0, p1) {
        return Geom2D.line_line(p0.x, p0.y, p1.x, p1.y, this.start.x, this.start.y, this.end.x, this.end.y);
    }
    toString() {
        let s = `${this.constructor.name}  @  [${this.start.x.toFixed(2)}, ${this.start.y.toFixed(2)}]  `;
        s += `from [${this.start.x.toFixed(2)}, ${this.start.y.toFixed(2)}]  `;
        s += `to [${this.end.x.toFixed(2)}, ${this.end.y.toFixed(2)}]  `;
        return s;
    }
}
_Wall_start = new WeakMap(), _Wall_end = new WeakMap(), _Wall_norm = new WeakMap(), _Wall_repelSide = new WeakMap();
//# sourceMappingURL=wall.js.map