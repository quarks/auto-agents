let wx = 400, wy = 400, depth = 3;
let intParts = [], intEnts = [];
let world;

function setup() {
    // console.clear();
    hintHeading = hintVelocity = hintForce = false;
    hintTrail = hintCircle = hintFleeCircle = false;
    hintObsDetect = false;
    showColCircle = false;
    let p5canvas = createCanvas(440, 440);
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
    translate(20, 20);
    push();
    beginClip();
    rect(wd.lowX, wd.lowY, wd.width, wd.height);
    // ellipse(wd.cX, wd.cY, wd.width, wd.height);
    endClip();
    // World background and tree grid
    noStroke(); fill(255, 240, 255); rect(wd.lowX, wd.lowY, wd.width, wd.height);
    renderTreeGrid();

    // Colourize walls on collision
    walls.forEach(x => x.painter = ppWall[0]);
    vehicles[0].pilot.testWallsFound?.forEach(x => x.painter = ppWall[1]);

    world.render();
    pop();
}

function makeEntities() {
    ppObs = [], ppWall = [], ppMover = [], ppVehicle = [];
    obstacles = [], walls = [], movers = [], vehicles = [], data = [];
    //Wall data
    ppWall[0] = paintWall(color(180, 240, 180), 10); // Green
    ppWall[1] = paintWall(color(180, 180, 240), 10); // Blue
    ppWall[2] = paintWall(color(240, 180, 180), 10); // Red
    data = [
        [25, 175, 175, 125],
        [350, 190, 320, 120],
        [360, 350, 130, 315],
    ]
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        walls.push(new Wall({ x: d[0], y: d[1] }, { x: d[2], y: d[3] }));
        walls[i].painter = ppWall[0];
        world.birth(walls[i]);
    }
    // Wander data
    ppVehicle[0] = paintPerson(color(160, 255, 160, 48), color(20, 200, 20, 48), [showFeelers]); // Green
    ppVehicle[1] = paintPerson(color(180, 180, 255), color(20, 20, 200), [showFeelers]); // Blue
    data = [
        [200, 200, 10],
    ]
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        v = new Vehicle([d[0], d[1]], d[2], world);
        let pilot = v.pilot;
        vehicles.push(v);
        v.vel = Vector2D.fromRandom(20, 30);
        v.painter = ppVehicle[1];
        v.maxSpeed = 60;

        pilot.wanderdist = 100;
        pilot.wanderradius = 30;
        pilot.wanderOn();
        pilot.wanderJitter = 20;

        pilot.wallAvoidOn();
        pilot.ovalEnvelope = true;
        pilot.feelerLength = 25;
        pilot.feelerFOV = Math.PI * 0.75
        pilot.nbrFeelers = 5;
        world.birth(v);
    }
}

function keyTyped() {
    if (key == 't') world.quadtreeAnalysis();
    if (key == 'c') console.log(`Population: ${world._population.size}   Tree: ${world.tree.countEntities()}`);
    if (key == 'd') { world.death(2); }
}
