let showDrag = false;
let pathToFollow = [], pathToDraw = [], testedEdges = [];
let cellsize = 20, nodeRad = cellsize * 0.275;
let rWt = cellsize * 0.2, eWt = cellsize * 0.025, eeWt = rWt * 0.85;
let w, h, walls = [];
let walker;

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
    // Create walker
    walker = new Vehicle({ x: 15, y: 15 }, 10, world);
    walker.painter = vcePerson(color(200, 200, 255), color(20, 20, 160));
    walker.maxSpeed = 40;
    world.birth(walker);
    // #######  Make Maze Data  ##############
    graph = createGraph(node_data, edge_data);
    nodes = graph.nodes;
    edges = graph.edges;
    // Make maze image
    backImage = createMazeWallImage(maze_data, cellsize, cellCol);
}

function draw() {
    world.update(deltaTime / 1000);
    background(200);
    image(backImage, 0, 0);
    //drawEdges();
    drawTestedEdges();
    drawNodes();
    drawRoute(pathToDraw);
    stroke(0, 255, 255); strokeWeight(3);
    if (showDrag) line(startNode.x, startNode.y, endNode.x, endNode.y);
    world.render();
    if (walker.pilot.isPathOn) {
        console.log(walker.pilot.pathEdge?.toString());
        // console.log(walker.pilot.pathNode?.toString());
    }
}

function keyTyped() {
    if (key == 'w') walker.printForceData();
    if (key === 'q') console.log(graph.getData().join('\n'));
}

function mouseMoved() {
    // let n = graph.nearestNode(mouseX, mouseY);
    // console.log(n.id);
}

function mousePressed() {
    startNode = graph.nearestNode(mouseX, mouseY);
    endNode = startNode;
}

function mouseDragged() {
    showDrag = true;
    endNode = graph.nearestNode(mouseX, mouseY);
}

function mouseReleased() {
    console.clear();
    showDrag = false;
    let heuristicID = 0;
    let algorithmID = 0;
    switch (heuristicID) {
        case 1: heuristic = MANHATTAN; break;
        default: heuristic = EUCLIDEAN; break;
    }
    switch (algorithmID) {
        case 3: algorithm = DFS; break;
        case 2: algorithm = BFS; break;
        case 1: algorithm = DIJKSTRA; break;
        default:
            algorithm = ASTAR;
    }
    gs = graph.search([startNode.id, endNode.id], algorithm, heuristic);
    pathToDraw = [...gs.path];
    if (pathToDraw.length > 0) {
        pathToFollow = [...gs.path];
        walker.setPos(new Vector2D(pathToFollow[0].x, pathToFollow[0].y));
        pathToFollow.shift();
        walker.pilot.pathOn(pathToFollow, gs.edges);
        testedEdges = gs.testedEdges;
    }
    console.log(`Path length ${pathToDraw.length}   Nbr edges tested ${testedEdges.length}`);
}

function drawRoute(p2d) {
    if (p2d) {
        stroke(240, 0, 0); strokeWeight(rWt);
        for (let i = 1; i < p2d.length; i++)
            line(p2d[i - 1].x, p2d[i - 1].y, p2d[i].x, p2d[i].y);
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
