let wx = 400, wy = 400, depth = 5;
let nd = 50, popSize = 50;
let intParts = [], intEnts = [];
let entities = [];

function setup() {
    //console.clear();
    console.log('GLOBAL mode');
    let p5canvas = createCanvas(800, 440);
    p5canvas.parent('sketch');
    showColCircle = false;
    world = new World(wx, wy, depth);
    world.domain.constraint = WRAP;
    makePainters();
    makeNeighbours();
    selectRandomVehicle();
    // console.log(`Start at ${entities[0].pos.$(6)}`);
}

function draw() {
    world.update(deltaTime / 1000);
    background(220);
    noStroke(); fill(220, 255, 220);
    let d = world._domain;
    rect(d.lowX, d.lowY, d.width, d.height);
    renderTreeGrid();
    // Render neighbourhood
    // fill(0, 20); stroke(0, 48); strokeWeight(1.2);
    // ellipse(selEntity.pos.x, selEntity.pos.y, 2 * nd, 2 * nd);
    world.render();
}

function selectRandomVehicle() {
    let n = Math.floor(Math.random() * entities.length);
    selEntity = entities[n];
    entities.forEach(e => e.painter = ppCyan);
    // Make selected entity red
    selEntity.painter = ppRed;
    // selEntity.pilot.getNeighbours(selEntity, world, nd);
    // selEntity.pilot.testNeighbours.forEach(e => e.painter = ppBlue);

    selEntity.forceRecorderOn();
    console.log(`${selEntity.pilot.testNeighbours.length} Neighbours found  (Pop: ${popSize})`);
}

function makeNeighbours() {
    for (let i = 0; i < popSize; i++) {
        let x = Math.random() * 200 + 100, y = Math.random() * 200 + 100;
        let v = new Vehicle([x, y], 8, world);
        v.painter = ppCyan;
        v.vel = Vector2D.fromRandom(10, 15);
        v.heading = v.vel.copy().normalize();
        v.maxSpeed = 15;
        // v.pilot.cohesionOn();
        // v.pilot.separationOn();
        // v.pilot.alignmentOn();
        v.pilot.flockOn();
        entities.push(v);
        world.birth(v);
    }
    world.update(0);
}


function makePainters() {
    ppRed = mvrArrow(color(255, 180, 180), color(160, 20, 20));
    ppPurple = mvrArrow(color(255, 180, 255), color(160, 20, 160));
    ppBlue = mvrArrow(color(180, 180, 255), color(20, 20, 160));
    ppCyan = mvrArrow(color(180, 255, 255), color(20, 200, 200));
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
    if (key == 'd') selEntity.printForceData();
    if (key == 's') noLoop();
    if (key == ' ') selectRandomVehicle();
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