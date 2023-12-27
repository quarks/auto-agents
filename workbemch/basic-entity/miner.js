class Miner extends Entity {

    _name = '';
    _location = '';
    _thirst = 0;
    _fatigue = 0;
    _gold = 0;
    _deposited = 0;

    constructor(name = 'Miner') {
        super([0, 0], 0);
        this._name = name;
        this._fsm = new FiniteStateMachine(this);
    }

    get thirst() { return this._thirst };
    set thirst(thirst) { this._thirst = thirst };

    get location() { return this._location };
    set location(location) { this._location = location };

    get name() { return this._name };
    set name(name) { this._name = name };

    update(elapsedTime, world) {
        this.fsm.update(elapsedTime, world);
    }
}

class DigForNugget extends State {
    enter(user) {
        if (user.location != 'goldmine') {
            user.location = 'goldmine';
            console.log('Digging for Gold in goldmine');
        }
    }

    execute(user, elapsedTime, world) {
        user._gold += elapsedTime;
        user._fatigue += elapsedTime;
        user._thirst += elapsedTime;
        //console.log(`${user.name} Gold: ${user._gold}   Fatigue: ${user._fatigue}`);
        if (user._gold >= 13000) user.changeState(stateDepositGold);
        if (user._fatigue >= 19000) user.changeState(stateSleepUntilRested);
    }

    exit(user) {
    }
}

class DepositGold extends State {
    enter(user) {
        if (user.location != 'bank') {
            user.location = 'bank';
            console.log(`Going to bank to deposit gold    ${millis()}`);
            user.world?.postman?.postTelegram(2500, user.id, user.id, 99);
        }
    }

    execute(user, elapsedTime, world) {
    }

    onMessage(user, tgram) {
        if (tgram.message == 99) {
            let deposit = Math.floor(user._gold / 1000);
            user._deposited += deposit;
            user._gold = 0;
            console.log(`   ${user.name} deposited ${deposit} gold nuggets at ${millis()} -- bank balance = ${user._deposited}`);
            user.revertToPreviousState();
            return true;
        }
        return false;
    };

    exit(user) {
    }
}

class SleepUntilRested extends State {
    enter(user) {
        if (user.location != 'home') {
            user.location = 'home';
            console.log('Going home to sleep.');
        }
    }

    execute(user, elapsedTime, world) {
        user._fatigue -= elapsedTime * 1.3;
        if (user._fatigue <= 0) {
            user._fatigue = 0;
            user.changeState(stateDigForGold);
        }
    }

    exit(user) {
    }
}