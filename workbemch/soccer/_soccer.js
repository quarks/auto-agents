offsetX = 20; offsetY = 100;

function preload() {
    pitchImage = loadImage('pitch.png');
    prefsdata = loadStrings('prefs.txt');
}

function setup() {
    // console.clear();
    let p5canvas = createCanvas(640, 600);
    p5canvas.parent('sketch');
    PREF.readPreferences(prefsdata);
    console.log($('AutoRepeat'));
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

function keyTyped() {
    switch (key) {
        case 'q':
            if (!$('AutoRepeat' && pitch.fsm.currentState == pchPreMatch)) {
                world.dispatcher.postTelegram(1, pitch, pitch, PREPARE_FOR_KICKOFF);
            }
            break;
        case 'c':
            console.clear();
            break;
        case '9':
            pitch.changeState(pchEndMatch);
            break;
        case '1':
            pitch.changeState(pchPrepForKickOff);
            break;

    }
}


function draw() {
    world.update(deltaTime / 1000);
    background(color('lightgreen'));

    push();
    translate(offsetX, 0);
    drawScoreBoard(pitch.clock);

    textAlign(LEFT, TOP); textSize(20); fill(0);
    text(pitch.fsm.currentState.name, 0, height - 100, width, 50);
    pop();

    push();
    translate(offsetX, offsetY);
    // beginClip();
    // rect(-10, -10, PITCH_LENGTH + 20, PITCH_WIDTH + 30);
    // endClip();
    world.render();
    pop();

}

function $(name) {
    return PREF.prefs.get(name);
}

class PREF {

    static readPreferences(jsonString) {
        let s = Array.isArray(jsonString) ? jsonString.join('\n') : jsonString;
        let obj = JSON.parse(s);
        PREF.prefs = new Map();
        obj.OPTIONS.forEach(d => { PREF.prefs.set(d.name, d.value) });
    }

}

