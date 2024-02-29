class Telegram {
    #sender;
    get sender() { return this.#sender; }
    #receiver;
    get receiver() { return this.#receiver; }
    #msgID;
    get msgID() { return this.#msgID; }
    #delay;
    get delay() { return this.#delay; }
    reduceeDelayBy(time) { this.#delay -= time; }
    #extraInfo;
    get extraInfo() { return this.#extraInfo; }
    constructor(despatchAt, sender, receiver, msg, extraInfo) {
        this.#delay = despatchAt;
        this.#sender = sender;
        this.#receiver = receiver;
        this.#msgID = msg;
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
        let pop = this.#world.populationMap;
        sender = sender instanceof Entity ? sender : pop.get(sender);
        receiver = receiver instanceof Entity ? receiver : pop.get(receiver);
        if (sender && receiver && receiver.hasFSM()) {
            let tgram = new Telegram(delay, sender, receiver, msg, extraInfo);
            this.#telegrams.push(tgram);
        }
    }
    /** Send the telegram     */
    sendTelegram(tgram) {
        tgram.receiver.fsm.onMessage(tgram);
    }
    /** Send telegram and remove from tem from postnag */
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