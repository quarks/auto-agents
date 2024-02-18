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
    world.domain.constraint = WRAP;
}

function draw() {
    world.update(deltaTime / 1000);
    let wd = world.domain;
    background(240, 190, 240);
    // World background and tree grid
    noStroke(); fill(255, 240, 255); rect(wd.lowX, wd.lowY, wd.width, wd.height);
    renderTreeGrid();

    // Colourize obstacles
    obstacles.forEach(x => x.painter = ppObs[0]);
    vehicles[0].pilot.testObstaclesFound?.forEach(x => x.painter = ppObs[1]);
    vehicles[0].pilot.testClosestObstacle?.setPainter(ppObs[2]);

    world.render();
    if (frameCount == 60) console.log(`Max obstacle col. rad.  ${world.maxObstacleSize}`);
}

function makeEntities() {
    ppObs = [], ppWall = [], ppMover = [], ppVehicle = [];
    obstacles = [], walls = [], movers = [], vehicles = [], data = [];

    // Obstacle Data
    ppObs[0] = entBasic(color(160, 255, 160), color(20, 200, 20)); // Green
    ppObs[1] = entBasic(color(180, 180, 255), color(20, 20, 160));  // Blue
    ppObs[2] = entBasic(color(255, 180, 180), color(160, 20, 20));  // Red
    data = [
        [90, 90, 35],
        [75, 200, 10],
        [160, 110, 14],
        [125, 310, 40],
        [330, 280, 20],
        [260, 70, 10],
        [330, 82, 10],
        [355, 135, 13],
        [370, 189, 10],
        [286, 150, 25],
        [225, 233, 15],
    ]
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        obstacles.push(new Obstacle({ x: d[0], y: d[1] }, d[2]));
        obstacles[i].painter = ppObs[0];
        world.birth(obstacles[i]);
    }
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
        vehicles[i].maxSpeed = 60;
        vehicles[i].pilot.wanderOn();
        // vehicles[i].pilot.wanderRadius = 40;
        // vehicles[i].pilot.wanderDist = 100;
        vehicles[i].pilot.wanderJitter = 3;
        vehicles[i].pilot.obsAvoidOn();
        world.birth(vehicles[i]);
    }
}

function keyTyped() {
    if (key == 't') printTree(world._tree);
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