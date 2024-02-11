class Artefact extends Entity {

    #lowX: number;
    #highX: number;
    #lowY: number;
    #highY: number;
    #width: number;
    #height: number;

    constructor(center: Vector2D, width: number, height: number) {
        super(center);
        this.Z = 8;
        this.#width = width;
        this.#height = height;
        this.#lowX = center.x - width / 2;
        this.#lowY = center.y - height / 2;
        this.#highX = center.x + width / 2;
        this.#highY = center.y + height / 2;
    }

    fits_inside(lowX: number, lowY: number, highX: number, highY: number): boolean {
        let fits: boolean = (this.#lowX >= lowX) && (this.#highX <= highX)
            && (this.#lowY >= lowY) && (this.#highY <= highY);
        return fits;
    }

    render() { }

    toString(): string {
        let s = `Artefact: [${this.#lowX}, ${this.#lowY}] - [${this.#highX}, ${this.#highY}]`;
        s += `    Size: ${this.#width} x ${this.#height}`;
        return s;
    }
}