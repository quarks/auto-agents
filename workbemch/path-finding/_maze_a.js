let raw_data = [];
let diags = [false, true, true, true];
let mn = 1;
let showDrag = false;
let path, testedEdges;
let cellsize = 20, nodeRad = cellsize * 0.2;
let rWt = cellsize * 0.2, eWt = cellsize * 0.025, eeWt = rWt * 0.85;
let gs;

function preload() {
    raw_data[0] = loadStrings('maze_0.txt');
    raw_data[1] = loadStrings('maze_1.txt');
    raw_data[2] = loadStrings('maze_2.txt');
    raw_data[3] = loadStrings('maze_3.txt');
}

function setup() {
    console.clear();
    console.log('GLOBAL mode');
    console.log(`Maze No.  ${mn}`);
    maze_data = raw_data[mn];
    useDiags = diags[mn];
    cellCol = [color(255, 255, 220), color(0)];
    backImage = createMazeWallImage(maze_data, cellsize, cellCol);
    let h = maze_data.length, w = maze_data[0].length;
    let p5canvas = createCanvas(w * cellsize, h * cellsize);
    p5canvas.parent('sketch');
    cellCol = [color(250), color(0)];
    nodeCol = color(200);
    routeNodeCol = color(240, 0, 0);
    // #######  Make Maze Data  ##############
    graph = createMazeGraph(maze_data, useDiags);
    nodes = graph.nodes;
    edges = graph.edges;
    console.log(`Graph: nbr nodes ${graph.nodes.length}    edges ${graph.edges.length}`);
}

function draw() {
    background(255, 255, 220);
    image(backImage, 0, 0);
    //drawEdges();
    drawTestedEdges();
    drawNodes();
    drawRoute();
    stroke(0, 255, 255); strokeWeight(3);
    if (showDrag)
        line(startNode.x, startNode.y, endNode.x, endNode.y);
}

function keyTyped() {
    if (key === 'q') console.log(graph.getData().join('\n'));
    if (key === 's') {
        let searcher = new Search_DFS(graph);
        searcher.search(27, 83);
        searcher.route.forEach(n => { console.log(n.toString()) })
        //console.log(searcher.route);
    }
}

function mousePressed() {
    startNode = graph.nearestNode(mouseX, mouseY);
    endNode = startNode;
}

function mouseMoved() {
    let n = graph.nearestNode(mouseX, mouseY);
    // console.log(n.id);
}

function mouseDragged() {
    showDrag = true;
    endNode = graph.nearestNode(mouseX, mouseY);
}

function mouseReleased() {
    showDrag = false;
    console.log(`Route from ${startNode.id}  to  ${endNode.id}`)
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
    gs = graph.search([startNode.id, endNode.id], algorithm, heuristic, 0.6);
    // gs = graph.search([243, 965, 197, 985], algorithm, heuristic);
    path = gs.path;
    testedEdges = gs.testedEdges;
    console.log(`Path length ${path.length}   Nbr edges tested ${testedEdges.length}`);
}

function drawRoute() {
    if (path) {
        stroke(240, 0, 0); strokeWeight(rWt);
        for (let i = 1; i < path.length; i++)
            line(path[i - 1].x, path[i - 1].y, path[i].x, path[i].y);
        stroke(0); strokeWeight(0.7); fill(routeNodeCol);
        path.forEach(n => {
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

function createMazeGraph(data, diags) {
    let h = maze_data.length, w = maze_data[0].length;
    let walls = [];
    for (let i = 0; i < h; i++) {
        walls.push(new Uint8Array(w));
        for (let j = 0; j < w; j++)
            walls[i][j] = data[i].charAt(j) === ' ' ? 0 : 1;
    }
    let g = new Graph('Maze A'), id = 0;
    for (let i = 0; i < walls.length; i++) {
        for (let j = 0; j < walls[i].length; j++) {
            if (walls[i][j] === 0) {
                g.createNode(id, [(j + 0.5) * cellsize, (i + 0.5) * cellsize]);
                g.createEdge(id, id - 2 * w, true);
                g.createEdge(id, id - 1, true);
                if (diags) {
                    g.createEdge(id, id - 2 * w - 1, true);
                    g.createEdge(id, id - 2 * w + 1, true);
                }
            }
            id++;
        }
        id += w; // Avoid wrap
    }
    g.compact();
    return g;
}