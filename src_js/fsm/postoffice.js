class Telegram {
    #sender;
    get sender() { return this.#sender; }
    #receiver;
    get receiver() { return this.#receiver; }
    #msg;
    get message() { return this.#msg; }
    #delay;
    get delay() { return this.#delay; }
    reduceeDelayBy(time) { this.#delay -= time; }
    #extraInfo;
    get extraInfo() { return this.#extraInfo; }
    constructor(despatchAt, sender, receiver, msg, extraInfo) {
        this.#delay = despatchAt;
        this.#sender = sender;
        this.#receiver = receiver;
        this.#msg = msg;
        this.#extraInfo = extraInfo;
    }
}
class Dispatcher {
    #telegrams;
    #world;
    constructor(world) {
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
    postTelegram(delay, sender, receiver, msg, extraInfo) {
        if (this.#world.populationMap.has(receiver) && this.#world.populationMap.get(receiver).hasFSM()) {
            let tgram = new Telegram(delay, sender, receiver, msg, extraInfo);
            this.#telegrams.push(tgram);
        }
    }
    /** Send the telegram     */
    sendTelegram(tgram) {
        let entity = this.#world.populationMap.get(tgram.receiver);
        if (entity && entity.hasFSM()) {
            entity.fsm.onMessage(tgram);
        }
    }
    update(elapsedTime) {
        this.#telegrams.forEach(tgram => tgram.reduceeDelayBy(elapsedTime));
        let toSend = this.#telegrams.filter(x => x.delay <= 0);
        for (let tgram of toSend)
            this.sendTelegram(tgram);
        if (toSend.length > 0)
            this.#telegrams = this.#telegrams.filter(x => x.delay > 0);
    }
}
//# sourceMappingURL=postoffice.js.map