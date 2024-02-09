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
var _State_name;
class State {
    constructor(name) {
        _State_name.set(this, void 0);
        if (!name)
            name = this.constructor.name;
        __classPrivateFieldSet(this, _State_name, name, "f");
        // console.log(`State name : ${this.#name}`);
    }
    set name(n) { __classPrivateFieldSet(this, _State_name, n, "f"); }
    get name() { return __classPrivateFieldGet(this, _State_name, "f"); }
    // this executes if the agent receives a message from the postman
    // returns true if telegram message is used.
    onMessage(user, tgram) { return false; }
    ;
}
_State_name = new WeakMap();
//# sourceMappingURL=state.js.map