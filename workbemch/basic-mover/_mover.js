let wx = 400, wy = 400, depth = 3;
let painters = [];

function setup() {
    console.clear();
    console.log('GLOBAL mode');
    let p5canvas = createCanvas(800, 440);
    p5canvas.parent('sketch');
    world = new World(wx, wy, depth);
    world._domain.constraint = REBOUND;
    makeMovers();
    let art = new Artefact({ x: 190, y: 210 }, 80, 45);
    world.birth(art);

}

function makeMovers() {
    let movers = [];
    painters[1] = mvrPerson(color(255, 200, 200), color(160, 20, 20));
    painters[2] = mvrPerson(color(200, 255, 255), color(20, 200, 200));
    painters[3] = mvrPerson(color(255, 120, 255), color(200, 20, 200));
    painters[4] = mvrPerson(color(200, 200, 255), color(20, 20, 160));

    let data = [
        [380, 125, 10, painters[1]],
        [70, 85, 12, painters[1]],
        [175, 210, 14, painters[1]],
        [250, 175, 16, painters[1]],
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
    //world._tree.colorizeEntities(painters);
    colorizeEntities(world._tree, painters);
    background(220);
    noStroke(); fill(220, 255, 220);
    let d = world._domain; rect(d.lowX, d.lowY, d.width, d.height);
    renderTreeGrid();
    world.render();
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
}

function printTree(tree) {
    function pt(tree) {
        if (tree._entities.size > 0)
            console.log(tree.toString());
        if (tree._children)
            for (let child of tree._children)
                pt(child);
    }
    console.log('=====================================================================================');
    pt(tree);
    console.log(`World population        ( Size = ${world._population.size} )`)
    if (world._population.size > 0) {
        let pop = [...world._population.values()].map(x => x.id).reduce((x, y) => x + ' ' + y, '{ ') + '  }';
        console.log(pop);
    }
}