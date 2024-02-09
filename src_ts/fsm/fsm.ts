class FiniteStateMachine {

    #owner: Entity;
    set owner(entity: Entity) { this.#owner = entity }
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

    constructor(owner: Entity, currentState?: State, previousState?: State, globalState?: State) {
        this.#owner = owner;
        this.#currentState = currentState;
        this.#previousState = previousState;
        this.#globalState = globalState;
    }

    update(elapsedTime: number, world: World) {
        // if there is a global state call it
        // this['_globalState']?.execute(this._owner, elapsedTime, world);
        this.globalState?.execute(this.#owner, elapsedTime, world);
        // same with the current state
        // this['_currentState']?.execute(this._owner, elapsedTime, world);
        this.#currentState?.execute(this.#owner, elapsedTime, world);
    }

    // onMessage(tgram: Telegram): boolean {
    //     // See if the global state can accept telegram
    //     if (this._currentState && this._currentState.onMessage(this._owner, tgram))
    //         return true;
    //     // See if the global state can accept telegram
    //     if (this._globalState && this._globalState.onMessage(this._owner, tgram))
    //         return true;
    //     // Telegram has not been handled
    //     return false;
    // }
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
        // ***********************************************************
        // Change the current state
        this.#currentState = newState;
        // ***********************************************************
        // Enter the current state
        this.#currentState?.enter(this.#owner);
    }

    revertToPreviousState() {
        this.changeState(this.#previousState);
    }
}
