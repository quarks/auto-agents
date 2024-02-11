class Wall extends Entity {
    #end;
    get end() { return this.#end; }
    ;
    get start() { return this.pos; }
    ;
    #norm;
    get norm() { return this.#norm; }
    ;
    #repelSide;
    setRepelSide(s) { this.repelSide = s; return this; }
    set repelSide(s) {
        switch (s) {
            case OUTSIDE:
            case INSIDE:
            case BOTH_SIDES:
                this.#repelSide = s;
                break;
            default:
                this.#repelSide == NO_SIDE;
        }
    }
    get repelSide() { return this.#repelSide; }
    constructor(start, end, repelSide = OUTSIDE) {
        super(start, 1);
        this.Z = 64;
        this.#end = Vector2D.from(end);
        this.#norm = new Vector2D(-(end.y - start.y), end.x - start.x);
        this.#norm = this.#norm.normalize();
        this.repelSide = repelSide;
    }
    fitsInside(lowX, lowY, highX, highY) {
        let x0 = Math.min(this.x, this.end.x), y0 = Math.min(this.y, this.end.y);
        let x1 = Math.max(this.x, this.end.x), y1 = Math.max(this.y, this.end.y);
        return x0 >= lowX && y0 >= lowY && x1 <= highX && y1 <= highY;
    }
    isEitherSide(p0, p1) {
        return Geom2D.line_line(p0.x, p0.y, p1.x, p1.y, this.start.x, this.start.y, this.end.x, this.end.y);
    }
}
//# sourceMappingURL=wall.js.map