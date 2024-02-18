let cellsize = 20, nodeRad = cellsize * 0.275;
let rWt = cellsize * 0.15, eWt = cellsize * 0.025, eeWt = rWt * 0.85;
let w, h, walls = [];


let walkerA;
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
    // Create walker
    walkerA = new Vehicle({ x: 15, y: 15 }, 8, world);
    walkerA.painter = mvrArrowOffset(color(200, 200, 255), color(20, 20, 160), 0.5);
    walkerA.maxSpeed = 60;
    world.birth(walkerA);
    walkerB = new Vehicle({ x: 15, y: 15 }, 8, world);
    walkerB.painter = mvrArrowOffset(color(200, 200, 255), color(20, 20, 160), 0.5);
    walkerB.maxSpeed = 60;
    world.birth(walkerB);
    // #######  Make Maze Data  ##############
    graph = createGraph(node_data, edge_data);
    nodes = graph.nodes;
    edges = graph.edges;
    // Create paths
    gsa = graph.search([1, 10, 5, 32, 29, 6], ASTAR, EUCLIDEAN);
    nodePathA = [...gsa.path];
    gsb = graph.search([6, 17, 29, 32, 5, 10, 1], ASTAR, EUCLIDEAN);
    nodePathB = [...gsb.path];
    psd = 10;
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
            path = nodePathA;
            walkerA.pilot.pathOff();
            walkerA.pos.set([0, 0]);
            walkerA.pilot.pathOn(nodePathA, cyclic);
            walkerA.pilot.pathSeekDist = psd;
            walkerB.pilot.pathOff();
            walkerB.pos.set([0, 0]);
            walkerB.pilot.pathOn(nodePathB, cyclic);
            walkerB.pilot.pathSeekDist = psd;
            console.log(`(1)  Node path:     Cyclic: ${cyclic}`)
            break;
        case '2':
            cyclic = true;
            path = nodePathA;
            walkerA.pilot.pathOff();
            walkerA.pos.set(nodePathA[0]);
            walkerA.pilot.pathOn(path, cyclic);
            walkerA.pilot.pathSeekDist = psd;
            console.log(`(2)  Node path:     Cyclic: ${cyclic}`)
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
