const MATRIX2D = '1 # 06 Nov 2022';
// Some problems with translation yet to iron out
// should this class be immutable
/**
* Class to represent a 2D matrix that can be used to create transformed
* Vector2D objects.
*/
class Matrix2D {
    matrix;
    constructor() {
        this.matrix = new Matrix();
        this.matrix.identity();
    }
    set(n) {
        this.matrix.set(n);
    }
    /**
     * Create a new list of vectors from the provided list after being
     * transformed by this this.matrix.
     *
     * @param vList the original list of vectors
     * @return a list of transformed vectors.
     */
    transformVectors(vList) {
        return vList.map((v) => { return this.transformVector(v); });
    }
    // transformVectors(vList: Array<Vector2D>): Array<Vector2D> {
    //     return vList.map((v) => {
    //         let x = (this.matrix._11 * v.x) + (this.matrix._21 * v.y) + (this.matrix._31);
    //         let y = (this.matrix._12 * v.x) + (this.matrix._22 * v.y) + (this.matrix._32);
    //         return new Vector2D(x, y);
    //     });
    // }
    /**
     * Create a new vector from the provided vector after being transformed
     * by the matrix.
     *
     * @param vPoint the original vector
     * @return the transformed vector
     */
    transformVector(vPoint) {
        let x = (this.matrix._11 * vPoint.x) + (this.matrix._21 * vPoint.y) + (this.matrix._31);
        let y = (this.matrix._12 * vPoint.x) + (this.matrix._22 * vPoint.y) + (this.matrix._32);
        return new Vector2D(x, y);
    }
    /**
     * Initialise the matrix to the identity matrix. This will erase the previous
     * matrix element data.
     */
    identity() {
        this.matrix._11 = 1;
        this.matrix._12 = 0;
        this.matrix._13 = 0;
        this.matrix._21 = 0;
        this.matrix._22 = 1;
        this.matrix._23 = 0;
        this.matrix._31 = 0;
        this.matrix._32 = 0;
        this.matrix._33 = 1;
        return this;
    }
    /**
     * Translate the matrix by the amount specified in
     * x and y.
     *
     * @param x x-translation value
     * @param y y-translation value
     */
    translate(x, y) {
        let mat = new Matrix();
        mat._11 = 1;
        mat._12 = 0;
        mat._13 = 0;
        mat._21 = 0;
        mat._22 = 1;
        mat._23 = 0;
        mat._31 = x;
        mat._32 = y;
        mat._33 = 1;
        this._matrixMultiply(mat);
    }
    /**
     * Scale the matrix in the x and y directions.
     * @param xScale scale x by this
     * @param yScale scale y by this
     */
    scale(xScale, yScale) {
        let mat = new Matrix();
        mat._11 = xScale;
        mat._12 = 0;
        mat._13 = 0;
        mat._21 = 0;
        mat._22 = yScale;
        mat._23 = 0;
        mat._31 = 0;
        mat._32 = 0;
        mat._33 = 1;
        this._matrixMultiply(mat);
        return this;
    }
    /**
     * Rotate the matrix
     * @param p0 the angle of rotation (radians) or the forward vector
     * @param p1 the side vector
     */
    rotate(p0, p1) {
        if (typeof p0 === 'object' && typeof p1 === 'object')
            this._rotVectors(p0, p1);
        else if (typeof p0 === 'number' && Number.isFinite(p0))
            this._rotAngle(p0);
        return this;
    }
    /**
     * Rotation implementation given an angle.
     * @hidden
     */
    _rotAngle(rot) {
        let mat = new Matrix();
        let sinA = Math.sin(rot);
        let cosA = Math.cos(rot);
        mat._11 = cosA;
        mat._12 = sinA;
        mat._13 = 0;
        mat._21 = -sinA;
        mat._22 = cosA;
        mat._23 = 0;
        mat._31 = 0;
        mat._32 = 0;
        mat._33 = 1;
        this._matrixMultiply(mat);
    }
    /**
      * Rotation implementation given forward and side vectore.
      * @phidden
      */
    _rotVectors(fwd, side) {
        let mat = new Matrix();
        mat._11 = fwd.x;
        mat._12 = fwd.y;
        mat._13 = 0;
        mat._21 = side.x;
        mat._22 = side.y;
        mat._23 = 0;
        mat._31 = 0;
        mat._32 = 0;
        mat._33 = 1;
        this._matrixMultiply(mat);
    }
    /**
     * Multiply this matrix by another
     * @param mIn the multiplying matrix
     * @hidden
     */
    _matrixMultiply(mIn) {
        let mat = new Matrix();
        // Row 1
        mat._11 = (this.matrix._11 * mIn._11) + (this.matrix._12 * mIn._21) + (this.matrix._13 * mIn._31);
        mat._12 = (this.matrix._11 * mIn._12) + (this.matrix._12 * mIn._22) + (this.matrix._13 * mIn._32);
        mat._13 = (this.matrix._11 * mIn._13) + (this.matrix._12 * mIn._23) + (this.matrix._13 * mIn._33);
        // Row 2
        mat._21 = (this.matrix._21 * mIn._11) + (this.matrix._22 * mIn._21) + (this.matrix._23 * mIn._31);
        mat._22 = (this.matrix._21 * mIn._12) + (this.matrix._22 * mIn._22) + (this.matrix._23 * mIn._32);
        mat._23 = (this.matrix._21 * mIn._13) + (this.matrix._22 * mIn._23) + (this.matrix._23 * mIn._33);
        // Row 3
        mat._31 = (this.matrix._31 * mIn._11) + (this.matrix._32 * mIn._21) + (this.matrix._33 * mIn._31);
        mat._32 = (this.matrix._31 * mIn._12) + (this.matrix._32 * mIn._22) + (this.matrix._33 * mIn._32);
        mat._33 = (this.matrix._31 * mIn._13) + (this.matrix._32 * mIn._23) + (this.matrix._33 * mIn._33);
        this.matrix = mat;
    }
    // /**
    //  * Multiply this matrix by another
    //  * @param mIn the multiplying matrix
    //  * @hidden
    //  */
    // _matMultiply2D(m: Matrix2D) :Matr{
    //     let mIn = m.matrix;
    //     let mat = new Matrix();
    //     // Row 1
    //     mat._11 = (this.matrix._11 * mIn._11) + (this.matrix._12 * mIn._21) + (this.matrix._13 * mIn._31);
    //     mat._12 = (this.matrix._11 * mIn._12) + (this.matrix._12 * mIn._22) + (this.matrix._13 * mIn._32);
    //     mat._13 = (this.matrix._11 * mIn._13) + (this.matrix._12 * mIn._23) + (this.matrix._13 * mIn._33);
    //     // Row 2
    //     mat._21 = (this.matrix._21 * mIn._11) + (this.matrix._22 * mIn._21) + (this.matrix._23 * mIn._31);
    //     mat._22 = (this.matrix._21 * mIn._12) + (this.matrix._22 * mIn._22) + (this.matrix._23 * mIn._32);
    //     mat._23 = (this.matrix._21 * mIn._13) + (this.matrix._22 * mIn._23) + (this.matrix._23 * mIn._33);
    //     // Row 3
    //     mat._31 = (this.matrix._31 * mIn._11) + (this.matrix._32 * mIn._21) + (this.matrix._33 * mIn._31);
    //     mat._32 = (this.matrix._31 * mIn._12) + (this.matrix._32 * mIn._22) + (this.matrix._33 * mIn._32);
    //     mat._33 = (this.matrix._31 * mIn._13) + (this.matrix._32 * mIn._23) + (this.matrix._33 * mIn._33);
    //     this.matrix = mat;
    // }
    // setters for the matrix elements
    _11(val) { this.matrix._11 = val; }
    _12(val) { this.matrix._12 = val; }
    _13(val) { this.matrix._13 = val; }
    _21(val) { this.matrix._21 = val; }
    _22(val) { this.matrix._22 = val; }
    _23(val) { this.matrix._23 = val; }
    _31(val) { this.matrix._31 = val; }
    _32(val) { this.matrix._32 = val; }
    _33(val) { this.matrix._33 = val; }
    toString() {
        return this.matrix.toString();
    }
}
/**
 * Handy inner class to hold the intermediate transformation matrices.
 * @hidden
 */
class Matrix {
    _11 = 0;
    _12 = 0;
    _13 = 0;
    _21 = 0;
    _22 = 0;
    _23 = 0;
    _31 = 0;
    _32 = 0;
    _33 = 0;
    /**
     * Ctor initialises to the zero matrix
     */
    constructor() { }
    set(n) {
        this._11 = n[0];
        this._12 = n[1];
        this._13 = n[2];
        this._21 = n[3];
        this._22 = n[4];
        this._23 = n[5];
        this._31 = n[6];
        this._32 = n[7];
        this._33 = n[8];
    }
    /**
     * Set to the identity matrix. Erases previous matrix data.
     */
    identity() {
        this._11 = 1.0;
        this._12 = 0.0;
        this._13 = 0.0;
        this._21 = 0.0;
        this._22 = 1.0;
        this._23 = 0.0;
        this._31 = 0.0;
        this._32 = 0.0;
        this._33 = 1.0;
    }
    toString() {
        let s = `[ ${this._11}, ${this._12}, ${this._13} ] `;
        s += `[ ${this._21}, ${this._22}, ${this._23} ] `;
        s += `[ ${this._31}, ${this._32}, ${this._33} ] `;
        return s;
    }
}
//# sourceMappingURL=matrix2d.js.map