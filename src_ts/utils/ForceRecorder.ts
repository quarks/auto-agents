class ForceRecorder {

    forceNames: Array<string> = [
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

    spacer = "                                         ";
    owner: Vehicle;
    forces: Array<Force>;
    nbrReadings = 0;

    public ForceRecorder(owner: Vehicle) {
        this.owner = owner;
        this.forces = new Array(16);
        for (let i = 0; i < this.forces.length; i++)
            this.forces[i] = new Force(i, this.forceNames[i]);
    }

    addData(type: number, force: Vector2D): void {
        if (type >= 0 && type < this.forces.length) {
            let mag = force.length();
            if (mag > 1) {
                this.nbrReadings++;
                this.forces[type].addData(mag);
            }
        }
    }

    hasData(): boolean {
        return (this.nbrReadings > 0);
    }

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
class Force {
    name: string;
    forceID = -1;
    min = Number.MAX_VALUE;
    max = 0;
    s1 = 0;
    s2 = 0;
    n = 0;

    constructor(id: number, name: string) {
        this.forceID = (1 << id);
        this.name = name;
    }

    addData(forceMagnitude: number) {
        if (forceMagnitude < this.min) this.min = forceMagnitude;
        if (forceMagnitude > this.max) this.max = forceMagnitude;
        this.s1 += forceMagnitude;
        this.s2 += forceMagnitude * forceMagnitude;
        this.n++;
    }

    hasData(): boolean {
        return (this.n > 0);
    }

    getAverage(): number {
        if (this.n > 0)
            return this.s1 / this.n;
        else
            return 0;
    }

    getStdDev(): number {
        return Math.sqrt(this.n * this.s2 - this.s1 * this.s1) / this.n;
    }


    // private String getString(double number, String pattern) {
    // 		DecimalFormat myFormatter = new DecimalFormat(pattern);
    // 		String ns = myFormatter.format(number);
    // 		int fillLengthReqd = pattern.length() - ns.length();
    //     if (fillLengthReqd > 0)
    //         ns = spacer.substring(0, fillLengthReqd) + ns;
    //     return ns;
    // }

    // public String toString() {
    // 		StringBuilder s = new StringBuilder(name);
    //     s.append(getString(min, "  #####0.00"));
    //     s.append(getString(max, "  #####0.00"));
    //     s.append(getString(getAverage(), "  #####0.00"));
    //     s.append(getString(getStdDev(), "  #####0.00"));
    //     s.append(getString(n, "  #####"));
    //     s.append(getString(owner.AP().getWeight(forceID), "  #####0.00"));
    //     return new String(s);
    // }

}

