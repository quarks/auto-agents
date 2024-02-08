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
var _Astar_instances, _Astar_graph, _Astar_route, _Astar_edges, _Astar_testedEdges, _Astar_ash, _Astar_search;
class Astar {
    constructor(graph, ash = Euclidean()) {
        _Astar_instances.add(this);
        _Astar_graph.set(this, void 0);
        _Astar_route.set(this, void 0);
        _Astar_edges.set(this, void 0);
        _Astar_testedEdges.set(this, void 0);
        _Astar_ash.set(this, void 0);
        __classPrivateFieldSet(this, _Astar_graph, graph, "f");
        __classPrivateFieldSet(this, _Astar_ash, ash, "f");
        __classPrivateFieldSet(this, _Astar_route, [], "f");
        __classPrivateFieldSet(this, _Astar_testedEdges, new Set(), "f");
    }
    get route() { return __classPrivateFieldGet(this, _Astar_route, "f"); }
    get edges() { return __classPrivateFieldGet(this, _Astar_edges, "f"); }
    ;
    get testedEdges() { return [...__classPrivateFieldGet(this, _Astar_testedEdges, "f").values()]; }
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
        else if (!allNodesExist(__classPrivateFieldGet(this, _Astar_graph, "f"), nodeIDs)) {
            console.error(`Search error:  non-existant nodes in route list`);
            return this;
        }
        __classPrivateFieldGet(this, _Astar_testedEdges, "f").clear();
        __classPrivateFieldSet(this, _Astar_route, __classPrivateFieldGet(this, _Astar_instances, "m", _Astar_search).call(this, nodeIDs[0], nodeIDs[1]), "f");
        for (let i = 2; i < nodeIDs.length; i++) {
            let pr = __classPrivateFieldGet(this, _Astar_instances, "m", _Astar_search).call(this, nodeIDs[i - 1], nodeIDs[i]);
            pr.shift();
            __classPrivateFieldGet(this, _Astar_route, "f").push(...pr);
        }
        __classPrivateFieldSet(this, _Astar_edges, [], "f");
        for (let i = 0; i < __classPrivateFieldGet(this, _Astar_route, "f").length - 1; i++)
            __classPrivateFieldGet(this, _Astar_edges, "f").push(__classPrivateFieldGet(this, _Astar_route, "f")[i].edge(__classPrivateFieldGet(this, _Astar_route, "f")[i + 1].id));
        return this;
    }
}
_Astar_graph = new WeakMap(), _Astar_route = new WeakMap(), _Astar_edges = new WeakMap(), _Astar_testedEdges = new WeakMap(), _Astar_ash = new WeakMap(), _Astar_instances = new WeakSet(), _Astar_search = function _Astar_search(startID, targetID) {
    __classPrivateFieldGet(this, _Astar_graph, "f").nodes.forEach(n => n.resetSearchCosts());
    let partRoute = [];
    let start = __classPrivateFieldGet(this, _Astar_graph, "f").node(startID), target = __classPrivateFieldGet(this, _Astar_graph, "f").node(targetID);
    if (start !== target) {
        let unsettledNodes = []; // Use as priority queue
        let settledNodes = new Set();
        let parent = new Map();
        let next, edgeTo;
        start.fullCost = __classPrivateFieldGet(this, _Astar_ash, "f").call(this, start, target);
        unsettledNodes.push(start);
        while (unsettledNodes.length > 0) {
            next = unsettledNodes.shift();
            if (next === target) {
                partRoute.push(target);
                while (next !== start) {
                    next = parent.get(next);
                    partRoute.push(next);
                }
                partRoute.reverse();
                return partRoute;
            }
            settledNodes.add(next);
            next.edges.forEach(e => {
                edgeTo = __classPrivateFieldGet(this, _Astar_graph, "f").node(e.to);
                let gCost = next.graphCost + e.cost;
                let hCost = __classPrivateFieldGet(this, _Astar_ash, "f").call(this, edgeTo, target);
                let edgeToCost = edgeTo.graphCost;
                if (!settledNodes.has(edgeTo) && (edgeToCost == 0 || edgeTo.graphCost > gCost + hCost)) {
                    edgeTo.graphCost = gCost;
                    edgeTo.fullCost = gCost + hCost;
                    parent.set(edgeTo, next);
                    unsettledNodes.push(edgeTo); // Maintain priority queue
                    unsettledNodes.sort((a, b) => a.fullCost - b.fullCost);
                    __classPrivateFieldGet(this, _Astar_testedEdges, "f").add(e);
                }
            });
        }
    }
    return partRoute;
};
function Euclidean(factor = 1) {
    return (function (node, target) {
        let dx = target.x - node.x;
        let dy = target.y - node.y;
        let dz = target.z - node.z;
        return factor * Math.sqrt(dx * dx + dy * dy + dz * dz);
    });
}
function Manhattan(factor = 1) {
    return (function (node, target) {
        let dx = Math.abs(target.x - node.x);
        let dy = Math.abs(target.y - node.y);
        let dz = Math.abs(target.z - node.z);
        return factor * (dx + dy + dz);
    });
}
//# sourceMappingURL=gs_astar.js.map