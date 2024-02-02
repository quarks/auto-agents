class Dijkstra {
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

    search(startID: number, targetID: number): Dijkstra {
        this._graph.nodes.forEach(n => n.resetSearchCosts());
        this._route = [], this._testedEdges.clear();
        let start = this._graph.node(startID), target = this._graph.node(targetID);
        if (!start || !target) {
            console.error(`Nodes ${startID} and/or ${targetID} do not exist in this graph.`);
            return this;
        }
        let unsettledNodes: Array<GraphNode> = []; // Use as priority queue
        let settledNodes: Set<GraphNode> = new Set();
        let parent: Map<GraphNode, GraphNode> = new Map();
        let next: GraphNode, edgeTo: GraphNode;
        unsettledNodes.push(start);

        while (unsettledNodes.length > 0) {
            next = unsettledNodes.shift();
            if (next == target) {
                this._route.push(target);
                while (next !== start) {
                    next = parent.get(next);
                    this._route.push(next);
                }
                this._route.reverse();
                return this;
            }
            settledNodes.add(next);
            next.edges.forEach(e => {
                edgeTo = this._graph.node(e.to);
                let newCost = next.graphCost + e.cost;
                let edgeToCost = edgeTo.graphCost;
                if (!settledNodes.has(edgeTo) && (edgeToCost == 0 || edgeTo.graphCost > newCost)) {
                    edgeTo.graphCost = newCost;
                    parent.set(edgeTo, next);
                    unsettledNodes.push(edgeTo); // Maintain priority queue
                    unsettledNodes.sort((a, b) => a.graphCost - b.graphCost);
                    this._testedEdges.add(e);
                }
            });
        }
        return this;
    }
}