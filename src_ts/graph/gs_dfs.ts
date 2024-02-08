class DFS {
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

    search(nodeIDs: Array<number>): DFS {
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
        let partroute = [];
        let start = this.#graph.node(startID), target = this.#graph.node(targetID);
        if (!start || !target) {
            console.error(`Nodes ${startID} and/or ${targetID} do not exist in this graph.`);
            return partroute;
        }
        let settledNodes: Map<number, number> = new Map();
        let visited: Set<number> = new Set();
        let next: GraphEdge;
        let stack: Array<GraphEdge> = [];
        stack.push(new GraphEdge(startID, startID, 0));

        while (stack.length > 0) {
            next = stack.pop();
            settledNodes.set(next.to, next.from);
            visited.add(next.to);
            if (next.to == targetID) {
                let parent = targetID;
                partroute.push(this.#graph.node(targetID));
                do {
                    parent = settledNodes.get(parent);
                    partroute.push(this.#graph.node(parent));
                } while (parent != startID);
                partroute.reverse();
                return partroute;
            }
            // Examine edges from current node
            this.#graph.node(next.to).edges.forEach(e => {
                if (!visited.has(e.to)) {
                    stack.push(e);
                    this.#testedEdges.add(e);
                }
            });
        }
        return partroute;
    }
}