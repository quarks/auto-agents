class FiniteStateMachine {
    #owner;
    get owner() { return this.#owner; }
    #currentState;
    set currentState(state) { this.#currentState = state; }
    get currentState() { return this.#currentState; }
    #previousState;
    set previousState(state) { this.#previousState = state; }
    get previousState() { return this.#previousState; }
    #globalState;
    set globalState(state) { this.#globalState = state; }
    get globalState() { return this.#globalState; }
    constructor(owner, world, currentState, previousState, globalState) {
        this.#owner = owner;
        this.#currentState = currentState;
        this.#previousState = previousState;
        this.#globalState = globalState;
    }
    update(elapsedTime) {
        // if there is a global state call it
        this.globalState?.execute(this.#owner, elapsedTime);
        // same with the current state
        this.#currentState?.execute(this.#owner, elapsedTime);
    }
    onMessage(tgram) {
        // See if the global state can accept telegram
        if (this.#currentState?.onMessage(this.#owner, tgram))
            return true;
        // See if the global state can accept telegram
        if (this.#globalState?.onMessage(this.#owner, tgram))
            return true;
        // Telegram has not been handled
        return false;
    }
    changeState(newState) {
        // Keep track of the previous state
        this.#previousState = this.#currentState;
        // Exit the current state
        this.#currentState?.exit(this.#owner);
        // Change the current state
        this.#currentState = newState;
        // Enter the new current state
        this.#currentState?.enter(this.#owner);
    }
    revertToPreviousState() {
        this.changeState(this.#previousState);
    }
}
//# sourceMappingURL=fsm.js.map