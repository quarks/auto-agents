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
    #edges = new Map<number, GraphEdge>();
    get edges(): Array<GraphEdge> { return [...this.#edges.values()]; }

    #id: number;
    get id(): number { return this.#id; }

    _name = '';
    setName(n: string): GraphNode { this._name = n; return this; }
    set name(n: string) { this._name = n; }
    get name(): string { return this._name; }

    #p = new Float64Array(3);
    get pos(): Float64Array { return this.#p; }

    setX(n: number): GraphNode { this.#p[0] = n; return this; }
    set x(n: number) { this.#p[0] = n; }
    get x(): number { return this.#p[0]; }

    setY(n: number): GraphNode { this.#p[1] = n; return this; }
    set y(n: number) { this.#p[1] = n; }
    get y(): number { return this.#p[1]; }

    setZ(n: number): GraphNode { this.#p[2] = n; return this; }
    set z(n: number) { this.#p[2] = n; }
    get z(): number { return this.#p[2]; }

    // Used in the Dijkstra and A* search algorithms
    #graphCost: number = 0;
    set graphCost(n: number) { this.#graphCost = n; }
    get graphCost(): number { return this.#graphCost; }

    #fullCost: number = 0;
    set fullCost(n: number) { this.#fullCost = n; }
    get fullCost(): number { return this.#fullCost; }


    /** Create a node with a unique ID and an optional position */
    constructor(id: number, position: Array<number> = [0, 0, 0], name = '') {
        this.#id = id;
        let len = position.length;
        this.#p[0] = len > 0 ? position[0] : 0;
        this.#p[1] = len > 1 ? position[1] : 0;
        this.#p[2] = len > 2 ? position[2] : 0;
        this._name = name;
    }

    /**
     * Add an edge to this node. It will replace any previous edge with the smae
     * destination.
     * @param edge the edge to add
     */
    addEdge(edge: GraphEdge) {
        console.assert(!this.#edges.has(edge.to), `Duplicate edge from: ${this.id} to ${edge.to} - the original edge has been overwritten`);
        this.#edges.set(edge.to, edge);
    }

    /**
     * Removes the edge to the specified destination
     * @param id the destination node ID
     */
    removeEdge(id: number) {
        this.#edges.delete(id);
    }

    edge(to: number): GraphEdge {
        return this.#edges.get(to);
    }

    resetSearchCosts() {
        this.graphCost = this.fullCost = 0;
    }

    toString() {
        return `ID: ${this.id}  Name: "${this.name}" @ [ ${this.x}, ${this.y}, ${this.z}]`;
    }
}
