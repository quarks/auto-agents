let wx = 400, wy = 400, depth = 4;
let intParts = [], intEnts = [];

function setup() {
    //console.clear();
    console.log('GLOBAL mode');
    let p5canvas = createCanvas(800, 440);
    p5canvas.parent('sketch');
    world = new World(wx, wy, depth);
    // Test area
    //testInterestingPartiions(240, 310, 50, 40);
    testInterestingPartiions(190, 210, 35, 36);
}

function testInterestingPartiions(x, y, w, h) {
    x0 = x; y0 = y; x1 = x + w; y1 = y + h;
    // let encPart = world._tree.getEnclosingPartition(x0, y0, x1, y1);
    // encPart.$$();
    console.log('---------------------------------------------------------------');
    of_interest = world._tree?.getItemsInRegion(x0, y0, x1, y1);
    intParts = of_interest.partitions;
    encPart = of_interest.enc_partition;
    for (let part of intParts) part.$$();
}

function drawEnclosingPartition(part) {
    if (part) {
        stroke(0, 90); strokeWeight(6); noFill();
        rect(part.lowX, part.lowY, part.width, part.height);
        fill(0, 30); noStroke();
        rect(x0, y0, x1 - x0, y1 - y0);
    }
}

function draw() {
    world.update(deltaTime);
    background(220);
    noStroke(); fill(255, 255, 255);
    let d = world._domain;
    rect(d.lowX, d.lowY, d.width, d.height);
    renderTreeGrid();
    // world.render();
    fill(0, 64);
    rect(x0, y0, x1 - x0, y1 - y0);
    stroke(255, 0, 0); strokeWeight(1.1); noFill();
    fill(255, 200, 200, 48);
    for (let part of intParts) rect(part.lowX, part.lowY, part.width, part.height);
    drawEnclosingPartition(encPart);
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
    if (key == 'e') {
        let ents = world._tree?.getEntitiesInPartition(encPart);
        ents.forEach(value => value.painter = ppRed);
    }
    let eid = '0123456789'.indexOf(key);
    if (eid >= 0 && eid < entities.length) {
        world.death(eid);
        //world.death(entities[eid]);
    }
}


function makeEntities() {
    entities = [];
    ppRed = enyBasic(color(255, 200, 200), color(160, 20, 20));
    ppPurple = enyBasic(color(255, 200, 255), color(160, 20, 160));
    ppBlue = enyBasic(color(200, 200, 255), color(20, 20, 160));
    ppCyan = enyBasic(color(200, 255, 255), color(20, 200, 200));
    let data = [
        [280, 125, 8, ppCyan],
        [70, 120, 8, ppCyan],
        [225, 320, 8, ppCyan],
        [250, 175, 8, ppCyan],
        [75, 50, 8, ppCyan],
        [150, 200, 8, ppCyan],
    ]
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        entities.push(new Vehicle({ x: d[0], y: d[1] }, d[2]));
        entities[i].painter = d[3];
        world.birth(entities[i]);
    }
}


function printTree(tree) {
    function pt(tree) {
        if (tree._entities.size > 0)
            tree.$$();
        //console.log(tree.toString());
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