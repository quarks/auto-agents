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
var _Telegram_sender, _Telegram_receiver, _Telegram_msgID, _Telegram_dispatchAt, _Telegram_extraInfo, _Dispatcher_telegrams, _Dispatcher_world;
/**
 * A message that can be passed between entities.
 *
 * Internally the dispatch time is measured in ms
 */
class Telegram {
    constructor(dispatchAt, sender, receiver, msg, extraInfo) {
        _Telegram_sender.set(this, void 0);
        _Telegram_receiver.set(this, void 0);
        _Telegram_msgID.set(this, void 0);
        _Telegram_dispatchAt.set(this, void 0);
        _Telegram_extraInfo.set(this, void 0);
        __classPrivateFieldSet(this, _Telegram_dispatchAt, dispatchAt, "f");
        __classPrivateFieldSet(this, _Telegram_sender, sender, "f");
        __classPrivateFieldSet(this, _Telegram_receiver, receiver, "f");
        __classPrivateFieldSet(this, _Telegram_msgID, msg, "f");
        __classPrivateFieldSet(this, _Telegram_extraInfo, extraInfo, "f");
    }
    get sender() { return __classPrivateFieldGet(this, _Telegram_sender, "f"); }
    get receiver() { return __classPrivateFieldGet(this, _Telegram_receiver, "f"); }
    get msgID() { return __classPrivateFieldGet(this, _Telegram_msgID, "f"); }
    get dispatchAt() { return __classPrivateFieldGet(this, _Telegram_dispatchAt, "f"); }
    get extraInfo() { return __classPrivateFieldGet(this, _Telegram_extraInfo, "f"); }
}
_Telegram_sender = new WeakMap(), _Telegram_receiver = new WeakMap(), _Telegram_msgID = new WeakMap(), _Telegram_dispatchAt = new WeakMap(), _Telegram_extraInfo = new WeakMap();
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
     * Receive telegram details for later delivery.
     * @param delay time to wait before sending to receiver (seconds)
     * @param sender sender or sender id
     * @param receiver receiver or receiver id
     * @param msgID message ID (integer number set in constants)
     * @param extraInfo optional object holding any extra information for receiver
     */
    postTelegram(delay, sender, receiver, msgID, extraInfo) {
        let pop = __classPrivateFieldGet(this, _Dispatcher_world, "f").populationMap;
        sender = sender instanceof Entity ? sender : pop.get(sender);
        receiver = receiver instanceof Entity ? receiver : pop.get(receiver);
        if (sender && receiver && receiver.hasFSM()) {
            let desptachAt = Date.now() / 1000 + delay;
            let tgram = new Telegram(desptachAt, sender, receiver, msgID, extraInfo);
            __classPrivateFieldGet(this, _Dispatcher_telegrams, "f").push(tgram);
        }
    }
    /** Send telegram and remove from them from postbag */
    update(elapsedTime) {
        let presentTime = Date.now() / 1000;
        let toSend = __classPrivateFieldGet(this, _Dispatcher_telegrams, "f").filter(x => x.dispatchAt <= presentTime);
        if (toSend.length > 0) {
            // Remove these from waiting telegrams
            __classPrivateFieldSet(this, _Dispatcher_telegrams, __classPrivateFieldGet(this, _Dispatcher_telegrams, "f").filter(x => x.dispatchAt > presentTime), "f");
            // Make sure telegrams are dispatched in chronological order
            toSend.sort((a, b) => a.dispatchAt - b.dispatchAt);
            toSend.forEach(tgram => { tgram.receiver.fsm.onMessage(tgram); });
        }
    }
}
_Dispatcher_telegrams = new WeakMap(), _Dispatcher_world = new WeakMap();
//# sourceMappingURL=postoffice.js.map