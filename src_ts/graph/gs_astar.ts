class Astar {
    _graph: Graph;

    _route: Array<GraphNode>;
    get route(): Array<GraphNode> { return this._route; }

    _testedEdges: Set<GraphEdge>;
    get testedEdges(): Array<GraphEdge> { return [...this._testedEdges.values()]; }

    _ash: AstarHeuristic;

    constructor(graph: Graph, ash = new AshCrowFlight()) {
        this._graph = graph;
        this._ash = ash;
        this._route = [];
        this._testedEdges = new Set();
    }

    search(startID: number, targetID: number): Astar {
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

        start.fullCost = this._ash.getCost(start, target);
        unsettledNodes.push(start);

        while (unsettledNodes.length > 0) {
            next = unsettledNodes.shift();
            if (next === target) {
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
                let gCost = next.graphCost + e.cost;
                let hCost = this._ash.getCost(edgeTo, target);
                let edgeToCost = edgeTo.graphCost;
                if (!settledNodes.has(edgeTo) && (edgeToCost == 0 || edgeTo.graphCost > gCost + hCost)) {
                    edgeTo.graphCost = gCost;
                    edgeTo.fullCost = gCost + hCost;
                    parent.set(edgeTo, next);
                    unsettledNodes.push(edgeTo); // Maintain priority queue
                    unsettledNodes.sort((a, b) => a.fullCost - b.fullCost);
                    this._testedEdges.add(e);
                }
            });

        }
        return this;
    }
}

interface AstarHeuristic {
    getCost: Function;
}

class AshCrowFlight implements AstarHeuristic {
    _factor = 1.0;

    constructor(factor: number = 1) {
        this._factor = factor;
    }

    getCost(node: GraphNode, target: GraphNode): number {
        let dx = target.x - node.x;
        let dy = target.y - node.y;
        let dz = target.z - node.z;
        return this._factor * Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

}

class AshManhattan implements AstarHeuristic {
    _factor = 1.0;

    public AshManhattan(factor = 1) {
        this._factor = factor;
    }

    getCost(node: GraphNode, target: GraphNode): number {
        let dx = Math.abs(target.x - node.x);
        let dy = Math.abs(target.y - node.y);
        let dz = Math.abs(target.z - node.z);
        return this._factor * (dx + dy + dz);
    }
}
