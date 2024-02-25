class State {
    #name;
    set name(n) { this.#name = n; }
    get name() { return this.#name; }
    #world;
    get world() { return this.#world; }
    // This will execute when the state is entered.
    enter(user) { }
    ;
    // This is the state's normal update function.
    execute(user, elapsedTime) { }
    // This will execute when the state is exited.
    exit(user) { }
    // This executes if the agent receives a message from the dispatcher.
    // returns true if telegram message is used.
    onMessage(user, tgram) { return false; }
    constructor(world, name) {
        if (!name)
            name = this.constructor.name;
        this.#name = name;
        this.#world = world;
    }
}
//# sourceMappingURL=state.js.map