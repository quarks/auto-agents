abstract class State {


    name: string = '';

    //this will execute when the state is entered
    abstract enter(user: Entity): void;

    //this is the state's normal update function
    abstract execute(user: Entity, deltaTime: number, world: any): void;
    // world is of type World

    // this will execute when the state is exited.
    abstract exit(user: Entity): void;

    //this executes if the agent receives a message from the message dispatcher
    abstract onMessage(user: Entity, tgram: any): boolean;
    //tgram is of type Telegram

}

