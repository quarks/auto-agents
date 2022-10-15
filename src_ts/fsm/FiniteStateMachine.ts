class FiniteStateMachine {

    owner;
    currentState;
    previousState;
    globalState;

    constructor(owner, currentState,
        previousState, globalState) {
        this.owner = owner;
        this.currentState = currentState;
        this.previousState = previousState;
        this.globalState = globalState;
    }

}