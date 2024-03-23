// Approximate normal distribution about mean of 0.5
function rnd() {
    return (random() + random() + random() + random() + random() + random()) / 6;
}

const SC = Symbol.for('State change');
const PT = Symbol.for('Post telegram');
const RT = Symbol.for('Receive telgram');

// Simple relay functions
function postTelegram(delay, sender, receiver, msg, extraInfo) {
    world.dispatcher.postTelegram(delay, sender, receiver, msg, extraInfo);
}

function logItem(item) {
    logger.add(item);
}

let bankBalance = 200;
function incMoneyInBank(amt) { bankBalance += amt; }
function decMoneyInBank(amt) { bankBalance -= amt; }
function isWealthy() { return bankBalance > 400; }
function moneyInBank() { return round(bankBalance); }

class Agent extends Entity {
    _name = '';
    get name() { return this._name };

    _location = '';
    get location() { return this._location; }
    set location(where) { this._location = where; }

    get currentState() { return this.fsm.currentState; }
    isInState(state) { return state === this.fsm.currentState; }

    constructor(world, name) {
        super();
        this._name = name;
        this.enableFsm(world);
    }
}
class Miner extends Agent {
    _thirst = 0;
    _thirstLimit = 35;
    incThirst(delta) { this._thirst = min(this._thirst + delta, this._thirstLimit); }
    decThirst(delta) { this._thirst = max(this._thirst - delta, 0); }
    isThirsty() { return this._thirst >= this._thirstLimit; }
    get propThirst() { return this._thirst / this._thirstLimit };

    _fatigue = 0;
    _fatigueLimit = 70;
    incFatigue(delta) { this._fatigue = min(this._fatigue + delta, this._fatigueLimit); }
    decFatigue(delta) { this._fatigue = max(this._fatigue - delta, 0); }
    isFatigued() { return this._fatigue >= this._fatigueLimit; }
    isRested() { return this._fatigue <= 0; }
    get propFatigue() { return this._fatigue / this._fatigueLimit; }

    _goldInPocket = 0;
    _goldInPocketLimit = 0;
    incGoldInPocket(delta) {
        this._goldInPocket = min(this._goldInPocket + delta, this._goldInPocketLimit);
    }
    decGoldInPocket(delta) {
        delta = min(delta, this._goldInPocket);
        this._goldInPocket -= delta; return delta;
    }
    isPocketFull() { return this._goldInPocket >= this._goldInPocketLimit; }
    isPocketEmpty() { return this._goldInPocket <= 0; }
    get propGoldInPocket() { return this._goldInPocket / this._goldInPocketLimit; }

    constructor(world, name = 'Miner') {
        super(world, name);
    }
}

class Wife extends Agent {
    _moneyInWallet = 0;
    _walletLimit = 100;
    incMoneyInWallet(delta) {
        this._moneyInWallet = min(this._moneyInWallet + delta, this._walletLimit);
    }
    decMoneyInWallet(delta) {
        delta = min(delta, this._moneyInWallet);
        this._moneyInWallet -= delta; return delta;
    }
    isWalletFull() { return this._moneyInWallet >= this._walletLimit; }
    isWalletEmpty() { return this._moneyInWallet <= 0; }
    get propMoneyInWallet() { return this._moneyInWallet / this._walletLimit; }
    get moneyInWallet() { return this._moneyInWallet };
    set walletLimit(amt) { if (amt > 0) this._walletLimit = amt; }

    _inBathroomLimit = 6;
    _inBathroom = 0;
    get propBathroom() { return this._inBathroom / this._inBathroomLimit; }
    incBathroom(amt) { this._inBathroom = min(this._inBathroom + amt, this._inBathroomLimit); }
    initBathroom() { this._inBathroom = 0; this._bathroomTimeLimit = random(4, 8) };
    get isFinishedInBathroom() { return this._inBathroom >= this._inBathroomLimit; }

    _makeStewLimit = 5;
    _makeStew = 0;
    get propMakeStew() { return this._makeStew / this._makeStewLimit; }
    incMakeStew(amt) { this._makeStew = min(this._makeStew + amt, this._makeStewLimit); }
    initMakeStew() { this._makeStew = 0; this._makeStewLimit = random(5, 9) };
    get isStewMade() { return this._makeStew >= this._makeStewLimit; }

    get currentState() { return this.fsm.currentState }
    isInState(state) { return state === this.fsm.currentState; }


    constructor(world, name = 'Wife') {
        super(world, name);
    }
}

// ####################   STATES   #################################

class DigForGold extends State {
    enter(user) {
        minerStateViewer.setStateIdx(0);
        user._goldInPocketLimit = random(120, 150);
        logItem({
            time: millis(), agent: user, type: SC,
            msg: "MINE: Digging deep for gold !"
        });
    }

    execute(user, elapsedTime, world) {
        user.incGoldInPocket(rnd() * elapsedTime * 16);
        user.incFatigue(rnd() * elapsedTime * 6);
        user.incThirst(rnd() * elapsedTime * 1.5);
        if (user.isPocketFull())
            user.changeState(stateDepositGold);
        else if (user.isFatigued())
            user.changeState(stateRelaxAtHome);
        else if (user.isThirsty())
            user.changeState(stateQuenchThirst);
    }

}

