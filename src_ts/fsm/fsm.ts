class FiniteStateMachine {

    _owner: Entity;
    _currentState: State;
    _previousState: State;
    _globalState: State;

    set owner(entity: Entity) { this._owner = entity }
    get owner() { return this._owner }

    set currentState(state: State) { this._currentState = state }
    get currentState() { return this._currentState }

    set previousState(state: State) { this._previousState = state }
    get previousState() { return this._previousState }

    set globalState(state: State) { this._globalState = state }
    get globalState() { return this._globalState }

    constructor(owner: Entity, currentState?: State, previousState?: State, globalState?: State) {
        this._owner = owner;
        this._currentState = currentState;
        this._previousState = previousState;
        this._globalState = globalState;
    }

    update(elapsedTime: number, world: World) {
        // if there is a global state call it
        // this['_globalState']?.execute(this._owner, elapsedTime, world);
        this.globalState?.execute(this._owner, elapsedTime, world);
        // same with the current state
        // this['_currentState']?.execute(this._owner, elapsedTime, world);
        this._currentState?.execute(this._owner, elapsedTime, world);
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
        if (this._currentState?.onMessage(this._owner, tgram))
            return true;
        // See if the global state can accept telegram
        if (this._globalState?.onMessage(this._owner, tgram))
            return true;
        // Telegram has not been handled
        return false;
    }

    changeState(newState: State) {
        // Keep track of the previous state
        this._previousState = this._currentState;
        // Exit the current state
        this._currentState?.exit(this._owner);
        // ***********************************************************
        // Change the current state
        this._currentState = newState;
        // ***********************************************************
        // Enter the current state
        this._currentState?.enter(this._owner);
    }

    revertToPreviousState() {
        this.changeState(this._previousState);
    }
}
