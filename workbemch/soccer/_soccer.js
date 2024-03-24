offsetX = 20; offsetY = 60;

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
    teamColors = initTeamColors(); // Array of schemes id 0-5 incl

    pitch = new Pitch(pitchImage, world);

    //world.update(0);
    for (let p of pitch.getAllPlayers())
        p.changeState(plyLeavePitch);
}

function createStates(w) {
    preMatch = new PreMatch(w);
    endMatch = new EndMatch(w);
    plyWait = new Wait(w);
    pchGlobal = new PitchGlobal(w);
    plyReturnToHomeRegion = new ReturnToHomeRegion(w);
    plyLeavePitch = new LeavePitch(w);
}
1
function keyTyped() {
    switch (key) {
        case '0':
            pitch.counter = 0; 1
            for (let p of pitch.changeTeamColors()) {
                p.changeState(plyLeavePitch);
            }
            break;
        case '1':
            pitch.counter = 0;
            for (let p of pitch.getAllPlayers()) {
                p.changeState(plyReturnToHomeRegion);
            }
            break;
        case 'a':
            //console.log('Team mode > ATTACKING');
            pitch.team[0].setTeamMode(ATTACKING);
            pitch.team[1].setTeamMode(ATTACKING);
            break;
        case 'd':
            //console.log('Team mode > DEFENDING');
            pitch.team[0].setTeamMode(DEFENDING);
            pitch.team[1].setTeamMode(DEFENDING);
            break;
        case 'n':
            pitch.changeTeamColors();
            break;
        case 'e':
            pitch.changeState(endMatch);
            break;
    }
}

function draw() {
    world.update(deltaTime / 1000);
    background(80, 180, 80);
    translate(offsetX, offsetY);
    world.render();
}
