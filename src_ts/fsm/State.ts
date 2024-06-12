class State {

    #name: string;
    set name(n: string) { this.#name = n; }
    get name(): string { return this.#name; }

    #world: World;
    get world() { return this.#world; }

    // This will execute when the state is entered.
    enter(user: Entity): void { }

    // This is the state's normal update function.
    execute(user: Entity, elapsedTime: number): void { }

    // This will execute when the state is exited.
    exit(user: Entity): void { }

    // This executes if the agent receives a message from the dispatcher.
    // returns true if telegram message is used.
    onMessage(user: Entity, tgram: Telegram): boolean { return false; }

    sendMessage(delay: number, sender: number | Entity, receiver: number | Entity, msg: number, extraInfo?: object) {
        this.#world.dispatcher.postTelegram(delay, sender, receiver, msg, extraInfo);
    }

    constructor(world: World, name?: string) {
        if (!name) name = this.constructor.name;
        this.#name = name;
        this.#world = world;
    }
}

