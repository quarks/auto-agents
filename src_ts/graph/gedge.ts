/**
 * This class is used to represent a directed edge between 2 nodes and the
 * cost of traversing it.
 * 
 * @author Peter Lager
 */
class GraphEdge {

    _from: number;
    setFrom(v: number): GraphEdge { this._from = v; return this; }
    set from(v: number) { this._from = v; }
    get from(): number { return this._from }

    _to: number;
    setTo(v: number): GraphEdge { this._to = v; return this; }
    set to(v: number) { this._to = v; }
    get to(): number { return this._to; }

    _name = '';
    setName(n: string): GraphEdge { this._name = n; return this; }
    set name(n: string) { this._name = n; }
    get name(): string { return this._name; }

    _cost: number = 0;
    setCost(n: number): GraphEdge { this._cost = n; return this; }
    set cost(n: number) { this._cost = n; }
    get cost(): number { return this._cost; }

    /** If no cost provided cost = distance between nodes   */
    constructor(from: number, to: number, cost: number = 0, name = '') {
        this._from = from;
        this._to = to;
        this._cost = cost;
        this._name = name;
    }

    toString() {
        return `"${this.name}" from node: ${this.from} to node: ${this.to}  cost: ${this.cost}`;
    }
}
