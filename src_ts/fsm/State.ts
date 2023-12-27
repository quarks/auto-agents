abstract class State {

    _name: string;

    //this will execute when the state is entered
    abstract enter(user: Entity): void;

    //this is the state's normal update function
    abstract execute(user: Entity, elapsedTime: number, world: any): void;
    // world is of type World

    // this will execute when the state is exited.
    abstract exit(user: Entity): void;

    // this executes if the agent receives a message from the postman
    // returns true if telegram message is used.
    onMessage(user: Entity, tgram: Telegram): boolean { return false; };

    constructor(name?: string) {
        if (!name)
            name = this.constructor.name;
        this._name = name;
        console.log(`State name : ${this._name}`);
    }

}

