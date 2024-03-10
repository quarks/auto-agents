let wx = 640, wy = 400, depth = 4;

function preload() {
    marketData = loadStrings('market_day_data.txt');
    back0 = loadImage('layer0.png');
    back1 = loadImage('layer1.png');
    boat0 = loadImage('boat0.png');
    boat1 = loadImage('boat1.png');
    graphData = loadStrings('boatgraph_data.txt');
}

function setup() {
    // console.clear();
    let p5canvas = createCanvas(660, 420);
    p5canvas.parent('sketch');
    world = new World(wx, wy, depth);
    world.domain = new Domain(-100, -100, 700, 500, WRAP);
    graph = new Graph();
    makeScene(marketData);
    makeGraph(graphData);
    makeLayers();
    makeBoats();
    makePeople(100);
}

function draw() {
    world.update(deltaTime / 1000);
    let wd = world.domain;
    background(20);
    translate(10, 10);
    push();
    beginClip();
    rect(0, 0, world.width, world.height);
    endClip();
    world.render();
    pop();
}

function makeGraph(filedata) {
    let obj = graphFromJSON(filedata);
    obj.NODES.forEach(node => graph.addNode(node));
    obj.EDGES.forEach(edge => graph.addEdge(edge));
    graph.compact();
}

function makeScene(filedata) {
    let obj = sceneFromJSON(filedata);
    obj.FENCES?.forEach(fence => {
        //fence.painter = paintFencedArea(color(0, 255, 0));
        fence.walls.forEach(w => w.painter = paintWall(color(200, 200, 255), 3));
        world.birth(fence);
    });
    obj.OBSTACLES?.forEach(obstacle => {
        obstacle.painter = paintEntity(color(0, 255, 0), color(0, 0, 200));
        world.birth(obstacle);
    });
    obj.WALLS?.forEach(wall => {
        wall.painter = paintWall(color(200, 200, 255), 4);
        world.birth(wall);
    });
}

function makeLayers() {
    let layer0 = new Artefact(new Vector2D(wx / 2, wy / 2), wx, wy);
    layer0.painter = paintArtefact(back0);
    layer0.Z = 0;
    let layer1 = new Artefact(new Vector2D(wx / 2, wy / 2), wx, wy);
    layer1.painter = paintArtefact(back1);
    layer1.Z = 100;
    world.birth([layer1, layer0]);
}

function makeBoats() {
    let boatProps = { 'turnRate': 1, 'Z': 100, 'maxSpeed': 25 };
    let boatA = new Vehicle(new Vector2D(80, 480));
    boatA.painter = paintImage(boat0);
    boatA.setProperties(boatProps);
    let gs = graph.search([101, 102, 103, 108, 100]);
    boatA.pilot.pathOn([...gs.path], true);
    let boatB = new Vehicle(new Vector2D(320, -95));
    boatB.painter = paintImage(boat1);
    boatB.setProperties(boatProps);
    gs = graph.search([208, 200, 207]);
    boatB.pilot.pathOn([...gs.path], true);
    world.birth([boatA, boatB]);
}

function makePeople(nbr) {
    let ptr = [];
    ptr.push(paintPerson(color(220, 220, 255), color(0, 0, 164)));
    ptr.push(paintPerson(color(255, 220, 220), color(192, 0, 0)));
    ptr.push(paintPerson(color(220, 255, 220), color(0, 192, 0)));
    ptr.push(paintPerson(color(255, 220, 255), color(192, 0, 192)));
    ptr.push(paintPerson(color(200, 240, 240), color(0, 160, 160)));
    ptr.push(paintPerson(color(128), color(96)));

    let pilotProps = {
        'wanderDist': 70, 'wanderRadius': 30, 'wanderJitter': 20,
        'feelerLength': 7, 'nbrFeelers': 5
    };
    let vehicleProps = { 'maxForce': 600, 'maxSpeed': 40 };
    for (let i = 0; i < nbr; i++) {
        let pos = new Vector2D(wx * random(), wy * random());
        let vehicle = new Vehicle(pos, 5);
        vehicle.setProperties(vehicleProps);
        vehicle.heading = Vector2D.fromRandom();
        vehicle.painter = ptr[floor(random(0, ptr.length))];
        //vehicle.painter = ptrBlue;
        let pilot = vehicle.pilot;
        pilot.setProperties(pilotProps);
        pilot.wanderOn().wallAvoidOn();
        pilot.setWeighting(IDX_WANDER, 1)
        world.birth(vehicle);
    }
}


function paintPerson(colF, colS, hints = [], p = p5.instance) {
    let body = [0.15, -0.5, 0.15, 0.5, -0.18, 0.3, -0.18, -0.3];
    return (function (elapsedTime, world) {
        let size = 2 * this.colRad;
        p.push();
        p.translate(this.pos.x, this.pos.y);
        for (let hint of hints) hint.call(this, p);
        p.rotate(this.headingAngle);
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

function paintWall(col, weight, p = p5.instance) {
    return (function (elapsedTime, world) {
        p.push();
        p.stroke(col); p.strokeWeight(weight);
        p.line(this.start.x, this.start.y, this.end.x, this.end.y);
        p.stroke(60); p.strokeWeight(1);
        if (this.repelSide == OUTSIDE || this.repelSide == BOTH_SIDES) {
            p.push();
            p.translate(this.norm.x * 2, this.norm.y * 2);
            p.line(this.start.x, this.start.y, this.end.x, this.end.y);
            p.pop();
        }
        if (this.repelSide == INSIDE || this.repelSide == BOTH_SIDES) {
            p.push();
            p.translate(this.norm.x * -2, this.norm.y * -2);
            p.line(this.start.x, this.start.y, this.end.x, this.end.y);
            p.pop();
        }
        p.pop();
    });
}

function paintArtefact(img, p = p5.instance) {
    return (function (elapsedTime, world) {
        p.push();
        p.translate(this.lowX, this.lowY);
        p.image(img, 0, 0);
        p.pop();
    });
}

function paintImage(img, p = p5.instance) {
    return (function (elapsedTime, world) {
        p.push();
        p.imageMode(CENTER);
        p.translate(this.pos.x, this.pos.y);
        p.rotate(this.headingAngle);
        p.image(img, 0, 0);
        p.pop();
    });
}

function keyTyped() {
    switch (key) {
        case 'q': world.quadtreeAnalysis(); break;
    }
}