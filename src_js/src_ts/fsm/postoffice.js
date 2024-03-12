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
var _Telegram_sender, _Telegram_receiver, _Telegram_msgID, _Telegram_delay, _Telegram_extraInfo, _Dispatcher_telegrams, _Dispatcher_world;
/**
 * A message that can be passed between entities.
 */
class Telegram {
    constructor(despatchAt, sender, receiver, msg, extraInfo) {
        _Telegram_sender.set(this, void 0);
        _Telegram_receiver.set(this, void 0);
        _Telegram_msgID.set(this, void 0);
        _Telegram_delay.set(this, void 0);
        _Telegram_extraInfo.set(this, void 0);
        __classPrivateFieldSet(this, _Telegram_delay, despatchAt, "f");
        __classPrivateFieldSet(this, _Telegram_sender, sender, "f");
        __classPrivateFieldSet(this, _Telegram_receiver, receiver, "f");
        __classPrivateFieldSet(this, _Telegram_msgID, msg, "f");
        __classPrivateFieldSet(this, _Telegram_extraInfo, extraInfo, "f");
    }
    get sender() { return __classPrivateFieldGet(this, _Telegram_sender, "f"); }
    get receiver() { return __classPrivateFieldGet(this, _Telegram_receiver, "f"); }
    get msgID() { return __classPrivateFieldGet(this, _Telegram_msgID, "f"); }
    get delay() { return __classPrivateFieldGet(this, _Telegram_delay, "f"); }
    reduceeDelayBy(time) { __classPrivateFieldSet(this, _Telegram_delay, __classPrivateFieldGet(this, _Telegram_delay, "f") - time, "f"); }
    get extraInfo() { return __classPrivateFieldGet(this, _Telegram_extraInfo, "f"); }
}
_Telegram_sender = new WeakMap(), _Telegram_receiver = new WeakMap(), _Telegram_msgID = new WeakMap(), _Telegram_delay = new WeakMap(), _Telegram_extraInfo = new WeakMap();
/**
 * Responcible for receiving, storing and dispatching telegrams.
 */
class Dispatcher {
    constructor(world) {
        _Dispatcher_telegrams.set(this, void 0);
        _Dispatcher_world.set(this, void 0);
        __classPrivateFieldSet(this, _Dispatcher_world, world, "f");
        __classPrivateFieldSet(this, _Dispatcher_telegrams, [], "f");
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
        let pop = __classPrivateFieldGet(this, _Dispatcher_world, "f").populationMap;
        sender = sender instanceof Entity ? sender : pop.get(sender);
        receiver = receiver instanceof Entity ? receiver : pop.get(receiver);
        if (sender && receiver && receiver.hasFSM()) {
            let tgram = new Telegram(delay, sender, receiver, msg, extraInfo);
            __classPrivateFieldGet(this, _Dispatcher_telegrams, "f").push(tgram);
        }
    }
    /** Send the telegram     */
    sendTelegram(tgram) {
        tgram.receiver.fsm.onMessage(tgram);
    }
    /** Send telegram and remove from tem from postnag */
    update(elapsedTime) {
        __classPrivateFieldGet(this, _Dispatcher_telegrams, "f").forEach(tgram => tgram.reduceeDelayBy(elapsedTime));
        let toSend = __classPrivateFieldGet(this, _Dispatcher_telegrams, "f").filter(x => x.delay <= 0);
        for (let tgram of toSend)
            this.sendTelegram(tgram);
        if (toSend.length > 0)
            __classPrivateFieldSet(this, _Dispatcher_telegrams, __classPrivateFieldGet(this, _Dispatcher_telegrams, "f").filter(x => x.delay > 0), "f");
    }
}
_Dispatcher_telegrams = new WeakMap(), _Dispatcher_world = new WeakMap();
//# sourceMappingURL=postoffice.js.map