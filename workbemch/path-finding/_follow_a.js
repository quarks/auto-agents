let showDrag = false;
let route, testedEdges;
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
    drawEdges();
    drawTestedEdges();
    drawNodes();
    drawRoute();
    stroke(0, 255, 255); strokeWeight(3);
    if (showDrag) line(startNode.x, startNode.y, endNode.x, endNode.y);
    world.render();
}

function keyTyped() {
    if (key == 'w') walker.printForceData();
    if (key === 'q') console.log(graph.getData().join('\n'));
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

function drawRoute() {
    if (route) {
        stroke(240, 0, 0); strokeWeight(rWt);
        for (let i = 1; i < route.length; i++)
            line(route[i - 1].x, route[i - 1].y, route[i].x, route[i].y);
        stroke(0); strokeWeight(0.7); fill(routeNodeCol);
        route.forEach(n => {
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
