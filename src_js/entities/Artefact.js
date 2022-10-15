class Artefact extends Entity {
    constructor(center, width, height) {
        super(center);
        this.type = ARTEFACT;
        this._width = width;
        this._height = height;
        this._lowX = center.x - width / 2;
        this._lowY = center.y - height / 2;
        this._highX = center.x + width / 2;
        this._highY = center.y + height / 2;
    }
    fits_inside(lowX, lowY, highX, highY) {
        let fits = (this._lowX >= lowX) && (this._highX <= highX)
            && (this._lowY >= lowY) && (this._highY <= highY);
        return fits;
    }
    update(elapsedTime) {
        throw new Error("Method not implemented.");
    }
}
//# sourceMappingURL=Artefact.js.map