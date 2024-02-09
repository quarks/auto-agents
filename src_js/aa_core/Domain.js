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
var _Domain_lowX, _Domain_highX, _Domain_lowY, _Domain_highY, _Domain_cX, _Domain_cY, _Domain_width, _Domain_height, _Domain_constraint;
class Domain {
    constructor(lowX, lowY, highX, highY, constraint = REBOUND) {
        _Domain_lowX.set(this, void 0);
        _Domain_highX.set(this, void 0);
        _Domain_lowY.set(this, void 0);
        _Domain_highY.set(this, void 0);
        _Domain_cX.set(this, void 0);
        _Domain_cY.set(this, void 0);
        _Domain_width.set(this, void 0);
        _Domain_height.set(this, void 0);
        _Domain_constraint.set(this, REBOUND);
        __classPrivateFieldSet(this, _Domain_lowX, lowX, "f");
        __classPrivateFieldSet(this, _Domain_lowY, lowY, "f");
        __classPrivateFieldSet(this, _Domain_highX, highX, "f");
        __classPrivateFieldSet(this, _Domain_highY, highY, "f");
        __classPrivateFieldSet(this, _Domain_width, highX - lowX, "f");
        __classPrivateFieldSet(this, _Domain_height, highY - lowY, "f");
        __classPrivateFieldSet(this, _Domain_cX, (lowX + highX) / 2, "f");
        __classPrivateFieldSet(this, _Domain_cY, (lowY + highY) / 2, "f");
        __classPrivateFieldSet(this, _Domain_constraint, constraint, "f");
    }
    /**
     * Create a Domain object given the top-left and bottom-right coordinates.
     * @param lowX
     * @param lowY
     * @param highX
     * @param highY
     */
    // Domain attribute getters
    get lowX() { return __classPrivateFieldGet(this, _Domain_lowX, "f"); }
    get highX() { return __classPrivateFieldGet(this, _Domain_highX, "f"); }
    get lowY() { return __classPrivateFieldGet(this, _Domain_lowY, "f"); }
    get highY() { return __classPrivateFieldGet(this, _Domain_highY, "f"); }
    get cX() { return __classPrivateFieldGet(this, _Domain_cX, "f"); }
    get cY() { return __classPrivateFieldGet(this, _Domain_cY, "f"); }
    get width() { return __classPrivateFieldGet(this, _Domain_width, "f"); }
    get height() { return __classPrivateFieldGet(this, _Domain_height, "f"); }
    get constraint() { return __classPrivateFieldGet(this, _Domain_constraint, "f"); }
    set constraint(c) {
        if (c == REBOUND || c == WRAP || c == PASS_THROUGH)
            __classPrivateFieldSet(this, _Domain_constraint, c, "f");
    }
    setConstraint(c) {
        if (c == REBOUND || c == WRAP || c == PASS_THROUGH)
            __classPrivateFieldSet(this, _Domain_constraint, c, "f");
    }
    /** returns a copy of this domain object */
    copy() {
        return new Domain(__classPrivateFieldGet(this, _Domain_lowX, "f"), __classPrivateFieldGet(this, _Domain_lowY, "f"), __classPrivateFieldGet(this, _Domain_highX, "f"), __classPrivateFieldGet(this, _Domain_highY, "f"), __classPrivateFieldGet(this, _Domain_constraint, "f"));
    }
    /**
     * Create a Domain that is a copy of another one.
     * @param d domain to be copied
     */
    set_d(d) {
        __classPrivateFieldSet(this, _Domain_lowX, __classPrivateFieldGet(d, _Domain_lowX, "f"), "f");
        __classPrivateFieldSet(this, _Domain_lowY, __classPrivateFieldGet(d, _Domain_lowY, "f"), "f");
        __classPrivateFieldSet(this, _Domain_highX, __classPrivateFieldGet(d, _Domain_highX, "f"), "f");
        __classPrivateFieldSet(this, _Domain_highY, __classPrivateFieldGet(d, _Domain_highY, "f"), "f");
        __classPrivateFieldSet(this, _Domain_width, __classPrivateFieldGet(d, _Domain_width, "f"), "f");
        __classPrivateFieldSet(this, _Domain_height, __classPrivateFieldGet(d, _Domain_height, "f"), "f");
        __classPrivateFieldSet(this, _Domain_cX, __classPrivateFieldGet(d, _Domain_cX, "f"), "f");
        __classPrivateFieldSet(this, _Domain_cY, __classPrivateFieldGet(d, _Domain_cY, "f"), "f");
        __classPrivateFieldSet(this, _Domain_constraint, __classPrivateFieldGet(d, _Domain_constraint, "f"), "f");
    }
    /**
     * Set the domain size.
     * @param lowX top-left x coordinate
     * @param lowY top-left y coordinate
     * @param width domain width
     * @param height domain height
     */
    set_xywh(lowX, lowY, width, height) {
        __classPrivateFieldSet(this, _Domain_lowX, lowX, "f");
        __classPrivateFieldSet(this, _Domain_lowY, lowY, "f");
        __classPrivateFieldSet(this, _Domain_width, width, "f");
        __classPrivateFieldSet(this, _Domain_height, height, "f");
        __classPrivateFieldSet(this, _Domain_highX, lowX + width, "f");
        __classPrivateFieldSet(this, _Domain_highY, lowY + height, "f");
        __classPrivateFieldSet(this, _Domain_cX, (__classPrivateFieldGet(this, _Domain_lowX, "f") + __classPrivateFieldGet(this, _Domain_highX, "f")) / 2, "f");
        __classPrivateFieldSet(this, _Domain_cY, (__classPrivateFieldGet(this, _Domain_lowY, "f") + __classPrivateFieldGet(this, _Domain_highY, "f")) / 2, "f");
    }
    /**
     * Centre the domain about the given world position.
     * @param wx world x position
     * @param wy world y position
     */
    move_centre_xy_to(wx, wy) {
        __classPrivateFieldSet(this, _Domain_cX, wx, "f");
        __classPrivateFieldSet(this, _Domain_cY, wy, "f");
        __classPrivateFieldSet(this, _Domain_lowX, __classPrivateFieldGet(this, _Domain_cX, "f") - __classPrivateFieldGet(this, _Domain_width, "f") / 2, "f");
        __classPrivateFieldSet(this, _Domain_lowY, __classPrivateFieldGet(this, _Domain_cY, "f") - __classPrivateFieldGet(this, _Domain_height, "f") / 2, "f");
        __classPrivateFieldSet(this, _Domain_highX, __classPrivateFieldGet(this, _Domain_lowX, "f") + __classPrivateFieldGet(this, _Domain_width, "f"), "f");
        __classPrivateFieldSet(this, _Domain_highY, __classPrivateFieldGet(this, _Domain_lowY, "f") + __classPrivateFieldGet(this, _Domain_height, "f"), "f");
    }
    /**
     * Centre the domain about the given horizontal position.
     * @param wx world x position
     */
    move_centre_x_to(wx) {
        this.move_centre_xy_to(wx, __classPrivateFieldGet(this, _Domain_cY, "f"));
    }
    /**
     * Centre the domain about the given vertical position.
     * @param wy world y position
     */
    move_centre_y_to(wy) {
        this.move_centre_xy_to(__classPrivateFieldGet(this, _Domain_cX, "f"), wy);
    }
    /**
     * Centre the domain about the given position.
     * @param wx world x centre position
     * @param wy world y centre position
     */
    move_centre_xy_by(wx, wy) {
        __classPrivateFieldSet(this, _Domain_cX, __classPrivateFieldGet(this, _Domain_cX, "f") - wx, "f");
        __classPrivateFieldSet(this, _Domain_cY, __classPrivateFieldGet(this, _Domain_cY, "f") - wy, "f");
        __classPrivateFieldSet(this, _Domain_lowX, __classPrivateFieldGet(this, _Domain_lowX, "f") - wx, "f");
        __classPrivateFieldSet(this, _Domain_lowY, __classPrivateFieldGet(this, _Domain_lowY, "f") - wy, "f");
        __classPrivateFieldSet(this, _Domain_highX, __classPrivateFieldGet(this, _Domain_lowX, "f") + __classPrivateFieldGet(this, _Domain_width, "f"), "f");
        __classPrivateFieldSet(this, _Domain_highY, __classPrivateFieldGet(this, _Domain_lowY, "f") + __classPrivateFieldGet(this, _Domain_height, "f"), "f");
    }
    /**
     * Move the domain centre horizontally by the world distance given.
     * @param wx world x centre position
     */
    move_centre_x_by(wx) {
        this.move_centre_xy_by(wx, 0);
    }
    /**
     * Move the domain centre vertically by the world distance given.
     * @param wy world y centre position
     */
    move_centre_y_by(wy) {
        this.move_centre_xy_by(0, wy);
    }
    /**
     * See if this point is within the domain
     * @param x the x position or point to test
     * @param y the y position (optional)
     * @return true if the point is on or inside the boundary of this domain
     */
    contains(x, y) {
        if (x instanceof Vector2D) {
            y = x.y;
            x = x.x;
        }
        return (x >= __classPrivateFieldGet(this, _Domain_lowX, "f") && x <= __classPrivateFieldGet(this, _Domain_highX, "f") && y >= __classPrivateFieldGet(this, _Domain_lowY, "f") && y <= __classPrivateFieldGet(this, _Domain_highY, "f"));
    }
    /**
     * See if this point is within a box scaled by the second parameter. <br>
     * fraction must be >0 otherwise the function always returns false. A value
     * of 1 will test against the full size domain and a value of 0.5 means the
     * point p must be in the middle half both horizontally and vertically. <br>
     *
     * @param p the point to test
     * @param fraction the scale of the domain to consider
     * @return true if the point is on or inside the boundary of this scaled domain
     */
    // contains(p: Vector2D, fraction: number = 1) {
    // 	let dx = Math.abs(p.x - this.centre.x) / this.width;
    // 	let dy = Math.abs(p.y - this.centre.y) / this.height;
    // 	return (dx < fraction && dy < fraction);
    // }
    /**
     * Return the Domain as a String
     */
    toString() {
        let s = `Domain from ${__classPrivateFieldGet(this, _Domain_lowX, "f")}, ${__classPrivateFieldGet(this, _Domain_lowY, "f")} to ${__classPrivateFieldGet(this, _Domain_highX, "f")}, ${__classPrivateFieldGet(this, _Domain_highY, "f")}  `;
        s += `Size ${__classPrivateFieldGet(this, _Domain_width, "f")}, ${__classPrivateFieldGet(this, _Domain_height, "f")}  `;
        s += `Constraint: ${Symbol.keyFor(__classPrivateFieldGet(this, _Domain_constraint, "f"))}`;
        return s;
    }
}
_Domain_lowX = new WeakMap(), _Domain_highX = new WeakMap(), _Domain_lowY = new WeakMap(), _Domain_highY = new WeakMap(), _Domain_cX = new WeakMap(), _Domain_cY = new WeakMap(), _Domain_width = new WeakMap(), _Domain_height = new WeakMap(), _Domain_constraint = new WeakMap();
//# sourceMappingURL=domain.js.map