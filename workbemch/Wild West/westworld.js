function preload() {
    stateicon = loadImage('wildwest.png');
    backdrop = loadImage('wwbg1.jpg');
    minericon = loadImage('bob120.png');
    wifeicon = loadImage('elsa130.png');
    money = loadImage('moneysmall.png');
}

function setup() {
    // console.clear();
    let p5canvas = createCanvas(640, 655);
    p5canvas.parent('sketch');
    createGUIitems();
    createAgentItems();
    world.dispatcher.postTelegram(30, elsa, elsa, 2201);
}


function createAgentItems() {
    world = new World(300, 300);
    bob = new Miner(world, 'Bob');
    elsa = new Wife(world, 'Elsa');
    world.birth([bob, elsa]);
    // Create states
    stateDigForGold = new DigForGold(world);
    stateDepositGold = new DepositGold(world);
    stateRelaxAtHome = new RelaxAtHome(world);
    stateQuenchThirst = new QuenchThirst(world);
    stateAtHome = new AtHome(world);
    stateGetMoneyFromBank = new GetMoneyFromBank(world);
    stateShopping = new Shopping(world);
    stateBathroom = new Bathroom(world);
    stateMakeStew = new MakeStew(world);
    // Setup initial states
    bob.changeState(stateDigForGold);
    elsa.changeState(stateAtHome);
    elsa.fsm.globalState = new WifeGlobal(world);
}

function createGUIitems() {
    logger = new Logger(60, 320, 16);
    minerStateViewer = new StateIconViewer(80, 20, stateicon, -46, 60, minericon);
    minerStateViewer.setStateIdx(0);
    wifeStateViewer = new StateIconViewer(width - 230, 20, stateicon, 120, 52, wifeicon);
    wifeStateViewer.setStateIdx(3);
    goldMinedGauge = new ProgressBar(60, 210, 180, 24, 'Gold nuggets found');
    fatigueGauge = new ProgressBar(60, 240, 180, 24, 'Fatigue');
    thirstGauge = new ProgressBar(60, 270, 180, 24, 'Thirst');
    moneyGauge = new ProgressBar(400, 210, 180, 24, 'Money in wallet');
    bathroomGauge = new ProgressBar(400, 240, 180, 24, 'Visiting bathroom');
    makeStewGauge = new ProgressBar(400, 270, 180, 24, 'Making stew');
}

function draw() {
    background(backdrop);
    world.update(deltaTime / 1000);
    goldMinedGauge.setValue(bob.propGoldInPocket); goldMinedGauge.render();
    fatigueGauge.setValue(bob.propFatigue); fatigueGauge.render();
    thirstGauge.setValue(bob.propThirst); thirstGauge.render();
    moneyGauge.setValue(elsa.propMoneyInWallet); moneyGauge.render();
    bathroomGauge.setValue(elsa.propBathroom); bathroomGauge.render();
    makeStewGauge.setValue(elsa.propMakeStew); makeStewGauge.render();
    minerStateViewer.render(); wifeStateViewer.render();
    logger.render();
    moneyRender();
}

function layout() {
    stroke(0); strokeWeight(2); noFill();
    rect(60, 20, 150, 150);
    image(stateicon.get(150, 0, 150, 150), 60, 20)
}

function moneyRender() {
    push();
    translate(250, 140);
    image(money, 0, 0);
    fill('ivory'); stroke('firebrick'); strokeWeight(2);
    rect(40, 58, 60, 20);
    textAlign(CENTER, CENTER); textSize(16);
    noStroke(); fill(0);
    text(moneyInBank(), 40, 59, 60, 20);
    textStyle(BOLD);
    text('Money in Bank', 20, 106, 100, 40);
    pop();
}
