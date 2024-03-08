/**
 * This class represents a node (vertex) that can be used with the Graph class.
 * The node has a 3D position but for 2D scenarios the z value should be zero. <br>
 * Each node should be given a unique ID number >= 0. Node ID numbers do not
 * need to start at 0 (zero) or be sequential but they must be unique. <br>
 *
 * It is the responsibility of the user to ensure that each node ID is unique
 * as duplicate ID numbers can lead to unpredictable behaviour.
 *
 * @author Peter Lager
 */
class GraphNode {
    #edges = new Map();
    get edges() { return [...this.#edges.values()]; }
    #id;
    get id() { return this.#id; }
    _name = '';
    setName(n) { this._name = n; return this; }
    set name(n) { this._name = n; }
    get name() { return this._name; }
    #p = new Float64Array(3);
    get pos() { return this.#p; }
    setX(n) { this.#p[0] = n; return this; }
    set x(n) { this.#p[0] = n; }
    get x() { return this.#p[0]; }
    setY(n) { this.#p[1] = n; return this; }
    set y(n) { this.#p[1] = n; }
    get y() { return this.#p[1]; }
    setZ(n) { this.#p[2] = n; return this; }
    set z(n) { this.#p[2] = n; }
    get z() { return this.#p[2]; }
    // Used in the Dijkstra and A* search algorithms
    #graphCost = 0;
    set graphCost(n) { this.#graphCost = n; }
    get graphCost() { return this.#graphCost; }
    #fullCost = 0;
    set fullCost(n) { this.#fullCost = n; }
    get fullCost() { return this.#fullCost; }
    /** Create a node with a unique ID and an optional position */
    constructor(id, position = [0, 0, 0], name = '') {
        this.#id = id;
        let len = position.length;
        this.#p[0] = len > 0 ? position[0] : 0;
        this.#p[1] = len > 1 ? position[1] : 0;
        this.#p[2] = len > 2 ? position[2] : 0;
        this._name = name;
    }
    /**
     * Add an edge to this node. It will replace any previous edge with the smae
     * destination.
     */
    addEdge(edge) {
        console.assert(!this.#edges.has(edge.to), `Duplicate edge from: ${this.id} to ${edge.to} - the original edge has been overwritten`);
        this.#edges.set(edge.to, edge);
    }
    /**
     * Removes the edge to the specified destination
     * @param id the destination node ID
     */
    removeEdge(id) {
        this.#edges.delete(id);
    }
    edge(to) {
        return this.#edges.get(to);
    }
    resetSearchCosts() {
        this.graphCost = this.fullCost = 0;
    }
    toString() {
        return `ID: ${this.id}  Name: "${this.name}" @ [ ${this.x}, ${this.y}, ${this.z}]`;
    }
}
//# sourceMappingURL=gnode.js.map