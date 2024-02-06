class Astar {
    constructor(graph, ash = Euclidean()) {
        this._graph = graph;
        this._ash = ash;
        this._route = [];
        this._testedEdges = new Set();
    }
    get route() { return this._route; }
    get testedEdges() { return [...this._testedEdges.values()]; }
    search(startID, targetID) {
        this._graph.nodes.forEach(n => n.resetSearchCosts());
        this._route = [], this._testedEdges.clear();
        let start = this._graph.node(startID), target = this._graph.node(targetID);
        if (!start || !target) {
            console.error(`Nodes ${startID} and/or ${targetID} do not exist in this graph.`);
            return this;
        }
        let unsettledNodes = []; // Use as priority queue
        let settledNodes = new Set();
        let parent = new Map();
        let next, edgeTo;
        start.fullCost = this._ash(start, target);
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
                let hCost = this._ash(edgeTo, target);
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
function Euclidean(factor = 1) {
    return (function (node, target) {
        let dx = target.x - node.x;
        let dy = target.y - node.y;
        let dz = target.z - node.z;
        return factor * Math.sqrt(dx * dx + dy * dy + dz * dz);
    });
}
function Manhattan(factor = 1) {
    return (function (node, target) {
        let dx = Math.abs(target.x - node.x);
        let dy = Math.abs(target.y - node.y);
        let dz = Math.abs(target.z - node.z);
        return factor * (dx + dy + dz);
    });
}
// class AshCrowFlight implements AstarHeuristic {
//     _factor = 1.0;
//     constructor(factor: number = 1) {
//         this._factor = factor;
//     }
//     getCost(node: GraphNode, target: GraphNode): number {
//         let dx = target.x - node.x;
//         let dy = target.y - node.y;
//         let dz = target.z - node.z;
//         return this._factor * Math.sqrt(dx * dx + dy * dy + dz * dz);
//     }
// }
// class AshManhattan implements AstarHeuristic {
//     _factor = 1.0;
//     public AshManhattan(factor = 1) {
//         this._factor = factor;
//     }
//     getCost(node: GraphNode, target: GraphNode): number {
//         let dx = Math.abs(target.x - node.x);
//         let dy = Math.abs(target.y - node.y);
//         let dz = Math.abs(target.z - node.z);
//         return this._factor * (dx + dy + dz);
//     }
// }
//# sourceMappingURL=gs_astar.js.map