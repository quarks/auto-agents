class Wall extends Entity {
    constructor(start, end) {
        super(start, 1);
        this._type = WALL;
        this._end = Vector2D.from(end);
    }
    get end() { return this._end; }
    ;
    fitsInside(lowX, lowY, highX, highY) {
        let x0 = Math.min(this.x, this.end.x), y0 = Math.min(this.y, this.end.y);
        let x1 = Math.max(this.x, this.end.x), y1 = Math.max(this.y, this.end.y);
        return x0 >= lowX && y0 >= lowY && x1 <= highX && y1 <= highY;
    }
    update(elapsedTime) {
        // Use enity method?
    }
}
//# sourceMappingURL=wall.js.map