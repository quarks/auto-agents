let showDrag = false;
let route, testedEdges;
let cellsize = 20, nodeRad = cellsize * 0.275;
let routeWeight = cellsize * 0.2, edgeWeight = 0.9;
let w, h, walls = [];

let walker;

function preload() {
    maze_data = loadStrings('maze_3.txt');
    node_data = loadStrings('fa_nodes.txt');
    edge_data = loadStrings('fa_edges.txt');
}

function setup() {
    h = maze_data.length, w = maze_data[0].length;
    console.clear();
    console.log('GLOBAL mode');
    let p5canvas = createCanvas(w * cellsize, h * cellsize);
    p5canvas.parent('sketch');
    // World
    world = new World(w * cellsize, h * cellsize);
    cellCol = [color(255, 255, 220), color(0)];
    nodeCol = color(200);
    routeNodeCol = color(240, 0, 0);
    // Create walker
    walker = new Vehicle({ x: 15, y: 15 }, 10, world);
    ppBlue = vcePerson(color(200, 200, 255), color(20, 20, 160));
    walker.painter = ppBlue;
    walker.maxSpeed = 40;
    walker.forceRecorderOn();
    world.birth(walker);
    // #######  Make Maze Data  ##############
    walls = createMazeWalls(maze_data);
    graph = createGraph(node_data, edge_data);
    nodes = graph.nodes;
    edges = graph.edges;
}

function draw() {
    world.update(deltaTime / 1000);
    background(200);
    drawMazeWalls();
    //drawEdges();
    //drawTestedEdges();
    drawNodes();
    drawRoute();
    stroke(0, 255, 255); strokeWeight(3);
    if (showDrag)
        line(startNode.x, startNode.y, endNode.x, endNode.y);
    world.render();
}



function keyTyped() {
    if (key == 'w') walker.printForceData();
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
    // let n = graph.nearestNode(mouseX, mouseY);
    // console.log(n.id);
}

function mouseDragged() {
    showDrag = true;
    endNode = graph.nearestNode(mouseX, mouseY);
}

function mouseReleased() {
    showDrag = false;
    let gs = new Astar(graph);
    gs.search(startNode.id, endNode.id);
    route = [...gs.route];
    walker.setPos(new Vector2D(gs.route[0].x, gs.route[0].y));
    gs.route.shift();
    walker.pilot.pathOn(gs.route);
    testedEdges = gs.testedEdges;
    console.log(`Route length ${route.length}   Nbr edges tested ${testedEdges.length}`);
}


function drawNodes() {
    noStroke(); fill(nodeCol);
    nodes.forEach(n => {
        ellipse(n.x, n.y, 2 * nodeRad, 2 * nodeRad);
    });
}


function drawRoute() {
    if (route) {
        stroke(240, 0, 0); strokeWeight(routeWeight);
        for (let i = 1; i < route.length; i++)
            line(route[i - 1].x, route[i - 1].y, route[i].x, route[i].y);
        noStroke(); fill(routeNodeCol);
        route.forEach(n => {
            ellipse(n.x, n.y, 2 * nodeRad, 2 * nodeRad);
        });
    }
}

function drawEdges() {
    stroke(180, 215, 210); strokeWeight(edgeWeight);
    edges.forEach(e => {
        let n0 = graph.node(e.from), n1 = graph.node(e.to);
        line(n0.x, n0.y, n1.x, n1.y);
    })
}


function drawTestedEdges() {
    stroke(10); strokeWeight(edgeWeight);
    testedEdges?.forEach(e => {
        let n0 = graph.node(e.from), n1 = graph.node(e.to);
        line(n0.x, n0.y, n1.x, n1.y);
    })
}
function drawMazeWalls() {
    noStroke();
    for (let i = 0; i < walls.length; i++)
        for (j = 0; j < walls[i].length; j++) {
            fill(cellCol[walls[i][j]]);
            rect(j * cellsize, i * cellsize, cellsize, cellsize);
        }
}

function createMazeWalls(data) {
    let walls = [];
    console.log(`Maze size: ${w} x ${h}`);
    for (let i = 0; i < h; i++) {
        walls.push(new Uint8Array(w));
        for (let j = 0; j < w; j++)
            walls[i][j] = data[i].charAt(j) === ' ' ? 0 : 1;
    }
    return walls;
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