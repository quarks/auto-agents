let wx = 400, wy = 400, depth = 4;

function setup() {
    //console.clear();
    console.log('GLOBAL mode');
    let p5canvas = createCanvas(800, 440);
    p5canvas.parent('sketch');
    world = new World(wx, wy, depth);
    makeEntities();

    x0 = 210; y0 = 20, x1 = 330, y1 = 150;
    encPart = world._tree?.getEnclosingPartition(x0, y0, x1, y1);

}

function makeEntities() {
    entities = [];
    ppRed = personPainter(color(255, 200, 200), color(160, 20, 20));
    ppPurple = personPainter(color(255, 200, 255), color(160, 20, 160));
    ppBlue = personPainter(color(200, 200, 255), color(20, 20, 160));
    ppCyan = personPainter(color(200, 255, 255), color(20, 200, 200));
    let data = [
        [280, 125, 20, ppCyan],
        [70, 85, 20, ppCyan],
        [175, 210, 20, ppCyan],
        [250, 175, 20, ppCyan],
    ]
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        entities.push(new Entity({ x: d[0], y: d[1] }));
        entities[i].colRad = d[2];
        entities[i].painter = d[3];
        world.birth(entities[i]);
    }
}

function drawEnclosingPartition(part) {
    if (part) {
        stroke(255, 200, 200, 160); strokeWeight(6); noFill();
        rect(part.lowX, part.lowY, part.width, part.height);
        fill(0, 30); noStroke();
        rect(x0, y0, x1 - x0, y1 - y0);
    }
}

function getEntitiesInPartition(part) {

}

function draw() {
    world.update(deltaTime);
    background(220);
    noStroke(); fill(220, 255, 220);
    let d = world._domain;
    rect(d.lowX, d.lowY, d.width, d.height);
    renderTreeGrid();
    world.render();
    drawEnclosingPartition(encPart)
}

function renderTreeGrid() {
    function renderPart(level) {
        level = (2 ** (level - 1));
        let dx = d.width / level, dy = d.height / level;
        for (let i = d.lowX; i < d.highX; i += dx) line(i, d.lowY, i, d.highY);
        for (let i = d.lowY; i < d.highY; i += dy) line(d.lowX, i, d.highX, i);
    }
    let d = world._domain;
    stroke(0); strokeWeight(1.2);
    for (let i = 1; i <= depth; i++) renderPart(i);
}

function keyTyped() {
    if (key == 't') printTree(world._tree);
    if (key == 'e') {
        entities = world._tree?.getEntitiesInPartition(encPart);
        entities.forEach(value => value.painter = ppRed);
    }
    let eid = '0123456789'.indexOf(key);
    if (eid >= 0 && eid < entities.length)
        world.death(eid);
    // world.death(entities[eid]);
}

function personPainter(colF, colS, p = p5.instance) {
    //let size = this.colRad;
    let body = [
        0.15, -0.5,
        0.15, 0.5,
        -0.18, 0.3,
        -0.18, -0.3
    ];
    return (function () {
        p.push();
        p.translate(this._pos.x, this._pos.y);
        let size = this.colRad;
        // p.fill(0, 32); p.noStroke();
        // p.ellipse(0, 0, size, size);
        p.fill(colF); p.stroke(colS); p.strokeWeight(1.1);
        p.beginShape();
        for (let idx = 0; idx < body.length; idx += 2)
            p.vertex(body[idx] * size, body[idx + 1] * size);
        p.endShape(CLOSE);
        p.fill(colS); p.noStroke();
        p.ellipse(0, 0, 0.6 * size, 0.56 * size)
        p.pop();
    });
}

function printTree(tree) {
    if (tree._entities.size > 0)
        console.log(tree.toString());
    if (tree._children)
        for (let child of tree._children)
            printTree(child);
}