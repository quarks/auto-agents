let offsetX = 20; let offsetY = 100;

let world = undefined;
let pitch = undefined;
let dispatcher = undefined;
let ball = undefined;
let team = [];
let goal = [];
let teamInfo = [];
let teamsAvailable = [];
let score = [0, 0];

function preload() {
    pitchImage = loadImage('pitch.png');
    prefsdata = loadStrings('prefs.txt');
}

function setup() {
    console.clear();
    let p5canvas = createCanvas(640, 600);
    p5canvas.parent('sketch');
    PREF.readPreferences(prefsdata);
    createWorld();
    createStates();
    createSoccerElements();
    world.update(0);
    pitch.changeState(pchEndMatch);
}

function changeTeams() {
    if (!teamsAvailable || teamsAvailable.length <= 1)
        teamsAvailable = shuffle([0, 1, 2, 3, 4, 5]);
    team[0].scheme = teamInfo[teamsAvailable.pop()];
    team[1].scheme = teamInfo[teamsAvailable.pop()];

}

function createSoccerElements() {
    teamInfo = initTeamInfo(); // Name and colour of strip
    pitch = new Pitch(pitchImage, world);
    ball = new Ball(this).setDomain(pitch.domain).enableFsm(world).born(world);
    goal.push(
        new Goal(LHS).enableFsm(world).born(world),
        new Goal(RHS).enableFsm(world).born(world));
    team.push(
        new Team(LHS, [1, 3, 5, 6, 8], [1, 4, 8, 12, 14], world).enableFsm(world).born(world),
        new Team(RHS, [16, 12, 14, 9, 11], [16, 13, 9, 3, 5], world).enableFsm(world).born(world),
    );
}


function createWorld() {
    world = new World(600, 300);
    world.domain = new Domain(-10, -10, 610, 400, REBOUND);
    dispatcher = world.dispatcher;
}

function createStates() {
    // Pitch
    pchPreMatch = new PreMatch(world);
    pchEndMatch = new EndMatch(world);
    pchPrepForKickOff = new PrepForKickOff(world);
    pchKickOff = new KickOff(world);
    pchGameOn = new GameOn(world);
    pchGlobal = new PitchGlobal(world);
    // Teams
    tmDefending = new Defending(world);
    tmAttacking = new Attacking(world);
    // Players (fielders)
    plyWait = new Wait(world);
    plyReceiveBall = new ReceiveBall(world);
    plyKickBall = new KickBall(world);
    plyDribble = new Dribble(world);
    plyChaseBall = new ChaseBall(world);
    plyReturnHome = new ReturnHome(world);
    plyLeavePitch = new LeavePitch(world);
    plyGlobal = new PlayerGlobal(world);
    // Keepers
    kprTendGoal = new TendGoal(world);
    kprPutBallBackInPlay = new PutBallBackInPlay(world);
    kprInterceptBall = new InterceptBall(world);
    kprGlobal = new KeeperGlobal(world);
}

function drawSopportingSpots() {
    function spots(team) {
        team.ssp.forEach(s => { ellipse(s.x, s.y, 5, 5) });
    }
    noStroke();
    fill(0, 0, 255); spots(team[0]);
    fill(255, 0, 0); spots(team[1]);

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

    drawSopportingSpots();
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

function keyTyped() {
    switch (key) {
        case ' ': // Start new match if not auto repeat
            if (!$('AutoRepeat' && pitch.fsm.currentState === pchPreMatch))
                world.dispatcher.postTelegram(0.2, pitch, pitch, PREPARE_FOR_KICKOFF);
            break;
        case 'c':
            console.clear();
            break;
        case 't':
            pitch.team[0].player[0].changeState(kprTendGoal);
            pitch.team[1].player[0].changeState(kprTendGoal);
            break;
        case 'h':
            pitch.team[0].player[0].changeState(kprReturnHome);
            pitch.team[1].player[0].changeState(kprReturnHome);
            break;
        case 's': // stop match
            pitch.changeState(pchEndMatch);
            break;
        case '1':
            pitch.teamInControl = pitch.team[0];
            break;
        case '2':
            pitch.teamInControl = pitch.team[1];
            break;
        case '3':
            pitch.teamInControl = undefined;
            break;
        case '4':
            pitch.changeState(pchPrepForKickOff);
    }
}

