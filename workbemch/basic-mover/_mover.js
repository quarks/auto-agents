let wx = 400, wy = 400, depth = 4;
let painters = [];

function setup() {
    console.clear();
    console.log('GLOBAL mode');
    let p5canvas = createCanvas(800, 440);
    p5canvas.parent('sketch');
    world = new World(wx, wy, depth);
    world._domain.constraint = REBOUND;
    makeMovers();
}

function makeMovers() {
    let movers = [];
    painters[1] = personPainter(color(255, 200, 200), color(160, 20, 20));
    painters[2] = personPainter(color(200, 255, 255), color(20, 200, 200));
    painters[3] = personPainter(color(255, 120, 255), color(200, 20, 200));
    painters[4] = personPainter(color(200, 200, 255), color(20, 20, 160));

    let data = [
        [280, 125, 10, painters[1]],
        [70, 85, 12, painters[1]],
        [175, 210, 14, painters[1]],
        [250, 175, 16, painters[1]],
    ]
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        movers.push(new Mover({ x: d[0], y: d[1] }, d[2]));
        movers[i].painter = d[3];
        let v = Vector2D.fromRandom(20, 40);
        movers[i].vel = v.copy();
        world.birth(movers[i]);
    }
}


function draw() {
    world.update(deltaTime / 1000);
    world._tree.colorizeEntities(painters);
    background(220);
    noStroke(); fill(220, 255, 220);
    let d = world._domain; rect(d.lowX, d.lowY, d.width, d.height);
    renderTreeGrid();
    world.render();
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
}

function personPainter(colF, colS, p = p5.instance) {
    let body = [
        0.15, -0.5,
        0.15, 0.5,
        -0.18, 0.3,
        -0.18, -0.3
    ];
    return (function () {
        p.push();
        p.translate(this._pos.x, this._pos.y);
        p.rotate(this.headingAngle)
        let size = 2 * this.colRad;
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
    function pt(tree) {
        if (tree._entities.size > 0)
            console.log(tree.toString());
        if (tree._children)
            for (let child of tree._children)
                pt(child);
    }
    console.log('=====================================================================================');
    pt(tree);
    console.log(`World population        ( Size = ${world._population.size} )`)
    if (world._population.size > 0) {
        let pop = [...world._population.values()].map(x => x.id).reduce((x, y) => x + ' ' + y, '{ ') + '  }';
        console.log(pop);
    }
}