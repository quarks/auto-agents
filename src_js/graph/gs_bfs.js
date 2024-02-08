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
var _BFS_instances, _BFS_graph, _BFS_route, _BFS_edges, _BFS_testedEdges, _BFS_search;
class BFS {
    constructor(graph) {
        _BFS_instances.add(this);
        _BFS_graph.set(this, void 0);
        _BFS_route.set(this, void 0);
        _BFS_edges.set(this, void 0);
        _BFS_testedEdges.set(this, void 0);
        __classPrivateFieldSet(this, _BFS_graph, graph, "f");
        __classPrivateFieldSet(this, _BFS_route, [], "f");
        __classPrivateFieldSet(this, _BFS_testedEdges, new Set(), "f");
    }
    get route() { return __classPrivateFieldGet(this, _BFS_route, "f"); }
    get edges() { return __classPrivateFieldGet(this, _BFS_edges, "f"); }
    ;
    get testedEdges() { return [...__classPrivateFieldGet(this, _BFS_testedEdges, "f").values()]; }
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
        else if (!allNodesExist(__classPrivateFieldGet(this, _BFS_graph, "f"), nodeIDs)) {
            console.error(`Search error:  non-existant nodes in route list`);
            return this;
        }
        __classPrivateFieldGet(this, _BFS_testedEdges, "f").clear();
        __classPrivateFieldSet(this, _BFS_route, __classPrivateFieldGet(this, _BFS_instances, "m", _BFS_search).call(this, nodeIDs[0], nodeIDs[1]), "f");
        for (let i = 2; i < nodeIDs.length; i++) {
            let pr = __classPrivateFieldGet(this, _BFS_instances, "m", _BFS_search).call(this, nodeIDs[i - 1], nodeIDs[i]);
            pr.shift();
            __classPrivateFieldGet(this, _BFS_route, "f").push(...pr);
        }
        __classPrivateFieldSet(this, _BFS_edges, [], "f");
        for (let i = 0; i < __classPrivateFieldGet(this, _BFS_route, "f").length - 1; i++)
            __classPrivateFieldGet(this, _BFS_edges, "f").push(__classPrivateFieldGet(this, _BFS_route, "f")[i].edge(__classPrivateFieldGet(this, _BFS_route, "f")[i + 1].id));
        return this;
    }
}
_BFS_graph = new WeakMap(), _BFS_route = new WeakMap(), _BFS_edges = new WeakMap(), _BFS_testedEdges = new WeakMap(), _BFS_instances = new WeakSet(), _BFS_search = function _BFS_search(startID, targetID) {
    let partRoute = [];
    let start = __classPrivateFieldGet(this, _BFS_graph, "f").node(startID), target = __classPrivateFieldGet(this, _BFS_graph, "f").node(targetID);
    if (start !== target) {
        let settledNodes = new Map();
        let visited = new Set();
        let next;
        let queue = [];
        queue.push(new GraphEdge(startID, startID, 0));
        while (queue.length > 0) {
            next = queue.shift();
            settledNodes.set(next.to, next.from);
            visited.add(next.to);
            if (next.to == targetID) {
                let parent = targetID;
                partRoute.push(__classPrivateFieldGet(this, _BFS_graph, "f").node(targetID));
                do {
                    parent = settledNodes.get(parent);
                    partRoute.push(__classPrivateFieldGet(this, _BFS_graph, "f").node(parent));
                } while (parent != startID);
                partRoute.reverse();
                return partRoute;
            }
            // Examine edges from current node
            __classPrivateFieldGet(this, _BFS_graph, "f").node(next.to).edges.forEach(e => {
                if (!visited.has(e.to)) {
                    queue.push(e);
                    __classPrivateFieldGet(this, _BFS_testedEdges, "f").add(e);
                }
            });
        }
    }
    return partRoute;
};
//# sourceMappingURL=gs_bfs.js.map