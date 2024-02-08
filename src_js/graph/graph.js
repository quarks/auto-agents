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
var _Graph_nodes, _Graph_floatingEdges, _Graph_name;
class Graph {
    constructor(name = '') {
        _Graph_nodes.set(this, new Map());
        _Graph_floatingEdges.set(this, new Set());
        _Graph_name.set(this, '');
        __classPrivateFieldSet(this, _Graph_name, name, "f");
    }
    get nodes() { return [...__classPrivateFieldGet(this, _Graph_nodes, "f").values()]; }
    ;
    get edges() {
        let e = [];
        this.nodes.forEach(n => e.push(n.edges));
        return e.flat();
    }
    setName(n) { __classPrivateFieldSet(this, _Graph_name, n, "f"); return this; }
    set name(n) { __classPrivateFieldSet(this, _Graph_name, n, "f"); }
    get name() { return __classPrivateFieldGet(this, _Graph_name, "f"); }
    /** Gets the node for a given id it it exists. */
    node(id) {
        return __classPrivateFieldGet(this, _Graph_nodes, "f").get(id);
    }
    /** Gets the node for a given id it it exists. */
    edge(from, to) {
        return __classPrivateFieldGet(this, _Graph_nodes, "f").get(from)?.edge(to);
    }
    /**
     * Create and add a node. If a z coordinate is not provided then it is
     * set to zero.
     * @param id Create and add a node
     * @param position [x, y] or [x, y, z] position for the node
     * @param name name for this node
     * @returns this graph
     */
    createNode(id, position, name = '') {
        let node = new GraphNode(id, position, name);
        this.addNode(node);
        return this;
    }
    /**
     * Add a previously created node
     * @param node the node to add
     * @returns this graph
     */
    addNode(node) {
        console.assert(!__classPrivateFieldGet(this, _Graph_nodes, "f").has(node.id), `Duplicate node ID: ${node.id} - the original node has been overwritten`);
        __classPrivateFieldGet(this, _Graph_nodes, "f").set(node.id, node);
        return this;
    }
    /**
     * Remove this node and all edges that come to this node.
     * @param id the node id
     * @returns this graph
     */
    removeNode(id) {
        let node = this.node(id);
        if (node) {
            __classPrivateFieldGet(this, _Graph_nodes, "f").delete(node.id);
            [...__classPrivateFieldGet(this, _Graph_nodes, "f").values()].forEach(n => n.removeEdge(node.id));
        }
        return this;
    }
    /**
     * Create and add an edge between two nodes. To create a two-way connection
     * then bidrection should be true.
     * @param from node id
     * @param to  node id
     * @param bidirectional if true then add edge for both directions
     * @param cost array containing edge costs
     * @param name name for this edge
     * @returns this graph
     */
    createEdge(from, to, bidirectional = true, cost = [0, 0], name = '') {
        if (!cost)
            cost = [0, 0];
        if (bidirectional && cost.length == 1)
            cost[1] = cost[0];
        this.addEdge(new GraphEdge(from, to, cost[0], name));
        if (bidirectional)
            this.addEdge(new GraphEdge(to, from, cost[1], name));
        return this;
    }
    /**
     * Add a previously created edge
     * @param edge the edge to add
     * @returns this graph
     */
    addEdge(edge) {
        if (__classPrivateFieldGet(this, _Graph_nodes, "f").has(edge.from) && __classPrivateFieldGet(this, _Graph_nodes, "f").has(edge.to)) {
            if (edge.cost == 0)
                edge.cost = Graph.dist(this.node(edge.from), this.node(edge.to));
            this.node(edge.from).addEdge(edge);
        }
        else
            __classPrivateFieldGet(this, _Graph_floatingEdges, "f").add(edge);
        return this;
    }
    /**
     * Remove the one or both edges between two nodes
     * @param from the edge source
     * @param to the edge destination
     * @param bidirectional if true remove both edges
     * @returns this graph
     */
    removeEdge(from, to, bidirectional = false) {
        this.node(from)?.removeEdge(to);
        if (bidirectional)
            this.node(to)?.removeEdge(from);
        return this;
    }
    nearestNode(x, y, z = 0) {
        let pos = Float64Array.of(x, y, z);
        let nearestDist = Number.MAX_VALUE;
        let nearestNode;
        __classPrivateFieldGet(this, _Graph_nodes, "f").forEach(n => {
            let dist = Graph.distSq(n.pos, pos);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearestNode = n;
            }
        });
        return nearestNode;
    }
    /**
     * Adds all floating edges where the source and destination nodes exist.
     * Any unallocated edges are deleted.
     * @returns this graph
     */
    compact() {
        let nfe = 0, feadded = 0;
        for (let fe of __classPrivateFieldGet(this, _Graph_floatingEdges, "f").values()) {
            nfe++;
            let fromNode = this.node(fe.from), toNode = this.node(fe.to);
            if (fromNode && toNode) {
                feadded++;
                fromNode.addEdge(fe);
            }
        }
        if (nfe > 0) {
            console.log(`Compact:  ${feadded} of ${nfe} floating edges have been added to graph.`);
            if (feadded < nfe) {
                console.log(`          ${nfe - feadded} orphan edge(s) have been deleted.`);
                __classPrivateFieldGet(this, _Graph_floatingEdges, "f").clear();
            }
        }
        return this;
    }
    /** Eclidean distance between two nodes or node positions */
    static dist(n0, n1) {
        return Math.sqrt(Graph.distSq(n0, n1));
    }
    /** Eclidean distance squared between two nodes or node positions */
    static distSq(n0, n1) {
        let pa = n0 instanceof GraphNode ? n0.pos : n0;
        let pb = n1 instanceof GraphNode ? n1.pos : n1;
        let dx = pb[0] - pa[0], dy = pb[1] - pa[1], dz = pb[2] - pb[2];
        return dx * dx + dy * dy + dz * dz;
    }
    /** Eclidean distance between a nodes or node positions and XYZ coordinates */
    static dist_XYZ(n0, x, y, z = 0) {
        return Math.sqrt(Graph.distSq_XYZ(n0, x, y, z));
    }
    /** Eclidean distance squared between a nodes or node positions and XYZ coordinates */
    static distSq_XYZ(n0, x, y, z = 0) {
        let pa = n0 instanceof GraphNode ? n0.pos : n0;
        let dx = pa[0] - x, dy = pa[1] - y, dz = pa[2] - z;
        return dx * dx + dy * dy + dz * dz;
    }
    /** Returns an array of strings listing all nodes and edges */
    getData() {
        let a = [];
        a.push(`GRAPH: "${this.name}"`);
        a.push('Nodes:');
        for (let node of __classPrivateFieldGet(this, _Graph_nodes, "f").values()) {
            a.push(`  ${node.toString()}`);
            for (let edge of node.edges.values())
                a.push(`        ${edge.toString()}`);
        }
        a.push('Floating Edges:');
        for (let edge of __classPrivateFieldGet(this, _Graph_floatingEdges, "f").values())
            a.push(`  ${edge.toString()}`);
        return a;
    }
}
_Graph_nodes = new WeakMap(), _Graph_floatingEdges = new WeakMap(), _Graph_name = new WeakMap();
function getRouteEdges(nodes) {
    let edges = [];
    for (let i = 0; i < nodes.length - 1; i++) {
        edges.push(nodes[i].edge(nodes[i + 1].id));
    }
    return edges;
}
//# sourceMappingURL=graph.js.map