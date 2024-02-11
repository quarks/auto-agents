class Artefact extends Entity {
    #lowX;
    #highX;
    #lowY;
    #highY;
    #width;
    #height;
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
    render() { }
    toString() {
        let s = `Artefact: [${this.#lowX}, ${this.#lowY}] - [${this.#highX}, ${this.#highY}]`;
        s += `    Size: ${this.#width} x ${this.#height}`;
        return s;
    }
}
//# sourceMappingURL=artefact.js.map