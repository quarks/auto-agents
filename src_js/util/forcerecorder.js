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
var _ForceRecorder_owner, _ForceRecorder_forces, _ForceRecorder_nbrReadings, _Force_forceName, _Force_min, _Force_max, _Force_s1, _Force_s2, _Force_n, _Force_weight;
class ForceRecorder {
    constructor(owner) {
        _ForceRecorder_owner.set(this, void 0);
        _ForceRecorder_forces.set(this, void 0);
        _ForceRecorder_nbrReadings.set(this, 0);
        __classPrivateFieldSet(this, _ForceRecorder_owner, owner, "f");
        __classPrivateFieldSet(this, _ForceRecorder_forces, ForceRecorder.FORCE_NAME.map((v, i) => new Force(v)), "f");
    }
    addData(idxBhvr, force, weighting) {
        var _a;
        if (idxBhvr >= 0 && idxBhvr < NBR_BEHAVIOURS) {
            __classPrivateFieldSet(this, _ForceRecorder_nbrReadings, (_a = __classPrivateFieldGet(this, _ForceRecorder_nbrReadings, "f"), _a++, _a), "f");
            __classPrivateFieldGet(this, _ForceRecorder_forces, "f")[idxBhvr].addData(force.length(), weighting);
        }
    }
    clearData() {
        __classPrivateFieldSet(this, _ForceRecorder_nbrReadings, 0, "f");
        for (let f of __classPrivateFieldGet(this, _ForceRecorder_forces, "f"))
            f.clearData();
    }
    hasData() { return (__classPrivateFieldGet(this, _ForceRecorder_nbrReadings, "f") > 1); }
    toString() {
        let s = `----------------------------------------------------------------------------------------\n`;
        s += `Owner ID: ${__classPrivateFieldGet(this, _ForceRecorder_owner, "f").id} \n`;
        s += `Force calculator:  Weighted Truncated Running Sum with Prioritization. \n`;
        s += `Max force:  ${__classPrivateFieldGet(this, _ForceRecorder_owner, "f").maxForce} \n`;
        s += '                           Min         Max         Avg     Std Dev   Count   Weighting\n';
        for (let force of __classPrivateFieldGet(this, _ForceRecorder_forces, "f"))
            if (force.hasData())
                s += `   ${force.toString()} \n`;
        s += `----------------------------------------------------------------------------------------\n`;
        return s;
    }
}
_ForceRecorder_owner = new WeakMap(), _ForceRecorder_forces = new WeakMap(), _ForceRecorder_nbrReadings = new WeakMap();
ForceRecorder.FORCE_NAME = [
    'Wall avoid     ', 'Obstacle avoid ', 'Evade          ', 'Flee           ',
    'Separation     ', 'Alignment      ', 'Cohesion       ', 'Seek           ',
    'Arrive         ', 'Wander         ', 'Pursuit        ', 'Offset Pursuit ',
    'Interpose      ', 'Hide           ', 'Path           ', 'Flock          '
];
class Force {
    constructor(forceName) {
        _Force_forceName.set(this, '');
        _Force_min.set(this, Number.MAX_VALUE);
        _Force_max.set(this, 0);
        _Force_s1.set(this, 0);
        _Force_s2.set(this, 0);
        _Force_n.set(this, 0);
        _Force_weight.set(this, 0);
        __classPrivateFieldSet(this, _Force_forceName, forceName, "f");
    }
    clearData() {
        __classPrivateFieldSet(this, _Force_min, Number.MAX_VALUE, "f");
        __classPrivateFieldSet(this, _Force_max, 0, "f");
        __classPrivateFieldSet(this, _Force_s1, 0, "f");
        __classPrivateFieldSet(this, _Force_s2, 0, "f");
        __classPrivateFieldSet(this, _Force_n, 0, "f");
    }
    addData(forceMagnitude, weighting) {
        var _a;
        __classPrivateFieldSet(this, _Force_weight, weighting, "f");
        if (forceMagnitude < __classPrivateFieldGet(this, _Force_min, "f"))
            __classPrivateFieldSet(this, _Force_min, forceMagnitude, "f");
        if (forceMagnitude > __classPrivateFieldGet(this, _Force_max, "f"))
            __classPrivateFieldSet(this, _Force_max, forceMagnitude, "f");
        __classPrivateFieldSet(this, _Force_s1, __classPrivateFieldGet(this, _Force_s1, "f") + forceMagnitude, "f");
        __classPrivateFieldSet(this, _Force_s2, __classPrivateFieldGet(this, _Force_s2, "f") + forceMagnitude * forceMagnitude, "f");
        __classPrivateFieldSet(this, _Force_n, (_a = __classPrivateFieldGet(this, _Force_n, "f"), _a++, _a), "f");
    }
    hasData() { return (__classPrivateFieldGet(this, _Force_n, "f") > 0); }
    getAverage() {
        if (__classPrivateFieldGet(this, _Force_n, "f") > 0)
            return __classPrivateFieldGet(this, _Force_s1, "f") / __classPrivateFieldGet(this, _Force_n, "f");
        return 0;
    }
    getStdDev() {
        if (__classPrivateFieldGet(this, _Force_n, "f") > 0)
            return Math.sqrt(__classPrivateFieldGet(this, _Force_n, "f") * __classPrivateFieldGet(this, _Force_s2, "f") - __classPrivateFieldGet(this, _Force_s1, "f") * __classPrivateFieldGet(this, _Force_s1, "f")) / __classPrivateFieldGet(this, _Force_n, "f");
        return 0;
    }
    toString() {
        function fmt(n, nd, bufferLength) {
            let s = n.toFixed(nd).toString();
            while (s.length < bufferLength)
                s = ' ' + s;
            return s;
        }
        let s = __classPrivateFieldGet(this, _Force_forceName, "f");
        s += `${fmt(__classPrivateFieldGet(this, _Force_min, "f"), 2, 12)}`;
        s += `${fmt(__classPrivateFieldGet(this, _Force_max, "f"), 2, 12)}`;
        s += `${fmt(this.getAverage(), 2, 12)}`;
        s += `${fmt(this.getStdDev(), 2, 12)}`;
        s += `${fmt(__classPrivateFieldGet(this, _Force_n, "f"), 0, 8)}`;
        s += `${fmt(__classPrivateFieldGet(this, _Force_weight, "f"), 2, 12)}`;
        return s;
    }
}
_Force_forceName = new WeakMap(), _Force_min = new WeakMap(), _Force_max = new WeakMap(), _Force_s1 = new WeakMap(), _Force_s2 = new WeakMap(), _Force_n = new WeakMap(), _Force_weight = new WeakMap();
//# sourceMappingURL=forcerecorder.js.map