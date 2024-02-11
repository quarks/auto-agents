let wx = 400, wy = 400, depth = 4;
let intParts = [], intEnts = [];

function setup() {
    console.clear();
    console.log('GLOBAL mode');
    let p5canvas = createCanvas(800, 440);
    p5canvas.parent('sketch');
    world = new World(wx, wy, depth);
    makeEntities();
    world.update(0);  // Allow for birth of entities

    // Test area
    //testInterestingPartiions(240, 310, 50, 40);
    testInterestingPartiions(190, 300, 35, 40);
}

function testInterestingPartiions(x, y, w, h) {
    x0 = x; y0 = y; x1 = x + w; y1 = y + h;
    console.log('-------------  Items of Interest   ------------------------');
    let results = world.tree?.getItemsInRegion(x0, y0, x1, y1);
    intParts = results.partitions;
    console.log(`Found ${intParts.length} partitions`);
    for (let part of intParts) part.$$();
    intEnts = results.entities;
    console.log(`Found ${intEnts.length} entities`);
    intEnts.forEach((ent) => { ent.painter = ppRed; ent.$$() });
    encPart = results.enc_partition;
    console.log('-----------------------------------------------------------');
}

function drawEnclosingPartition(part) {
    if (part) {
        stroke(255, 200, 200, 160); strokeWeight(6); noFill();
        rect(part.lowX, part.lowY, part.width, part.height);
        fill(0, 30); noStroke();
        rect(x0, y0, x1 - x0, y1 - y0);
    }
}

function draw() {
    world.update(deltaTime);
    background(220);
    noStroke(); fill(250);
    let d = world._domain;
    rect(d.lowX, d.lowY, d.width, d.height);
    renderTreeGrid();
    // world.render();
    fill(0, 64);
    rect(x0, y0, x1 - x0, y1 - y0);
    fill(255, 200, 200, 48);
    noFill(); stroke(255, 0, 0); strokeWeight(1.1);
    for (let part of intParts) rect(part.lowX, part.lowY, part.width, part.height);
    noFill(); stroke(0, 48); strokeWeight(6);
    rect(encPart.lowX, encPart.lowY, encPart.width, encPart.height);
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
    ppRed = entWall(color(255, 200, 200), 4);
    ppPurple = entWall(color(255, 200, 255), 4);
    ppBlue = entWall(color(200, 200, 255), 4);
    ppCyan = entWall(color(200, 255, 255), 4);
    let data = [
        [125, 75, 60, 280, ppPurple],
        [75, 340, 120, 310, ppPurple],
        [270, 66, 375, 80, ppPurple],
        [290, 105, 260, 145, ppPurple],
        [330, 310, 380, 340, ppPurple],

    ]
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        entities.push(new Wall({ x: d[0], y: d[1] }, { x: d[2], y: d[3] }));
        entities[i].painter = d[4];
        world.birth(entities[i]);
    }
}


function printTree(tree) {
    function pt(tree) {
        //if (tree._entities.size > 0)
        tree.$$();
        //console.log(tree.toString());
        if (tree._children)
            for (let child of tree._children)
                pt(child);
    }
    console.log('=====================================================================================');
    pt(tree);
    console.log(`World population        ( Size = ${world._population.size} )`)
    // console.log([...world._population.values()]);
    // if (world._population.size > 0) {
    // let pop = [...world._population.values()].map(x => x.id).reduce((x, y) => x + ' ' + y, '{ ') + '  }';
    // console.log(pop);
    // }
}