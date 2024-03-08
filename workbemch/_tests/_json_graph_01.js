let wx = 400, wy = 400, depth = 4;

function preload() {
    graphData = loadStrings('graph_data_01.txt');
}

function setup() {
    console.clear();
    let p5canvas = createCanvas(640, 440);
    p5canvas.parent('sketch');
    world = new World(wx, wy, depth);
    world.domain.constraint = WRAP;
    graph = new Graph();
    makeGraph(graphData);
    // Get graph search result
    gs = graph.search([1, 3, 6, 9, 11, 10, 5, 4, 0]);
    // Create walker
    walkerA = new Vehicle({ x: 140, y: 70 }, 8, world);
    walkerA.domain = world.domain.copy().setConstraint(PASS_THROUGH);
    walkerA.painter = paintPerson(color(200, 200, 255), color(20, 20, 160));
    walkerA.maxSpeed = 30;
    world.birth(walkerA);
    walkerA.pilot.pathOn([...gs.path], false);
}

function draw() {
    world.update(deltaTime / 1000);
    let wd = world.domain;
    background(240, 190, 240);
    translate(100, 20);
    push();
    beginClip();
    rect(wd.lowX, wd.lowY, wd.width, wd.height);
    endClip();
    // World background
    noStroke(); fill(255, 240, 255); rect(wd.lowX, wd.lowY, wd.width, wd.height);
    world.render();
    drawEdges();
    drawNodes();
    renderTreeGrid();
    pop();
    if (walkerA.pilot.isPathOn) {
        console.log(`Node ${walkerA.pilot.currNode?.name}   Edge ${walkerA.pilot.currEdge?.name}   ( Next edge ${walkerA.pilot.nextEdge?.name} )`)
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

function makeGraph(filedata) {
    let obj = graphFromJSON(filedata);
    obj.NODES.forEach(node => graph.addNode(node));
    obj.EDGES.forEach(edge => graph.addEdge(edge));
    graph.compact();
}

function keyTyped() {
    switch (key) {
        case 'q': world.quadtreeAnalysis(); break;
        case 'r': master.printForceData(); break;
        case '1': walkerA.pilot.pathOn([...path], true); break;
    }
}

// function makeScene(filedata) {
//     let obj = sceneFromJSON(filedata);
//     obj.FENCES?.forEach(fence => {
//         fence.painter = paintFencedArea(color(0, 255, 0));
//         fence.walls.forEach(w => w.painter = paintWall(color(200, 200, 255), 4));
//         world.birth(fence);
//     });
//     obj.OBSTACLES?.forEach(obstacle => {
//         obstacle.painter = paintEntity(color(0, 255, 0), color(0, 0, 200));
//         world.birth(obstacle);
//     });
//     obj.WALLS?.forEach(wall => {
//         wall.painter = paintWall(color(200, 200, 255), 4);
//         world.birth(wall);
//     });
// }

// function makePeople(nbr) {
//     let ptrBlue = paintPerson(color(200, 200, 255), color(0, 0, 128));
//     let ptrRed = paintPerson(color(255, 220, 220), color(192, 0, 0));
//     let pilotProps = {
//         'wanderDist': 70, 'wanderRadius': 30, 'wanderJitter': 20, 'feelerLength': 12, 'nbrFeelers': 5,
//         'detectBoxLength': 40
//     };
//     let vehicleProps = { 'maxForce': 600, 'maxSpeed': 50 };
//     for (let i = 0; i < nbr; i++) {
//         let pos = new Vector2D(wx * random(), wy * random());
//         let vehicle = new Vehicle(pos, 6);
//         vehicle.setProperties(vehicleProps);
//         vehicle.heading = Vector2D.fromRandom();
//         vehicle.painter = ptrBlue;
//         let pilot = vehicle.pilot;
//         pilot.setProperties(pilotProps);
//         pilot.wanderOn().wallAvoidOn().obsAvoidOn();
//         pilot.setWeighting(IDX_OBSTACLE_AVOID, 20)
//         pilot.setWeighting(IDX_WANDER, 1)
//         world.birth(vehicle);
//         // For testing purposes
//         if (i == 0) {
//             vehicle.painter = ptrRed;
//             vehicle.forceRecorderOn();
//             master = vehicle;
//         }
//     }
// }

