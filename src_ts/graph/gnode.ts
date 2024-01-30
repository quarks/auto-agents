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

    _edges = new Map<number, GraphEdge>();

    _id: number;
    get id(): number { return this._id; }

    _name = '';
    setName(n: string): GraphNode { this._name = n; return this; }
    set name(n: string) { this._name = n; }
    get name(): string { return this._name; }

    _p = new Float64Array(3);

    setX(n: number): GraphNode { this._p[0] = n; return this; }
    set x(n: number) { this._p[0] = n; }
    get x(): number { return this._p[0]; }

    setY(n: number): GraphNode { this._p[1] = n; return this; }
    set y(n: number) { this._p[1] = n; }
    get y(): number { return this._p[1]; }

    setZ(n: number): GraphNode { this._p[2] = n; return this; }
    set z(n: number) { this._p[2] = n; }
    get z(): number { return this._p[2]; }

    /** Create a node with a unique ID and an optional position */
    constructor(id: number, x = 0, y = 0, z = 0, name = '') {
        this._id = id;
        this._p[0] = x;
        this._p[1] = y;
        this._p[2] = z;
        this._name = name;
    }
    //console.assert(!this._nodes.has(id), `Duplicate node ID: ${id} - the original node has been overwritten`);
    addFwdEdge(edge: GraphEdge) {
        console.assert(!this._edges.has(edge.to), `Duplicate edge from: ${this.id} to ${edge.to} - the original edge has been overwritten`);
        this._edges.set(edge.to, edge);
    }

    toString() {
        return `ID: ${this.id}  Name: "${this.name}" @ [ ${this.x}, ${this.y}, ${this.z}]`;
    }
}
