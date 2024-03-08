class Domain {
	#lowX: number;
	#highX: number;
	#lowY: number;
	#highY: number;
	#cX: number;
	#cY: number;
	#width: number;
	#height: number;
	#constraint = REBOUND;

	/**
	 * Create a Domain object given the top-left and bottom-right coordinates.
	 * @param lowX
	 * @param lowY
	 * @param highX
	 * @param highY
	 */

	// Domain attribute getters
	get lowX(): number { return this.#lowX; }
	get highX(): number { return this.#highX; }
	get lowY(): number { return this.#lowY; }
	get highY(): number { return this.#highY; }
	get cX(): number { return this.#cX; }
	get cY(): number { return this.#cY; }
	get width(): number { return this.#width; }
	get height(): number { return this.#height; }

	get constraint(): symbol { return this.#constraint; }
	set constraint(c: symbol) {
		if (c == REBOUND || c == WRAP || c == PASS_THROUGH)
			this.#constraint = c;
	}
	setConstraint(c: symbol) {
		if (c == REBOUND || c == WRAP || c == PASS_THROUGH)
			this.#constraint = c;
		return this;
	}

	constructor(lowX: number, lowY: number, highX: number, highY: number, constraint = REBOUND) {
		this.#lowX = lowX; this.#lowY = lowY;
		this.#highX = highX; this.#highY = highY;
		this.#width = highX - lowX; this.#height = highY - lowY;
		this.#cX = (lowX + highX) / 2; this.#cY = (lowY + highY) / 2;
		this.#constraint = constraint;
	}

	/** returns a copy of this domain object */
	copy(): Domain {
		return new Domain(this.#lowX, this.#lowY, this.#highX, this.#highY, this.#constraint);
	}

	/**
	 * Create a Domain that is a copy of another one.
	 * @param d domain to be copied
	 */
	set_d(d: Domain) {
		this.#lowX = d.#lowX; this.#lowY = d.#lowY;
		this.#highX = d.#highX; this.#highY = d.#highY;
		this.#width = d.#width; this.#height = d.#height;
		this.#cX = d.#cX; this.#cY = d.#cY;
		this.#constraint = d.#constraint;
	}

	/**
	 * Set the domain size.
	 * @param lowX top-left x coordinate
	 * @param lowY top-left y coordinate
	 * @param width domain width
	 * @param height domain height
	 */
	set_xywh(lowX: number, lowY: number, width: number, height: number) {
		this.#lowX = lowX; this.#lowY = lowY;
		this.#width = width; this.#height = height;
		this.#highX = lowX + width; this.#highY = lowY + height;
		this.#cX = (this.#lowX + this.#highX) / 2;
		this.#cY = (this.#lowY + this.#highY) / 2;
	}

	/**
	 * Centre the domain about the given world position.
	 * @param wx world x position
	 * @param wy world y position
	 */
	move_centre_xy_to(wx: number, wy: number) {
		this.#cX = wx; this.#cY = wy;
		this.#lowX = this.#cX - this.#width / 2;
		this.#lowY = this.#cY - this.#height / 2;
		this.#highX = this.#lowX + this.#width;
		this.#highY = this.#lowY + this.#height;
	}

	/**
	 * Centre the domain about the given horizontal position.
	 * @param wx world x position
	 */
	move_centre_x_to(wx) {
		this.move_centre_xy_to(wx, this.#cY)
	}

	/**
	 * Centre the domain about the given vertical position.
	 * @param wy world y position
	 */
	move_centre_y_to(wy: number) {
		this.move_centre_xy_to(this.#cX, wy)
	}

	/**
	 * Centre the domain about the given position.
	 * @param wx world x centre position
	 * @param wy world y centre position
	 */
	move_centre_xy_by(wx: number, wy: number) {
		this.#cX -= wx; this.#cY -= wy;
		this.#lowX -= wx; this.#lowY -= wy;
		this.#highX = this.#lowX + this.#width;
		this.#highY = this.#lowY + this.#height;
	}

	/**
	 * Move the domain centre horizontally by the world distance given.
	 * @param wx world x centre position
	 */
	move_centre_x_by(wx: number) {
		this.move_centre_xy_by(wx, 0);
	}

	/**
	 * Move the domain centre vertically by the world distance given.
	 * @param wy world y centre position
	 */
	move_centre_y_by(wy: number) {
		this.move_centre_xy_by(0, wy);
	}

	/**
	 * See if this point is within the domain
	 * @param x the x position or point to test
	 * @param y the y position (optional)
	 * @return true if the point is on or inside the boundary of this domain
	 */
	contains(x: number | Vector2D, y?: number): boolean {
		if (x instanceof Vector2D) {
			y = x.y; x = x.x;
		}
		return (x >= this.#lowX && x <= this.#highX && y >= this.#lowY && y <= this.#highY);
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
		let s = `Domain from ${this.#lowX}, ${this.#lowY} to ${this.#highX}, ${this.#highY}  `
		s += `Size ${this.#width}, ${this.#height}  `
		s += `Constraint: ${Symbol.keyFor(this.#constraint)}`;
		return s;
	}
}
