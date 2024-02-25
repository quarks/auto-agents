hintHeading = false, hintVelocity = false, hintForce = false;
hintTrail = false, hintCircle = false, hintFleeCircle = false;
hintObsDetect = false, hintFeelers = false, hintInterpose = false;
hintCanSee = true;
showColCircle = false;

let wx = 400, wy = 400, depth = 3;

let t = [
    new Vector2D(60, 75),
    new Vector2D(75, 150),
    new Vector2D(110, 230),
    new Vector2D(330, 300),
    new Vector2D(260, 210),
    new Vector2D(190, 102),
    new Vector2D(140, 220),
    new Vector2D(160, 330),
    new Vector2D(235, 65),
    new Vector2D(315, 78),

];

function setup() {
    console.clear();
    let p5canvas = createCanvas(800, 440);
    p5canvas.parent('sketch');
    world = new World(wx, wy, depth);
    world.domain.constraint = WRAP;
    makeEntities();
    //world.update(0);  // Allow for birth of entities

}

function draw() {
    world.update(deltaTime / 1000);
    background(200);
    noStroke(); fill(220, 255, 220);
    let d = world.domain;
    rect(d.lowX, d.lowY, d.width, d.height);
    renderTreeGrid();
    // world.render();
    world.render();

    // let v = mvr.canSee(world, t[0]);
    // if (v) fill(200, 0, 0); else fill(0, 200, 0);
    // ellipse(t[0].x, t[0].y, 6, 6);


    t.forEach(p => {
        wdr.canSee(world, p) ? fill(255, 0, 0) : fill(0, 200, 0);
        ellipse(p.x, p.y, 8, 8);
    });
}

function keyTyped() {
    switch (key) {
        case 'c': console.clear(); break;
        case 'q': world.quadtreeAnalysis(); break;
    }
}

function makeEntities() {
    let ob;
    let obstaclePainter = paintEntity(color(200, 200, 255), color(100, 100, 192));
    ob = new Obstacle([175, 125], 20); ob.painter = obstaclePainter; world.birth(ob);
    ob = new Obstacle([330, 150], 25); ob.painter = obstaclePainter; world.birth(ob);
    ob = new Obstacle([250, 300], 50); ob.painter = obstaclePainter; world.birth(ob);

    let wl;
    let wallPainter = paintWall(color(180, 180, 240), 6); // Blue
    wl = new Wall([150, 200], [100, 250]); wl.painter = wallPainter; world.birth(wl);
    wl = new Wall([50, 175], [100, 50]); wl.painter = wallPainter; world.birth(wl);

    let fencePosts = [
        new Vector2D(300, 100),
        new Vector2D(330, 75),
        new Vector2D(294, 25),
        new Vector2D(200, 50),
        new Vector2D(220, 100),
    ]
    fnc = new Fence(fencePosts, false);
    fnc.walls.forEach(w => w.painter = wallPainter);

    world.birth(fnc);
    //fnc.deleteWall(1, world);


    wdr = new Vehicle([world.width / 2, world.height / 2], 12, world);
    wdr.vel = Vector2D.fromRandom(30, 60);
    wdr.painter = paintPerson('lightblue', 'darkblue', [showCanSee]);
    wdr.maxSpeed = 60;
    wdr.viewFOV = 2 * Math.PI / 10;
    wdr.viewDistance = 200;
    wdr.pilot.wanderOn().wallAvoidOn().obsAvoidOn();
    wdr.pilot.wanderDist = 70;
    wdr.pilot.wanderRadius = 25;
    wdr.pilot.wanderJitter = 20;
    world.birth(wdr);
}

