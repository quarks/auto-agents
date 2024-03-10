var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GraphEdge_from, _GraphEdge_to, _GraphEdge_name, _GraphEdge_cost;
/**
 * This class is used to represent a directed edge between 2 nodes and the
 * cost of traversing it.
 *
 * @author Peter Lager
 */
class GraphEdge {
    /** If no cost provided cost = distance between nodes   */
    constructor(from, to, cost = 0, name = '') {
        _GraphEdge_from.set(this, void 0);
        _GraphEdge_to.set(this, void 0);
        _GraphEdge_name.set(this, '');
        _GraphEdge_cost.set(this, 0);
        __classPrivateFieldSet(this, _GraphEdge_from, from, "f");
        __classPrivateFieldSet(this, _GraphEdge_to, to, "f");
        __classPrivateFieldSet(this, _GraphEdge_cost, cost, "f");
        __classPrivateFieldSet(this, _GraphEdge_name, name, "f");
    }
    setFrom(v) { __classPrivateFieldSet(this, _GraphEdge_from, v, "f"); return this; }
    set from(v) { __classPrivateFieldSet(this, _GraphEdge_from, v, "f"); }
    get from() { return __classPrivateFieldGet(this, _GraphEdge_from, "f"); }
    setTo(v) { __classPrivateFieldSet(this, _GraphEdge_to, v, "f"); return this; }
    set to(v) { __classPrivateFieldSet(this, _GraphEdge_to, v, "f"); }
    get to() { return __classPrivateFieldGet(this, _GraphEdge_to, "f"); }
    setName(n) { __classPrivateFieldSet(this, _GraphEdge_name, n, "f"); return this; }
    set name(n) { __classPrivateFieldSet(this, _GraphEdge_name, n, "f"); }
    get name() { return __classPrivateFieldGet(this, _GraphEdge_name, "f"); }
    setCost(n) { __classPrivateFieldSet(this, _GraphEdge_cost, n, "f"); return this; }
    set cost(n) { __classPrivateFieldSet(this, _GraphEdge_cost, n, "f"); }
    get cost() { return __classPrivateFieldGet(this, _GraphEdge_cost, "f"); }
    toString() {
        return `"${this.name}" from node: ${this.from} to node: ${this.to}  cost: ${this.cost}`;
    }
}
_GraphEdge_from = new WeakMap(), _GraphEdge_to = new WeakMap(), _GraphEdge_name = new WeakMap(), _GraphEdge_cost = new WeakMap();
//# sourceMappingURL=gedge.js.map