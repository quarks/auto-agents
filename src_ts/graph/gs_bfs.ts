class BFS {
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

    search(nodeIDs: Array<number>): BFS {
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
        let partRoute = [];
        let start = this.#graph.node(startID), target = this.#graph.node(targetID);
        if (start !== target) {
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
                    partRoute.push(this.#graph.node(targetID));
                    do {
                        parent = settledNodes.get(parent);
                        partRoute.push(this.#graph.node(parent));
                    } while (parent != startID);
                    partRoute.reverse();
                    return partRoute;
                }
                // Examine edges from current node
                this.#graph.node(next.to).edges.forEach(e => {
                    if (!visited.has(e.to)) {
                        queue.push(e);
                        this.#testedEdges.add(e);
                    }
                });
            }
        }
        return partRoute;
    }
}