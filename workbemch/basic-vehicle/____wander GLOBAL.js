let wx = 400, wy = 400;
let painters = [], wanderer, trail;
let showHeading = true, showVelocity = true, showForce = true;
let showTrail = true, showCircle = true;
let allowLooping = true;

function setup() {
    console.clear();
    let p5canvas = createCanvas(800, 440);
    p5canvas.parent('sketch');
    world = new World(wx, wy, 1);
    world._domain.constraint = WRAP;
    makeWanderer();
    trail = new Trail(400, color(0, 180, 0), 0.95);
}

function draw() {
    world.update(deltaTime / 1000);
    trail.add(wanderer.pos);
    background(255, 240, 255);
    noStroke(); fill(200, 255, 200);
    let d = world._domain;
    rect(d.lowX, d.lowY, d.width, d.height);
    world.render();
    if (showTrail) trail.render();
}

function keyTyped() {
    if (key === 'p') {
        allowLooping = !allowLooping;
        allowLooping ? loop() : noLoop();
    }
}

function makeWanderer() {
    wanderer = new Vehicle([world.width / 2, world.height / 2], 12);
    wanderer.vel = Vector2D.fromRandom(60, 100);
    wanderer.painter = wanderPainter(color(200, 200, 255), color(20, 20, 160));
    wanderer.addAutoPilot(world);
    wanderer.pilot.wanderOn();
    world.birth(wanderer);
}


function wanderPainter(colF, colS, p = p5.instance) {
    let body = [0.15, -0.5, 0.15, 0.5, -0.18, 0.3, -0.18, -0.3];
    return (function () {
        let pt = this.pilot, speed = this.speed;
        let wd = pt._wanderDist, wt = pt._wanderTarget, wr = pt._wanderRadius;
        let wd2 = wd / 2, wta = Math.atan2(wt.y, wd + wt.x);
        p.push();
        p.translate(this._pos.x, this._pos.y);
        if (showVelocity) {
            p.push();
            p.rotate(this.velAngle);
            p.noFill(); p.strokeWeight(3); p.stroke(220, 210, 100);
            p.line(0, 0, this.speed, 0);
            p.noStroke(); p.fill(220, 210, 100);
            p.triangle(this.speed, -6, this.speed, 6, this.speed + 10, 0);
            p.pop();
        }
        if (showHeading) {
            p.push();
            p.rotate(this.headingAngle);
            p.noFill(); p.strokeWeight(3); p.stroke(100, 210, 210);
            p.line(0, 0, wd2, 0);
            p.noStroke(); p.fill(100, 210, 210);
            p.triangle(wd2, -6, wd2, 6, wd2 + 10, 0);
            p.pop();
        }
        if (showCircle) {
            p.push();
            p.rotate(this.headingAngle);
            p.strokeWeight(2); p.stroke(0, 32); p.fill(0, 10);
            p.ellipse(wd, 0, 2 * wr, 2 * wr);
            p.pop();
        }
        if (showForce) {
            p.push();
            p.rotate(this.headingAngle);
            p.noFill(); p.strokeWeight(2); p.stroke(200, 0, 0);
            p.line(0, 0, wd + wt.x, wt.y);
            p.translate(wd + wt.x, wt.y); p.rotate(wta);
            p.noStroke(); p.fill(200, 0, 0); p.noStroke();
            p.triangle(-14, -5, -14, 5, 0, 0);
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