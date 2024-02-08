class Dijkstra {
    #graph: Graph;

    #route: Array<GraphNode>;
    get route(): Array<GraphNode> { return this.#route; }

    #edges: Array<GraphEdge>;
    get edges(): Array<GraphEdge> { return this.#edges };

    #testedEdges: Set<GraphEdge>;
    get testedEdges(): Array<GraphEdge> { return [...this.#testedEdges.values()]; }

    constructor(graph: Graph) {
        this.#graph = graph;
        this.#route = [];
        this.#testedEdges = new Set();
    }

    search(nodeIDs: Array<number>): Dijkstra {
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
        let partroute = [];
        this.#testedEdges.clear();
        let start = this.#graph.node(startID), target = this.#graph.node(targetID);
        if (!start || !target) {
            console.error(`Nodes ${startID} and/or ${targetID} do not exist in this graph.`);
            return partroute;
        }
        let unsettledNodes: Array<GraphNode> = []; // Use as priority queue
        let settledNodes: Set<GraphNode> = new Set();
        let parent: Map<GraphNode, GraphNode> = new Map();
        let next: GraphNode, edgeTo: GraphNode;
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
                edgeTo = this.#graph.node(e.to);
                let newCost = next.graphCost + e.cost;
                let edgeToCost = edgeTo.graphCost;
                if (!settledNodes.has(edgeTo) && (edgeToCost == 0 || edgeTo.graphCost > newCost)) {
                    edgeTo.graphCost = newCost;
                    parent.set(edgeTo, next);
                    unsettledNodes.push(edgeTo); // Maintain priority queue
                    unsettledNodes.sort((a, b) => a.graphCost - b.graphCost);
                    this.#testedEdges.add(e);
                }
            });
        }
        return partroute;
    }
}