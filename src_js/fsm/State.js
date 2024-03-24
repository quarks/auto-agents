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
var _State_name, _State_world;
class State {
    constructor(world, name) {
        _State_name.set(this, void 0);
        _State_world.set(this, void 0);
        if (!name)
            name = this.constructor.name;
        __classPrivateFieldSet(this, _State_name, name, "f");
        __classPrivateFieldSet(this, _State_world, world, "f");
    }
    set name(n) { __classPrivateFieldSet(this, _State_name, n, "f"); }
    get name() { return __classPrivateFieldGet(this, _State_name, "f"); }
    get world() { return __classPrivateFieldGet(this, _State_world, "f"); }
    get dispatcher() { return __classPrivateFieldGet(this, _State_world, "f").dispatcher; }
    // This will execute when the state is entered.
    enter(user) { }
    // This is the state's normal update function.
    execute(user, elapsedTime) { }
    // This will execute when the state is exited.
    exit(user) { }
    // This executes if the agent receives a message from the dispatcher.
    // returns true if telegram message is used.
    onMessage(user, tgram) { return false; }
}
_State_name = new WeakMap(), _State_world = new WeakMap();
//# sourceMappingURL=state.js.map