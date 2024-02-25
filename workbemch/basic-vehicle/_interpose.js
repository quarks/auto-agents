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
    ppVehicle[0] = paintPerson(color(160, 255, 160), color(20, 200, 20), [showInterpose]);
    ppVehicle[1] = paintPerson(color(180, 180, 255), color(20, 20, 200), [showInterpose]);
    ppVehicle[2] = paintPerson(color(255, 180, 180), color(200, 20, 20), [showInterpose]);
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


function keyTyped() {
    if (key == 'q') world.quadtreeAnalysis();
    if (key == 'c') console.log(`Population: ${world._population.size}   Tree: ${world.tree.countEntities()}`);
    if (key == 'd') { world.death(2); }
}
