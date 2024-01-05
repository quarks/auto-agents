let wanderdemo = function (p) {
    let showHeading = true, showVelocity = true, showForce = true;
    let showTrail = true, showCircle = true, allowLooping = true;
    let wanderer, trail, gui;

    p.setup = function () {
        console.clear();
        let p5canvas = p.createCanvas(640, 400, p);
        p5canvas.parent('sketch');
        world = new World(400, 400, 1);
        world._domain.constraint = WRAP;
        p.makeWanderer();
        trail = new Trail(300, p.color(0, 180, 0), 0.95);

        wanderer.pilot.setDetails({ 'wanderDist': 75, 'wanderRadius': 65, 'xxx': 123, 'wanderJitter': 35 });

        //gui = GUI.getNamed('WanderDemo', p5canvas, p);
        //p.createGUI(gui);
    }

    p.createGUI = function (gui) {
        let pilot = wanderer.pilot;
        gui.scheme('purple').textSize(16);
        let x = 420, y = 20;
        gui.checkbox('cbxHeading', x, y, 98, 24).text('Heading', p.CENTER).opaque().scheme('blue').select()
            .setAction((info) => { showHeading = info.selected });
        gui.checkbox('cbxVelocity', x, y + 26, 98, 24).text('Velocity', p.CENTER).opaque().scheme('orange').select()
            .setAction((info) => { showVelocity = info.selected });
        gui.checkbox('cbxForce', x + 102, y, 98, 24).text('Force', p.CENTER).opaque().scheme('red').select()
            .setAction((info) => { showForce = info.selected });
        gui.checkbox('cbxCircle', x + 102, y + 26, 98, 24).text('Circle', p.CENTER).opaque().select()
            .setAction((info) => { showCircle = info.selected });
        y += 52;
        gui.checkbox('cbxTrail', x, y, 200, 24).text(`Trail length ( ${trail._maxLength} )`, p.CENTER).opaque().scheme('green').select()
            .setAction((info) => { showTrail = info.selected });
        gui.slider('sdrTrail', x, y + 26, 200, 24).limits(200, 800).value(400).opaque().scheme('green')
            .setAction((info) => {
                trail._maxLength = Math.round(info.value);
                gui.$('cbxTrail').text(`Trail length ( ${trail._maxLength} )`);
            });
        y += 80;
        gui.label('lblDist', x, y, 200, 24).text(`Wander distance ( ${pilot.wanderDist} )`).opaque();
        gui.slider('sdrDist', x, y + 26, 200, 24).limits(20, 120).value(pilot.wanderDist).opaque()
            .setAction((info) => {
                pilot.wanderDist = Math.round(info.value);
                gui.$('lblDist').text(`Wander distance ( ${pilot.wanderDist} )`);
            });
        y += 58;
        gui.label('lblRadius', x, y, 200, 24).text(`Wander radius ( ${wanderer.pilot.wanderRadius} )`).opaque();
        gui.slider('sdrRadius', x, y + 26, 200, 24).limits(20, 100).value(wanderer.pilot.wanderRadius).opaque()
            .setAction((info) => {
                wanderer.pilot.wanderRadius = Math.round(info.value);
                gui.$('lblRadius').text(`Wander radius ( ${wanderer.pilot.wanderRadius} )`);
            });
        y += 58;
        gui.label('lblJitter', x, y, 200, 24).text(`Wander jitter ( ${wanderer.pilot.wanderJitter} )`).opaque();
        gui.slider('sdrJitter', x, y + 26, 200, 24).limits(10, 50).value(wanderer.pilot.wanderJitter).opaque()
            .setAction((info) => {
                wanderer.pilot.wanderJitter = Math.round(info.value);
                gui.$('lblJitter').text(`Wander jitter ( ${wanderer.pilot.wanderJitter} )`);
            });
        y += 58;
        gui.label('lblMaxSpeed', x, y, 200, 24).text(`Max. Speed ( ${wanderer.maxSpeed} )`).opaque();
        gui.slider('sdrMaxSpeed', x, y + 26, 200, 24).limits(10, 100).limits(10, 100).value(wanderer.maxSpeed).opaque()
            .setAction((info) => {
                wanderer.maxSpeed = Math.round(info.value);
                gui.$('lblMaxSpeed').text(`Max. Speed ( ${wanderer.maxSpeed} )`);
            });
    }

    p.draw = function () {
        world.update(p.deltaTime / 1000);
        trail.add(wanderer.pos);
        p.background(220, 160, 220);
        p.noStroke(); p.fill(200, 255, 200);
        let d = world._domain;
        p.rect(d.lowX, d.lowY, d.width, d.height);
        world.render();
        if (showTrail) trail.render();
        p.stroke(128, 0, 128); p.strokeWeight(4); p.fill(255, 220);
        p.rect(410, 10, 220, 380, 10);
        gui?.draw();
    }

    p.keyTyped = function () {
        if (key === 'p') {
            allowLooping = !allowLooping;
            allowLooping ? loop() : noLoop();
        }
    }

    p.makeWanderer = function () {
        wanderer = new Vehicle([world.width / 2, world.height / 2], 12);
        wanderer.vel = Vector2D.fromRandom(30, 60);
        wanderer.painter = p.wanderPainter(p.color(200, 200, 255), p.color(20, 20, 160), p);
        wanderer.maxSpeed = 50;
        wanderer.addAutoPilot(world);
        wanderer.pilot.wanderOn();
        wanderer.pilot.wanderDist = 70;
        wanderer.pilot.wanderRadius = 50;
        wanderer.pilot.wanderJitter = 20;
        world.birth(wanderer);
    }

    p.wanderPainter = function (colF, colS, p = p5.instance) {
        let body = [0.15, -0.5, 0.15, 0.5, -0.18, 0.3, -0.18, -0.3];
        return (function () {
            let pt = this.pilot, speed = this.speed;
            let wd = pt.wanderDist, wt = pt.wanderTarget, wr = pt.wanderRadius;
            let wd2 = wd / 2, wta = Math.atan2(wt.y, wd + wt.x);
            p.push();
            p.translate(this._pos.x, this._pos.y);
            // Draw wander hints
            if (showHeading) {
                p.push();
                p.rotate(this.headingAngle);
                p.noFill(); p.strokeWeight(4); p.stroke(163, 163, 255);
                p.line(0, 0, wd2, 0);
                p.noStroke(); p.fill(163, 163, 255);
                p.triangle(wd2, -6, wd2, 6, wd2 + 10, 0);
                p.pop();
            }
            if (showVelocity) {
                p.push();
                p.rotate(this.velAngle);
                p.noFill(); p.strokeWeight(2); p.stroke(250, 208, 162);
                p.line(0, 0, this.speed, 0);
                p.noStroke(); p.fill(250, 208, 162);
                p.triangle(this.speed, -6, this.speed, 6, this.speed + 10, 0);
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
            // Draw wanderer
            p.rotate(this.headingAngle);
            let size = 2 * this.colRad;
            p.fill(colF); p.stroke(colS); p.strokeWeight(1.1);
            p.beginShape();
            for (let idx = 0; idx < body.length; idx += 2)
                p.vertex(body[idx] * size, body[idx + 1] * size);
            p.endShape(p.CLOSE);
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
                p.strokeWeight(this._weight); p.stroke(this._col);
                for (let i = 1; i < t.length; i++) {
                    if (Math.abs(t[i - 1].x - t[i].x + t[i - 1].y - t[i].y) < 10)
                        p.line(t[i - 1].x, t[i - 1].y, t[i].x, t[i].y);
                }
            }
        }
    }
}

let wanderdemosketch = new p5(wanderdemo);
