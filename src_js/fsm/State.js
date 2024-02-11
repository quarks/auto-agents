class State {
    #name;
    set name(n) { this.#name = n; }
    get name() { return this.#name; }
    // this executes if the agent receives a message from the postman
    // returns true if telegram message is used.
    onMessage(user, tgram) { return false; }
    ;
    constructor(name) {
        if (!name)
            name = this.constructor.name;
        this.#name = name;
        // console.log(`State name : ${this.#name}`);
    }
}
//# sourceMappingURL=state.js.map