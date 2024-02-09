var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Telegram_sender, _Telegram_receiver, _Telegram_msg, _Telegram_despatchAt, _Telegram_extraInfo;
class Telegram {
    constructor(despatchAt = -1, sender = -1, receiver = -1, msg = -1, extraInfo) {
        _Telegram_sender.set(this, void 0);
        _Telegram_receiver.set(this, void 0);
        _Telegram_msg.set(this, void 0);
        _Telegram_despatchAt.set(this, void 0);
        _Telegram_extraInfo.set(this, void 0);
        __classPrivateFieldSet(this, _Telegram_despatchAt, despatchAt, "f");
        __classPrivateFieldSet(this, _Telegram_sender, sender, "f");
        __classPrivateFieldSet(this, _Telegram_receiver, receiver, "f");
        __classPrivateFieldSet(this, _Telegram_msg, msg, "f");
        __classPrivateFieldSet(this, _Telegram_extraInfo, extraInfo, "f");
    }
    get sender() { return __classPrivateFieldGet(this, _Telegram_sender, "f"); }
    get receiver() { return __classPrivateFieldGet(this, _Telegram_receiver, "f"); }
    get message() { return __classPrivateFieldGet(this, _Telegram_msg, "f"); }
    get despatchAt() { return __classPrivateFieldGet(this, _Telegram_despatchAt, "f"); }
    get extraInfo() { return __classPrivateFieldGet(this, _Telegram_extraInfo, "f"); }
    equals(tgram) {
        if (__classPrivateFieldGet(this, _Telegram_sender, "f") == __classPrivateFieldGet(tgram, _Telegram_sender, "f") && __classPrivateFieldGet(this, _Telegram_receiver, "f") == __classPrivateFieldGet(tgram, _Telegram_receiver, "f") &&
            __classPrivateFieldGet(this, _Telegram_msg, "f") == __classPrivateFieldGet(tgram, _Telegram_msg, "f") &&
            Math.abs(__classPrivateFieldGet(this, _Telegram_despatchAt, "f") - __classPrivateFieldGet(tgram, _Telegram_despatchAt, "f")) < SAFE_TIME_INTERVAL)
            return true;
        return false;
    }
}
_Telegram_sender = new WeakMap(), _Telegram_receiver = new WeakMap(), _Telegram_msg = new WeakMap(), _Telegram_despatchAt = new WeakMap(), _Telegram_extraInfo = new WeakMap();
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
        if (this._world.populationMap.has(receiver) && this._world.populationMap.get(receiver).hasFSM()) {
            let tgram = new Telegram(Date.now() + delay, sender, receiver, msg, extraInfo);
            this._telegrams.push(tgram);
        }
    }
    /**
     * Send the telegram
     * @param tgram telegram
     */
    sendTelegram(tgram) {
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
//# sourceMappingURL=postoffice.js.map