let allowLooping = true, showTrail = true;

let demo = function (p) {
    let leader, follower1, trail, gui;
    let sampleForces = false, sampleEnd;

    p.setup = function () {
        console.clear();
        let p5canvas = p.createCanvas(640, 400, p);
        p5canvas.parent('sketch');
        world = new World(400, 400, 1);
        // world.domain.constraint = WRAP;
        p.makeAgents();
        trail = new Trail(600, p.color(0, 180, 0), 0.95);
    }

    p.draw = function () {
        world.update(p.deltaTime / 1000);
        trail.add(follower1.pos);
        p.background(220, 160, 220);
        p.noStroke(); p.fill(200, 255, 200);
        let d = world.domain;
        p.rect(d.lowX, d.lowY, d.width, d.height);
        world.render();
        if (showTrail) trail.render();
        p.stroke(128, 0, 128); p.strokeWeight(4); p.fill(255, 220);
        p.rect(410, 10, 220, 380, 10);


        gui?.draw();

        if (sampleForces && p.frameCount >= sampleEnd) {
            sampleForces = false;
            console.log(`Sampling stopped on frame ${p.frameCount}  @ ${p.millis()}`);
            console.log(follower1.recorder.toString());
        }

    }

    p.keyTyped = function () {
        if (p.key === 'p') {
            allowLooping = !allowLooping;
            allowLooping ? p.loop() : p.noLoop();
        }
        if (p.key === 'r' && !sampleForces) {
            console.log(`Sampling started on frame ${p.frameCount}  @ ${p.millis()}`);
            sampleForces = true;
            sampleEnd = p.frameCount + 100;
            follower1.recorder.clearData();
        }
    }

    p.makeAgents = function () {
        leader = new Vehicle([world.width / 2, world.height / 2], 8);
        leader.vel = Vector2D.fromRandom(10, 20);
        leader.painter = vcePerson(p.color(200, 200, 255), p.color(20, 20, 160), p);
        leader.maxSpeed = 60;
        leader.pilot.wanderOn();
        leader.pilot.wanderDist = 100;
        leader.pilot.wanderRadius = 20;
        leader.pilot.wanderJitter = 20;
        world.birth(leader);

        follower1 = new Vehicle([0.19 * world.width, 0.91 * world.height], 8);
        follower1.vel = new Vector2D(20, 30);
        follower1.painter = vcePerson(p.color(255, 200, 255), p.color(160, 20, 160), p);
        follower1.maxSpeed = 80;
        follower1.pilot.offsetPursuitOn(leader, new Vector2D(-20, 0));
        follower1.forceRecorderOn();
        world.birth(follower1);
    }

    p.createGUI = function (gui) {
        let pilot = vEntity.pilot;
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
        gui.label('lblRadius', x, y, 200, 24).text(`Wander radius ( ${vEntity.pilot.wanderRadius} )`).opaque();
        gui.slider('sdrRadius', x, y + 26, 200, 24).limits(20, 100).value(vEntity.pilot.wanderRadius).opaque()
            .setAction((info) => {
                vEntity.pilot.wanderRadius = Math.round(info.value);
                gui.$('lblRadius').text(`Wander radius ( ${vEntity.pilot.wanderRadius} )`);
            });
        y += 58;
        gui.label('lblJitter', x, y, 200, 24).text(`Wander jitter ( ${vEntity.pilot.wanderJitter} )`).opaque();
        gui.slider('sdrJitter', x, y + 26, 200, 24).limits(10, 50).value(vEntity.pilot.wanderJitter).opaque()
            .setAction((info) => {
                vEntity.pilot.wanderJitter = Math.round(info.value);
                gui.$('lblJitter').text(`Wander jitter ( ${vEntity.pilot.wanderJitter} )`);
            });
        y += 58;
        gui.label('lblMaxSpeed', x, y, 200, 24).text(`Max. Speed ( ${vEntity.maxSpeed} )`).opaque();
        gui.slider('sdrMaxSpeed', x, y + 26, 200, 24).limits(10, 100).limits(10, 100).value(vEntity.maxSpeed).opaque()
            .setAction((info) => {
                vEntity.maxSpeed = Math.round(info.value);
                gui.$('lblMaxSpeed').text(`Max. Speed ( ${vEntity.maxSpeed} )`);
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

let demosketch = new p5(demo);

