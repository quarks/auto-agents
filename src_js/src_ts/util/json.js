function sceneFromJSON(jsonString) {
    let s = Array.isArray(jsonString) ? jsonString.join('\n') : jsonString;
    let obj = JSON.parse(s);
    let fences = [];
    obj.FENCES?.forEach(d => {
        let repel = Symbol.for(d.repel), contour = [];
        d.contour.forEach(v => contour.push(Vector2D.from(v)));
        let fence = new Fence(contour, d.enclosed, repel, d.no_walls_at);
        fences.push(fence);
    });
    let obstacles = [];
    obj.OBSTACLES?.forEach(d => {
        obstacles.push(new Obstacle(d.pos, d.cr));
    });
    let walls = [];
    obj.WALLS?.forEach(wall => {
        let repel = Symbol.for(wall.repel);
        walls.push(new Wall(wall.start, wall.end, repel));
    });
    return { FENCES: fences, OBSTACLES: obstacles, WALLS: walls };
}
function graphFromJSON(jsonString) {
    let s = Array.isArray(jsonString) ? jsonString.join('\n') : jsonString;
    let obj = JSON.parse(s);
    let nodes = [];
    obj.NODES?.forEach(d => {
        let node = new GraphNode(d.id, d.position, d.name);
        nodes.push(node);
    });
    let edges = [];
    obj.EDGES?.forEach(d => {
        let cost = !d.cost ? [0] : Array.isArray(d.cost) ? d.cost : [d.cost];
        let name = !d.name ? [''] : Array.isArray(d.name) ? d.name : [d.name];
        if (d.bidi && cost.length == 1) {
            cost.push(cost[0]);
            name.push(name[0]);
        }
        edges.push(new GraphEdge(d.from, d.to, cost[0], name[0]));
        if (d.bidi)
            edges.push(new GraphEdge(d.to, d.from, cost[1], name[1]));
    });
    return { NODES: nodes, EDGES: edges };
}
//# sourceMappingURL=json.js.map