class Telegram {
    constructor(despatchAt = -1, sender = -1, receiver = -1, msg = -1, extraInfo) {
        this._despatchAt = despatchAt;
        this._sender = sender;
        this._receiver = receiver;
        this._msg = msg;
        this._extraInfo = extraInfo;
    }
    get message() { return this._msg; }
    get sender() { return this._sender; }
    get receiver() { return this._receiver; }
    equals(tgram) {
        if (this._sender == tgram._sender && this._receiver == tgram._receiver &&
            this._msg == tgram._msg &&
            Math.abs(this._despatchAt - tgram._despatchAt) < SAFE_TIME_INTERVAL)
            return true;
        return false;
    }
}
class Dispatcher {
    constructor(world) {
        this._world = world;
        this._telegrams = [];
    }
    /**
     * Receive a telegram for later sending.
     *
     * @param delay time to wait before sending in ms
     * @param sender id of sender
     * @param receiver id of receiver
     * @param msg message string
     * @param extraInfo optional object holding any extra information
     */
    postTelegram(delay, sender, receiver, msg, extraInfo) {
        if (this._world._population.has(receiver) && this._world._population.get(receiver).hasFSM()) {
            let tgram = new Telegram(Date.now() + delay, sender, receiver, msg, extraInfo);
            this._telegrams.push(tgram);
        }
    }
    /**
     * Send the telegram
     * @param tgram telegram
     */
    sendTelegram(tgram) {
        let entity = this._world._population.get(tgram._receiver);
        if (entity && entity.hasFSM()) {
            entity.fsm.onMessage(tgram);
        }
    }
    update() {
        let time = Date.now();
        let toSend = this._telegrams.filter(x => x._despatchAt <= time);
        for (let tgram of toSend)
            this.sendTelegram(tgram);
        if (toSend.length > 0)
            this._telegrams = this._telegrams.filter(x => x._despatchAt > time);
    }
}
//# sourceMappingURL=postoffice.js.map