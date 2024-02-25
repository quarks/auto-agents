class FiniteStateMachine {

    #owner: Entity;
    get owner() { return this.#owner }

    #currentState: State;
    set currentState(state: State) { this.#currentState = state }
    get currentState() { return this.#currentState }

    #previousState: State;
    set previousState(state: State) { this.#previousState = state }
    get previousState() { return this.#previousState }

    #globalState: State;
    set globalState(state: State) { this.#globalState = state }
    get globalState() { return this.#globalState }

    constructor(owner: Entity, world: World, currentState?: State, previousState?: State, globalState?: State) {
        this.#owner = owner;
        this.#currentState = currentState;
        this.#previousState = previousState;
        this.#globalState = globalState;
    }

    update(elapsedTime: number) {
        // if there is a global state call it
        this.globalState?.execute(this.#owner, elapsedTime);
        // same with the current state
        this.#currentState?.execute(this.#owner, elapsedTime);
    }

    onMessage(tgram: Telegram): boolean {
        // See if the global state can accept telegram
        if (this.#currentState?.onMessage(this.#owner, tgram))
            return true;
        // See if the global state can accept telegram
        if (this.#globalState?.onMessage(this.#owner, tgram))
            return true;
        // Telegram has not been handled
        return false;
    }

    changeState(newState: State) {
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
