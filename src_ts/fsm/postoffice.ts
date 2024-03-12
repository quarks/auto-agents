/**
 * A message that can be passed between entities.
 */
class Telegram {
    #sender: Entity;
    get sender(): Entity { return this.#sender; }

    #receiver: Entity;
    get receiver(): Entity { return this.#receiver; }

    #msgID: number;
    get msgID(): number { return this.#msgID; }

    #delay: number;
    get delay(): number { return this.#delay; }
    reduceeDelayBy(time) { this.#delay -= time; }

    #extraInfo: object;
    get extraInfo(): object { return this.#extraInfo; }

    constructor(despatchAt: number, sender: Entity, receiver: Entity, msg: number, extraInfo?: object) {
        this.#delay = despatchAt;
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
     * Remember a telegram for later sending.
     * @param delay time to wait before sending in seconds
     * @param sender id of sender
     * @param receiver id of receiver
     * @param msg message string
     * @param extraInfo optional object holding any extra information
     */
    postTelegram(delay: number, sender: number | Entity, receiver: number | Entity, msg: number, extraInfo?: object) {
        let pop = this.#world.populationMap;
        sender = sender instanceof Entity ? sender : pop.get(sender);
        receiver = receiver instanceof Entity ? receiver : pop.get(receiver);
        if (sender && receiver && receiver.hasFSM()) {
            let tgram = new Telegram(delay, sender, receiver, msg, extraInfo);
            this.#telegrams.push(tgram);
        }
    }

    /** Send the telegram     */
    sendTelegram(tgram: Telegram) {
        tgram.receiver.fsm.onMessage(tgram);
    }

    /** Send telegram and remove from tem from postnag */
    update(elapsedTime: number) {
        this.#telegrams.forEach(tgram => tgram.reduceeDelayBy(elapsedTime));
        let toSend = this.#telegrams.filter(x => x.delay <= 0);
        for (let tgram of toSend)
            this.sendTelegram(tgram);
        if (toSend.length > 0)
            this.#telegrams = this.#telegrams.filter(x => x.delay > 0);
    }
}