function setup() {
    createCanvas(400, 400, WEBGL);
}

function draw() {
    background(255, 255, 200);
    //translate(width / 4, height / 4);
    noStroke();

    fill(255, 0, 255);
    rect(0, 0, -width / 2, -height / 2);

    // Draw in clipped area
    push();
    // Create torus shaped mask
    beginClip();
    // push();
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    scale(0.5);
    torus(200, 50);
    // pop();
    endClip();

    beginShape(QUAD_STRIP);
    fill(255, 100, 100);
    vertex(-width / 2, -height / 2);
    vertex(width / 2, -height / 2);
    fill(100, 100, 255);
    vertex(-width / 2, height / 2);
    vertex(width / 2, height / 2);
    endShape();
    fill(255, 0, 0);
    rect(0, 0, width / 2, height / 2);
    pop();
    // End of draw in clipped area

    // fill(255, 0, 0);
    // rect(0, 0, width / 2, height / 2);
}