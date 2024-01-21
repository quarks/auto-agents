let wx = 400, wy = 400, depth = 3;
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
    world.update(0);
    world._domain._constraint = WRAP;
}

function draw() {
    world.update(deltaTime / 1000);
    let wd = world._domain;
    background(240, 190, 240);
    // World background and tree grid
    noStroke(); fill(255, 240, 255); rect(wd.lowX, wd.lowY, wd.width, wd.height);
    renderTreeGrid();

    // Colourize obstacles
    walls.forEach(x => x.painter = ppWall[0]);
    vehicles[0].pilot.testWallsFound?.forEach(x => x.painter = ppWall[1]);

    world.render();
}

function makeEntities() {
    ppObs = [], ppWall = [], ppMover = [], ppVehicle = [];
    obstacles = [], walls = [], movers = [], vehicles = [], data = [];
    //Wall data
    ppWall[0] = entWall(color(180, 240, 180), 10); // Green
    ppWall[1] = entWall(color(180, 180, 240), 10); // Blue
    ppWall[2] = entWall(color(240, 180, 180), 10); // Red
    data = [
        [25, 175, 175, 125],
        [350, 190, 320, 120],
        [360, 350, 130, 315],
    ]
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        walls.push(new Wall({ x: d[0], y: d[1] }, { x: d[2], y: d[3] }, OUTSIDE));
        walls[i].painter = ppWall[0];
        world.birth(walls[i]);
    }
    walls[0].repelSide = BOTH_SIDES;

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
        v = new Vehicle([d[0], d[1]], d[2], world);
        let pilot = v.pilot;
        vehicles.push(v);
        v.vel = Vector2D.fromRandom(20, 30);
        v.painter = ppVehicle[1];
        v.maxSpeed = 60;

        // pilot.interposeOn(undefined, [21.3, 87.91]);
        // pilot.interposeOn(undefined, { x: 123.9, y: 56.7 });
        // pilot.interposeOn(undefined, new Vector2D(31.422, 229.99));
        // pilot.interposeOn(undefined, v);

        pilot.wanderOn();
        pilot.wanderJitter = 3;

        pilot.wallAvoidOn();
        pilot.ovalEnvelope = true;
        pilot.feelerLength = 25;
        pilot.feelerFOV = Math.PI * 0.75
        pilot.nbrFeelers = 5;
        world.birth(v);
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