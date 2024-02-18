class Wall extends Entity {
    #start: Vector2D;
    get start() { return this.#start };

    #end: Vector2D;
    get end() { return this.#end };

    #norm: Vector2D;
    get norm() { return this.#norm };

    #repelSide: symbol;

    setRepelSide(s: symbol) { this.#repelSide = s; return this; }
    set repelSide(s: symbol) { this.#repelSide = s; }
    get repelSide() { return this.#repelSide; }

    constructor(start: _XY_, end: _XY_, repelSide = BOTH_SIDES) {
        let vs = Vector2D.from(start), ve = Vector2D.from(end);
        super(vs.add(ve).div(2), 1);
        this.Z = 64;
        this.#start = vs;
        this.#end = ve;
        this.#norm = new Vector2D(-(this.#end.y - this.#start.y), this.#end.x - this.#start.x);
        this.#norm = this.#norm.normalize();
        this.repelSide = repelSide;
    }

    fitsInside(lowX: number, lowY: number, highX: number, highY: number): boolean {
        let x0 = Math.min(this.x, this.end.x), y0 = Math.min(this.y, this.end.y);
        let x1 = Math.max(this.x, this.end.x), y1 = Math.max(this.y, this.end.y);
        return x0 >= lowX && y0 >= lowY && x1 <= highX && y1 <= highY;
    }

    isEitherSide(p0: Vector2D, p1: Vector2D): boolean {
        return Geom2D.line_line(p0.x, p0.y, p1.x, p1.y, this.start.x,
            this.start.y, this.end.x, this.end.y);
    }

    toString() {
        let s = `${this.constructor.name}  @  [${this.x.toFixed(FXD)}, ${this.y.toFixed(FXD)}]  `;
        s += `from [${this.start.x.toFixed(FXD)}, ${this.start.y.toFixed(FXD)}]  `
        s += `to [${this.end.x.toFixed(FXD)}, ${this.end.y.toFixed(FXD)}]  `
        return s;
    }
}