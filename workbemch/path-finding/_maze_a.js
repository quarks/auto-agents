let showDrag = false;
let route, testedEdges;

function preload() {
    maze_data = loadStrings('maze.txt');
}

function setup() {
    console.clear();
    console.log('GLOBAL mode');
    let p5canvas = createCanvas(420, 420);
    p5canvas.parent('sketch');

    cellsize = 20; nodeRad = 5.5;
    cellCol = [color(250), color(0)];
    nodeCol = color(0, 240, 0);

    graph = createMazeGraph(maze_data);
    nodes = graph.nodes;
    edges = graph.edges;

    console.log(`Nbr nodes ${graph.nodes.length}    edges ${graph.edges.length}`)
}

function draw() {
    background(255, 255, 220);
    drawMazeWalls();
    //drawEdges();

    drawTestedEdges();
    drawRoute();
    drawNodes();

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

function mouseDragged() {
    showDrag = true;
    endNode = graph.nearestNode(mouseX, mouseY);
}

function mouseReleased() {
    showDrag = false;
    let gs = new Astar(graph, new AshManhattan());
    gs.search(startNode.id, endNode.id);
    route = gs.route;
    testedEdges = gs.testedEdges;
    route.forEach(n => { console.log(n.toString()) })
}


function drawNodes() {
    noStroke(); fill(nodeCol);
    nodes.forEach(n => {
        ellipse(n.x, n.y, 2 * nodeRad, 2 * nodeRad);
    });
}

function drawEdges() {
    stroke(180, 215, 210); strokeWeight(0.9);
    edges.forEach(e => {
        let n0 = graph.node(e.from), n1 = graph.node(e.to);
        line(n0.x, n0.y, n1.x, n1.y);
    })
}

function drawRoute() {
    stroke(200, 0, 0); strokeWeight(4);
    if (route)
        for (let i = 1; i < route.length; i++) {
            line(route[i - 1].x, route[i - 1].y, route[i].x, route[i].y);
        }
}

function drawTestedEdges() {
    stroke(100, 100, 255); strokeWeight(3);
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

function createMazeGraph(data) {
    let h = data.length, w = data[0].length; walls = [];
    for (let i = 0; i < h; i++) {
        walls.push(new Uint8Array(w));
        for (let j = 0; j < w; j++)
            walls[i][j] = data[i].charAt(j) === ' ' ? 0 : 1;
    }
    let g = new Graph('Maze A'), id = 0;
    for (let i = 0; i < walls.length; i++)
        for (let j = 0; j < walls[i].length; j++) {
            if (walls[i][j] === 0) {
                g.createNode(id, [(j + 0.5) * cellsize, (i + 0.5) * cellsize]);
                g.createEdge(id, id - w, true);
                g.createEdge(id, id - 1, true);
            }
            id++;
        }
    g.compact();
    return g;
}