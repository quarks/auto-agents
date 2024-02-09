class Telegram {

    #sender: number;
    #receiver: number;
    #msg: number;
    #despatchAt: number;
    #extraInfo: object;

    get sender(): number { return this.#sender; }
    get receiver(): number { return this.#receiver; }
    get message(): number { return this.#msg; }
    get despatchAt(): number { return this.#despatchAt; }
    get extraInfo(): object { return this.#extraInfo; }

    constructor(despatchAt = -1, sender = -1, receiver = -1, msg = -1, extraInfo: object) {
        this.#despatchAt = despatchAt;
        this.#sender = sender;
        this.#receiver = receiver;
        this.#msg = msg;
        this.#extraInfo = extraInfo;
    }

    equals(tgram: Telegram): boolean {
        if (this.#sender == tgram.#sender && this.#receiver == tgram.#receiver &&
            this.#msg == tgram.#msg &&
            Math.abs(this.#despatchAt - tgram.#despatchAt) < SAFE_TIME_INTERVAL)
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
        if (this._world.populationMap.has(receiver) && this._world.populationMap.get(receiver).hasFSM()) {
            let tgram = new Telegram(Date.now() + delay, sender, receiver, msg, extraInfo);
            this._telegrams.push(tgram);
        }
    }

    /**
     * Send the telegram
     * @param tgram telegram
     */
    sendTelegram(tgram: Telegram) {
        let entity = this._world.populationMap.get(tgram.receiver);
        if (entity && entity.hasFSM()) {
            entity.fsm.onMessage(tgram);
        }
    }

    update() {
        let time = Date.now();
        let toSend = this._telegrams.filter(x => x.despatchAt <= time);
        for (let tgram of toSend)
            this.sendTelegram(tgram);
        if (toSend.length > 0)
            this._telegrams = this._telegrams.filter(x => x.despatchAt > time);
    }
}