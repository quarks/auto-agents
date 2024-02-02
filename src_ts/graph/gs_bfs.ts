class BFS {
    _graph: Graph;

    _route: Array<GraphNode>;
    get route(): Array<GraphNode> { return this._route; }

    _testedEdges: Set<GraphEdge>;
    get testedEdges(): Array<GraphEdge> { return [...this._testedEdges.values()]; }

    constructor(graph: Graph) {
        this._graph = graph;
        this._route = [];
        this._testedEdges = new Set();
    }

    search(startID: number, targetID: number): DFS {
        this._route = [];
        this._testedEdges.clear();
        let start = this._graph.node(startID), target = this._graph.node(targetID);
        if (!start || !target) {
            console.error(`Nodes ${startID} and/or ${targetID} do not exist in this graph.`);
            return this;
        }
        let settledNodes: Map<number, number> = new Map();
        let visited: Set<number> = new Set();
        let next: GraphEdge;
        let queue: Array<GraphEdge> = [];
        queue.push(new GraphEdge(startID, startID, 0));

        while (queue.length > 0) {
            next = queue.shift();
            settledNodes.set(next.to, next.from);
            visited.add(next.to);
            if (next.to == targetID) {
                let parent = targetID;
                this._route.push(this._graph.node(targetID));
                do {
                    parent = settledNodes.get(parent);
                    this._route.push(this._graph.node(parent));
                } while (parent != startID);
                this._route.reverse();
                return this;
            }
            // Examine edges from current node
            this._graph.node(next.to).edges.forEach(e => {
                if (!visited.has(e.to)) {
                    queue.push(e);
                    this._testedEdges.add(e);
                }
            });
        }
        return this;
    }
}