let cellsize = 20, nodeRad = cellsize * 0.275;
let rWt = cellsize * 0.15, eWt = cellsize * 0.025, eeWt = rWt * 0.85;
let w, h, walls = [];

let cyclic;

let nodePath, vectorPath, path;

function preload() {
    maze_data = loadStrings('maze_3.txt');
    node_data = loadStrings('fa_nodes.txt');
    edge_data = loadStrings('fa_edges.txt');
}

function setup() {
    let h = maze_data.length, w = maze_data[0].length;
    let p5canvas = createCanvas(w * cellsize, h * cellsize);
    p5canvas.parent('sketch');
    // World
    world = new World(w * cellsize, h * cellsize);
    cellCol = [color(255, 255, 220), color(0)];
    nodeCol = color(220);
    routeNodeCol = color(240, 0, 0);
    // Make maze image
    backImage = createMazeWallImage(maze_data, cellsize, cellCol);
    // Create walkers
    walkerA = new Vehicle({ x: 15, y: 15 }, 8, world);
    walkerA.painter = vcePerson(color(200, 200, 255), color(20, 20, 160));
    walkerA.maxSpeed = 60;
    world.birth(walkerA);
    // #######  Make Maze Data  ##############
    graph = createGraph(node_data, edge_data);
    nodes = graph.nodes;
    edges = graph.edges;
    // Create paths
    gs = graph.search([1, 10, 5, 32, 29, 6], ASTAR, EUCLIDEAN);
    nodePath = [...gs.path];
    vectorPath = [new Vector2D(90, 130), new Vector2D(270, 210), new Vector2D(50, 370), new Vector2D(50, 270), new Vector2D(130, 190)];
    psd = 15;
    path = undefined;
}

function draw() {
    world.update(deltaTime / 1000);
    background(200);
    image(backImage, 0, 0);
    //drawEdges();
    // drawTestedEdges();
    drawNodes();
    drawRoute(path, cyclic);
    world.render();
    if (walkerA.pilot.isPathOn) {
        //console.log(walker.pilot.pathEdge?.toString());
        // console.log(walker.pilot.pathNode?.toString());
    }
}

function keyTyped() {
    switch (key) {
        case 'w': walkerA.printForceData(); break;
        case 'd': console.log(graph.getData().join('\n')); break;
        case '1':
            cyclic = true;
            walkerA.pilot.pathOff();
            walkerA.pos.set([0, 0]);
            path = nodePath;
            walkerA.pilot.pathOn(path, cyclic);
            walkerA.pilot.pathSeekDist = psd;
            console.log(`(1)  Node path:     Cyclic: ${cyclic}`)
            break;
        case '2':
            cyclic = true;
            walkerA.pilot.pathOff();
            walkerA.pos.set([50, 10]);
            path = nodePath;
            walkerA.pilot.pathOn(path, cyclic);
            walkerA.pilot.pathSeekDist = psd;
            console.log(`(2)  Node path:     Cyclic: ${cyclic}`)
            break;
        case '3':
            cyclic = false;
            walkerA.pilot.pathOff();
            walkerA.pos.set([0, 0]);
            path = [...nodePath];
            walkerA.pilot.pathOn(path, cyclic);
            walkerA.pilot.pathSeekDist = psd;
            console.log(`(3)  Node path:     Cyclic: ${cyclic}`)
            break;
        case '4':
            cyclic = false;
            walkerA.pilot.pathOff();
            walkerA.pos.set([50, 10]);
            path = nodePath;
            walkerA.pilot.pathOn(path, cyclic);
            walkerA.pilot.pathSeekDist = psd;
            console.log(`(4)  Node path:     Cyclic: ${cyclic}`)
            break;

        case '5':
            cyclic = true;
            walkerA.pilot.pathOff();
            walkerA.pos.set([0, 0]);
            path = vectorPath;
            walkerA.pilot.pathOn(path, cyclic);
            walkerA.pilot.pathSeekDist = psd;
            console.log(`(5)  Vector path:     Cyclic: ${cyclic}`)
            break;
        case '6':
            cyclic = true;
            walkerA.pilot.pathOff();
            walkerA.pos.set(vectorPath[0]);
            path = vectorPath;
            walkerA.pilot.pathOn(path, cyclic);
            walkerA.pilot.pathSeekDist = psd;
            console.log(`(6)  Vector path:     Cyclic: ${cyclic}`)
            break;
        case '7':
            cyclic = false;
            walkerA.pilot.pathOff();
            walkerA.pos.set([0, 0]);
            path = vectorPath;
            walkerA.pilot.pathOn(path, cyclic);
            walkerA.pilot.pathSeekDist = psd;
            console.log(`(7)  Vector path:     Cyclic: ${cyclic}`)
            break;
        case '8':
            cyclic = false;
            walkerA.pilot.pathOff();
            walkerA.pos.set(vectorPath[0]);
            path = vectorPath;
            walkerA.pilot.pathOn(path, cyclic);
            walkerA.pilot.pathSeekDist = psd;
            console.log(`(8)  Vector path:     Cyclic: ${cyclic}`)
            break;

    }
}

function mouseMoved() {
    let n = graph.nearestNode(mouseX, mouseY);
    // console.log(n.id);
}

function mousePressed() {
    startNode = graph.nearestNode(mouseX, mouseY);
    endNode = startNode;
}

function drawRoute(p2d, cyclic) {
    if (p2d) {
        stroke(240, 0, 0); strokeWeight(rWt);
        let nbrEdges = cyclic ? p2d.length : p2d.length - 1;
        for (let i = 0; i < nbrEdges; i++) {
            let ni = (i + 1) % p2d.length;
            line(p2d[i].x, p2d[i].y, p2d[ni].x, p2d[ni].y);
        }
        stroke(0); strokeWeight(0.7); fill(routeNodeCol);
        p2d.forEach(n => {
            ellipse(n.x, n.y, 2 * nodeRad, 2 * nodeRad);
        });
    }
}

function drawNodes() {
    stroke(0); strokeWeight(0.7); fill(nodeCol);
    nodes.forEach(n => {
        ellipse(n.x, n.y, 2 * nodeRad, 2 * nodeRad);
    });
}

function drawTestedEdges() {
    stroke(140, 140, 240); strokeWeight(eeWt);
    testedEdges?.forEach(e => {
        let n0 = graph.node(e.from), n1 = graph.node(e.to);
        line(n0.x, n0.y, n1.x, n1.y);
    })
}

function drawEdges() {
    stroke(0, 32); strokeWeight(eWt);
    edges.forEach(e => {
        let n0 = graph.node(e.from), n1 = graph.node(e.to);
        line(n0.x, n0.y, n1.x, n1.y);
    })
}

function createGraph(n_data, e_data) {
    let g = new Graph('Maze A');
    n_data.forEach(d => {
        let n = d.split(' ').map(v => Number(v));
        g.createNode(n[0], [(n[1] + 0.5) * cellsize, (n[2] + 0.5) * cellsize]);
    });
    e_data.forEach(d => {
        let n = d.split(' ').map(v => Number(v));
        let n0 = n.shift();
        n.forEach(n1 =>
            g.createEdge(n0, n1));
    });
    g.compact();
    return g;
}
