class ForceRecorder {

    _owner: Vehicle;
    _forces: Array<Force>;

    _nbrReadings = 0;

    constructor(owner: Vehicle, weights: Array<number>) {
        this._owner = owner;
        this._forces = FORCE_NAME.map((v, i) => new Force(this, i, v, weights[i]));
    }

    addData(typeFlag: number, force: Vector2D) {
        if (typeFlag >= 0 && typeFlag < NBR_BEHAVIOURS) {
            this._nbrReadings++;
            this._forces[typeFlag].addData(force.length());
        }
    }

    clearData() {
        this._nbrReadings = 0;
        for (let f of this._forces) f.clearData();
    }

    hasData(): boolean { return (this._nbrReadings > 1); }

    toString() {
        let s = `----------------------------------------------------------------------------------------\n`;
        s += `Owner ID: ${this._owner.id} \n`;
        s += `Force calculator:  ${Symbol.keyFor(this._owner.pilot._forceCalcMethod)} \n`;
        s += `Max force:  ${this._owner.maxForce} \n`;
        s += '                           Min         Max         Avg     Std Dev   Count   Weighting\n';
        for (let force of this._forces)
            if (force.hasData()) s += `   ${force.toString()} \n`;
        s += `----------------------------------------------------------------------------------------\n`;
        return s;
    }

}

class Force {
    _recorder: ForceRecorder;
    _forceID = -1;
    _forceName = '';
    _min = Number.MAX_VALUE;
    _max = 0;
    _s1 = 0;
    _s2 = 0;
    _n = 0;
    _weight: number;

    constructor(recorder: ForceRecorder, forceID: number, forceName: string, weighting: number) {
        this._recorder = recorder;
        this._forceID = forceID;
        this._forceName = forceName;
        this._weight = weighting;
    }

    clearData() {
        this._min = Number.MAX_VALUE;
        this._max = 0;
        this._s1 = 0;
        this._s2 = 0;
        this._n = 0;
    }

    addData(forceMagnitude: number) {
        if (forceMagnitude < this._min) this._min = forceMagnitude;
        if (forceMagnitude > this._max) this._max = forceMagnitude;
        this._s1 += forceMagnitude;
        this._s2 += forceMagnitude * forceMagnitude;
        this._n++;
    }

    hasData() { return (this._n > 0); }

    getAverage() {
        if (this._n > 0) return this._s1 / this._n;
        return 0;
    }

    getStdDev() {
        if (this._n > 0) return Math.sqrt(this._n * this._s2 - this._s1 * this._s1) / this._n;
        return 0;
    }

    toString() {
        function fmt(n: number, nd: number, bufferLength: number) {
            let s = n.toFixed(nd).toString();
            while (s.length < bufferLength) s = ' ' + s;
            return s;
        }
        let s = this._forceName;
        s += `${fmt(this._min, 2, 12)}`
        s += `${fmt(this._max, 2, 12)}`
        s += `${fmt(this.getAverage(), 2, 12)}`;
        s += `${fmt(this.getStdDev(), 2, 12)}`;
        s += `${fmt(this._n, 0, 8)}`;
        s += `${fmt(this._weight, 2, 12)}`;
        return s;
    }

}

