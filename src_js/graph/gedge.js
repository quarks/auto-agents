/**
 * This class is used to represent a directed edge between 2 nodes and the
 * cost of traversing it.
 *
 * @author Peter Lager
 */
class GraphEdge {
    #from;
    setFrom(v) { this.#from = v; return this; }
    set from(v) { this.#from = v; }
    get from() { return this.#from; }
    #to;
    setTo(v) { this.#to = v; return this; }
    set to(v) { this.#to = v; }
    get to() { return this.#to; }
    #name = '';
    setName(n) { this.#name = n; return this; }
    set name(n) { this.#name = n; }
    get name() { return this.#name; }
    #cost = 0;
    setCost(n) { this.#cost = n; return this; }
    set cost(n) { this.#cost = n; }
    get cost() { return this.#cost; }
    /** If no cost provided cost = distance between nodes   */
    constructor(from, to, cost = 0, name = '') {
        this.#from = from;
        this.#to = to;
        this.#cost = cost;
        this.#name = name;
    }
    toString() {
        return `"${this.name}" from node: ${this.from} to node: ${this.to}  cost: ${this.cost}`;
    }
}
//# sourceMappingURL=gedge.js.map