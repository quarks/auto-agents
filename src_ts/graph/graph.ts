class Graph {

    _nodes = new Map<number, GraphNode>();
    _floatingEdges = new Set<GraphEdge>();

    _name = '';
    setName(n: string): Graph { this._name = n; return this; }
    set name(n: string) { this._name = n; }
    get name(): string { return this._name; }

    constructor(name = '') {
        this._name = name;
    }

    node(id: number) {
        return this._nodes.get(id);
    }

    createNode(id: number, x: number, y: number, z: number = 0, name = ''): GraphNode {
        let node = new GraphNode(id, x, y, z, name);
        console.assert(!this._nodes.has(id), `Duplicate node ID: ${id} - the original node has been overwritten`);
        this._nodes.set(id, node);
        return node;
    }

    createEdge(from: number, to: number, cost: number | Array<number>, name = '') {
        function makeEdge(from: number, to: number, cost: number, name: string) {
            let edge = new GraphEdge(from, to, cost, name);
            if (this._nodes.has(from) && this._nodes.has(to)) {
                this.node(from)?.addFwdEdge(edge);
            }
            else {
                this._floatingEdges.add(edge);
            }
        }
        if (Array.isArray(cost)) {
            makeEdge.call(this, from, to, cost[0], name);
            makeEdge.call(this, to, from, cost[1] ? cost[1] : cost[0], name);
        }
        else
            makeEdge.call(this, from, to, cost, name);
    }

    compact() {
        let nfe = 0, feadded = 0;
        for (let fe of this._floatingEdges.values()) {
            nfe++;
            let fromNode = this.node(fe.from), toNode = this.node(fe.to);
            if (fromNode && toNode) {
                feadded++;
                fromNode.addFwdEdge(fe);
            }
        }
        if (nfe > 0)
            console.log(`Compact: ${feadded} of ${nfe} edges have been added to graph`);

    }
    static dist(n0: GraphNode, n1: GraphNode): number {
        let dx = n1._p[0] - n0._p[0],
            dy = n1._p[1] - n0._p[1],
            dz = n1._p[2] - n1._p[2];
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    static distSq(n0: GraphNode, n1: GraphNode): number {
        let dx = n1._p[0] - n0._p[0],
            dy = n1._p[1] - n0._p[1],
            dz = n1._p[2] - n1._p[2];
        return dx * dx + dy * dy + dz * dz;
    }

    getData(): Array<string> {
        let a = [];
        a.push(`GRAPH: "${this.name}"`);
        a.push('Nodes:');
        for (let node of this._nodes.values()) {
            a.push(`  ${node.toString()}`);
            for (let edge of node._edges.values())
                a.push(`        ${edge.toString()}`);
        }
        a.push('Floating Edges:');
        for (let edge of this._floatingEdges.values())
            a.push(`  ${edge.toString()}`);
        return a;
    }
}
