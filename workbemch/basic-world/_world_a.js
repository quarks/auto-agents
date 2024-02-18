let wx = 400, wy = 400, depth = 2;
let intParts = [], intEnts = [];

function setup() {
    console.clear();
    console.log('GLOBAL mode');
    hintHeading = hintVelocity = hintForce = false;
    hintTrail = hintCircle = hintFleeCircle = false;
    showColCircle = false;
    let p5canvas = createCanvas(800, 440);
    p5canvas.parent('sketch');
    world = new World(wx, wy, depth);
    console.log(`Quadtree leaf size ${world.tree.leafSize}`)
    makeEntities();
    // View region
    x0 = 210; y0 = 155;
    w = 35, h = 40;
    x1 = x0 + w; y1 = y0 + h;
}

function findStuffOfInterest(x, y, w, h) {
    results = world.tree?.getItemsInRegion(x0, y0, x + w, y + h);
    intParts = results.partitions;
    intEnts = results.entities;
    encPart = results.enc_partition;
}

function draw() {
    world.update(deltaTime / 1000);
    let wd = world.domain;
    background(240, 190, 240);
    // World background and tree grid
    noStroke(); fill(255, 240, 255); rect(wd.lowX, wd.lowY, wd.width, wd.height);
    renderTreeGrid();
    // Show region of interest
    fill(0, 32); rect(x0, y0, w, h);
    // Update painters for entities of interest
    for (let ent of world.population) setPainter(ent, 0);
    findStuffOfInterest(x0, y0, w, h);
    for (let part of intParts)
        for (let ent of part.entities)
            setPainter(ent, 1);
    // Show partitions of interest
    noFill(); stroke(255, 0, 0); strokeWeight(1.2);
    for (let part of intParts) rect(part.lowX, part.lowY, part.width, part.height);
    // Highlight enclosing partition
    drawEnclosingPartition(encPart);
    world.render();
}


function printStuffOfInterest() {
    if (results) {
        console.log('-------------  Items of Interest   ------------------------');
        console.log(`Found ${intParts.length} partitions`);
        for (let part of intParts) part.$$();
        console.log(`Found ${intEnts.length} entities`);
        intEnts.forEach((ent) => { ent.$$() });
        console.log(`Enclosing partition ${encPart.$()}`)
        console.log('-----------------------------------------------------------');
    }
}

function drawEnclosingPartition(part) {
    if (part) {
        stroke(190, 130, 0, 160); strokeWeight(6); noFill();
        rect(part.lowX, part.lowY, part.width, part.height);
        fill(0, 30); noStroke();
        rect(x0, y0, x1 - x0, y1 - y0);
    }
}

function setPainter(entity, mode) {
    if (entity instanceof Wall)
        entity.painter = ppWall[mode];
    else if (entity instanceof Vehicle)
        entity.painter = ppVehicle[mode];
    else if (entity instanceof Mover)
        entity.painter = ppMover[mode];
}

function makeEntities() {
    ppWall = [], ppMover = [], ppVehicle = [];
    walls = [], movers = [], vehicles = [], data = [];

    // Wall data
    ppWall[0] = entWall(color(160, 255, 160, 80), 8);  // Green
    ppWall[1] = entWall(color(200, 200, 255), 8);  // Blue
    data = [
        [125, 75, 60, 280],
        [75, 340, 120, 310],
        [270, 66, 375, 80],
        [290, 105, 260, 145],
        [330, 310, 380, 340],
    ]
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        walls.push(new Wall({ x: d[0], y: d[1] }, { x: d[2], y: d[3] }));
        walls[i].painter = ppWall[0];
        world.birth(walls[i]);
    }
    // Mover data
    ppMover[0] = mvrArrow(color(160, 255, 160, 48), color(20, 200, 20, 48)); // Green
    ppMover[1] = mvrArrow(color(180, 180, 255), color(20, 20, 160));  // Blue
    data = [
        [380, 125, 10],
        [70, 85, 10],
        [175, 210, 10],
        [250, 175, 10],
    ]
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        movers.push(new Mover({ x: d[0], y: d[1] }, d[2]));
        movers[i].painter = ppMover[0];
        movers[i].vel = Vector2D.fromRandom(60, 90);
        world.birth(movers[i]);
    }
    // Wander data
    ppVehicle[0] = vcePerson(color(160, 255, 160, 48), color(20, 200, 20, 48)); // Green
    ppVehicle[1] = vcePerson(color(180, 180, 255), color(20, 20, 200)); // Blue
    data = [
        [222, 333, 10],
        [111, 85, 10],
        [300, 233, 10],
        [40, 155, 10],
    ]
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        vehicles.push(new Vehicle([d[0], d[1]], d[2], world));
        vehicles[i].vel = Vector2D.fromRandom(30, 60);
        vehicles[i].painter = ppVehicle[0];
        vehicles[i].maxSpeed = 50;
        vehicles[i].pilot.wanderOn();
        vehicles[i].pilot.wallAvoidOn();
        vehicles[i].pilot.feelerLength = 20;
        world.birth(vehicles[i]);
    }
}


function keyTyped() {
    if (key == 'i') printStuffOfInterest();
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