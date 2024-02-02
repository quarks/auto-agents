/**
 * This class is used to represent a directed edge between 2 nodes and the
 * cost of traversing it.
 *
 * @author Peter Lager
 */
class GraphEdge {
    /** If no cost provided cost = distance between nodes   */
    constructor(from, to, cost = 0, name = '') {
        this._name = '';
        this._cost = 0;
        this._from = from;
        this._to = to;
        this._cost = cost;
        this._name = name;
    }
    setFrom(v) { this._from = v; return this; }
    set from(v) { this._from = v; }
    get from() { return this._from; }
    setTo(v) { this._to = v; return this; }
    set to(v) { this._to = v; }
    get to() { return this._to; }
    setName(n) { this._name = n; return this; }
    set name(n) { this._name = n; }
    get name() { return this._name; }
    setCost(n) { this._cost = n; return this; }
    set cost(n) { this._cost = n; }
    get cost() { return this._cost; }
    toString() {
        return `"${this.name}" from node: ${this.from} to node: ${this.to}  cost: ${this.cost}`;
    }
}
//# sourceMappingURL=gedge.js.map