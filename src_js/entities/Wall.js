class Wall extends Entity {
    #start;
    get start() { return this.#start; }
    ;
    #end;
    get end() { return this.#end; }
    ;
    #norm;
    get norm() { return this.#norm; }
    ;
    #repelSide;
    setRepelSide(s) { this.#repelSide = s; return this; }
    set repelSide(s) { this.#repelSide = s; }
    get repelSide() { return this.#repelSide; }
    constructor(start, end, repelSide = BOTH_SIDES) {
        let vs = Vector2D.from(start), ve = Vector2D.from(end);
        super(vs.add(ve).div(2), 1);
        this.Z = 64;
        this.#start = vs;
        this.#end = ve;
        this.#norm = new Vector2D(-(this.#end.y - this.#start.y), this.#end.x - this.#start.x);
        this.#norm = this.#norm.normalize();
        this.repelSide = repelSide;
    }
    fitsInside(lowX, lowY, highX, highY) {
        let x0 = Math.min(this.start.x, this.end.x), y0 = Math.min(this.start.y, this.end.y);
        let x1 = Math.max(this.start.x, this.end.x), y1 = Math.max(this.start.y, this.end.y);
        return x0 >= lowX && y0 >= lowY && x1 <= highX && y1 <= highY;
    }
    isEitherSide(p0, p1) {
        return Geom2D.line_line(p0.x, p0.y, p1.x, p1.y, this.start.x, this.start.y, this.end.x, this.end.y);
    }
    toString() {
        let s = `${this.constructor.name}  @  [${this.start.x.toFixed(FXD)}, ${this.start.y.toFixed(FXD)}]  `;
        s += `from [${this.start.x.toFixed(FXD)}, ${this.start.y.toFixed(FXD)}]  `;
        s += `to [${this.end.x.toFixed(FXD)}, ${this.end.y.toFixed(FXD)}]  `;
        return s;
    }
}
//# sourceMappingURL=wall.js.map