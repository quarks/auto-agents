class Astar {
    #graph: Graph;

    #route: Array<GraphNode>;
    get route(): Array<GraphNode> { return this.#route; }

    #edges: Array<GraphEdge>;
    get edges(): Array<GraphEdge> { return this.#edges };

    #testedEdges: Set<GraphEdge>;
    get testedEdges(): Array<GraphEdge> { return [...this.#testedEdges.values()]; }

    #ash: Function;

    constructor(graph: Graph, ash = Euclidean()) {
        this.#graph = graph;
        this.#ash = ash;
        this.#route = [];
        this.#testedEdges = new Set();
    }

    search(nodeIDs: Array<number>): Astar {
        function allNodesExist(graph: Graph, ids: Array<number>): boolean {
            for (let id of ids) if (!graph.node(id)) return false;
            return true;
        }
        if (!Array.isArray(nodeIDs) || nodeIDs.length <= 1) {
            console.error(`Search error:  invalid array`);
            return this;
        }
        else if (!allNodesExist(this.#graph, nodeIDs)) {
            console.error(`Search error:  non-existant nodes in route list`);
            return this;
        }
        this.#testedEdges.clear();
        this.#route = this.#search(nodeIDs[0], nodeIDs[1]);
        for (let i = 2; i < nodeIDs.length; i++) {
            let pr = this.#search(nodeIDs[i - 1], nodeIDs[i]);
            pr.shift();
            this.#route.push(...pr);
        }
        this.#edges = [];
        for (let i = 0; i < this.#route.length - 1; i++)
            this.#edges.push(this.#route[i].edge(this.#route[i + 1].id));
        return this;
    }

    #search(startID: number, targetID: number): Array<GraphNode> {
        this.#graph.nodes.forEach(n => n.resetSearchCosts());
        let partRoute = [];
        let start = this.#graph.node(startID), target = this.#graph.node(targetID);
        if (start !== target) {
            let unsettledNodes: Array<GraphNode> = []; // Use as priority queue
            let settledNodes: Set<GraphNode> = new Set();
            let parent: Map<GraphNode, GraphNode> = new Map();
            let next: GraphNode, edgeTo: GraphNode;
            start.fullCost = this.#ash(start, target);
            unsettledNodes.push(start);
            while (unsettledNodes.length > 0) {
                next = unsettledNodes.shift();
                if (next === target) {
                    partRoute.push(target);
                    while (next !== start) {
                        next = parent.get(next);
                        partRoute.push(next);
                    }
                    partRoute.reverse();
                    return partRoute;
                }
                settledNodes.add(next);
                next.edges.forEach(e => {
                    edgeTo = this.#graph.node(e.to);
                    let gCost = next.graphCost + e.cost;
                    let hCost = this.#ash(edgeTo, target);
                    let edgeToCost = edgeTo.graphCost;
                    if (!settledNodes.has(edgeTo) && (edgeToCost == 0 || edgeTo.graphCost > gCost + hCost)) {
                        edgeTo.graphCost = gCost;
                        edgeTo.fullCost = gCost + hCost;
                        parent.set(edgeTo, next);
                        unsettledNodes.push(edgeTo); // Maintain priority queue
                        unsettledNodes.sort((a, b) => a.fullCost - b.fullCost);
                        this.#testedEdges.add(e);
                    }
                });
            }
        }
        return partRoute;
    }
}

interface AstarHeuristic {
    getCost: Function;
}

function Euclidean(factor = 1): Function {
    return (function (node: GraphNode, target: GraphNode) {
        let dx = target.x - node.x;
        let dy = target.y - node.y;
        let dz = target.z - node.z;
        return factor * Math.sqrt(dx * dx + dy * dy + dz * dz);
    });
}

function Manhattan(factor = 1): Function {
    return (function (node: GraphNode, target: GraphNode) {
        let dx = Math.abs(target.x - node.x);
        let dy = Math.abs(target.y - node.y);
        let dz = Math.abs(target.z - node.z);
        return factor * (dx + dy + dz);
    });
}
