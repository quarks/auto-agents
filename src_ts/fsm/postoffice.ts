class Telegram {

    _sender: number;
    _receiver: number;
    _msg: number;
    _despatchAt: number;
    _extraInfo: object;

    get message(): number { return this._msg; }
    get sender(): number { return this._sender; }
    get receiver(): number { return this._receiver; }

    constructor(despatchAt = -1, sender = -1, receiver = -1, msg = -1, extraInfo: object) {
        this._despatchAt = despatchAt;
        this._sender = sender;
        this._receiver = receiver;
        this._msg = msg;
        this._extraInfo = extraInfo;
    }

    equals(tgram: Telegram): boolean {
        if (this._sender == tgram._sender && this._receiver == tgram._receiver &&
            this._msg == tgram._msg &&
            Math.abs(this._despatchAt - tgram._despatchAt) < SAFE_TIME_INTERVAL)
            return true;
        return false;
    }
}

class Dispatcher {

    _telegrams: Array<Telegram>;
    _world: World;

    constructor(world: World) {
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
    postTelegram(delay: number, sender: number, receiver: number, msg: number, extraInfo?: object) {
        if (this._world._population.has(receiver) && this._world._population.get(receiver).hasFSM()) {
            let tgram = new Telegram(Date.now() + delay, sender, receiver, msg, extraInfo);
            this._telegrams.push(tgram);
        }
    }

    /**
     * Send the telegram
     * @param tgram telegram
     */
    sendTelegram(tgram: Telegram) {
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