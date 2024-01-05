let wx = 380, wy = 260, depth = 4;
let painters = [], wanderer;
let allowLooping = true;

function setup() {
    console.clear();
    let p5canvas = createCanvas(800, 440);
    p5canvas.parent('sketch');
    world = new World(wx, wy, depth);
    world._domain.constraint = WRAP;
    makevehicles();
    let art = new Artefact({ x: 190, y: 210 }, 80, 45);
    world.birth(art);

}

function makevehicles() {
    let vehicles = [];
    painters[1] = personPainter(color(255, 200, 200), color(160, 20, 20));
    painters[2] = personPainter(color(200, 255, 255), color(20, 200, 200));
    painters[3] = personPainter(color(255, 120, 255), color(200, 20, 200));
    painters[4] = personPainter(color(200, 200, 255), color(20, 20, 160));
    wanderer = wanderPainter(color(255, 200, 200), color(160, 20, 20));
    let data = [
        [35, 375, 6, painters[1]],
        [190, 185, 10, painters[1]],
        // [175, 210, 14, painters[1]],
        // [250, 175, 16, painters[1]],
    ]
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        vehicles.push(new Vehicle({ x: d[0], y: d[1] }, d[2]));
        vehicles[i].painter = d[3];
        let v = Vector2D.fromRandom(60, 100);
        vehicles[i].vel = v.copy();
        world.birth(vehicles[i]);
    }
    // console.log(`Col Radius: ${vehicles[0]._colRad}     Mass: ${vehicles[0]._mass}    Rest factor: ${0.1 / vehicles[0]._mass}`);
    // vehicles[0].addAutoPilot(world);
    // vehicles[0].pilot.arriveOn([220, 130], FAST);
    vehicles[1].addAutoPilot(world);
    vehicles[1].pilot.wanderOn();
    vehicles[1].painter = wanderer;
}

function draw() {
    world.update(deltaTime / 1000);
    //world._tree.colorizeEntities(painters);
    background(220);
    noStroke(); fill(220, 255, 220);
    let d = world._domain; rect(d.lowX, d.lowY, d.width, d.height);
    renderTreeGrid();
    world.render();
}

function renderTreeGrid() {
    function renderPart(level) {
        level = (2 ** (level - 1));
        let dx = r.width / level, dy = r.height / level;
        for (let i = r.lowX; i <= highX; i += dx) line(i, r.lowY, i, highY);
        for (let i = r.lowY; i <= highY; i += dy) line(r.lowX, i, highX, i);
    }
    let r = world._tree, d = world._domain;
    let highX = Math.min(r.highX, d.highX), highY = Math.min(r.highY, d.highY);
    stroke(0, 16); strokeWeight(1.1);
    for (let i = 1; i <= depth; i++) renderPart(i);
}

function keyTyped() {
    if (key == 't') printTree(world._tree);
    if (key == 's') {
        allowLooping = !allowLooping;
        if (allowLooping) loop(); else noLoop();
    }
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

function wanderPainter(colF, colS, p = p5.instance) {
    let body = [
        0.15, -0.5,
        0.15, 0.5,
        -0.18, 0.3,
        -0.18, -0.3
    ];
    return (function () {
        p.push();
        p.translate(this._pos.x, this._pos.y);
        p.rotate(this.headingAngle);
        // Draw wander stuff
        p.noFill(); p.strokeWeight(1); p.stroke(0, 128);

        p.line(0, 0, this.pilot._wanderDist, 0);
        p.line(this.pilot._wanderDist, 0, this.pilot._wanderDist + this.pilot._wanderTarget.x, this.pilot._wanderTarget.y);
        p.ellipse(this.pilot._wanderDist, 0, 2 * this.pilot._wanderRadius, 2 * this.pilot._wanderRadius);
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