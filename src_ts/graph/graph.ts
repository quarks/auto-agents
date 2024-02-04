class Graph {

    _nodes = new Map<number, GraphNode>();
    get nodes(): Array<GraphNode> { return [...this._nodes.values()] };

    get edges(): Array<GraphEdge> {
        let e = [];
        this.nodes.forEach(n => e.push(n.edges));
        return e.flat();
    }

    _floatingEdges = new Set<GraphEdge>();

    _name = '';
    setName(n: string): Graph { this._name = n; return this; }
    set name(n: string) { this._name = n; }
    get name(): string { return this._name; }

    constructor(name = '') {
        this._name = name;
    }

    /** Gets the node for a given id it it exists. */
    node(id: number) {
        return this._nodes.get(id);
    }

    /** Gets the node for a given id it it exists. */
    edge(from: number, to: number) {
        return this._nodes.get(from)?.edge(to);
    }

    /**
     * Create and add a node. If a z coordinate is not provided then it is 
     * set to zero.
     * @param id Create and add a node
     * @param position [x, y] or [x, y, z] position for the node
     * @param name name for this node
     * @returns this graph
     */
    createNode(id: number, position: Array<number>, name = ''): Graph {
        let node = new GraphNode(id, position, name);
        this.addNode(node);
        return this;
    }

    /**
     * Add a previously created node
     * @param node the node to add
     * @returns this graph
     */
    addNode(node: GraphNode): Graph {
        console.assert(!this._nodes.has(node.id), `Duplicate node ID: ${node.id} - the original node has been overwritten`);
        this._nodes.set(node.id, node);
        return this;
    }

    /**
     * Remove this node and all edges that come to this node.
     * @param id the node id
     * @returns this graph
     */
    removeNode(id: number): Graph {
        let node = this.node(id);
        if (node) {
            this._nodes.delete(node.id);
            [...this._nodes.values()].forEach(n => n.removeEdge(node.id));
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
    createEdge(from: number, to: number, bidirectional: boolean = true, cost: Array<number> = [0, 0], name = ''): Graph {
        if (!cost) cost = [0, 0];
        if (bidirectional && cost.length == 1) cost[1] = cost[0];
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
    addEdge(edge: GraphEdge): Graph {
        if (this._nodes.has(edge.from) && this._nodes.has(edge.to)) {
            if (edge.cost == 0)
                edge.cost = Graph.dist(this.node(edge.from), this.node(edge.to));
            this.node(edge.from).addEdge(edge);
        }
        else
            this._floatingEdges.add(edge);
        return this;
    }

    /**
     * Remove the one or both edges between two nodes
     * @param from the edge source
     * @param to the edge destination
     * @param bidirectional if true remove both edges
     * @returns this graph
     */
    removeEdge(from: number, to: number, bidirectional = false): Graph {
        this.node(from)?.removeEdge(to);
        if (bidirectional)
            this.node(to)?.removeEdge(from);
        return this;
    }

    nearestNode(x: number, y: number, z = 0) {
        let pos = Float64Array.of(x, y, z);
        let nearestDist = Number.MAX_VALUE;
        let nearestNode: GraphNode;
        this._nodes.forEach(n => {
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
    compact(): Graph {
        let nfe = 0, feadded = 0;
        for (let fe of this._floatingEdges.values()) {
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
                this._floatingEdges.clear();
            }
        }
        return this;
    }

    /** Eclidean distance between two nodes or node positions */
    static dist(n0: GraphNode | Float64Array, n1: GraphNode | Float64Array): number {
        return Math.sqrt(Graph.distSq(n0, n1));
    }

    /** Eclidean distance squared between two nodes or node positions */
    static distSq(n0: GraphNode | Float64Array, n1: GraphNode | Float64Array): number {
        let pa = n0 instanceof GraphNode ? n0.pos : n0;
        let pb = n1 instanceof GraphNode ? n1.pos : n1;
        let dx = pb[0] - pa[0], dy = pb[1] - pa[1], dz = pb[2] - pb[2];
        return dx * dx + dy * dy + dz * dz;
    }

    /** Eclidean distance between a nodes or node positions and XYZ coordinates */
    static dist_XYZ(n0: GraphNode | Float64Array, x: number, y: number, z = 0): number {
        return Math.sqrt(Graph.distSq_XYZ(n0, x, y, z));
    }

    /** Eclidean distance squared between a nodes or node positions and XYZ coordinates */
    static distSq_XYZ(n0: GraphNode | Float64Array, x: number, y: number, z = 0): number {
        let pa = n0 instanceof GraphNode ? n0.pos : n0;
        let dx = pa[0] - x, dy = pa[1] - y, dz = pa[2] - z;
        return dx * dx + dy * dy + dz * dz;
    }

    /** Returns an array of strings listing all nodes and edges */
    getData(): Array<string> {
        let a = [];
        a.push(`GRAPH: "${this.name}"`);
        a.push('Nodes:');
        for (let node of this._nodes.values()) {
            a.push(`  ${node.toString()}`);
            for (let edge of node._edges.values())
                a.push(`        ${edge.toString()}`);
        }
        a.push('Floating Edges:');
        for (let edge of this._floatingEdges.values())
            a.push(`  ${edge.toString()}`);
        return a;
    }
}

