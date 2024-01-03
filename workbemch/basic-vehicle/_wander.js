let wx = 400, wy = 400, depth = 1;
let painters = [], wanderer, trail;
let allowLooping = true;

function setup() {
    console.clear();
    let p5canvas = createCanvas(800, 440);
    p5canvas.parent('sketch');
    world = new World(wx, wy, depth);
    world._domain.constraint = WRAP;
    makePainters();
    makeWanderer();
    trail = new Trail(400);
}

function draw() {
    world.update(deltaTime / 1000);
    trail.add(wanderer.pos);
    world._tree.colorizeEntities(painters);
    background(255, 240, 255);
    noStroke(); fill(200, 255, 200);
    let d = world._domain;
    rect(d.lowX, d.lowY, d.width, d.height);
    renderTreeGrid();
    world.render();
    trail.render();
}

function keyTyped() {
    console.log(`Key typed ${key}`);
    if (key == 'p')
        wanderer._painter.stuff();
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

function makePainters() {
    painters[1] = wanderPainter(color(255, 200, 200), color(160, 20, 20));
    painters[2] = wanderPainter(color(200, 255, 255), color(20, 200, 200));
    painters[3] = wanderPainter(color(255, 120, 255), color(200, 20, 200));
    painters[4] = wanderPainter(color(200, 200, 255), color(20, 20, 160));
}

function makeWanderer() {
    wanderer = new Vehicle([world.width / 2, world.height / 2], 12);
    wanderer.vel = Vector2D.fromRandom(60, 100);
    wanderer.painter = painters[1];
    wanderer.addAutoPilot(world);
    wanderer.pilot.wanderOn();
    world.birth(wanderer);
}


let showHeading = true, showVelocity = true, showForce = true;

function wanderPainter(colF, colS, p = p5.instance) {
    let body = [0.15, -0.5, 0.15, 0.5, -0.18, 0.3, -0.18, -0.3];

    return (function () {
        p.push();
        p.translate(this._pos.x, this._pos.y);
        if (showVelocity) {
            p.push();
            p.rotate(this.velAngle);
            p.noFill(); p.strokeWeight(3); p.stroke(220, 210, 100);
            p.line(0, 0, this.speed, 0);
            p.noStroke(); p.fill(220, 210, 100);
            p.ellipse(this.speed, 0, 10, 10);
            p.pop();
        }
        if (showHeading) {
            p.push();
            p.rotate(this.headingAngle);
            p.noFill(); p.strokeWeight(3); p.stroke(100, 210, 210);
            p.line(0, 0, this.pilot._wanderDist / 2, 0);
            p.noStroke(); p.fill(100, 210, 210);
            p.ellipse(this.pilot._wanderDist / 2, 0, 10, 10);
            p.pop();
        }
        if (showForce) {
            p.push();
            p.rotate(this.headingAngle);
            p.noFill(); p.strokeWeight(2); p.stroke(255, 0, 0, 64);
            p.line(0, 0, this.pilot._wanderDist + this.pilot._wanderTarget.x, this.pilot._wanderTarget.y);
            p.ellipse(this.pilot._wanderDist, 0, 2 * this.pilot._wanderRadius, 2 * this.pilot._wanderRadius);
            p.fill(255, 0, 0, 64); p.noStroke();
            p.ellipse(this.pilot._wanderDist + this.pilot._wanderTarget.x, this.pilot._wanderTarget.y, 8, 8);
            p.pop();
        }
        // Draw entity
        p.rotate(this.headingAngle);
        let size = 2 * this.colRad;
        p.fill(colF); p.stroke(colS); p.strokeWeight(1.1);
        p.beginShape();
        for (let idx = 0; idx < body.length; idx += 2)
            p.vertex(body[idx] * size, body[idx + 1] * size);
        p.endShape(CLOSE);
        p.fill(colS); p.noStroke();
        p.ellipse(0, 0, 0.6 * size, 0.56 * size)
        p.pop();

    });

}

function personPainter(colF, colS, p = p5.instance) {
    let body = [0.15, -0.5, 0.15, 0.5, -0.18, 0.3, -0.18, -0.3];
    return (function () {
        p.push();
        p.translate(this._pos.x, this._pos.y);
        p.rotate(this.headingAngle)
        let size = 2 * this.colRad;
        // p.fill(0, 32); p.noStroke();
        // p.ellipse(0, 0, size, size);
        p.fill(colF); p.stroke(colS); p.strokeWeight(1.1);
        p.beginShape();
        for (let idx = 0; idx < body.length; idx += 2)
            p.vertex(body[idx] * size, body[idx + 1] * size);
        p.endShape(CLOSE);
        p.fill(colS); p.noStroke();
        p.ellipse(0, 0, 0.6 * size, 0.56 * size)
        p.pop();
    });
}

class Trail {

    constructor(length = 100, col = color(255, 0, 255), weight = 1) {
        this._trail = [];
        this._maxLength = length;
        this._col = col;
        this._weight = weight;
    }

    add(pos) {
        this._trail.push(pos.copy());
        while (this._trail.length > this._maxLength) this._trail.shift();
    }

    render() {
        let t = this._trail;
        if (t.length > 1) {
            strokeWeight(this._weight); stroke(this._col);
            for (let i = 1; i < t.length; i++) {
                if (Math.abs(t[i - 1].x - t[i].x + t[i - 1].y - t[i].y) < 10)
                    line(t[i - 1].x, t[i - 1].y, t[i].x, t[i].y);
            }
        }
    }



}