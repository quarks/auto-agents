class Artefact extends Entity {

    _lowX: number;
    _highX: number;
    _lowY: number;
    _highY: number;
    _width: number;
    _height: number;

    constructor(center: Vector2D, width: number, height: number) {
        super(center);
        this._width = width;
        this._height = height;
        this._lowX = center.x - width / 2;
        this._lowY = center.y - height / 2;
        this._highX = center.x + width / 2;
        this._highY = center.y + height / 2;
    }

    fits_inside(lowX: number, lowY: number, highX: number, highY: number): boolean {
        let fits: boolean = (this._lowX >= lowX) && (this._highX <= highX)
            && (this._lowY >= lowY) && (this._highY <= highY);
        return fits;
    }

    render() { }

}