class Wall extends Entity {

    #end: Vector2D;
    get end() { return this.#end };
    get start() { return this.pos };

    #norm: Vector2D;
    get norm() { return this.#norm };

    #repelSide: symbol;

    setRepelSide(s: symbol) { this.repelSide = s; return this; }
    set repelSide(s: symbol) {
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

    constructor(start: _XY_, end: _XY_, repelSide = OUTSIDE) {
        super(start, 1);
        this.#end = Vector2D.from(end);
        this.#norm = new Vector2D(-(end.y - start.y), end.x - start.x);
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