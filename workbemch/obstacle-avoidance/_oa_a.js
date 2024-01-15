let wx = 400, wy = 400, depth = 3;
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
    makeEntities();
    world.update(0);
    // View region
    x0 = 210; y0 = 155;
    w = 35, h = 40;
    x1 = x0 + w; y1 = y0 + h;
}

function findStuffOfInterest(x, y, w, h) {
    results = world._tree?.getItemsInRegion(x0, y0, x + w, y + h);
    intParts = results.partitions;
    intEnts = results.entities;
    encPart = results.enc_partition;
}

function draw() {
    world.update(deltaTime / 1000);
    let wd = world._domain;
    background(240, 190, 240);
    // World background and tree grid
    noStroke(); fill(255, 240, 255); rect(wd.lowX, wd.lowY, wd.width, wd.height);
    renderTreeGrid();

    world.render();
}

function makeEntities() {
    ppObs = [], ppWall = [], ppMover = [], ppVehicle = [];
    obstacles = [], walls = [], movers = [], vehicles = [], data = [];

    // Obstacle Data
    ppObs[0] = enyBasic(160, 255, 160), color(20, 200, 20); // Green
    ppObs[1] = enyBasic(color(180, 180, 255), color(20, 20, 160));  // Blue
    data = [
        [50, 50, 15],
        [75, 150, 10],
        [160, 110, 18],
        [125, 275, 22],
        [330, 280, 20],
        [260, 70, 10],
        [330, 82, 10],
        [355, 135, 13],
        [370, 189, 10],
        [286, 150, 15],
        [225, 233, 15],
    ]
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        obstacles.push(new Obstacle({ x: d[0], y: d[1] }, d[2]));
        obstacles[i].painter = ppObs[1];
        world.birth(obstacles[i]);
    }
    // Wall data
    // ppWall[0] = wallBarrier(color(160, 255, 160, 80), 8);  // Green
    // ppWall[1] = wallBarrier(color(200, 200, 255), 8);  // Blue
    // data = [
    //     [125, 75, 60, 280],
    //     [75, 340, 120, 310],
    //     [270, 66, 375, 80],
    //     [290, 105, 260, 145],
    //     [330, 310, 380, 340],
    // ]
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        walls.push(new Wall({ x: d[0], y: d[1] }, { x: d[2], y: d[3] }));
        walls[i].painter = ppWall[0];
        world.birth(walls[i]);
    }
    // Mover data
    // ppMover[0] = mvrArrow(color(160, 255, 160, 48), color(20, 200, 20, 48)); // Green
    // ppMover[1] = mvrArrow(color(180, 180, 255), color(20, 20, 160));  // Blue
    // data = [
    //     [380, 125, 10],
    //     [70, 85, 10],
    //     [175, 210, 10],
    //     [250, 175, 10],
    // ]
    // for (let i = 0; i < data.length; i++) {
    //     let d = data[i];
    //     movers.push(new Mover({ x: d[0], y: d[1] }, d[2]));
    //     movers[i].painter = ppMover[0];
    //     movers[i].vel = Vector2D.fromRandom(60, 90);
    //     world.birth(movers[i]);
    // }
    // Wander data
    ppVehicle[0] = vcePerson(color(160, 255, 160, 48), color(20, 200, 20, 48)); // Green
    ppVehicle[1] = vcePerson(color(180, 180, 255), color(20, 20, 200)); // Blue
    data = [
        [200, 200, 10],
        // [222, 333, 10],
        // [111, 85, 10],
        // [300, 233, 10],
        // [40, 155, 10],
    ]
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        vehicles.push(new Vehicle([d[0], d[1]], d[2], world));
        vehicles[i].vel = Vector2D.fromRandom(20, 30);
        vehicles[i].painter = ppVehicle[1];
        vehicles[i].maxSpeed = 30;
        vehicles[i].pilot.wanderOn();
        vehicles[i].pilot.obsAvoidOn();
        world.birth(vehicles[i]);
    }
}

function test001() {
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
    switch (entity._type) {
        case WALL:
            entity.painter = ppWall[mode];
            break;
        case MOVER:
            entity.painter = ppMover[mode];
            break;
        case VEHICLE:
            entity.painter = ppVehicle[mode];
            break;
        default:
            console.log(`Failed to find type ${entity.type.toString()}`);
    }
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