/**
 * This class represents a node (vertex) that can be used with the Graph class.
 * <br>
 * The node has a 3D position but for 2D scenarios the z value should be zero.
 * <br>
 *
 * Each node should be given a unique ID number >= 0. Node ID numbers do not
 * need to start at 0 (zero) or be sequential but they must be unique. <br>
 *
 * It is the responsibility of the user to ensure that each node ID is unique
 * as duplicate ID numbers can lead to unpredictable behaviour.
 *
 * @author Peter Lager
 *
 */
class GraphNode {
    /** Create a node with a unique ID and an optional position */
    constructor(id, position = [0, 0, 0], name = '') {
        this._edges = new Map();
        this._name = '';
        this._p = new Float64Array(3);
        // Used in the Dijkstra and A* search algorithms
        this._graphCost = 0;
        this._fullCost = 0;
        this._id = id;
        let len = position.length;
        this._p[0] = len > 0 ? position[0] : 0;
        this._p[1] = len > 1 ? position[1] : 0;
        this._p[2] = len > 2 ? position[2] : 0;
        this._name = name;
    }
    get edges() { return [...this._edges.values()]; }
    get id() { return this._id; }
    setName(n) { this._name = n; return this; }
    set name(n) { this._name = n; }
    get name() { return this._name; }
    get pos() { return this._p; }
    setX(n) { this._p[0] = n; return this; }
    set x(n) { this._p[0] = n; }
    get x() { return this._p[0]; }
    setY(n) { this._p[1] = n; return this; }
    set y(n) { this._p[1] = n; }
    get y() { return this._p[1]; }
    setZ(n) { this._p[2] = n; return this; }
    set z(n) { this._p[2] = n; }
    get z() { return this._p[2]; }
    set graphCost(n) { this._graphCost = n; }
    get graphCost() { return this._graphCost; }
    set fullCost(n) { this._fullCost = n; }
    get fullCost() { return this._fullCost; }
    /**
     * Add an edge to this node. It will replace any previous edge with the smae
     * destination.
     * @param edge the edge to add
     */
    addEdge(edge) {
        console.assert(!this._edges.has(edge.to), `Duplicate edge from: ${this.id} to ${edge.to} - the original edge has been overwritten`);
        this._edges.set(edge.to, edge);
    }
    /**
     * Removes the edge to the specified destination
     * @param id the destination node ID
     */
    removeEdge(id) {
        this._edges.delete(id);
    }
    edge(to) {
        return this._edges.get(to);
    }
    resetSearchCosts() {
        this.graphCost = this.fullCost = 0;
    }
    toString() {
        return `ID: ${this.id}  Name: "${this.name}" @ [ ${this.x}, ${this.y}, ${this.z}]`;
    }
}
//# sourceMappingURL=gnode.js.map