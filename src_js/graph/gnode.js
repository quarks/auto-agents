/**
 * This class represents a node (vertex) that can be used with
 * the Graph class. <br>
 *
 * The node has a position in 3D space for 2D applications the z value should
 * be zero. <br>
 *
 * Each node should be given a unique ID number >= 0. Node ID numbers do
 * not need to start at 0 (zero) or be sequential but they must be unique. <br>
 *
 * It is the responsibility of the user to ensure that each node ID is unique
 * as duplicate ID numbers can lead to unpredictable behaviour.
 *
 * @author Peter Lager
 *
 */
class GraphNode {
    /** Create a node with a unique ID and an optional position */
    constructor(id, x = 0, y = 0, z = 0, name = '') {
        this._edges = new Map();
        this._name = '';
        this._p = new Float64Array(3);
        this._id = id;
        this._p[0] = x;
        this._p[1] = y;
        this._p[2] = z;
        this._name = name;
    }
    get id() { return this._id; }
    setName(n) { this._name = n; return this; }
    set name(n) { this._name = n; }
    get name() { return this._name; }
    setX(n) { this._p[0] = n; return this; }
    set x(n) { this._p[0] = n; }
    get x() { return this._p[0]; }
    setY(n) { this._p[1] = n; return this; }
    set y(n) { this._p[1] = n; }
    get y() { return this._p[1]; }
    setZ(n) { this._p[2] = n; return this; }
    set z(n) { this._p[2] = n; }
    get z() { return this._p[2]; }
    //console.assert(!this._nodes.has(id), `Duplicate node ID: ${id} - the original node has been overwritten`);
    addFwdEdge(edge) {
        console.assert(!this._edges.has(edge.to), `Duplicate edge from: ${this.id} to ${edge.to} - the original edge has been overwritten`);
        this._edges.set(edge.to, edge);
    }
    toString() {
        return `ID: ${this.id}  Name: "${this.name}" @ [ ${this.x}, ${this.y}, ${this.z}]`;
    }
}
//# sourceMappingURL=gnode.js.map