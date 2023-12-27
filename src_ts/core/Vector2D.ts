const VECTOR2D = '2 # 23 Dec 2023';

/**
* Simple 2D vector class
*
* Although it is possible to change the x and y properties with the set 
* methods it is not recommended as changes the actual vector.
* 
* All methods return a new vector representing the result of the
* operation. For instance the statement
*
* <pre> v0.add(v1);  </pre>
*
* will return a the sum of the 2 vectors v0 and v1 as a new vector and 
* will leave v0 unchanged.
* 
* To change the vector v0 then you must assign the resukt back to v0 
* like this
*
* <pre> v0 = v0.add(v1);  </pre>
*
* Last updated: 18 Nov 2023
*
* @author Peter Lager
*/
class Vector2D implements Position {

    /** Null vector (coordinates: 0, 0). */
    static ZERO = new Vector2D(0, 0);

    /** Null vector (coordinates: 1, 1). */
    static ONE = new Vector2D(1, 1);

    /** First canonical vector (coordinates: 1, 0). */
    static PLUS_I = new Vector2D(1, 0);

    /** Opposite of the first canonical vector (coordinates: -1, 0). */
    static MINUS_I = new Vector2D(-1, 0);

    /** Second canonical vector (coordinates: 0, 1). */
    static PLUS_J = new Vector2D(0, 1);

    /** Opposite of the second canonical vector (coordinates: 0, -1). */
    static MINUS_J = new Vector2D(0, -1);

    /** A vector with all coordinates set to positive infinity. */
    static POSITIVE_INFINITY =
        new Vector2D(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);

    /** A vector with all coordinates set to negative infinity. */
    static NEGATIVE_INFINITY =
        new Vector2D(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);

    static EPSILON = 1E-10;

    static CLOCKWISE = 1;
    static ANTI_CLOCKWISE = -1;

    _p = new Float64Array(2);

    /**
     * If no values are passed then a zero vector will be created.
     * 
     * @param x x value
     * @param y y value
     */
    constructor(x: number = 0, y: number = 0) {
        this._p[0] = x; this._p[1] = y;
    }

    /** X coordinate value */
    get x(): number { return this._p[0]; }
    set x(value) { if (Number.isFinite(value)) this._p[0] = value; }
    /** Y coordinate value */
    get y(): number { return this._p[1]; }
    set y(value) { if (Number.isFinite(value)) this._p[1] = value; }
    /** Angle in 2D plane */
    get angle() { return Math.atan2(this._p[1], this._p[0]); }
    set angle(n: number) { this._p[0] = Math.cos(n); this._p[1] = Math.sin(n); }

    /**
     * Add a displacement (either vector object or 2 scalars ) 
     * to this vector to create a new vector.
     * 
     * @param x a number or a Vector
     * @param y a number
     * @return the sum as a new vector
     */
    add(x: number | Vector2D, y?: number): Vector2D {
        let nv = this.copy();
        if (typeof x === 'object') {
            nv._p[0] += x._p[0]; nv._p[1] += x._p[1];
        }
        else if (Number.isFinite(x) && Number.isFinite(y)) {
            nv._p[0] += x; nv._p[1] += y;
        }
        return nv;
    }

    /**
     * Calculate the angle between this and another vector.
     * @param v the other vector
     * @return the angle between in radians
     */
    angleBetween(v: Vector2D): number {
        let denom = Math.sqrt(this._p[0] * this._p[0] + this._p[1] * this._p[1]) *
            Math.sqrt(v._p[0] * v._p[0] + v._p[1] * v._p[1]);
        if (Number.isFinite(denom)) {
            let a = Math.acos((this._p[0] * v._p[0] + this._p[1] * v._p[1]) / denom);
            return Number.isFinite(a) ? a : 0;
        }
        return 0;
    }

    /**
     * Creates a new vector object that duplicates this one
     * @returns a copy of this vector
     */
    copy(): Vector2D {
        return new Vector2D(this._p[0], this._p[1]);
    }

