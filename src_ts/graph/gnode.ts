/**
 * This class represents a node (vertex) that can be used with the Graph class.
 * <br>
 * The node has a 3D position but for 2D scenarios the z value should be zero.
 * <br>
 * 
 * Each node should be given a unique ID number >= 0. Node ID numbers do not
 * need to start at 0 (zero) or be sequential but they must be unique. <br>
 * 
 * It is the responsibility of the user to ensure that each node ID is unique 
 * as duplicate ID numbers can lead to unpredictable behaviour.
 * 
 * @author Peter Lager
 *
 */
class GraphNode {

    _edges = new Map<number, GraphEdge>();
    get edges(): Array<GraphEdge> { return [...this._edges.values()]; }

    _id: number;
    get id(): number { return this._id; }

    _name = '';
    setName(n: string): GraphNode { this._name = n; return this; }
    set name(n: string) { this._name = n; }
    get name(): string { return this._name; }

    _p = new Float64Array(3);
    get pos(): Float64Array { return this._p; }

    setX(n: number): GraphNode { this._p[0] = n; return this; }
    set x(n: number) { this._p[0] = n; }
    get x(): number { return this._p[0]; }

    setY(n: number): GraphNode { this._p[1] = n; return this; }
    set y(n: number) { this._p[1] = n; }
    get y(): number { return this._p[1]; }

    setZ(n: number): GraphNode { this._p[2] = n; return this; }
    set z(n: number) { this._p[2] = n; }
    get z(): number { return this._p[2]; }

    // Used in the Dijkstra and A* search algorithms
    _graphCost: number = 0;
    set graphCost(n: number) { this._graphCost = n; }
    get graphCost(): number { return this._graphCost; }

    _fullCost: number = 0;
    set fullCost(n: number) { this._fullCost = n; }
    get fullCost(): number { return this._fullCost; }


    /** Create a node with a unique ID and an optional position */
    constructor(id: number, position: Array<number> = [0, 0, 0], name = '') {
        this._id = id;
        let len = position.length;
        this._p[0] = len > 0 ? position[0] : 0;
        this._p[1] = len > 1 ? position[1] : 0;
        this._p[2] = len > 2 ? position[2] : 0;
        this._name = name;
    }

    /**
     * Add an edge to this node. It will replace any previous edge with the smae
     * destination.
     * @param edge the edge to add
     */
    addEdge(edge: GraphEdge) {
        console.assert(!this._edges.has(edge.to), `Duplicate edge from: ${this.id} to ${edge.to} - the original edge has been overwritten`);
        this._edges.set(edge.to, edge);
    }

    /**
     * Removes the edge to the specified destination
     * @param id the destination node ID
     */
    removeEdge(id: number) {
        this._edges.delete(id);
    }

    edge(to: number): GraphEdge {
        return this._edges.get(to);
    }

    resetSearchCosts() {
        this.graphCost = this.fullCost = 0;
    }

    toString() {
        return `ID: ${this.id}  Name: "${this.name}" @ [ ${this.x}, ${this.y}, ${this.z}]`;
    }
}
