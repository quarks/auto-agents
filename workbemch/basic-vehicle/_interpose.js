let wx = 400, wy = 400, depth = 1;
let intParts = [], intEnts = [];

function setup() {
    console.clear();
    console.log('GLOBAL mode');
    hintHeading = hintVelocity = hintForce = false;
    hintTrail = hintCircle = hintFleeCircle = false;
    hintObsDetect = false;
    showColCircle = false;
    let p5canvas = createCanvas(800, 440);
    p5canvas.parent('sketch');
    world = new World(wx, wy, depth);
    makeEntities();
    world.domain.constraint = WRAP;
}

function draw() {
    world.update(deltaTime / 1000);
    let wd = world.domain;
    background(240, 190, 240);
    // World background and tree grid
    noStroke(); fill(255, 240, 255); rect(wd.lowX, wd.lowY, wd.width, wd.height);
    renderTreeGrid();
    stroke(200, 0, 200); strokeWeight(1.5); fill(200, 0, 200, 64);
    ellipse(200, 200, 5, 5);
    world.render();
}

function makeEntities() {
    ppObs = [], ppWall = [], ppMover = [], ppVehicle = [];
    obstacles = [], walls = [], movers = [], vehicles = [], data = [];

    // Wander data
    ppVehicle[0] = vcePerson(color(160, 255, 160), color(20, 200, 20)); // Green
    ppVehicle[1] = vcePerson(color(180, 180, 255), color(20, 20, 200)); // Blue
    ppVehicle[2] = vcePerson(color(255, 180, 180), color(200, 20, 20)); // Red
    data = [
        [200, 200, 8],
        [222, 333, 8],
        [200, 200, 6],
        [230, 230, 6],
    ]
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        let v = new Vehicle([d[0], d[1]], d[2], world);
        v.vel = Vector2D.fromRandom(30, 40);
        v.maxSpeed = 40;
        vehicles.push(v);
        world.birth(v);
    }

    let v = vehicles[0];
    v.painter = ppVehicle[1];
    v.pilot.wanderOn();
    v.pilot.wanderDist = 200;
    v.pilot.jitter = 3;

    v = vehicles[1];
    v.painter = ppVehicle[1];
    v.pilot.wanderOn();
    v.pilot.wanderDist = 200;
    v.pilot.jitter = 3;

    v = vehicles[2];
    v.painter = ppVehicle[2];
    v.maxSpeed = 70;
    v.pilot.interposeOn(vehicles[0], vehicles[1]);

    v = vehicles[3];
    v.painter = ppVehicle[0];
    v.maxSpeed = 70;
    v.pilot.interposeOn(vehicles[2], [200, 200]);
}

function renderTreeGrid() {
    function renderPart(level) {
        level = (2 ** (level - 1));
        let dx = r.width / level, dy = r.height / level;
        for (let i = r.lowX; i <= highX; i += dx) line(i, r.lowY, i, highY);
        for (let i = r.lowY; i <= highY; i += dy) line(r.lowX, i, highX, i);
    }
    let r = world._tree, d = world.domain;
    let highX = Math.min(r.highX, d.highX), highY = Math.min(r.highY, d.highY);
    stroke(0, 16); strokeWeight(1.1);
    for (let i = 1; i <= depth; i++) renderPart(i);
}

function keyTyped() {
    if (key == 't') printTree(world._tree);
    if (key == 'c') console.log(`Population: ${world._population.size}   Tree: ${world.tree.countEntities()}`);
    if (key == 'd') { world.death(2); }
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