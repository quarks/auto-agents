class Wall extends Entity {

    _end: Vector2D;

    get end() { return this._end };

    constructor(start: Position, end: Position) {
        super(start, 1); this._type = WALL;
        this._end = Vector2D.from(end);
    }

    fitsInside(lowX: number, lowY: number, highX: number, highY: number): boolean {
        let x0 = Math.min(this.x, this.end.x), y0 = Math.min(this.y, this.end.y);
        let x1 = Math.max(this.x, this.end.x), y1 = Math.max(this.y, this.end.y);
        return x0 >= lowX && y0 >= lowY && x1 <= highX && y1 <= highY;
    }

    update(elapsedTime: number): void {
        // Use enity method?
    }

    // toString(len: number = 5): string {
    //     function fmt(n: number, nd: number, bufferLength: number) {
    //         let s = n.toFixed(nd).toString();
    //         while (s.length < bufferLength) s = ' ' + s;
    //         return s;
    //     }
    //     let s = `Wall ID: ${fmt(this.id, 0, 2)}`;
    //     s += `    [${fmt(this.x, 0, len)}, ${fmt(this.y, 0, len)}]-`;
    //     s += `[${fmt(this.end.x, 0, len)}, ${fmt(this.end.y, 0, len)}]`;
    //     return s;
    // }
}