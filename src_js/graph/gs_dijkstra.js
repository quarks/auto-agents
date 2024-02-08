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
var _Dijkstra_instances, _Dijkstra_graph, _Dijkstra_route, _Dijkstra_edges, _Dijkstra_testedEdges, _Dijkstra_search;
class Dijkstra {
    constructor(graph) {
        _Dijkstra_instances.add(this);
        _Dijkstra_graph.set(this, void 0);
        _Dijkstra_route.set(this, void 0);
        _Dijkstra_edges.set(this, void 0);
        _Dijkstra_testedEdges.set(this, void 0);
        __classPrivateFieldSet(this, _Dijkstra_graph, graph, "f");
        __classPrivateFieldSet(this, _Dijkstra_route, [], "f");
        __classPrivateFieldSet(this, _Dijkstra_testedEdges, new Set(), "f");
    }
    get route() { return __classPrivateFieldGet(this, _Dijkstra_route, "f"); }
    get edges() { return __classPrivateFieldGet(this, _Dijkstra_edges, "f"); }
    ;
    get testedEdges() { return [...__classPrivateFieldGet(this, _Dijkstra_testedEdges, "f").values()]; }
    search(nodeIDs) {
        function allNodesExist(graph, ids) {
            for (let id of ids)
                if (!graph.node(id))
                    return false;
            return true;
        }
        if (!Array.isArray(nodeIDs) || nodeIDs.length <= 1) {
            console.error(`Search error:  invalid array`);
            return this;
        }
        else if (!allNodesExist(__classPrivateFieldGet(this, _Dijkstra_graph, "f"), nodeIDs)) {
            console.error(`Search error:  non-existant nodes in route list`);
            return this;
        }
        __classPrivateFieldGet(this, _Dijkstra_testedEdges, "f").clear();
        __classPrivateFieldSet(this, _Dijkstra_route, __classPrivateFieldGet(this, _Dijkstra_instances, "m", _Dijkstra_search).call(this, nodeIDs[0], nodeIDs[1]), "f");
        for (let i = 2; i < nodeIDs.length; i++) {
            let pr = __classPrivateFieldGet(this, _Dijkstra_instances, "m", _Dijkstra_search).call(this, nodeIDs[i - 1], nodeIDs[i]);
            pr.shift();
            __classPrivateFieldGet(this, _Dijkstra_route, "f").push(...pr);
        }
        __classPrivateFieldSet(this, _Dijkstra_edges, [], "f");
        for (let i = 0; i < __classPrivateFieldGet(this, _Dijkstra_route, "f").length - 1; i++)
            __classPrivateFieldGet(this, _Dijkstra_edges, "f").push(__classPrivateFieldGet(this, _Dijkstra_route, "f")[i].edge(__classPrivateFieldGet(this, _Dijkstra_route, "f")[i + 1].id));
        return this;
    }
}
_Dijkstra_graph = new WeakMap(), _Dijkstra_route = new WeakMap(), _Dijkstra_edges = new WeakMap(), _Dijkstra_testedEdges = new WeakMap(), _Dijkstra_instances = new WeakSet(), _Dijkstra_search = function _Dijkstra_search(startID, targetID) {
    __classPrivateFieldGet(this, _Dijkstra_graph, "f").nodes.forEach(n => n.resetSearchCosts());
    let partroute = [];
    __classPrivateFieldGet(this, _Dijkstra_testedEdges, "f").clear();
    let start = __classPrivateFieldGet(this, _Dijkstra_graph, "f").node(startID), target = __classPrivateFieldGet(this, _Dijkstra_graph, "f").node(targetID);
    if (!start || !target) {
        console.error(`Nodes ${startID} and/or ${targetID} do not exist in this graph.`);
        return partroute;
    }
    let unsettledNodes = []; // Use as priority queue
    let settledNodes = new Set();
    let parent = new Map();
    let next, edgeTo;
    unsettledNodes.push(start);
    while (unsettledNodes.length > 0) {
        next = unsettledNodes.shift();
        if (next == target) {
            partroute.push(target);
            while (next !== start) {
                next = parent.get(next);
                partroute.push(next);
            }
            partroute.reverse();
            return partroute;
        }
        settledNodes.add(next);
        next.edges.forEach(e => {
            edgeTo = __classPrivateFieldGet(this, _Dijkstra_graph, "f").node(e.to);
            let newCost = next.graphCost + e.cost;
            let edgeToCost = edgeTo.graphCost;
            if (!settledNodes.has(edgeTo) && (edgeToCost == 0 || edgeTo.graphCost > newCost)) {
                edgeTo.graphCost = newCost;
                parent.set(edgeTo, next);
                unsettledNodes.push(edgeTo); // Maintain priority queue
                unsettledNodes.sort((a, b) => a.graphCost - b.graphCost);
                __classPrivateFieldGet(this, _Dijkstra_testedEdges, "f").add(e);
            }
        });
    }
    return partroute;
};
//# sourceMappingURL=gs_dijkstra.js.map