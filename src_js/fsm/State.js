class State {
    constructor(name) {
        if (!name)
            name = this.constructor.name;
        this._name = name;
        console.log(`State name : ${this._name}`);
    }
    // this executes if the agent receives a message from the postman
    // returns true if telegram message is used.
    onMessage(user, tgram) { return false; }
    ;
}
//# sourceMappingURL=state.js.map