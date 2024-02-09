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
var _Artefact_lowX, _Artefact_highX, _Artefact_lowY, _Artefact_highY, _Artefact_width, _Artefact_height;
class Artefact extends Entity {
    constructor(center, width, height) {
        super(center);
        _Artefact_lowX.set(this, void 0);
        _Artefact_highX.set(this, void 0);
        _Artefact_lowY.set(this, void 0);
        _Artefact_highY.set(this, void 0);
        _Artefact_width.set(this, void 0);
        _Artefact_height.set(this, void 0);
        __classPrivateFieldSet(this, _Artefact_width, width, "f");
        __classPrivateFieldSet(this, _Artefact_height, height, "f");
        __classPrivateFieldSet(this, _Artefact_lowX, center.x - width / 2, "f");
        __classPrivateFieldSet(this, _Artefact_lowY, center.y - height / 2, "f");
        __classPrivateFieldSet(this, _Artefact_highX, center.x + width / 2, "f");
        __classPrivateFieldSet(this, _Artefact_highY, center.y + height / 2, "f");
    }
    fits_inside(lowX, lowY, highX, highY) {
        let fits = (__classPrivateFieldGet(this, _Artefact_lowX, "f") >= lowX) && (__classPrivateFieldGet(this, _Artefact_highX, "f") <= highX)
            && (__classPrivateFieldGet(this, _Artefact_lowY, "f") >= lowY) && (__classPrivateFieldGet(this, _Artefact_highY, "f") <= highY);
        return fits;
    }
    render() { }
    toString() {
        let s = `Artefact: [${__classPrivateFieldGet(this, _Artefact_lowX, "f")}, ${__classPrivateFieldGet(this, _Artefact_lowY, "f")}] - [${__classPrivateFieldGet(this, _Artefact_highX, "f")}, ${__classPrivateFieldGet(this, _Artefact_highY, "f")}]`;
        s += `    Size: ${__classPrivateFieldGet(this, _Artefact_width, "f")} x ${__classPrivateFieldGet(this, _Artefact_height, "f")}`;
        return s;
    }
}
_Artefact_lowX = new WeakMap(), _Artefact_highX = new WeakMap(), _Artefact_lowY = new WeakMap(), _Artefact_highY = new WeakMap(), _Artefact_width = new WeakMap(), _Artefact_height = new WeakMap();
//# sourceMappingURL=artefact.js.map