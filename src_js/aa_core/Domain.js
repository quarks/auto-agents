class Domain {
    /**
     * Create a Domain object given the top-left and bottom-right coordinates.
     * @param lowX
     * @param lowY
     * @param highX
     * @param highY
     */
    constructor(lowX, lowY, highX, highY) {
        this._lowX = lowX;
        this._lowY = lowY;
        this._highX = highX;
        this._highY = highY;
        this._center = new Vector2D((lowX + highX) / 2, (lowY + highY) / 2);
        this._width = highX - lowX;
        this._height = highY - lowY;
    }
    // Domain attribute getters
    get lowX() { return this._lowX; }
    get highX() { return this._highX; }
    get lowY() { return this._lowY; }
    get highY() { return this._highY; }
    get center() { return this._center; }
    get width() { return this._width; }
    get height() { return this._height; }
    /**
     * Create a Domain that is a copy of another one.
     * @param d domain to be copied
     */
    set_d(d) {
        this._lowX = d._lowX;
        this._lowY = d._lowY;
        this._highX = d._highX;
        this._highY = d._highY;
        this._width = this._highX - this._lowX;
        this._height = this._highY - this._lowY;
        this._center = d._center.copy();
    }
    /**
     *
     * @returns a copy of this domain object
     */
    copy() {
        return new Domain(this._lowX, this._lowY, this._highX, this._highY);
    }
    /**
     * Set the domain size.
     *
     * @param lowX top-left x coordinate
     * @param lowY top-left y coordinate
     * @param width domain width
     * @param height domain height
     */
    set_xywh(lowX, lowY, width, height) {
        this._lowX = lowX;
        this._lowY = lowY;
        this._width = width;
        this._height = height;
        this._highX = lowX + width;
        this._highY = lowY + height;
        this._center.set([(lowX + this._highX) / 2, (lowY + this._highY) / 2]);
    }
    /**
     * Centre the domain about the given world position.
     * @param wx world x position
     * @param wy world y position
     */
    move_centre_xy_to(wx, wy) {
        this._center.set([wx, wy]);
        this._lowX = this._center.x - this._width / 2;
        this._lowY = this._center.y - this._height / 2;
        this._highX = this._lowX + this._width;
        this._highY = this._lowY + this._height;
    }
    /**
     * Centre the domain about the given horizontal position.
     * @param wx world x position
     */
    move_centre_x_to(wx) {
        this._center.x = wx;
        this._lowX = this._center.x - this._width / 2;
        this._highX = this._lowX + this._width;
    }
    /**
     * Centre the domain about the given vertical position.
     * @param wy world y position
     */
    move_centre_y_to(wy) {
        this._center.y = wy;
        this._lowY = this._center.y - this._height / 2;
        this._highY = this._lowY + this._height;
    }
    /**
     * Centre the domain about the given position.
     * @param wx world x centre position
     * @param wy world y centre position
     */
    move_centre_xy_by(wx, wy) {
        this._center.x -= wx;
        this._center.y -= wy;
        this._lowX -= wx;
        this._lowY -= wy;
        this._highX = this._lowX + this._width;
        this._highY = this._lowY + this._height;
    }
    /**
     * Move the domain centre horizontally by the world distance given.
     * @param wx world x centre position
     */
    move_centre_x_by(wx) {
        this._center.x -= wx;
        this._lowX -= wx;
        this._highX = this._lowX + this._width;
    }
    /**
     * Move the domain centre vertically by the world distance given.
     * @param wy world y centre position
     */
    move_centre_y_by(wy) {
        this._center.y -= wy;
        this._lowY -= wy;
        this._highY = this._lowY + this._height;
    }
    /**
     * See if this point is within the domain
     * @param x the x position or point to test
     * @param y the y position (optional)
     * @return true if the point is on or inside the boundary of this domain
     */
    contains(x, y) {
        if (x instanceof Vector2D) {
            y = x.y;
            x = x.x;
        }
        return (x >= this._lowX && x <= this._highX && y >= this._lowY && y <= this._highY);
    }
    /**
     * See if this point is within a box scaled by the second parameter. <br>
     * fraction must be >0 otherwise the function always returns false. A value
     * of 1 will test against the full size domain and a value of 0.5 means the
     * point p must be in the middle half both horizontally and vertically. <br>
     *
     * @param p the point to test
     * @param fraction the scale of the domain to consider
     * @return true if the point is on or inside the boundary of this scaled domain
     */
    // contains(p: Vector2D, fraction: number = 1) {
    // 	let dx = Math.abs(p.x - this.centre.x) / this.width;
    // 	let dy = Math.abs(p.y - this.centre.y) / this.height;
    // 	return (dx < fraction && dy < fraction);
    // }
    /**
     * Return the Domain as a String
     */
    toString() {
        return `Domain from ${this._lowX}, ${this._lowY} to ${this._highX}, ${this._highY}  Size ${this._width}, ${this._height}`;
    }
}
//# sourceMappingURL=domain.js.map