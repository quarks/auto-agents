offsetX = 20; offsetY = 100;

function preload() {
    pitchImage = loadImage('pitch.png');
}

function setup() {
    // console.clear();
    let p5canvas = createCanvas(640, 600);
    p5canvas.parent('sketch');
    world = new World(600, 300);
    world.domain = new Domain(-10, -10, 610, 600, REBOUND);
    createStates(world);
    teamDetails = initTeamDetails(); // Array of schemes id 0-5 incl

    pitch = new Pitch(pitchImage, world);
    pitch.changeState(pchEndMatch);

}

function createStates(w) {
    pchPreMatch = new PreMatch(w);
    pchEndMatch = new EndMatch(w);
    pchPrepForKickOff = new PrepForKickOff(w);
    pchGlobal = new PitchGlobal(w);
    pchKickOff = new KickOff(w);
    pchGameOn = new GameOn(w);

    plyWait = new Wait(w);
    plyReturnToHomeRegion = new ReturnToHomeRegion(w);
    plyLeavePitch = new LeavePitch(w);
    plyChaseBall = new ChaseBall(w);
}
1
function keyTyped() {
    switch (key) {
        case 'c':
            console.clear();
            break;
        case '9':
            pitch.changeState(pchEndMatch);
            break;
        case '1':
            pitch.changeState(pchPrepForKickOff);
            break;
        case 's':
            console.clear();
            for (let p of pitch.getAllPlayers()) {
                console.log(p.speed);
            }
            console.log('--------------------------------')
            break;

    }
}

function drawClock(x, y, r, ms) {
    let f = ms * 0.001 / MATCH_TIME;
    let m = floor(ms / 60000); ms -= m * 60000;
    let s = (ms / 1000).toFixed(1);
    let time = m.toString().padStart(2, '0') + ':' + s.toString().padStart(4, '0');

    push();
    translate(x, y);

}

function drawDetail(x, y, w, h, d, name) {
    push();
    noStroke(); fill(d.backCol);
    if (d.borderWeight > 0) {
        stroke(d.borderCol);
        strokeWeight(d.borderWeight);
    }
    rect(x, y, w, h);
    textAlign(d.halign, d.valign); textSize(d.textSize);
    fill(d.textCol);
    text(name, x + d.hinset, y + d.vinset, w - 2 * d.hinset, h - 2 * d.vinset);
    pop();
}

function draw() {
    world.update(deltaTime / 1000);
    background(color('lightgreen'));

    push();
    translate(offsetX, 0);
    let dtl = {
        backCol: color('bisque'), textCol: color('darkslategrey'),
        borderCol: color('darkslategrey'), borderWeight: 1,
        textSize: 22, halign: LEFT, valign: CENTER,
        hinset: 10, vinset: 0
    }
    drawDetail(0, 20, 220, 40, dtl, pitch.teamName[0]);
    dtl.halign = RIGHT;
    drawDetail(380, 20, 220, 40, dtl, pitch.teamName[1]);
    dtl.backCol = color('aliceblue'); dtl.textSize = 20;
    dtl.halign = CENTER; dtl.hinset = 0;
    drawDetail(220 - 35, 25, 30, 30, dtl, pitch.score[0]);
    drawDetail(385, 25, 30, 30, dtl, pitch.score[1]);


    // // arc(300, 60, 240, 100, PI, TAU, CHORD)
    // ellipse(300, 40, 170, 60);
    // rect(0, 20, 240, 40); rect(360, 20, 240, 40);
    // stroke(color('burlywood')); strokeWeight(1); fill(color('aliceblue'));
    // rect(204, 25, 30, 30); rect(366, 25, 30, 30);


    // line(220, offsetY + 320, 380, offsetY + 320);
    // noStroke(); fill(color('darkslategrey')); textSize(24);
    // textAlign(LEFT, CENTER); text(pitch.teamName[0], 10, 20, 260, 40);
    // textAlign(RIGHT, CENTER); text(pitch.teamName[1], 330, 20, 260, 40);
    // textAlign(CENTER, CENTER); textSize(18);
    // text(pitch.score[0], 204, 27, 30, 30); text(pitch.score[1], 366, 27, 30, 30);
    // textSize(18); text(clockTime(pitch.clock), 200, 50, 200);

    textAlign(LEFT, TOP); textSize(20); fill(0);
    text(pitch.fsm.currentState.name, 0, height - 100, width, 50);
    pop();

    push();
    translate(offsetX, offsetY);
    beginClip();
    rect(-10, -10, PITCH_LENGTH + 20, PITCH_WIDTH + 30);
    endClip();
    world.render();
    pop();

}

function clockTime(ms) {
    let m = floor(ms / 60000); ms -= m * 60000;
    let s = (ms / 1000).toFixed(1);
    return m.toString().padStart(2, '0') + ':' + s.toString().padStart(4, '0');
}