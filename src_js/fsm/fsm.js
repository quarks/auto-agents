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
var _FiniteStateMachine_owner, _FiniteStateMachine_currentState, _FiniteStateMachine_previousState, _FiniteStateMachine_globalState;
class FiniteStateMachine {
    constructor(owner, world, currentState, previousState, globalState) {
        _FiniteStateMachine_owner.set(this, void 0);
        _FiniteStateMachine_currentState.set(this, void 0);
        _FiniteStateMachine_previousState.set(this, void 0);
        _FiniteStateMachine_globalState.set(this, void 0);
        __classPrivateFieldSet(this, _FiniteStateMachine_owner, owner, "f");
        __classPrivateFieldSet(this, _FiniteStateMachine_currentState, currentState, "f");
        __classPrivateFieldSet(this, _FiniteStateMachine_previousState, previousState, "f");
        __classPrivateFieldSet(this, _FiniteStateMachine_globalState, globalState, "f");
    }
    get owner() { return __classPrivateFieldGet(this, _FiniteStateMachine_owner, "f"); }
    set currentState(state) { __classPrivateFieldSet(this, _FiniteStateMachine_currentState, state, "f"); }
    get currentState() { return __classPrivateFieldGet(this, _FiniteStateMachine_currentState, "f"); }
    set previousState(state) { __classPrivateFieldSet(this, _FiniteStateMachine_previousState, state, "f"); }
    get previousState() { return __classPrivateFieldGet(this, _FiniteStateMachine_previousState, "f"); }
    set globalState(state) { __classPrivateFieldSet(this, _FiniteStateMachine_globalState, state, "f"); }
    get globalState() { return __classPrivateFieldGet(this, _FiniteStateMachine_globalState, "f"); }
    update(elapsedTime) {
        // if there is a global state call it
        this.globalState?.execute(__classPrivateFieldGet(this, _FiniteStateMachine_owner, "f"), elapsedTime);
        // same with the current state
        __classPrivateFieldGet(this, _FiniteStateMachine_currentState, "f")?.execute(__classPrivateFieldGet(this, _FiniteStateMachine_owner, "f"), elapsedTime);
    }
    onMessage(tgram) {
        // See if the global state can accept telegram
        if (__classPrivateFieldGet(this, _FiniteStateMachine_currentState, "f")?.onMessage(__classPrivateFieldGet(this, _FiniteStateMachine_owner, "f"), tgram))
            return true;
        // See if the global state can accept telegram
        if (__classPrivateFieldGet(this, _FiniteStateMachine_globalState, "f")?.onMessage(__classPrivateFieldGet(this, _FiniteStateMachine_owner, "f"), tgram))
            return true;
        // Telegram has not been handled
        return false;
    }
    changeState(newState) {
        // Keep track of the previous state
        __classPrivateFieldSet(this, _FiniteStateMachine_previousState, __classPrivateFieldGet(this, _FiniteStateMachine_currentState, "f"), "f");
        // Exit the current state
        __classPrivateFieldGet(this, _FiniteStateMachine_currentState, "f")?.exit(__classPrivateFieldGet(this, _FiniteStateMachine_owner, "f"));
        // Change the current state
        __classPrivateFieldSet(this, _FiniteStateMachine_currentState, newState, "f");
        // Enter the new current state
        __classPrivateFieldGet(this, _FiniteStateMachine_currentState, "f")?.enter(__classPrivateFieldGet(this, _FiniteStateMachine_owner, "f"));
    }
    revertToPreviousState() {
        this.changeState(__classPrivateFieldGet(this, _FiniteStateMachine_previousState, "f"));
    }
}
_FiniteStateMachine_owner = new WeakMap(), _FiniteStateMachine_currentState = new WeakMap(), _FiniteStateMachine_previousState = new WeakMap(), _FiniteStateMachine_globalState = new WeakMap();
//# sourceMappingURL=fsm.js.map