class QuenchThirst extends State {
    enter(user) {
        minerStateViewer.setStateIdx(1);
        logItem({
            time: millis(), agent: user, type: SC,
            msg: "SALOON: I've a terrible thirst, must drink some beer !"
        });
    }

    execute(user, elapsedTime, world) {
        user.decThirst(rnd() * elapsedTime * 5);
        user.decFatigue(rnd() * elapsedTime);
        decMoneyInBank(elapsedTime * 5);
        if (user._thirst == 0)
            user.changeState(stateDigForGold);
    }

}

class DepositGold extends State {
    enter(user) {
        minerStateViewer.setStateIdx(2);
        logItem({
            time: millis(), agent: user, type: SC,
            msg: "BANK: Sell my gold and deposit the money here!"
        });
    }

    execute(user, elapsedTime, world) {
        if (user.isPocketEmpty()) {
            if (isWealthy())
                user.changeState(stateRelaxAtHome);
            else
                user.changeState(stateDigForGold);
        }
        incMoneyInBank(user.decGoldInPocket(rnd() * elapsedTime * 20));
    }
}

class RelaxAtHome extends State {
    enter(user) {
        minerStateViewer.setStateIdx(3);
        postTelegram(1, user, elsa, 1201);
        logItem({
            time: millis(), agent: user, toAgent: elsa, type: PT, msgID: 1201,
            msg: "HOME: \"Hi honey I\'m home !\""
        });
    }

    execute(user, elapsedTime, world) {
        user.decFatigue(rnd() * elapsedTime * 10);
        user.decThirst(rnd() * elapsedTime);
        if (user.isRested())
            user.changeState(stateDigForGold);
    }

    exit(user) {
        user._fatigueLimit = random(60, 80);
    }
}

class GetMoney extends State {
    enter(user) {
        wifeStateViewer.setStateIdx(2);
        let maxAvailable = (moneyInBank());
        user.walletLimit = random(0.25, 0.5) * maxAvailable;
        logItem({
            time: millis(), agent: user, type: SC,
            msg: 'BANK: Withdraw some money for shopping'
        });
    }

    execute(user, elapsedTime, world) {
        if (user.isWalletFull())
            user.changeState(stateShopping);
        let amt = rnd() * elapsedTime * 35;
        user.incMoneyInWallet(amt);
        decMoneyInBank(amt);
    }
}

class Shopping extends State {
    enter(user) {
        wifeStateViewer.setStateIdx(4);
        logItem({
            time: millis(), agent: user, type: SC,
            msg: 'STORE: So many lovely things to buy'
        });
    }

    execute(user, elapsedTime, world) {
        if (random() < 0.0001)
            user.changeState(stateBathroom);
        if (user.isWalletEmpty())
            user.changeState(stateAtHome);
        let amt = rnd() * elapsedTime * 20;
        user.decMoneyInWallet(amt);
    }
}

class WifeGlobal extends State {
    onMessage(user, tgram) {
        if (tgram.msgID == 2201) {
            if (moneyInBank() > 300) {
                user.walletLimit = random(0.25, 0.5) * moneyInBank();
                logItem({
                    time: millis(), agent: user, toAgent: tgram.receiver, type: RT, msgID: 2201,
                    msg: 'Time to go shopping'
                });
                user.changeState(stateGetMoneyFromBank);

            }
            postTelegram(random(45, 60), elsa, elsa, 2201);  // Next shopping trip
            return true;
        }
        return false;
    }
}

class AtHome extends State {
    enter(user) {
        wifeStateViewer.setStateIdx(3);
        logItem({
            time: millis(), agent: user, type: SC,
            msg: 'HOME: Busy, busy, busy ... so much to do'
        });
    }

    execute(user, elapsedTime, world) {
        if (random() < 0.0002)
            user.changeState(stateBathroom);
    }

    onMessage(user, tgram) {
        if (tgram.msgID == 1201) {
            user.changeState(stateMakeStew);
            return true;
        }
        return false;
    }
}

class InBathroom extends State {
    enter(user) {
        logItem({
            time: millis(), agent: user, type: SC,
            msg: 'BATHROOM: Call of nature ... Aghhh relief !!!'
        });
    }

    execute(user, elapsedTime, world) {
        if (user.isFinishedInBathroom)
            user.revertToPreviousState();
        else
            user.incBathroom(elapsedTime);
    }

    exit(user) {
        user.initBathroom();
    }
}

class MakeStew extends State {
    enter(user) {
        user.initMakeStew();
        logItem({
            time: millis(), agent: user, type: SC,
            msg: 'MAKE STEW: Time to make our dinner'
        });
    }

    execute(user, elapsedTime, world) {
        if (user.isStewMade)
            user.revertToPreviousState();
        else
            user.incMakeStew(elapsedTime);
    }

    exit(user) {
        logItem({
            time: millis(), agent: user, toAgent: bob, type: PT, msgID: 2101,
            msg: 'Dinner is ready'
        });
        user.initMakeStew();
    }
}