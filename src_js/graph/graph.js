const ASTAR = Symbol.for('A*');
const DIJKSTRA = Symbol.for('Dijkstra');
const BFS = Symbol.for('Breadth first');
const DFS = Symbol.for('Depth first');
class Graph {
    #nodes = new Map();
    get nodes() { return [...this.#nodes.values()]; }
    get edges() {
        let e = [];
        this.nodes.forEach(n => e.push(n.edges));
        return e.flat();
    }
    #floatingEdges = new Set();
    #name = '';
    setName(n) { this.#name = n; return this; }
    set name(n) { this.#name = n; }
    get name() { return this.#name; }
    constructor(name = '') {
        this.#name = name;
    }
    search(nodeIDs, searchType = ASTAR, heuristic = EUCLIDEAN, costFactor = 1) {
        if (!this.#isSearchValid(nodeIDs, searchType, heuristic))
            return undefined;
        let searchImpl;
        let ash = heuristic(costFactor);
        switch (searchType) {
            case ASTAR:
                searchImpl = this.#searchAstar;
                break;
            case DIJKSTRA:
                searchImpl = this.#searchDijkstra;
                break;
            case BFS:
                searchImpl = this.#searchBFS;
                break;
            case DFS:
                searchImpl = this.#searchDFS;
                break;
        }
        let testedEdges = new Set();
        let path = searchImpl.call(this, nodeIDs[0], nodeIDs[1], testedEdges, ash);
        for (let i = 2; i < nodeIDs.length; i++) {
            let pr = searchImpl.call(this, nodeIDs[i - 1], nodeIDs[i], testedEdges, ash);
            pr.shift();
            path.push(...pr);
        }
        // Now we have the path create list of edges
        let edges = [];
        for (let i = 0; i < path.length - 1; i++)
            edges.push(path[i].edge(path[i + 1].id));
        return { 'path': [...path], 'edges': [...edges], 'testedEdges': [...testedEdges.values()] };
    }
    #searchDFS(startID, targetID, testedEdges) {
        console.log('Depth first');
        let partroute = [];
        let start = this.node(startID), target = this.node(targetID);
        if (!start || !target) {
            console.error(`Nodes ${startID} and/or ${targetID} do not exist in this graph.`);
            return partroute;
        }
        let settledNodes = new Map();
        let visited = new Set();
        let next;
        let stack = [];
        stack.push(new GraphEdge(startID, startID, 0));
        while (stack.length > 0) {
            next = stack.pop();
            settledNodes.set(next.to, next.from);
            visited.add(next.to);
            if (next.to == targetID) {
                let parent = targetID;
                partroute.push(this.node(targetID));
                do {
                    parent = settledNodes.get(parent);
                    partroute.push(this.node(parent));
                } while (parent != startID);
                partroute.reverse();
                return partroute;
            }
            // Examine edges from current node
            this.node(next.to).edges.forEach(e => {
                if (!visited.has(e.to)) {
                    stack.push(e);
                    testedEdges.add(e);
                }
            });
        }
        return partroute;
    }
    #searchBFS(startID, targetID, testedEdges) {
        console.log('Breadth first');
        let partRoute = [];
        let start = this.node(startID), target = this.node(targetID);
        if (start !== target) {
            let settledNodes = new Map();
            let visited = new Set();
            let next;
            let queue = [];
            queue.push(new GraphEdge(startID, startID, 0));
            while (queue.length > 0) {
                next = queue.shift();
                settledNodes.set(next.to, next.from);
                visited.add(next.to);
                if (next.to == targetID) {
                    let parent = targetID;
                    partRoute.push(this.node(targetID));
                    do {
                        parent = settledNodes.get(parent);
                        partRoute.push(this.node(parent));
                    } while (parent != startID);
                    partRoute.reverse();
                    return partRoute;
                }
                // Examine edges from current node
                this.node(next.to).edges.forEach(e => {
                    if (!visited.has(e.to)) {
                        queue.push(e);
                        testedEdges.add(e);
                    }
                });
            }
        }
        return partRoute;
    }
    #searchDijkstra(startID, targetID, testedEdges) {
        console.log('Dijkstra');
        this.nodes.forEach(n => n.resetSearchCosts());
        let partroute = [];
        let start = this.node(startID), target = this.node(targetID);
        if (!start || !target) {
            console.error(`Nodes ${startID} and/or ${targetID} do not exist in this graph.`);
            return partroute;
        }
        let unsettledNodes = []; // Use as priority queue
        let settledNodes = new Set();
        let parent = new Map();
        let next, edgeTo;
        unsettledNodes.push(start);
        while (unsettledNodes.length > 0) {
            next = unsettledNodes.shift();
            if (next == target) {
                partroute.push(target);
                while (next !== start) {
                    next = parent.get(next);
                    partroute.push(next);
                }
                partroute.reverse();
                return partroute;
            }
            settledNodes.add(next);
            next.edges.forEach(e => {
                edgeTo = this.node(e.to);
                let newCost = next.graphCost + e.cost;
                let edgeToCost = edgeTo.graphCost;
                if (!settledNodes.has(edgeTo) && (edgeToCost == 0 || edgeTo.graphCost > newCost)) {
                    edgeTo.graphCost = newCost;
                    parent.set(edgeTo, next);
                    unsettledNodes.push(edgeTo); // Maintain priority queue
                    unsettledNodes.sort((a, b) => a.graphCost - b.graphCost);
                    testedEdges.add(e);
                }
            });
        }
        return partroute;
    }
    #searchAstar(startID, targetID, testedEdges, ash) {
        console.log(`Astar   :   ${ash.name}`);
        this.nodes.forEach(n => n.resetSearchCosts());
        let partPath = [];
        let start = this.node(startID), target = this.node(targetID);
        if (start !== target) {
            let unsettledNodes = []; // Use as priority queue
            let settledNodes = new Set();
            let parent = new Map();
            let next, edgeTo;
            start.fullCost = ash(start, target);
            unsettledNodes.push(start);
            while (unsettledNodes.length > 0) {
                next = unsettledNodes.shift();
                if (next === target) {
                    partPath.push(target);
                    while (next !== start) {
                        next = parent.get(next);
                        partPath.push(next);
                    }
                    partPath.reverse();
                    return partPath;
                }
                settledNodes.add(next);
                next.edges.forEach(e => {
                    edgeTo = this.node(e.to);
                    let gCost = next.graphCost + e.cost;
                    let hCost = ash(edgeTo, target);
                    let edgeToCost = edgeTo.graphCost;
                    if (!settledNodes.has(edgeTo) && (edgeToCost == 0 || edgeTo.graphCost > gCost + hCost)) {
                        edgeTo.graphCost = gCost;
                        edgeTo.fullCost = gCost + hCost;
                        parent.set(edgeTo, next);
                        unsettledNodes.push(edgeTo); // Maintain priority queue
                        unsettledNodes.sort((a, b) => a.fullCost - b.fullCost);
                        testedEdges.add(e);
                    }
                });
            }
        }
        return partPath;
    }
    /** Gets the node for a given id it it exists. */
    node(id) {
        return this.#nodes.get(id);
    }
    /** Gets the node for a given id it it exists. */
    edge(from, to) {
        return this.#nodes.get(from)?.edge(to);
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
        console.assert(!this.#nodes.has(node.id), `Duplicate node ID: ${node.id} - the original node has been overwritten`);
        this.#nodes.set(node.id, node);
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
            this.#nodes.delete(node.id);
            [...this.#nodes.values()].forEach(n => n.removeEdge(node.id));
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
        if (this.#nodes.has(edge.from) && this.#nodes.has(edge.to)) {
            if (edge.cost == 0)
                edge.cost = Graph.dist(this.node(edge.from), this.node(edge.to));
            this.node(edge.from).addEdge(edge);
        }
        else
            this.#floatingEdges.add(edge);
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
        this.#nodes.forEach(n => {
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
        for (let fe of this.#floatingEdges.values()) {
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
                this.#floatingEdges.clear();
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
        for (let node of this.#nodes.values()) {
            a.push(`  ${node.toString()}`);
            for (let edge of node.edges.values())
                a.push(`        ${edge.toString()}`);
        }
        a.push('Floating Edges:');
        for (let edge of this.#floatingEdges.values())
            a.push(`  ${edge.toString()}`);
        return a;
    }
    #isSearchValid(ids, searchType, heuristic) {
        // Make sure we have an array of length >= 2
        if (!Array.isArray(ids) || ids.length <= 1) {
            console.error(`Search error:  invalid array`);
            return false;
        }
        // Ensure all nodes exits
        for (let id of ids)
            if (!this.node(id)) {
                return false;
                break;
            }
        // Check search type
        switch (searchType) {
            case ASTAR: break;
            case DIJKSTRA: break;
            case BFS: break;
            case DFS: break;
            default:
                console.error(`Invalid search algorithm`);
                return false;
        }
        // Check A star heuristic
        switch (heuristic) {
            case EUCLIDEAN:
            case MANHATTAN:
                break;
            default:
                console.error(`Invalid Astar heuristic`);
                return false;
        }
        return true;
    }
}
const EUCLIDEAN = function (factor = 1) {
    return (function Euclidian(node, target) {
        let dx = target.x - node.x;
        let dy = target.y - node.y;
        let dz = target.z - node.z;
        return factor * Math.sqrt(dx * dx + dy * dy + dz * dz);
    });
};
const MANHATTAN = function (factor = 1) {
    return (function Manhattan(node, target) {
        let dx = Math.abs(target.x - node.x);
        let dy = Math.abs(target.y - node.y);
        let dz = Math.abs(target.z - node.z);
        return factor * (dx + dy + dz);
    });
};
//# sourceMappingURL=graph.js.map