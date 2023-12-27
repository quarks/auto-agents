class ForceRecorder {
    constructor() {
        this.forceNames = [
            " Wall avoid.    ",
            " Obstacle avoid ",
            " Evade          ",
            " Flee           ",
            " Separation     ",
            " Alignment      ",
            " Cohesion       ",
            " Seek           ",
            " Arrive         ",
            " Wander         ",
            " Pursuit        ",
            " Offset Pursuit ",
            " Interpose      ",
            " Hide           ",
            " Path           ",
            " Flock          "
        ];
        this.spacer = "                                         ";
        this.nbrReadings = 0;
        // public String toString() {
        // 	StringBuilder s = new StringBuilder("------------------------------------------------------------------------------");
        //     s.append("\nName:   " + owner.name());
        //     s.append("\nID:     " + owner.ID());
        //     if (owner.AP().calculateMethod() == WEIGHTED)
        //         s.append("\nForce calculator:   Weighted Truncated Sum");
        //     else
        //         s.append("\nForce calculator:   Weighted Truncated Running Sum with Prioritization");
        //     s.append("\nMax force: " + owner.maxForce() + "\n");
        //     s.append("\n                        Min        Max        Avg    Std Dev  Count     Weight");
        //     for (Force f : forces) {
        //         if (f.hasData())
        //             s.append("\n" + f.toString());
        //     }
        //     s.append("\n------------------------------------------------------------------------------");
        //     return new String(s);
        // }
    }
    ForceRecorder(owner) {
        this.owner = owner;
        this.forces = new Array(16);
        for (let i = 0; i < this.forces.length; i++)
            this.forces[i] = new Force(i, this.forceNames[i]);
    }
    addData(type, force) {
        if (type >= 0 && type < this.forces.length) {
            let mag = force.length();
            if (mag > 1) {
                this.nbrReadings++;
                this.forces[type].addData(mag);
            }
        }
    }
    hasData() {
        return (this.nbrReadings > 0);
    }
}
class Force {
    constructor(id, name) {
        this.forceID = -1;
        this.min = Number.MAX_VALUE;
        this.max = 0;
        this.s1 = 0;
        this.s2 = 0;
        this.n = 0;
        this.forceID = (1 << id);
        this.name = name;
    }
    addData(forceMagnitude) {
        if (forceMagnitude < this.min)
            this.min = forceMagnitude;
        if (forceMagnitude > this.max)
            this.max = forceMagnitude;
        this.s1 += forceMagnitude;
        this.s2 += forceMagnitude * forceMagnitude;
        this.n++;
    }
    hasData() {
        return (this.n > 0);
    }
    getAverage() {
        if (this.n > 0)
            return this.s1 / this.n;
        else
            return 0;
    }
    getStdDev() {
        return Math.sqrt(this.n * this.s2 - this.s1 * this.s1) / this.n;
    }
}
//# sourceMappingURL=forcerecorder.js.map