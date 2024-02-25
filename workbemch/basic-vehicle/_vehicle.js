let wx = 380, wy = 260, depth = 3;
let painters = [], wanderer;
let allowLooping = true;

function setup() {
    let p5canvas = createCanvas(800, 440);
    p5canvas.parent('sketch');
    world = new World(wx, wy, depth);
    world.domain.constraint = WRAP;
    makevehicles();
}

function makevehicles() {
    let hints = [showHeading, showVelocity, showWanderCircle, showWanderForce];
    const RED = paintPerson('lightpink', 'firebrick', hints);
    const BLUE = paintPerson('lightblue', 'darkblue', hints);
    let vehicles = [];
    let data = [
        [35, 375, 10, RED], [190, 185, 10, RED], [175, 210, 12, BLUE], [250, 175, 12, BLUE],
    ]
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        vehicles.push(new Vehicle({ x: d[0], y: d[1] }, d[2]));
        vehicles[i].painter = d[3];
        let v = Vector2D.fromRandom(60, 100);
        vehicles[i].vel = v.copy();
        vehicles[i].pilot.wanderOn();
        world.birth(vehicles[i]);
    }
}

function draw() {
    world.update(deltaTime / 1000);
    background(220);
    noStroke(); fill(220, 255, 220);
    let d = world.domain;
    rect(d.lowX, d.lowY, d.width, d.height);
    renderTreeGrid();
    world.render();
}

function keyTyped() {
    if (key == 'q') world.quadtreeAnalysis();
    if (key == 's') {
        allowLooping = !allowLooping;
        if (allowLooping) loop(); else noLoop();
    }
}
