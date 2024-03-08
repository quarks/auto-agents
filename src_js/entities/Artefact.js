class Artefact extends Entity {
    #lowX;
    get lowX() { return this.#lowX; }
    #highX;
    get highX() { return this.#highX; }
    #lowY;
    get lowY() { return this.#lowY; }
    #highY;
    get highY() { return this.#highY; }
    #width;
    get width() { return this.#width; }
    #height;
    get height() { return this.#height; }
    constructor(center, width, height) {
        super(center);
        this.Z = 8;
        this.#width = width;
        this.#height = height;
        this.#lowX = center.x - width / 2;
        this.#lowY = center.y - height / 2;
        this.#highX = center.x + width / 2;
        this.#highY = center.y + height / 2;
    }
    fits_inside(lowX, lowY, highX, highY) {
        let fits = (this.#lowX >= lowX) && (this.#highX <= highX)
            && (this.#lowY >= lowY) && (this.#highY <= highY);
        return fits;
    }
    toString() {
        let s = `Artefact: [${this.#lowX}, ${this.#lowY}] - [${this.#highX}, ${this.#highY}]`;
        s += `    Size: ${this.#width} x ${this.#height}`;
        return s;
    }
}
//# sourceMappingURL=artefact.js.map