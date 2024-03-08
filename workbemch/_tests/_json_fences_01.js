let wx = 600, wy = 400, depth = 4;

function preload() {
    worldData = loadStrings('world_data_01.txt');
}

function setup() {
    // console.clear();
    let p5canvas = createCanvas(640, 440);
    p5canvas.parent('sketch');
    world = new World(wx, wy, depth);
    world.domain.constraint = WRAP;
    makeScene(worldData);
    makePeople(60);
}

function draw() {
    world.update(deltaTime / 1000);
    let wd = world.domain;
    background(240, 190, 240);
    translate(20, 20);
    push();
    beginClip();
    rect(0, 0, world.width, world.height);
    endClip();
    // World background
    noStroke(); fill(255, 240, 255); rect(wd.lowX, wd.lowY, wd.width, wd.height);
    world.render();
    renderTreeGrid();
    pop();
}

function makeScene(filedata) {
    let obj = sceneFromJSON(filedata);
    obj.FENCES?.forEach(fence => {
        fence.painter = paintFencedArea(color(0, 255, 0));
        fence.walls.forEach(w => w.painter = paintWall(color(200, 200, 255), 3));
        world.birth(fence);
    });
    obj.OBSTACLES?.forEach(obstacle => {
        obstacle.painter = paintEntity(color(0, 255, 0), color(0, 0, 200));
        world.birth(obstacle);
    });
    obj.WALLS?.forEach(wall => {
        wall.painter = paintWall(color(200, 200, 255), 4);
        world.birth(wall);
    });
}

function makePeople(nbr) {
    let ptrBlue = paintPerson(color(200, 200, 255), color(0, 0, 128));
    let ptrRed = paintPerson(color(255, 220, 220), color(192, 0, 0));
    let pilotProps = {
        'wanderDist': 70, 'wanderRadius': 30, 'wanderJitter': 20, 'feelerLength': 12,
        'nbrFeelers': 5, 'detectBoxLength': 40
    };
    let vehicleProps = { 'maxForce': 600, 'maxSpeed': 50 };
    for (let i = 0; i < nbr; i++) {
        let pos = new Vector2D(wx * random(), wy * random());
        let vehicle = new Vehicle(pos, 4);
        vehicle.setProperties(vehicleProps);
        vehicle.heading = Vector2D.fromRandom();
        vehicle.painter = ptrBlue;
        let pilot = vehicle.pilot;
        pilot.setProperties(pilotProps);
        pilot.wanderOn().wallAvoidOn().obsAvoidOn();
        pilot.setWeighting(IDX_OBSTACLE_AVOID, 20)
        pilot.setWeighting(IDX_WANDER, 1)
        world.birth(vehicle);
        // For testing purposes
        if (i == 0) {
            vehicle.painter = ptrRed;
            vehicle.forceRecorderOn();
            master = vehicle;
        }
    }
}

function keyTyped() {
    switch (key) {
        case 'q': world.quadtreeAnalysis(); break;
        case 'r': master.printForceData(); break;
    }
}