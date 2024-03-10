var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GraphNode_edges, _GraphNode_id, _GraphNode_p, _GraphNode_graphCost, _GraphNode_fullCost;
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
    /** Create a node with a unique ID and an optional position */
    constructor(id, position = [0, 0, 0], name = '') {
        _GraphNode_edges.set(this, new Map());
        _GraphNode_id.set(this, void 0);
        this._name = '';
        _GraphNode_p.set(this, new Float64Array(3));
        // Used in the Dijkstra and A* search algorithms
        _GraphNode_graphCost.set(this, 0);
        _GraphNode_fullCost.set(this, 0);
        __classPrivateFieldSet(this, _GraphNode_id, id, "f");
        let len = position.length;
        __classPrivateFieldGet(this, _GraphNode_p, "f")[0] = len > 0 ? position[0] : 0;
        __classPrivateFieldGet(this, _GraphNode_p, "f")[1] = len > 1 ? position[1] : 0;
        __classPrivateFieldGet(this, _GraphNode_p, "f")[2] = len > 2 ? position[2] : 0;
        this._name = name;
    }
    get edges() { return [...__classPrivateFieldGet(this, _GraphNode_edges, "f").values()]; }
    get id() { return __classPrivateFieldGet(this, _GraphNode_id, "f"); }
    setName(n) { this._name = n; return this; }
    set name(n) { this._name = n; }
    get name() { return this._name; }
    get pos() { return __classPrivateFieldGet(this, _GraphNode_p, "f"); }
    setX(n) { __classPrivateFieldGet(this, _GraphNode_p, "f")[0] = n; return this; }
    set x(n) { __classPrivateFieldGet(this, _GraphNode_p, "f")[0] = n; }
    get x() { return __classPrivateFieldGet(this, _GraphNode_p, "f")[0]; }
    setY(n) { __classPrivateFieldGet(this, _GraphNode_p, "f")[1] = n; return this; }
    set y(n) { __classPrivateFieldGet(this, _GraphNode_p, "f")[1] = n; }
    get y() { return __classPrivateFieldGet(this, _GraphNode_p, "f")[1]; }
    setZ(n) { __classPrivateFieldGet(this, _GraphNode_p, "f")[2] = n; return this; }
    set z(n) { __classPrivateFieldGet(this, _GraphNode_p, "f")[2] = n; }
    get z() { return __classPrivateFieldGet(this, _GraphNode_p, "f")[2]; }
    set graphCost(n) { __classPrivateFieldSet(this, _GraphNode_graphCost, n, "f"); }
    get graphCost() { return __classPrivateFieldGet(this, _GraphNode_graphCost, "f"); }
    set fullCost(n) { __classPrivateFieldSet(this, _GraphNode_fullCost, n, "f"); }
    get fullCost() { return __classPrivateFieldGet(this, _GraphNode_fullCost, "f"); }
    /**
     * Add an edge to this node. It will replace any previous edge with the smae
     * destination.
     */
    addEdge(edge) {
        console.assert(!__classPrivateFieldGet(this, _GraphNode_edges, "f").has(edge.to), `Duplicate edge from: ${this.id} to ${edge.to} - the original edge has been overwritten`);
        __classPrivateFieldGet(this, _GraphNode_edges, "f").set(edge.to, edge);
    }
    /**
     * Removes the edge to the specified destination
     * @param id the destination node ID
     */
    removeEdge(id) {
        __classPrivateFieldGet(this, _GraphNode_edges, "f").delete(id);
    }
    edge(to) {
        return __classPrivateFieldGet(this, _GraphNode_edges, "f").get(to);
    }
    resetSearchCosts() {
        this.graphCost = this.fullCost = 0;
    }
    toString() {
        return `ID: ${this.id}  Name: "${this.name}" @ [ ${this.x}, ${this.y}, ${this.z}]`;
    }
}
_GraphNode_edges = new WeakMap(), _GraphNode_id = new WeakMap(), _GraphNode_p = new WeakMap(), _GraphNode_graphCost = new WeakMap(), _GraphNode_fullCost = new WeakMap();
//# sourceMappingURL=gnode.js.map