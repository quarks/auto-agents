class Domain {
    /**
     * Create a Domain object given the top-left and bottom-right coordinates.
     * @param lowX
     * @param lowY
     * @param highX
     * @param highY
     */
    constructor(lowX, lowY, highX, highY) {
        this.lowX = lowX;
        this.lowY = lowY;
        this.highX = highX;
        this.highY = highY;
        this.centre = new Vector2D((lowX + highX) / 2, (lowY + highY) / 2);
        this.width = highX - lowX;
        this.height = highY - lowY;
    }
    /**
     * Create a Domain that is a copy of another one.
     * @param d domain to be copied
     */
    set_d(d) {
        this.lowX = d.lowX;
        this.lowY = d.lowY;
        this.highX = d.highX;
        this.highY = d.highY;
        this.width = this.highX - this.lowX;
        this.height = this.highY - this.lowY;
        this.centre = d.centre.copy();
    }
    /**
     *
     * @returns a copy of this domain object
     */
    copy() {
        return new Domain(this.lowX, this.lowY, this.highX, this.highY);
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
        this.lowX = lowX;
        this.lowY = lowY;
        this.width = width;
        this.height = height;
        this.highX = lowX + width;
        this.highY = lowY + height;
        this.centre.set((lowX + this.highX) / 2, (lowY + this.highY) / 2);
    }
    /**
     * Centre the domain about the given world position.
     * @param wx world x position
     * @param wy world y position
     */
    move_centre_xy_to(wx, wy) {
        this.centre.set(wx, wy);
        this.lowX = this.centre.x - this.width / 2;
        this.lowY = this.centre.y - this.height / 2;
        this.highX = this.lowX + this.width;
        this.highY = this.lowY + this.height;
    }
    /**
     * Centre the domain about the given horizontal position.
     * @param wx world x position
     */
    move_centre_x_to(wx) {
        this.centre.x = wx;
        this.lowX = this.centre.x - this.width / 2;
        this.highX = this.lowX + this.width;
    }
    /**
     * Centre the domain about the given vertical position.
     * @param wy world y position
     */
    move_centre_y_to(wy) {
        this.centre.y = wy;
        this.lowY = this.centre.y - this.height / 2;
        this.highY = this.lowY + this.height;
    }
    /**
     * Centre the domain about the given position.
     * @param wx world x centre position
     * @param wy world y centre position
     */
    move_centre_xy_by(wx, wy) {
        this.centre.x -= wx;
        this.centre.y -= wy;
        this.lowX -= wx;
        this.lowY -= wy;
        this.highX = this.lowX + this.width;
        this.highY = this.lowY + this.height;
    }
    /**
     * Move the domain centre horizontally by the world distance given.
     * @param wx world x centre position
     */
    move_centre_x_by(wx) {
        this.centre.x -= wx;
        this.lowX -= wx;
        this.highX = this.lowX + this.width;
    }
    /**
     * Move the domain centre vertically by the world distance given.
     * @param wy world y centre position
     */
    move_centre_y_by(wy) {
        this.centre.y -= wy;
        this.lowY -= wy;
        this.highY = this.lowY + this.height;
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
        return (x >= this.lowX && x <= this.highX && y >= this.lowY && y <= this.highY);
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
        return `Domain from ${this.lowX}, ${this.lowY} to ${this.highX}, ${this.highY}  Size ${this.width}, ${this.height}`;
    }
}
//# sourceMappingURL=Domain.js.map