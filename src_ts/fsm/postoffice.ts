/**
 * A message that can be passed between entities.
 * 
 * Internally the dispatch time is measured in ms
 */
class Telegram {
    #sender: Entity;
    get sender(): Entity { return this.#sender; }

    #receiver: Entity;
    get receiver(): Entity { return this.#receiver; }

    #msgID: number;
    get msgID(): number { return this.#msgID; }

    #dispatchAt: number;
    get dispatchAt(): number { return this.#dispatchAt; }

    #extraInfo: object;
    get extraInfo(): object { return this.#extraInfo; }

    constructor(dispatchAt: number, sender: Entity, receiver: Entity, msg: number, extraInfo?: object) {
        this.#dispatchAt = dispatchAt;
        this.#sender = sender;
        this.#receiver = receiver;
        this.#msgID = msg;
        this.#extraInfo = extraInfo;
    }
}

/**
 * Responcible for receiving, storing and dispatching telegrams.
 */
class Dispatcher {
    #telegrams: Array<Telegram>;
    #world: World;

    constructor(world: World) {
        this.#world = world;
        this.#telegrams = [];
    }

    /**
     * Receive telegram details for later delivery.
     * @param delay time to wait before sending to receiver (seconds)
     * @param sender sender or sender id
     * @param receiver receiver or receiver id
     * @param msgID message ID (integer number set in constants)
     * @param extraInfo optional object holding any extra information for receiver
     */
    postTelegram(delay: number, sender: number | Entity, receiver: number | Entity, msgID: number, extraInfo?: object) {
        let pop = this.#world.populationMap;
        sender = sender instanceof Entity ? sender : pop.get(sender);
        receiver = receiver instanceof Entity ? receiver : pop.get(receiver);
        if (sender && receiver && receiver.hasFSM()) {
            let desptachAt = Date.now() / 1000 + delay;
            let tgram = new Telegram(desptachAt, sender, receiver, msgID, extraInfo);
            this.#telegrams.push(tgram);
        }
    }

    /** Send telegram and remove from them from postbag */
    update(elapsedTime: number) {
        let presentTime = Date.now() / 1000;
        let toSend = this.#telegrams.filter(x => x.dispatchAt <= presentTime);
        if (toSend.length > 0) {
            // Remove these from waiting telegrams
            this.#telegrams = this.#telegrams.filter(x => x.dispatchAt > presentTime);
            // Make sure telegrams are dispatched in chronological order
            toSend.sort((a, b) => a.dispatchAt - b.dispatchAt);
            toSend.forEach(tgram => { tgram.receiver.fsm.onMessage(tgram); });
        }
    }
}