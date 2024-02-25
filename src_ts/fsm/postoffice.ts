class Telegram {
    #sender: number;
    get sender(): number { return this.#sender; }

    #receiver: number;
    get receiver(): number { return this.#receiver; }

    #msg: number | string;
    get message(): number | string { return this.#msg; }

    #delay: number;
    get delay(): number { return this.#delay; }
    reduceeDelayBy(time) { this.#delay -= time; }

    #extraInfo: object;
    get extraInfo(): object { return this.#extraInfo; }

    constructor(despatchAt: number, sender: number, receiver: number, msg: number | string, extraInfo?: object) {
        this.#delay = despatchAt;
        this.#sender = sender;
        this.#receiver = receiver;
        this.#msg = msg;
        this.#extraInfo = extraInfo;
    }
}

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
    postTelegram(delay: number, sender: number, receiver: number, msg: number | string, extraInfo?: object) {
        if (this.#world.populationMap.has(receiver) && this.#world.populationMap.get(receiver).hasFSM()) {
            let tgram = new Telegram(delay, sender, receiver, msg, extraInfo);
            this.#telegrams.push(tgram);
        }
    }

    /** Send the telegram     */
    sendTelegram(tgram: Telegram) {
        let entity = this.#world.populationMap.get(tgram.receiver);
        if (entity && entity.hasFSM())
            entity.fsm.onMessage(tgram);
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