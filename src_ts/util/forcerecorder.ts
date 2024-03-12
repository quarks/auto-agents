
/**
 * Represents a single stearing force
 */
class Force {
    #forceName = '';
    #min = Number.MAX_VALUE; #max = 0;
    #s1 = 0; #s2 = 0; #n = 0;
    #weight = 0;

    constructor(forceName: string) {
        this.#forceName = forceName;
    }

    clearData() {
        this.#min = Number.MAX_VALUE;
        this.#max = 0;
        this.#s1 = 0;
        this.#s2 = 0;
        this.#n = 0;
    }

    addData(forceMagnitude: number, weighting: number) {
        this.#weight = weighting;
        if (forceMagnitude < this.#min) this.#min = forceMagnitude;
        if (forceMagnitude > this.#max) this.#max = forceMagnitude;
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
        function fmt(n: number, nd: number, bufferLength: number) {
            let s = n.toFixed(nd).toString();
            while (s.length < bufferLength) s = ' ' + s;
            return s;
        }
        let s = this.#forceName;
        s += `${fmt(this.#min, 2, 12)}`
        s += `${fmt(this.#max, 2, 12)}`
        s += `${fmt(this.getAverage(), 2, 12)}`;
        s += `${fmt(this.getStdDev(), 2, 12)}`;
        s += `${fmt(this.#n, 0, 8)}`;
        s += `${fmt(this.#weight, 2, 12)}`;
        return s;
    }

}


/**
 * Records the steering forces applied to a vehicle. Can be used when tweeking
 * stearing force weights and max. force acting on a vehicle.
 */
class ForceRecorder {
    static FORCE_NAME = [
        'Wall avoid     ', 'Obstacle avoid ', 'Evade          ', 'Flee           ',
        'Separation     ', 'Alignment      ', 'Cohesion       ', 'Seek           ',
        'Arrive         ', 'Wander         ', 'Pursuit        ', 'Offset Pursuit ',
        'Interpose      ', 'Hide           ', 'Path           ', 'Flock          '
    ];

    #owner: Vehicle;
    #forces: Array<Force>;

    #nbrReadings = 0;

    constructor(owner: Vehicle) {
        this.#owner = owner;
        this.#forces = ForceRecorder.FORCE_NAME.map((v, i) => new Force(v));
    }

    addData(idxBhvr: number, force: Vector2D, weighting: number) {
        if (idxBhvr >= 0 && idxBhvr < NBR_BEHAVIOURS) {
            this.#nbrReadings++;
            this.#forces[idxBhvr].addData(force.length(), weighting);
        }
    }

    clearData() {
        this.#nbrReadings = 0;
        for (let f of this.#forces) f.clearData();
    }

    hasData(): boolean { return (this.#nbrReadings > 1); }

    toString() {
        let s = `----------------------------------------------------------------------------------------\n`;
        s += `Owner ID: ${this.#owner.id} \n`;
        s += `Force calculator:  Weighted Truncated Running Sum with Prioritization. \n`;
        s += `Max force:  ${this.#owner.maxForce} \n`;
        s += '                           Min         Max         Avg     Std Dev   Count   Weighting\n';
        for (let force of this.#forces)
            if (force.hasData()) s += `   ${force.toString()} \n`;
        s += `----------------------------------------------------------------------------------------\n`;
        return s;
    }
}
