/**
 * This class is used to represent a directed edge between 2 nodes and the
 * cost of traversing it.
 * 
 * @author Peter Lager
 */
class GraphEdge {

    #from: number;
    setFrom(v: number): GraphEdge { this.#from = v; return this; }
    set from(v: number) { this.#from = v; }
    get from(): number { return this.#from }

    #to: number;
    setTo(v: number): GraphEdge { this.#to = v; return this; }
    set to(v: number) { this.#to = v; }
    get to(): number { return this.#to; }

    #name = '';
    setName(n: string): GraphEdge { this.#name = n; return this; }
    set name(n: string) { this.#name = n; }
    get name(): string { return this.#name; }

    #cost: number = 0;
    setCost(n: number): GraphEdge { this.#cost = n; return this; }
    set cost(n: number) { this.#cost = n; }
    get cost(): number { return this.#cost; }

    /** If no cost provided cost = distance between nodes   */
    constructor(from: number, to: number, cost: number = 0, name = '') {
        this.#from = from;
        this.#to = to;
        this.#cost = cost;
        this.#name = name;
    }

    toString() {
        return `"${this.name}" from node: ${this.from} to node: ${this.to}  cost: ${this.cost}`;
    }
}