    /**
     * Get the distance between this and an other point.
     * @param v the other point
     * @return distance to other point
     */
    dist(v: Vector2D): number {
        let dx = v._p[0] - this._p[0];
        let dy = v._p[1] - this._p[1];
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Get the distance squared between this and another
     * point.
     * @param v the other point
     * @return distance to other point squared
     */
    distSq(v: Vector2D): number {
        let dx = v._p[0] - this._p[0];
        let dy = v._p[1] - this._p[1];
        return dx * dx + dy * dy;
    }

    /**
     * Divide the vector by a scalar to create a new vector.
     * @param s scalar value to divide by
     * @return the quotient as a new number
     */
    div(s: number): Vector2D {
        if (s == 0)
            throw new Error('Cannot divide vector by zero)');
        return new Vector2D(this._p[0] / s, this._p[1] / s);
    }

    /**
     * Calculate the dot product between two un-normalised vectors.
     * @param v the other vector
     * @return the dot product
     */
    dot(v: Vector2D): number {
        return (this._p[0] * v._p[0] + this._p[1] * v._p[1]);
    }

    /**
     * Calculate the dot product between two vectors using normalised values 
     * i.e. the cosine of the angle between them
     * @param v the other vector
     * @return the cosine of angle between them
     */
    dotNorm(v: Vector2D): number {
        let denom = Math.sqrt(this._p[0] * this._p[0] + this._p[1] * this._p[1]) *
            Math.sqrt(v._p[0] * v._p[0] + v._p[1] * v._p[1]);
        return (this._p[0] * v._p[0] + this._p[1] * v._p[1]) / denom;
    }

    /**
     * This vector is considered equal to v if  their x and y positions are 
     * closer than Vecor2D.EPSILON.
     * 
     * @param v the other vector
     * @returns true if this vector 'equals' v
     */
    equals(v: Vector2D) {
        return (Math.abs(this._p[0] - v._p[0]) <= Vector2D.EPSILON
            && Math.abs(this._p[1] - v._p[1]) <= Vector2D.EPSILON);
    }

    /**
     * Get a vector perpendicular to this one.
     * @return a perpendicular vector
     */
    getPerp(): Vector2D {
        return new Vector2D(-this._p[1], this._p[0]);
    }

    /**
     * Return the reflection of this vector about the norm
     * @param norm 
     * @return the reflected vector
     */
    getReflect(norm: Vector2D, normalize = false): Vector2D {
        if (normalize) norm = norm.normalize();
        let dot = this.dot(norm);
        let nx = this._p[0] + (-2 * dot * norm._p[0]);
        let ny = this._p[1] + (-2 * dot * norm._p[1]);
        return new Vector2D(nx, ny);
    }

    /**
     * Get a vector that is the reverse of this vector
     * @return the reverse vector
     */
    getReverse(): Vector2D {
        return new Vector2D(-this._p[0], -this._p[1]);
    }

    /**
     * Get the vector length
     */
    length(): number {
        return Math.sqrt(this._p[0] * this._p[0] + this._p[1] * this._p[1]);
    }

    /**
     * Get the vector length squared
     */
    lengthSq(): number {
        return this._p[0] * this._p[0] + this._p[1] * this._p[1];
    }

    /**
     * Multiply the vector by a scalar to create a new vector.
     * @param s scalar value to multiply by
     * @return the product as a new number
     */
    mult(s: number): Vector2D {
        let nv = this.copy();
        nv._p[0] *= s;
        nv._p[1] *= s;
        return nv;
    }

    /**
     * Multiplies this vetor by -1 effectively reversing
     * the vector direction.
     * 
     * @return the negated version as a new vector
     */
    negate(): Vector2D {
        return new Vector2D(-this._p[0], -this._p[1]);
    }

    /**
     * Normalise this vector
     */
    normalize(): Vector2D {
        let nv = this.copy();
        let mag = Math.sqrt(nv._p[0] * nv._p[0] + nv._p[1] * nv._p[1]);
        if (!Number.isFinite(mag) || mag == 0)
            throw new Error('Cannot normalise a vector of zero or infinite length')
        nv._p[0] /= mag;
        nv._p[1] /= mag;
        return nv;
    }

    /**
     * Invalid parameters will leave the vector unchanged.
     * @param x x value or a Vector2D
     * @param y y value
     * @returns this vector
     */
    // set(x: number | Vector2D, y?: number): Vector2D {
    //     if (typeof x === "object") {
    //         this.p[0] = x.p[0]; this.p[1] = x.p[1];
    //     }
    //     else if (Number.isFinite(x) && Number.isFinite(y)) {
    //         this.p[0] = x; this.p[1] = y;
    //     }
    //     return this;
    // }

    /**
     * 
     * @param position change the coordinates to match position
     * @returns 
     */
    set(position: Array<number> | Position): Vector2D {
        if (position instanceof Array) {
            this._p[0] = position[0]; this._p[1] = position[1];
        }
        else {
            this._p[0] = position.x; this._p[1] = position.y;
        }
        return this;
    }

    /**
     * Determines whether vector v is clockwise of this vector. <br>
     * @param v a vector
     * @return positive (+1) if clockwise else negative (-1)
     */
    sign(v: Vector2D): number {
        if (this._p[1] * v._p[0] > this._p[0] * v._p[1])
            return Vector2D.CLOCKWISE;
        else
            return Vector2D.ANTI_CLOCKWISE;
    }

    /**
     * Subtract a displacement (either vector object or 2 scalars ) 
     * to this vector  to create a new vector.
     * 
     * @param x a number or a Vector
     * @param y a number
     * @return the difference as a new vector
     */
    sub(x: number | Vector2D, y?: number): Vector2D {
        let nv = this.copy();
        if (typeof x === 'object') {
            nv._p[0] -= x._p[0]; nv._p[1] -= x._p[1];
        }
        else if (Number.isFinite(x) && Number.isFinite(y)) {
            nv._p[0] -= x; nv._p[1] -= y;
        }
        return nv;
    }

    /**
     * Truncate this vector so its length is no greater than
     * the value provided and return as a new vector.
     * @param max maximum size for the new vector
     * @return the new truncated vector
     */
    truncate(max: number): Vector2D {
        let nv = this.copy();
        let mag = nv.length();
        if (Number.isFinite(mag) && mag > max)
            nv = nv.mult(max / mag);
        return nv;
    }

    /**
     * Get the x,y coordinates as an array.
     */
    toArray(): Array<number> {
        return [this._p[0], this._p[1]];
    }

    /**       +++++++++++++ CLASS METHODS +++++++++++++++        */

    /** 
     * @returns true if these vectors have the same coordinates
     */
    static areEqual(v0: Vector2D, v1: Vector2D): boolean {
        return (Math.abs(v1._p[0] - v0._p[0]) <= Vector2D.EPSILON && Math.abs(v1._p[1] - v0._p[1]) <= Vector2D.EPSILON);
    }

    /**
     * The distance between two vectors
     * @param v0 the first vector
     * @param v1 the second vector
     * @return the distance between them
     */
    static dist(v0: Vector2D, v1: Vector2D): number {
        let dx = v1._p[0] - v0._p[0];
        let dy = v1._p[1] - v0._p[1];
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * The square of the distance between two vectors
     * @param v0 the first vector
     * @param v1 the second vector
     * @return square of the distance between them
     */
    static distSq(v0: Vector2D, v1: Vector2D): number {
        let dx = v1._p[0] - v0._p[0];
        let dy = v1._p[1] - v0._p[1];
        return dx * dx + dy * dy;
    }

    /**
     * Calculate the angle between two vectors.
     * @param v0 first vector
     * @param v1 second vector
     * @return the angle between in radians
     */
    static angleBetween(v0: Vector2D, v1: Vector2D): number {
        let denom = Math.sqrt(v0._p[0] * v0._p[0] + v0._p[1] * v0._p[1]) * Math.sqrt(v1._p[0] * v1._p[0] + v1._p[1] * v1._p[1]);
        if (Number.isFinite(denom)) {
            let a = Math.acos((v0._p[0] * v1._p[0] + v0._p[1] * v1._p[1]) / denom);
            return Number.isFinite(a) ? a : 0;
        }
        return 0;
    }

    /**
     * Determines whether entity 2 is visible from entity 1.
     * @param pos1 position of first entity
     * @param facing1 direction first entity is facing
     * @param fov1 field of view (radians) of first entity
     * @param pos2 position of second entity
     * @return true if second entity is inside 'visible' to the first entity
     */
    static isSecondInFOVofFirst(pos1: Vector2D, facing1: Vector2D, fov1: number,
        pos2: Vector2D): boolean {
        let toTarget = pos2.sub(pos1);  // Vector2D.sub(pos2, pos1);
        let dd = toTarget.length() * facing1.length();
        let angle = facing1.dot(toTarget) / dd;
        return angle >= Math.cos(fov1 / 2);
    }

    /**
     * Create a random vector whose magnitude is in the range provided.
     * @param m0 minimum length
     * @param m1 maximum length
     * @return the randomised vector
     */
    static fromRandom(m0 = 1, m1 = 1): Vector2D {
        let v = new Vector2D(Math.random(), Math.random());
        return v.normalize().mult(Math.random() * (m1 - m0) + m0);
    }

    /**
     * 
     * @param position 
     * @param colRadius 
     * @returns 
     */
    static from(position: Array<number> | Position, colRadius = 0): Vector2D {
        if (position instanceof Array)
            return new Vector2D(position[0], position[1]);
        else
            return new Vector2D(position.x, position.y);
    }

    print(precision = 16): Vector2D {
        console.log(this.$(precision));
        return this;
    }

    $(precision = 16): string {
        let xv = this.x.toPrecision(precision);
        let yv = this.y.toPrecision(precision);
        return `[${xv}, ${yv}]`;
    }

    toString(): string {
        return this.$();
    }

}

interface Position {
    x: number;
    y: number;
}