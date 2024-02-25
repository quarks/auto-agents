// Approximate normal distribution about mean of 0.5
function rnd() {
    return (random() + random() + random() + random() + random() + random()) / 6;
}

class Miner extends Entity {
    _name = '';
    get name() { return this._name };
    set name(name) { this._name = name };

    _wife;
    get wife() { return this._wife };
    set wife(wife) { this._wife = wife; }

    _location = '';
    get location() { return this._location };
    set location(location) { this._location = location; }

    _thirst = 0;
    _thirstLimit = 50;
    incThirst(delta) { this._thirst = min(this._thirst + delta, this._thirstLimit); }
    decThirst(delta) { this._thirst = max(this._thirst - delta, 0); }
    isThirsty() { return this._thirst >= this._thirstLimit; }
    isThirstQuenched() { return this._thirst <= 0; }
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
    incGoldInPocket(delta) { this._goldInPocket = min(this._goldInPocket + delta, this._goldInPocketLimit); }
    decGoldInPocket(delta) { delta = min(delta, this._goldInPocket); this._goldInPocket -= delta; return delta; }
    isPocketFull() { return this._goldInPocket >= this._goldInPocketLimit; }
    isPocketEmpty() { return this._goldInPocket <= 0; }
    emptyPocket() {
        let amt = this._goldInPocket;
        this._goldInPocket = 0;
        return amt;
    }
    get propGoldInPocket() { return this._goldInPocket / this._goldInPocketLimit; }

    _moneyInBank = 200;
    incMoneyInBank(amt) { this._moneyInBank += amt; }
    decMoneyInBank(amt) { this._moneyInBank -= amt; }
    hasMoneyInBank(needed) { return this._moneyInBank >= needed };
    isWealthy() { return this._moneyInBank > 400; }
    get moneyInBank() { return round(this._moneyInBank); }

    constructor(world, name = 'Miner') {
        super();
        this._name = name;
        this.enableFsm(this, world);
    }
}

class DigForGold extends State {
    enter(user) {
        minerStateViewer.setStateIdx(0);
        user.location = 'goldmine';
        user._goldInPocketLimit = random(80, 120);
        // console.log('Digging for Gold in goldmine');
    }

    execute(user, elapsedTime, world) {
        user.incGoldInPocket(rnd() * elapsedTime * 10);
        user.incFatigue(rnd() * elapsedTime * 4);
        user.incThirst(rnd() * elapsedTime * 2.5);
        if (user.isPocketFull())
            user.changeState(stateDepositGold);
        else if (user.isFatigued())
            user.changeState(stateSleepUntilRested);
        else if (user.isThirsty())
            user.changeState(stateQuenchThirst);
    }

    exit(user) { }
}

class QuenchThirst extends State {
    enter(user) {
        minerStateViewer.setStateIdx(1);
        user.location = 'bar';
        //console.log(`Going to bar to quench thirst`);
    }

    execute(user, elapsedTime, world) {
        user.decThirst(rnd() * elapsedTime * 5);
        user.decFatigue(rnd() * elapsedTime);
        user.decMoneyInBank(elapsedTime * 5);
        if (user._thirst == 0)
            user.changeState(stateDigForGold);
    }

    exit(user) { }
}

class DepositGold extends State {
    enter(user) {
        minerStateViewer.setStateIdx(2);
        user.location = 'bank';
        //console.log(`Gone to bank to deposit gold.   Balance: ${user.goldInBank}`)
    }

    execute(user, elapsedTime, world) {
        if (user.isPocketEmpty()) {
            if (user.isWealthy())
                user.changeState(stateSleepUntilRested);
            else
                user.changeState(stateDigForGold);
        }
        user.incMoneyInBank(user.decGoldInPocket(rnd() * elapsedTime * 20));
    }

    exit(user) { }
}

class RelaxAtHome extends State {
    enter(user) {
        minerStateViewer.setStateIdx(3);
        user.location = 'home';
        console.log(`Gone home:    sent telgram from ${user.id} to ${user.wife.id}`);
        this.world.dispatcher.postTelegram(0, user.id, user.wife.id, 111);
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


class Wife extends Entity {
    _name = '';
    get name() { return this._name };
    set name(name) { this._name = name };

    _miner;
    get miner() { return this._miner };
    set miner(miner) { this._miner = miner; }

    _moneyInWallet = 0;
    _walletLimit = 100;
    incMoneyInWallet(delta) { this._moneyInWallet = min(this._moneyInWallet + delta, this._walletLimit); }
    decMoneyInWallet(delta) { delta = min(delta, this._moneyInWallet); this._moneyInWallet -= delta; return delta; }
    isWalletFull() { return this._moneyInWallet >= this._walletLimit; }
    isWalletEmpty() { return this._moneyInWallet <= 0; }
    emptyWallet() {
        let amt = this._moneyInWallet;
        this._moneyInWallet = 0;
        return amt;
    }
    get propMoneyInWallet() { return this._moneyInWallet / this._walletLimit; }
    get moneyInWallet() { return this._moneyInWallet };
    set walletLimit(amt) { if (amt > 0) this._walletLimit = amt; }

    constructor(world, name = 'Houseeeper') {
        super();
        this._name = name;
        this.enableFsm(this, world);
    }

}

class GetMoneyFromBank extends State {

    enter(user) {
        wifeStateViewer.setStateIdx(2);
        let maxAvailable = user.miner.goldInBank;
        this.walletLimit = random(0.25, 0.5) * maxAvailable;
        user.location = 'bank';
        console.log(`Going to bank for spending money`);
    }

    execute(user, elapsedTime, world) {
        if (user.isWalletFull())
            user.changeState(stateShopping);
        let amt = rnd() * elapsedTime * 25;
        user.incMoneyInWallet(amt);
        user.miner.decMoneyInBank(amt);
    }

    exit(user) { }
}

class Shopping extends State {

    enter(user) {
        wifeStateViewer.setStateIdx(4);
        let maxAvailable = user.miner.goldInBank;
        this.walletLimit = random(0.25, 0.5) * maxAvailable;
        user.location = 'store';
        console.log(`At store spending money`);
    }

    execute(user, elapsedTime, world) {
        if (user.isWalletEmpty())
            user.changeState(stateWaitForMiner);
        let amt = rnd() * elapsedTime * 10;
        user.decMoneyInWallet(amt);
    }

    exit(user) { }
}


class WaitingForMiner extends State {
    enter(user) {
        wifeStateViewer.setStateIdx(3);
        user.location = 'home';
        console.log(`Waiting for ${user.miner.name}`);
    }

    execute(user, elapsedTime, world) {
    }

    onMessage(user, tgram) {
        if (tgram.message == 22001)
            user.changeState(stateGetMoneyFromBank);
        console.log(tgram.message);
        return true;
    }

    exit(user) { }
}
