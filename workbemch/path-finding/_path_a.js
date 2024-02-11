function setup() {
    console.clear();
    console.log('GLOBAL mode');
    let p5canvas = createCanvas(400, 400);
    p5canvas.parent('sketch');

    graph = new Graph('My graph');
    testData1();
}

function draw() {
    background(255, 255, 200);
    drawGraph(graph);
}

function drawGraph(graph) {
    push();
    textSize(10); textAlign(LEFT, CENTER);
    for (let n of graph.nodes.values()) {
        for (let e of n.edges.values()) {
            push();
            fill(0, 48); stroke(0, 48); strokeWeight(1.2);
            let fromNode = graph.node(e.from), toNode = graph.node(e.to);
            let dx = toNode.x - fromNode.x, dy = toNode.y - fromNode.y;
            let len = Math.sqrt(dx * dx + dy * dy), ahead = 0.65 * len;
            let angle = Math.atan2(dy, dx);
            translate(fromNode.x, fromNode.y); rotate(angle);
            line(0, 0, len, 0);
            noStroke();
            triangle(ahead, 0, ahead - 10, 0, ahead - 10, 6);
            fill(0);
            translate(ahead - 14, 8);
            text(e.cost, 0, 0, 40, 12);
            pop();
        }
    }
    for (let n of graph.nodes.values()) {
        noStroke(), fill(255, 100, 100);
        ellipse(n.x, n.y, 10, 10);
    }
    pop();
}

function keyTyped() {
    if (key === 'q') console.log(graph.getData().join('\n'));
    if (key === 'c') graph.compact();
    if (key === 'e') graph.removeEdge(2, 4, true);
    if (key === 'n') graph.removeNode(4);
}

function testData1() {
    graph.createNode(1, [325, 325], 'London');
    graph.createNode(2, [250, 225], 'Leeds');
    graph.createNode(3, [325, 75], 'Newcastle');
    graph.createNode(4, [125, 240], 'Manchester');
    graph.createNode(5, [105, 305], 'Birmingham');
    graph.createNode(6, [75, 25], 'Glasgow');

    graph.createEdge(1, 2, true, [130, 0], 'M1');
    graph.createEdge(2, 3, true, [100, 99], 'A1');
    graph.createEdge(2, 4, true, [62], 'M62');
    graph.createEdge(4, 5, true, [88], 'M6');
    graph.createEdge(4, 6, true, [220], 'M6');
}