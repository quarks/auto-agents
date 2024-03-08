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
    let p5canvas = createCanvas(800, 600);
    p5canvas.parent('sketch');
    world = new World(wx, wy, depth);
    world.domain = new Domain(-100, -100, 700, 500, WRAP);
    graph = new Graph();
    makeScene(marketData);
    makeGraph(graphData);
    makeLayers();
    makeBoats();
    makePeople(60);
}

function draw() {
    world.update(deltaTime / 1000);
    let wd = world.domain;
    background(240, 190, 240);
    translate(100, 100);
    push();
    beginClip();
    rect(0, 0, world.width, world.height);
    endClip();
    world.render();
    renderTreeGrid();
    pop();
    // drawNodes();
    // drawEdges();
}

function makeGraph(filedata) {
    let obj = graphFromJSON(filedata);
    obj.NODES.forEach(node => graph.addNode(node));
    obj.EDGES.forEach(edge => graph.addEdge(edge));
    graph.compact();
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


function makeBoats() {
    let boatProps = { 'turnRate': 1.1, 'Z': 100, 'maxSpeed': 20 };
    let boatA = new Vehicle(new Vector2D(80, 440));
    boatA.painter = paintImage(boat0);
    boatA.setProperties(boatProps);
    let gs = graph.search([103, 108, 109, 110, 103, 100, 102]);
    boatA.pilot.pathOn([...gs.path], true);
    let boatB = new Vehicle(new Vector2D(320, -50));
    boatB.painter = paintImage(boat1);
    boatB.setProperties(boatProps);
    gs = graph.search([210, 209, 202, 200, 201, 208]);
    boatB.pilot.pathOn([...gs.path], true);


    world.birth([boatA, boatB]);

}


function makePeople(nbr) {
    let ptrBlue = paintPerson(color(200, 200, 255), color(0, 0, 128));
    let ptrRed = paintPerson(color(255, 220, 220), color(192, 0, 0));
    let pilotProps = {
        'wanderDist': 70, 'wanderRadius': 30, 'wanderJitter': 20,
        'feelerLength': 7, 'nbrFeelers': 5, 'detectBoxLength': 40
    };
    let vehicleProps = { 'maxForce': 600, 'maxSpeed': 50 };
    for (let i = 0; i < nbr; i++) {
        let pos = new Vector2D(wx * random(), wy * random());
        let vehicle = new Vehicle(pos, 4.5);
        vehicle.setProperties(vehicleProps);
        vehicle.heading = Vector2D.fromRandom();
        vehicle.painter = ptrBlue;
        let pilot = vehicle.pilot;
        pilot.setProperties(pilotProps);
        pilot.wanderOn().wallAvoidOn(); //.obsAvoidOn();
        // pilot.setWeighting(IDX_OBSTACLE_AVOID, 20)
        pilot.setWeighting(IDX_WANDER, 1)
        world.birth(vehicle);
    }
}


function drawNodes() {
    stroke(0); strokeWeight(0.7); fill(0, 64);
    graph.nodes.forEach(n => {
        ellipse(n.x, n.y, 10, 10);
    });
}

function drawEdges() {
    stroke(0, 32); strokeWeight(1);
    graph.edges.forEach(e => {
        let n0 = graph.node(e.from), n1 = graph.node(e.to);
        line(n0.x, n0.y, n1.x, n1.y);
    })
}

function keyTyped() {
    switch (key) {
        case 'q': world.quadtreeAnalysis(); console.log(world.population.length); break;
        case 'r': master.printForceData(); break;
    }
}