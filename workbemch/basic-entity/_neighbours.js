let wx = 500, wy = 400, depth = 5, border = 25;
let nDist = 80, popSize = 200, arrowSize = 4;
let intParts = [], intEnts = [], entities = [];

function setup() {
    //console.clear();
    console.log('GLOBAL mode');
    let p5canvas = createCanvas(800, 800);
    p5canvas.parent('sketch');
    showColCircle = false;
    world = new World(wx, wy, depth, border);
    world.domain.constraint = WRAP;
    makePainters();
    makeNeighbours();
    selectRandomVehicle();
}

function draw() {
    world.update(deltaTime / 1000);
    background(220);
    translate((world.tree.treeSize - world.width + 20) / 2, (world.tree.treeSize - world.height + 20) / 2 + 10);
    noStroke(); fill(220, 255, 220);
    let d = world.domain;
    rect(d.lowX, d.lowY, d.width, d.height);
    renderTreeGrid();
    world.render();
}

function selectRandomVehicle() {
    let n = Math.floor(Math.random() * entities.length);
    selEntity = entities[n];
    entities.forEach(e => e.painter = ppCyan);
    // Make selected entity red
    // selEntity.painter = ppRed;
    // selEntity.pilot.getNeighbours(selEntity, world, nDist);
    // selEntity.pilot.testNeighbours.forEach(e => e.painter = ppBlue);

    selEntity.forceRecorderOn();
    // console.log(`${selEntity.pilot.testNeighbours.length} Neighbours found  (Pop: ${popSize})`);
}

function makeNeighbours() {
    for (let i = 0; i < popSize; i++) {
        let x = (Math.random() - Math.random()) * world.width / 2.2 + world.width / 2;
        let y = (Math.random() - Math.random()) * world.height / 2.2 + world.height / 2;
        let v = new Vehicle([x, y], arrowSize, world);
        v.painter = ppCyan;
        v.vel = Vector2D.fromRandom(60, 160);
        v.heading = v.vel.copy().normalize();
        v.maxSpeed = 70;
        // v.pilot.cohesionOn();
        // v.pilot.separationOn();
        // v.pilot.alignmentOn();
        v.pilot.flockOn(nDist);
        v.pilot.wanderOn();
        entities.push(v);
        world.birth(v);
    }
    world.update(0);
}


function makePainters() {
    ppRed = mvrArrow(color(255, 180, 180), color(160, 20, 20));
    ppPurple = mvrArrow(color(255, 180, 255), color(160, 20, 160));
    ppBlue = mvrArrow(color(180, 180, 255), color(20, 20, 160));
    ppCyan = mvrArrow(color(180, 255, 255), color(20, 200, 200));
}

// function renderTreeGrid() {
//     function renderPart(level) {
//         level = (2 ** (level - 1));
//         let delta = r.treeSize / level;
//         for (let i = r.lowX; i <= r.highX; i += delta) line(i, r.lowY, i, r.highY);
//         for (let i = r.lowY; i <= r.highY; i += delta) line(r.lowX, i, r.highX, i);
//     }
//     let r = world.tree;
//     //let highX = Math.min(r.highX, d.highX), highY = Math.min(r.highY, d.highY);
//     //let highX = r.highX, highY = r.highY;
//     stroke(0, 32); strokeWeight(1.1);
//     for (let i = 1; i <= depth; i++) renderPart(i);
// }

function keyTyped() {
    if (key == 'o') {
        world.preventOverlap = !world.isPreventOverlapOn;
        console.log(`No Overlap Allowed? ${world.isPreventOverlapOn}`)
    }
    if (key == 'q') world.quadtreeAnalysis();

    if (key == 'd') selEntity.printForceData();
    if (key == 's') noLoop();

}
