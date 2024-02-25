let wx = 600, wy = 400, depth = 3;
let painters = [];

function setup() {
    console.clear();
    console.log('GLOBAL mode');
    let p5canvas = createCanvas(800, 440);
    p5canvas.parent('sketch');
    world = new World(wx, wy, depth);
    world.domain.constraint = REBOUND;
    makeMovers();
    let art = new Artefact({ x: 190, y: 210 }, 80, 45);
    world.birth(art);

}

function makeMovers() {
    let movers = [];
    painters[1] = paintPerson(color(255, 200, 200), color(160, 20, 20));
    painters[2] = paintPerson(color(200, 255, 255), color(20, 200, 200));
    painters[3] = paintPerson(color(255, 120, 255), color(200, 20, 200));
    painters[4] = paintPerson(color(200, 200, 255), color(20, 20, 160));

    let data = [
        [380, 125, 10, painters[1]],
        [70, 85, 13, painters[1]],
        [175, 210, 16, painters[1]],
        [250, 175, 19, painters[1]],
        [25, 67, 10, painters[1]],
        [330, 17, 13, painters[1]],
        [122, 345, 16, painters[1]],
        [198, 300, 19, painters[1]],
    ]
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        movers.push(new Mover({ x: d[0], y: d[1] }, d[2]));
        movers[i].painter = d[3];
        let v = Vector2D.fromRandom(60, 90);
        movers[i].vel = v.copy();
        world.birth(movers[i]);
    }
}

function draw() {
    world.update(deltaTime / 1000);
    background(220);
    noStroke(); fill(220, 255, 220);
    let d = world.domain; rect(d.lowX, d.lowY, d.width, d.height);
    renderTreeGrid();
    world.render();
}

function renderTreeGrid() {
    function renderPart(level) {
        level = (2 ** (level - 1));
        let dx = r.treeSize / level, dy = r.treeSize / level;
        for (let i = r.lowX; i <= highX; i += dx) line(i, r.lowY, i, highY);
        for (let i = r.lowY; i <= highY; i += dy) line(r.lowX, i, highX, i);
    }
    let r = world.tree, d = world.domain;
    let highX = Math.min(r.highX, d.highX), highY = Math.min(r.highY, d.highY);
    stroke(0, 24); strokeWeight(1.1);
    for (let i = 1; i <= depth; i++) renderPart(i);
}

function keyTyped() {
    if (key == 't') world.quadtreeAnalysis();
    if (key >= '0' && key <= '3') world.death(Number(key));
}
