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
var _DFS_instances, _DFS_graph, _DFS_route, _DFS_edges, _DFS_testedEdges, _DFS_search;
class DFS {
    constructor(graph) {
        _DFS_instances.add(this);
        _DFS_graph.set(this, void 0);
        _DFS_route.set(this, void 0);
        _DFS_edges.set(this, void 0);
        _DFS_testedEdges.set(this, void 0);
        __classPrivateFieldSet(this, _DFS_graph, graph, "f");
        __classPrivateFieldSet(this, _DFS_route, [], "f");
        __classPrivateFieldSet(this, _DFS_testedEdges, new Set(), "f");
    }
    get route() { return __classPrivateFieldGet(this, _DFS_route, "f"); }
    get edges() { return __classPrivateFieldGet(this, _DFS_edges, "f"); }
    ;
    get testedEdges() { return [...__classPrivateFieldGet(this, _DFS_testedEdges, "f").values()]; }
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
        else if (!allNodesExist(__classPrivateFieldGet(this, _DFS_graph, "f"), nodeIDs)) {
            console.error(`Search error:  non-existant nodes in route list`);
            return this;
        }
        __classPrivateFieldGet(this, _DFS_testedEdges, "f").clear();
        __classPrivateFieldSet(this, _DFS_route, __classPrivateFieldGet(this, _DFS_instances, "m", _DFS_search).call(this, nodeIDs[0], nodeIDs[1]), "f");
        for (let i = 2; i < nodeIDs.length; i++) {
            let pr = __classPrivateFieldGet(this, _DFS_instances, "m", _DFS_search).call(this, nodeIDs[i - 1], nodeIDs[i]);
            pr.shift();
            __classPrivateFieldGet(this, _DFS_route, "f").push(...pr);
        }
        __classPrivateFieldSet(this, _DFS_edges, [], "f");
        for (let i = 0; i < __classPrivateFieldGet(this, _DFS_route, "f").length - 1; i++)
            __classPrivateFieldGet(this, _DFS_edges, "f").push(__classPrivateFieldGet(this, _DFS_route, "f")[i].edge(__classPrivateFieldGet(this, _DFS_route, "f")[i + 1].id));
        return this;
    }
}
_DFS_graph = new WeakMap(), _DFS_route = new WeakMap(), _DFS_edges = new WeakMap(), _DFS_testedEdges = new WeakMap(), _DFS_instances = new WeakSet(), _DFS_search = function _DFS_search(startID, targetID) {
    let partroute = [];
    let start = __classPrivateFieldGet(this, _DFS_graph, "f").node(startID), target = __classPrivateFieldGet(this, _DFS_graph, "f").node(targetID);
    if (!start || !target) {
        console.error(`Nodes ${startID} and/or ${targetID} do not exist in this graph.`);
        return partroute;
    }
    let settledNodes = new Map();
    let visited = new Set();
    let next;
    let stack = [];
    stack.push(new GraphEdge(startID, startID, 0));
    while (stack.length > 0) {
        next = stack.pop();
        settledNodes.set(next.to, next.from);
        visited.add(next.to);
        if (next.to == targetID) {
            let parent = targetID;
            partroute.push(__classPrivateFieldGet(this, _DFS_graph, "f").node(targetID));
            do {
                parent = settledNodes.get(parent);
                partroute.push(__classPrivateFieldGet(this, _DFS_graph, "f").node(parent));
            } while (parent != startID);
            partroute.reverse();
            return partroute;
        }
        // Examine edges from current node
        __classPrivateFieldGet(this, _DFS_graph, "f").node(next.to).edges.forEach(e => {
            if (!visited.has(e.to)) {
                stack.push(e);
                __classPrivateFieldGet(this, _DFS_testedEdges, "f").add(e);
            }
        });
    }
    return partroute;
};
//# sourceMappingURL=gs_dfs.js.map