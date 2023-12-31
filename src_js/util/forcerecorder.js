class ForceRecorder {
    constructor(owner) {
        this._nbrReadings = 0;
        this._owner = owner;
        console.log(FORCE_NAME.map((v, i) => new Force(this, i, v)));
        this._forces = FORCE_NAME.map((v, i) => new Force(this, i, v));
    }
    addData(type, force) {
        if (type >= 0 && type < this._forces.length) {
            let mag = force.length();
            if (mag > 1) {
                this._nbrReadings++;
                this._forces[type].addData(mag);
            }
        }
    }
    hasData() {
        return (this._nbrReadings > 0);
    }
    toString() {
        let s = `------------------------------------------------------------------------------------------------`;
        s += `Owner ID: ${this._owner.id} \n`;
        s += `Force calculator:  ${Symbol.keyFor(this._owner.pilot._forceCalcMethod)} \n`;
        s += `Max force:  ${this._owner.maxForce} \n`;
        s += '                       Min        Max        Avg    Std Dev  Count     Weight \n';
        for (let force of this._forces)
            if (force.hasData())
                s += `   ${force.toString()}`;
        s += `------------------------------------------------------------------------------------------------`;
        return s;
    }
}
class Force {
    constructor(recorder, forceID, forceName) {
        this._forceID = -1;
        this._forceName = '';
        this._min = Number.MAX_VALUE;
        this._max = 0;
        this._s1 = 0;
        this._s2 = 0;
        this._n = 0;
        this._recorder = recorder;
        this._forceID = forceID;
        this._forceName = forceName;
    }
    addData(forceMagnitude) {
        if (forceMagnitude < this._min)
            this._min = forceMagnitude;
        if (forceMagnitude > this._max)
            this._max = forceMagnitude;
        this._s1 += forceMagnitude;
        this._s2 += forceMagnitude * forceMagnitude;
        this._n++;
    }
    hasData() {
        return (this._n > 0);
    }
    getAverage() {
        if (this._n > 0)
            return this._s1 / this._n;
        else
            return 0;
    }
    getStdDev() {
        if (this._n > 0)
            return Math.sqrt(this._n * this._s2 - this._s1 * this._s1) / this._n;
        else
            return 0;
    }
    toString() {
        function fmt(n, nd, bufferLength) {
            let s = n.toFixed(nd).toString();
            while (s.length < bufferLength)
                s = ' ' + s;
            return s;
        }
        let s = this._forceName;
        s += `${fmt(this._min, 2, 12)}`;
        s += `${fmt(this._max, 2, 12)}`;
        s += `${fmt(this.getAverage(), 2, 12)}`;
        s += `${fmt(this.getStdDev(), 2, 12)}`;
        s += `${fmt(this._n, 0, 6)}`;
        // s.append(getString(min, "  #####0.00"));
        // s.append(getString(max, "  #####0.00"));
        // s.append(getString(getAverage(), "  #####0.00"));
        // s.append(getString(getStdDev(), "  #####0.00"));
        // s.append(getString(n, "  #####"));
        //s.append(getString(owner.AP().getWeight(forceID), "  #####0.00"));
        return s;
    }
}
//# sourceMappingURL=forcerecorder.js.map