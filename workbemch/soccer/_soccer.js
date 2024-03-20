offsetX = 20; offsetY = 60;

function preload() {
    grass = loadImage('grass.jpg');
}

function setup() {
    // console.clear();
    let p5canvas = createCanvas(640, 450);
    p5canvas.parent('sketch');
    pitchImage = createPitchImage();
    world = new World(600, 300);

}

function draw() {
    world.update(deltaTime / 1000);
    background(80, 180, 80);
    image(pitchImage, 0, 0);

}

function createPitchImage() {
    let pg = createGraphics(width, height);
    let lineCol = 'white';
    pg.clear();
    pg.push();
    pg.translate(offsetX, offsetY);
    pg.image(grass, 0, 0);
    pg.noFill(); pg.stroke(color(lineCol)); pg.strokeWeight(3);
    // Pitch border
    pg.rect(0, 0, PITCH_LENGTH, PITCH_WIDTH);
    // Keeper boxes
    let y0 = (PITCH_WIDTH - 130) / 2, y1 = (PITCH_WIDTH + 130) / 2, d = 50;
    pg.rect(0, y0, d, y1 - y0); pg.rect(PITCH_LENGTH - d, y0, d, y1 - y0);
    // Centre circle
    pg.line(PITCH_LENGTH / 2, 0, PITCH_LENGTH / 2, PITCH_WIDTH);
    pg.ellipse(PITCH_LENGTH / 2, PITCH_WIDTH / 2, 160, 160);
    pg.fill(color(lineCol));
    pg.ellipse(PITCH_LENGTH / 2, PITCH_WIDTH / 2, 5, 5);
    // Goals
    let netDepth = 14;
    pg.fill('darkgrey'); pg.stroke(color('lightgrey')); pg.strokeWeight(3);
    pg.rect(-netDepth, GOAL_LOW_Y, netDepth, GOAL_HIGH_Y - GOAL_LOW_Y, 6, 0, 0, 6);
    pg.rect(PITCH_LENGTH, GOAL_LOW_Y, netDepth, GOAL_HIGH_Y - GOAL_LOW_Y, 0, 6, 6, 0);
    pg.pop();
    return pg;
}