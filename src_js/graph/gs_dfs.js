class DFS {
    constructor(graph) {
        this._graph = graph;
        this._route = [];
        this._testedEdges = new Set();
    }
    get route() { return this._route; }
    get testedEdges() { return [...this._testedEdges.values()]; }
    search(startID, targetID) {
        this._route = [];
        this._testedEdges.clear();
        let start = this._graph.node(startID), target = this._graph.node(targetID);
        if (!start || !target) {
            console.error(`Nodes ${startID} and/or ${targetID} do not exist in this graph.`);
            return this;
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
                    stack.push(e);
                    this._testedEdges.add(e);
                }
            });
        }
        return this;
    }
}
//# sourceMappingURL=gs_dfs.js.map