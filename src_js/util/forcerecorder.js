class ForceRecorder {
    #owner;
    #forces;
    #nbrReadings = 0;
    constructor(owner, weights) {
        this.#owner = owner;
        this.#forces = FORCE_NAME.map((v, i) => new Force(v, weights[i]));
    }
    addData(typeFlag, force) {
        if (typeFlag >= 0 && typeFlag < NBR_BEHAVIOURS) {
            this.#nbrReadings++;
            this.#forces[typeFlag].addData(force.length());
        }
    }
    clearData() {
        this.#nbrReadings = 0;
        for (let f of this.#forces)
            f.clearData();
    }
    hasData() { return (this.#nbrReadings > 1); }
    toString() {
        let s = `----------------------------------------------------------------------------------------\n`;
        s += `Owner ID: ${this.#owner.id} \n`;
        s += `Force calculator:  Weighted Truncated Running Sum with Prioritization. \n`;
        s += `Max force:  ${this.#owner.maxForce} \n`;
        s += '                           Min         Max         Avg     Std Dev   Count   Weighting\n';
        for (let force of this.#forces)
            if (force.hasData())
                s += `   ${force.toString()} \n`;
        s += `----------------------------------------------------------------------------------------\n`;
        return s;
    }
}
class Force {
    #forceName = '';
    #min = Number.MAX_VALUE;
    #max = 0;
    #s1 = 0;
    #s2 = 0;
    #n = 0;
    #weight;
    constructor(forceName, weighting) {
        this.#forceName = forceName;
        this.#weight = weighting;
    }
    clearData() {
        this.#min = Number.MAX_VALUE;
        this.#max = 0;
        this.#s1 = 0;
        this.#s2 = 0;
        this.#n = 0;
    }
    addData(forceMagnitude) {
        if (forceMagnitude < this.#min)
            this.#min = forceMagnitude;
        if (forceMagnitude > this.#max)
            this.#max = forceMagnitude;
        this.#s1 += forceMagnitude;
        this.#s2 += forceMagnitude * forceMagnitude;
        this.#n++;
    }
    hasData() { return (this.#n > 0); }
    getAverage() {
        if (this.#n > 0)
            return this.#s1 / this.#n;
        return 0;
    }
    getStdDev() {
        if (this.#n > 0)
            return Math.sqrt(this.#n * this.#s2 - this.#s1 * this.#s1) / this.#n;
        return 0;
    }
    toString() {
        function fmt(n, nd, bufferLength) {
            let s = n.toFixed(nd).toString();
            while (s.length < bufferLength)
                s = ' ' + s;
            return s;
        }
        let s = this.#forceName;
        s += `${fmt(this.#min, 2, 12)}`;
        s += `${fmt(this.#max, 2, 12)}`;
        s += `${fmt(this.getAverage(), 2, 12)}`;
        s += `${fmt(this.getStdDev(), 2, 12)}`;
        s += `${fmt(this.#n, 0, 8)}`;
        s += `${fmt(this.#weight, 2, 12)}`;
        return s;
    }
}
//# sourceMappingURL=forcerecorder.js.map