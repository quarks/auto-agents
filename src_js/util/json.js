function sceneFromJSON(jsonString) {
    let s = Array.isArray(jsonString) ? jsonString.join('\n') : jsonString;
    let obj = JSON.parse(s);
    let fences = [];
    obj.FENCES?.forEach(d => {
        let repel = Symbol.for(d.repel), contour = [];
        d.contour.forEach(v => contour.push(Vector2D.from(v)));
        fences.push(new Fence(contour, d.enclosed, repel));
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
//# sourceMappingURL=json.js.map