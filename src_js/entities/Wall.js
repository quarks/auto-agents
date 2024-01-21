class Wall extends Entity {
    constructor(start, end, repelSide = OUTSIDE) {
        super(start, 1);
        this._type = WALL;
        this._end = Vector2D.from(end);
        this._norm = new Vector2D(-(end.y - start.y), end.x - start.x);
        this._norm = this._norm.normalize();
        this.repelSide = repelSide;
    }
    get end() { return this._end; }
    ;
    get start() { return this._pos; }
    ;
    get norm() { return this._norm; }
    ;
    setRepelSide(s) { this.repelSide = s; return this; }
    set repelSide(s) {
        switch (s) {
            case OUTSIDE:
            case INSIDE:
            case BOTH_SIDES:
                this.__repelSide = s;
                break;
            default:
                this.__repelSide == NO_SIDE;
        }
        //console.log(`ID ${this.id}     Repel ${Symbol.keyFor(this.__repelSide)}`)
    }
    get repelSide() { return this.__repelSide; }
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