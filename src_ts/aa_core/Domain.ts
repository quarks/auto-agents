class Domain {
	_lowX: number;
	_highX: number;
	_lowY: number;
	_highY: number;
	_cX: number;
	_cY: number;
	_width: number;
	_height: number;
	_constraint = REBOUND;

	/**
	 * Create a Domain object given the top-left and bottom-right coordinates.
	 * @param lowX
	 * @param lowY
	 * @param highX
	 * @param highY
	 */

	// Domain attribute getters
	get lowX(): number { return this._lowX; }
	get highX(): number { return this._highX; }
	get lowY(): number { return this._lowY; }
	get highY(): number { return this._highY; }
	get cX(): number { return this._cX; }
	get cY(): number { return this._cY; }
	get width(): number { return this._width; }
	get height(): number { return this._height; }
	get constraint(): symbol { return this._constraint; }
	set constraint(c: symbol) {
		if (c == REBOUND || c == WRAP || c == PASS_THROUGH)
			this._constraint = c;
	}

	constructor(lowX: number, lowY: number, highX: number, highY: number, constraint = REBOUND) {
		this._lowX = lowX; this._lowY = lowY;
		this._highX = highX; this._highY = highY;
		this._width = highX - lowX; this._height = highY - lowY;
		this._cX = (lowX + highX) / 2; this._cY = (lowY + highY) / 2;
		this._constraint = constraint;
	}

	/**
	 * Create a Domain that is a copy of another one.
	 * @param d domain to be copied
	 */
	set_d(d: Domain) {
		this._lowX = d._lowX; this._lowY = d._lowY;
		this._highX = d._highX; this._highY = d._highY;
		this._width = d._width; this._height = d._height;
		this._cX = d._cX; this._cY = d._cY;
		this._constraint = d._constraint;
	}

	/**
	 * 
	 * @returns a copy of this domain object
	 */
	copy(): Domain {
		return new Domain(this._lowX, this._lowY, this._highX, this._highY, this._constraint);
	}

	/**
	 * Set the domain size.
	 * 
	 * @param lowX top-left x coordinate
	 * @param lowY top-left y coordinate
	 * @param width domain width
	 * @param height domain height
	 */
	set_xywh(lowX: number, lowY: number, width: number, height: number) {
		this._lowX = lowX; this._lowY = lowY;
		this._width = width; this._height = height;
		this._highX = lowX + width; this._highY = lowY + height;
		this._cX = (this._lowX + this._highX) / 2;
		this._cY = (this._lowY + this._highY) / 2;
	}

	/**
	 * Centre the domain about the given world position.
	 * @param wx world x position
	 * @param wy world y position
	 */
	move_centre_xy_to(wx, wy) {
		this._cX = wx; this._cY = wy;
		this._lowX = this._cX - this._width / 2;
		this._lowY = this._cY - this._height / 2;
		this._highX = this._lowX + this._width;
		this._highY = this._lowY + this._height;
	}

	/**
	 * Centre the domain about the given horizontal position.
	 * @param wx world x position
	 */
	move_centre_x_to(wx) {
		this._cX = wx;
		this._lowX = this._cX - this._width / 2;
		this._highX = this._lowX + this._width;
	}

	/**
	 * Centre the domain about the given vertical position.
	 * @param wy world y position
	 */
	move_centre_y_to(wy) {
		this._cY = wy;
		this._lowY = this._cY - this._height / 2;
		this._highY = this._lowY + this._height;
	}

	/**
	 * Centre the domain about the given position.
	 * @param wx world x centre position
	 * @param wy world y centre position
	 */
	move_centre_xy_by(wx, wy) {
		this._cX -= wx; this._cY -= wy;
		this._lowX -= wx; this._lowY -= wy;
		this._highX = this._lowX + this._width;
		this._highY = this._lowY + this._height;
	}

	/**
	 * Move the domain centre horizontally by the world distance given.
	 * @param wx world x centre position
	 */
	move_centre_x_by(wx) {
		this._cX -= wx;
		this._lowX -= wx;
		this._highX = this._lowX + this._width;
	}

	/**
	 * Move the domain centre vertically by the world distance given.
	 * @param wy world y centre position
	 */
	move_centre_y_by(wy) {
		this._cY -= wy;
		this._lowY -= wy;
		this._highY = this._lowY + this._height;
	}

	/**
	 * See if this point is within the domain
	 * @param x the x position or point to test
	 * @param y the y position (optional)
	 * @return true if the point is on or inside the boundary of this domain
	 */
	contains(x: number | Vector2D, y?: number): boolean {
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
		let s = `Domain from ${this._lowX}, ${this._lowY} to ${this._highX}, ${this._highY}  `
		s += `Size ${this._width}, ${this._height}  `
		s += `Constraint: ${Symbol.keyFor(this._constraint)}`;
		return s;
	}
}
