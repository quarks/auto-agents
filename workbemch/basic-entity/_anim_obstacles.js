let wx = 400, wy = 400, depth = 4;
let intParts = [], intEnts = [];

function setup() {
    //console.clear();
    console.log('GLOBAL mode');
    let p5canvas = createCanvas(800, 440);
    p5canvas.parent('sketch');
    world = new World(wx, wy, depth);
    makeEntities();
    //world.update(0);  // Allow for birth of entities
}

function draw() {
    world.update(deltaTime);
    background(220);
    noStroke(); fill(255, 255, 255);
    let d = world.domain;
    rect(d.lowX, d.lowY, d.width, d.height);
    world.render();
}

function makeEntities() {
    entities = [];
    let cr = 40;
    let data = [
        [280, 125, cr, entObsAnim()],
        [70, 135, cr, entObsAnim()],
        [225, 320, cr, entObsAnim()],
        [250, 230, cr, entObsAnim()],
        [75, 50, cr, entObsAnim()],
        [150, 260, cr, entObsAnim()],
    ]
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        entities.push(new Obstacle({ x: d[0], y: d[1] }, d[2]));
        entities[i].painter = d[3];
        world.birth(entities[i]);
    }
}
