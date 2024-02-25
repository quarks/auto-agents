let wx = 400, wy = 400, depth = 4;
let intParts = [], intEnts = [];

function setup() {
    console.clear();
    let p5canvas = createCanvas(800, 440);
    p5canvas.parent('sketch');
    world = new World(wx, wy, depth);
    makeFences();
    makeMovers();
    world.update(0);
    world.domain.constraint = WRAP;
}

function draw() {
    push();
    world.update(deltaTime / 1000);
    let wd = world.domain;
    background(240, 190, 240);
    // World background and tree grid
    noStroke(); fill(255, 240, 255); rect(wd.lowX, wd.lowY, wd.width, wd.height);
    renderTreeGrid();
    world.render();
    pop();
}

function makeFences() {
    function makeVectorArray(a) {
        let v = [];
        for (let i = 0; i < a.length; i += 2)
            v.push(new Vector2D(a[i], a[i + 1]));
        return v;
    }
    let data = [75, 160, 145, 195, 190, 130, 165, 105, 180, 55, 140, 30, 110, 60];
    let f = makeVectorArray(data);
    let fence = new Fence(f, true);
    fence.painter = paintFencedArea(color(100, 255, 55));
    fence.walls.forEach(w => w.painter = paintWall(color(210, 220, 0), 6));
    world.birth(fence);
    //fence.deleteWall(1, world);
    fence.wallRepelSide(1, NO_SIDE);
    fence.wallRepelSide(5, NO_SIDE);
}

function makeMovers() {
    vehicles = []; data = [];
    let ms = 6;
    data = [
        [200, 200, ms],
        [100, 100, ms],
        [250, 200, ms],
        [200, 275, ms],
        [50, 90, ms],
        [350, 380, ms],
        [280, 20, ms],
        [30, 300, ms],
    ]
    let vehicleProps = {
        maxSpeed: 70, maxForce: 2000
    }
    let pilotProps = {
        nbrFeelers: 6, feelerLength: 15, feelerFOV: Math.PI * 0.7, ovalEnvelope: true,
        wanderDist: 50, wanderRadius: 20, wanderJitter: 40
    }
    let pilotWeights = {
        "Wall Avoid": 299, Wander: 5.5, 'Offset Pursuit': 22
    }
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        v = new Vehicle([d[0], d[1]], d[2], world);
        vehicles.push(v);
        v.vel = Vector2D.fromRandom(20, 30);
        v.painter = paintPerson('blue', 'darkblue');
        v.setProperties(vehicleProps);

        v.pilot.setWeights(pilotWeights);
        v.pilot.setProperties(pilotProps);
        v.pilot.wanderOn();
        v.pilot.wallAvoidOn();

        world.birth(v);
    }
    vehicles[0].painter = paintPerson('red', 'darkred');
    vehicles[0].forceRecorderOn();
}

function keyTyped() {
    if (key == 'q') world.quadtreeAnalysis();
    if (key == 'f') vehicles[0].printForceData();
}
