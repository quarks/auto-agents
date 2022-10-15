/**
* Simple 2D vector class.
*/
class Vector2D {
    /**
     * Default to the zero vector
     */
    constructor(x = 0, y = 0) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    /**
     * Creates a new vector object that duplicates this one
     * @returns a copy of this vector
     */
    copy() {
        return new Vector2D(this.x, this.y);
    }
    /**
     *
     * @param x x value or vector
     * @param y y value
     * @returns
     */
    set(x, y) {
        if (typeof x === "object") {
            this.x = x.x;
            this.y = x.y;
        }
        else if (Number.isFinite(x) && Number.isFinite(y)) {
            this.x = x;
            this.y = y;
        }
        return this;
    }
    /**
     * Get the vector length squared
     */
    lengthSq() {
        return this.x * this.x + this.y * this.y;
    }
    /**
     * Get the vector length
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    /**
     * Calculate the dot product between two un-normalised vectors.
     * @param v the other vector
     * @return the dot product
     */
    dot(v) {
        return (this.x * v.x + this.y * v.y);
    }
    /**
     * Calculate the dot product between two vectors using normalised values
     * i.e. the cosine of the angle between them
     * @param v the other vector
     * @return the cosine of angle between them
     */
    dotNorm(v) {
        let denom = Math.sqrt(this.x * this.x + this.y * this.y) * Math.sqrt(v.x * v.x + v.y * v.y);
        return (this.x * v.x + this.y * v.y) / denom;
    }
    /**
     * Calculate the angle between this and another vector.
     * @param v the other vector
     * @return the angle between in radians
     */
    angleBetween(v) {
        let denom = Math.sqrt(this.x * this.x + this.y * this.y) * Math.sqrt(v.x * v.x + v.y * v.y);
        if (Number.isFinite(denom)) {
            let a = Math.acos((this.x * v.x + this.y * v.y) / denom);
            return Number.isFinite(a) ? a : 0;
        }
        return 0;
    }
    /**
     * Determines whether vector v is clockwise of this vector. <br>
     * @param v a vector
     * @return positive (+1) if clockwise else negative (-1)
     */
    sign(v) {
        if (this.y * v.x > this.x * v.y)
            return Vector2D.CLOCKWISE;
        else
            return Vector2D.ANTI_CLOCKWISE;
    }
    /**
     * Get a copy (new object) of this vector.
     * @return a perpendicular vector
     */
    get() {
        return new Vector2D(this.x, this.y);
    }
    /**
     * Get a vector perpendicular to this one.
     * @return a perpendicular vector
     */
    getPerp() {
        return new Vector2D(-this.y, this.x);
    }
    /**
     * Get the distance squared between this and another
     * point.
     * @param v the other point
     * @return distance to other point squared
     */
    distanceSq(v) {
        let dx = v.x - this.x;
        let dy = v.y - this.y;
        return dx * dx + dy * dy;
    }
    /**
     * Get the distance between this and an other point.
     * @param v the other point
     * @return distance to other point
     */
    distance(v) {
        let dx = v.x - this.x;
        let dy = v.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    /**
     * Normalise this vector
     */
    normalize() {
        let mag = Math.sqrt(this.x * this.x + this.y * this.y);
        if (Number.isFinite(mag)) {
            this.x /= mag;
            this.y /= mag;
        }
        else {
            this.x = this.y = 0;
        }
        return this;
    }
    /**
     * Truncate this vector so its length is no greater than
     * the value provided.
     * @param max maximum size for this vector
     */
    truncate(max) {
        let mag = Math.sqrt(this.x * this.x + this.y * this.y);
        if (Number.isFinite(mag) && mag > max) {
            let f = max / mag;
            this.x *= f;
            this.y *= f;
        }
        return this;
    }
    /**
     * Get a vector that is the reverse of this vector
     * @return the reverse vector
     */
    getReverse() {
        return new Vector2D(-this.x, -this.y);
    }
    /**
     * Return the reflection vector about the norm
     * @param norm
     * @return the reflected vector
     */
    getReflect(norm) {
        let dot = this.dot(norm);
        let nx = this.x + (-2 * dot * norm.x);
        let ny = this.y + (-2 * dot * norm.y);
        return new Vector2D(nx, ny);
    }
    /**
     * Add a displacement (either vector object or 2 scalars )
     * to this vector.
     *
     * @param x a number or a Vector
     * @param y a number
     */
    add(x, y) {
        if (typeof x === 'object') {
            this.x += x.x;
            this.y += x.y;
        }
        else if (Number.isFinite(x) && Number.isFinite(y)) {
            this.x += x;
            this.y += y;
        }
        return this;
    }
    /**
     * Subtract a displacement (either vector object or 2 scalars )
     * to this vector.
     *
     * @param x a number or a Vector
     * @param y a number
     */
    sub(x, y) {
        if (typeof x === 'object') {
            this.x -= x.x;
            this.y -= x.y;
        }
        else if (Number.isFinite(x) && Number.isFinite(y)) {
            this.x -= x;
            this.y -= y;
        }
        return this;
    }
    /**
     * Multiply the vector by a scalar
     * @param s scalar value to multiply by
     */
    mult(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }
    /**
     * Divide the vector by a scalar
     * @param s scalar value to divide by
     * @return this vector
     */
    div(s) {
        this.x /= s;
        this.y /= s;
        return this;
    }
    /**
        * Randomize this vector. Its magnitude is governed by the parameter
        * values. If no parameters are passed then it will be of unit length.
        *
        * @param m0 minimum magnitude
        * @param m1 maximum magnitude
        * @returns this vector
        */
    random(m0, m1) {
        let angle = Math.random() * 2 * Math.PI;
        this.x = Math.cos(angle);
        this.y = Math.sin(angle);
        if (Number.isFinite(m0) && Number.isFinite(m1)) {
            let mag = Math.random() * (m1 - m0) + m0;
            this.x *= mag;
            this.y *= mag;
        }
        return this;
    }
    /**
     * This vector is considered equal to v if  their x and y positions are
     * closer than Vecor2D.EPSILON.
     *
     * @param v the other vector
     * @returns true if this vector 'equals' v
     */
    equals(v) {
        return (Math.abs(this.x - v.x) < Vector2D.EPSILON
            && Math.abs(this.y - v.y) < Vector2D.EPSILON);
    }
    /**       +++++++++++++ CLASS METHODS +++++++++++++++        */
    /** Create a copy of a vector */
    static copy(v) {
        return new Vector2D(v.x, v.y);
    }
    /**
     * @returns true if these vectors have the same coordinates
     */
    static areEqual(v0, v1) {
        return (Math.abs(v1.x - v0.x) < Vector2D.EPSILON && Math.abs(v1.y - v0.y) < Vector2D.EPSILON);
    }
    /** returns the dot product of two vector */
    static dot(v0, v1) {
        return (v0.x * v1.x + v0.y * v1.y);
    }
    /**
     * Get a new vector that is the sum of 2 vectors.
     * @param v0 first vector
     * @param v1 second vector
     * @return the sum of the 2 vectors
     */
    static add(v0, v1) {
        return new Vector2D(v0.x + v1.x, v0.y + v1.y);
    }
    /**
     * Get a new vector that is the difference between the
     * 2 vectors.
     * @param v0 first vector
     * @param v1 second vector
     * @return the difference between the 2 vectors
     */
    static sub(v0, v1) {
        return new Vector2D(v0.x - v1.x, v0.y - v1.y);
    }
    /**
     * Get a new vector that is the product of a vector and a scalar
     * @param v the original vector
     * @param s the multiplier
     * @return the calculated vector
     */
    static mult(v, s) {
        return new Vector2D(v.x * s, v.y * s);
    }
    /**
     * Get a new vector that is a vector divided by a scalar
     * @param v the original vector
     * @param d the divisor
     * @return the calculated vector
     */
    static div(v, s) {
        return new Vector2D(v.x / s, v.y / s);
    }
    /**
     * The square of the distance between two vectors
     * @param v0 the first vector
     * @param v1 the second vector
     * @return square of the distance between them
     */
    static distSq(v0, v1) {
        let dx = v1.x - v0.x;
        let dy = v1.y - v0.y;
        return dx * dx + dy * dy;
    }
    /**
     * The distance between two vectors
     * @param v0 the first vector
     * @param v1 the second vector
     * @return the distance between them
     */
    static dist(v0, v1) {
        let dx = v1.x - v0.x;
        let dy = v1.y - v0.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    /**
     * Get a new vector that is the given vector normalised
     * @param v the original vector
     * @return the normalised vector
     */
    static normalize(v) {
        let mag = v.length();
        if (Number.isFinite(mag))
            return new Vector2D(v.x / mag, v.y / mag);
        else
            return new Vector2D(0, 0);
    }
    /**
     * Calculate the angle between two vectors.
     * @param v0 first vector
     * @param v1 second vector
     * @return the angle between in radians
     */
    static angleBetween(v0, v1) {
        let denom = Math.sqrt(v0.x * v0.x + v0.y * v0.y) * Math.sqrt(v1.x * v1.x + v1.y * v1.y);
        if (Number.isFinite(denom)) {
            let a = Math.acos((v0.x * v1.x + v0.y * v1.y) / denom);
            return Number.isFinite(a) ? a : 0;
        }
        return 0;
    }
    /**
     * Determines whether entity 2 is visible from entity 1.
     * @param posFirst position of first entity
     * @param facingFirst direction first entity is facing
     * @param fovFirst field of view (radians) of first entity
     * @param posSecond position of second entity
     * @return true if second entity is inside 'visible' to the first entity
     */
    static isSecondInFOVofFirst(posFirst, facingFirst, fovFirst, posSecond) {
        let toTarget = Vector2D.sub(posSecond, posFirst);
        let dd = toTarget.length() * facingFirst.length();
        let angle = facingFirst.dot(toTarget) / dd;
        return angle >= Math.cos(fovFirst / 2);
    }
    /**
     * Create a random vector whose magnitude is in the range provided.
    * @param m0 minimum magnitude
    * @param m1 maximum magnitude
    * @return the randomised vector
     */
    static random(m0, m1) {
        let angle = Math.random() * 2 * Math.PI;
        let target = new Vector2D(Math.cos(angle), Math.sin(angle));
        if (Number.isFinite(m0) && Number.isFinite(m1))
            target.mult(Math.random() * (m1 - m0) + m0);
        return target;
    }
    /**
     * Get the x,y coordinates as an array.
     */
    toArray() {
        return [this.x, this.y];
    }
    toShortString() {
        return "[" + Math.round(this.x) + ", " + Math.round(this.y) + "] ";
    }
    toString() {
        return "[" + this.x + ", " + this.y + "] ";
    }
}
// /** Null vector (coordinates: 0, 0). */
Vector2D.ZERO = new Vector2D(0, 0);
/** Null vector (coordinates: 1, 1). */
Vector2D.ONE = new Vector2D(1, 1);
/** First canonical vector (coordinates: 1, 0). */
Vector2D.PLUS_I = new Vector2D(1, 0);
/** Opposite of the first canonical vector (coordinates: -1, 0). */
Vector2D.MINUS_I = new Vector2D(-1, 0);
/** Second canonical vector (coordinates: 0, 1). */
Vector2D.PLUS_J = new Vector2D(0, 1);
/** Opposite of the second canonical vector (coordinates: 0, -1). */
Vector2D.MINUS_J = new Vector2D(0, -1);
/** A vector with all coordinates set to positive infinity. */
Vector2D.POSITIVE_INFINITY = new Vector2D(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
/** A vector with all coordinates set to negative infinity. */
Vector2D.NEGATIVE_INFINITY = new Vector2D(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
Vector2D.EPSILON = 1e-10;
Vector2D.CLOCKWISE = 1;
Vector2D.ANTI_CLOCKWISE = -1;
//# sourceMappingURL=Vector2D.js.map