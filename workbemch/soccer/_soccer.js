offsetX = 20; offsetY = 60;

function preload() {
    pitchImage = loadImage('pitch.png');
}

function setup() {
    // console.clear();
    let p5canvas = createCanvas(640, 600);
    p5canvas.parent('sketch');
    world = new World(600, 300);
    teamColor = initTeamColors(); // Array of schemes id 0-5 incl
    pitch = new Pitch(pitchImage, world);
}

function keyTyped() {
    switch (key) {
        case 'p':
            for (let p of pitch.getAllPlayers()) {
                p.pos = p.offPitchPos;
                p.headingAtRest = p.offPitchHeading;
            }
            break;
        case 'd':
            for (let p of pitch.getAllPlayers()) {
                p.pos = p.regionPos[0];
                p.headingAtRest = pitch.goal[p.team.side].norm;
            }
            break;
        case 'a':
            for (let p of pitch.getAllPlayers()) {
                p.pos = p.regionPos[1];
                p.headingAtRest = pitch.goal[p.team.side].norm;
            }
            break;
    }
}


function draw() {
    world.update(deltaTime / 1000);
    background(80, 180, 80);
    translate(offsetX, offsetY);
    world.render();
}
