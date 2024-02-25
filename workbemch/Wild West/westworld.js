let stateSleepUntilRested;

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
    createAAitems();
}

function createGUIitems() {
    minerStateViewer = new StateIconViewer(80, 20, stateicon, -46, 60, minericon);
    minerStateViewer.setStateIdx(0);
    wifeStateViewer = new StateIconViewer(width - 80 - 150, 20, stateicon, 115, 58, wifeicon);
    wifeStateViewer.setStateIdx(3);
    goldMinedGauge = new ProgressBar(60, 210, 180, 24, 'Gold nuggets found')
    fatigueGauge = new ProgressBar(60, 240, 180, 24, 'Fatigue')
    thirstGauge = new ProgressBar(60, 270, 180, 24, 'Thirst')
    moneyGauge = new ProgressBar(400, 210, 180, 24, 'Money in wallet')
}

function createAAitems() {
    world = new World(300, 300);
    bob = new Miner(world, 'Bob');
    elsa = new Wife(world, 'Elsa');
    bob.wife = elsa;
    elsa.miner = bob;
    world.birth([bob, elsa]);
    stateDigForGold = new DigForGold(world);
    stateDepositGold = new DepositGold(world);
    stateSleepUntilRested = new RelaxAtHome(world);
    stateQuenchThirst = new QuenchThirst(world);
    stateWaitForMiner = new WaitingForMiner(world);
    stateGetMoneyFromBank = new GetMoneyFromBank(world);
    stateShopping = new Shopping(world);
    bob.changeState(stateDigForGold);
    elsa.changeState(stateWaitForMiner);

    world.update(0);
    world.dispatcher.postTelegram(10, elsa.id, elsa.id, 22001);
}

function draw() {
    background(backdrop);
    world.update(deltaTime / 1000);
    goldMinedGauge.setValue(bob.propGoldInPocket);
    fatigueGauge.setValue(bob.propFatigue);
    thirstGauge.setValue(bob.propThirst);
    moneyGauge.setValue(elsa.propMoneyInWallet);
    minerStateViewer.render();
    wifeStateViewer.render();
    goldMinedGauge.render();
    fatigueGauge.render();
    thirstGauge.render();
    moneyGauge.render();
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
    text(bob.moneyInBank, 40, 59, 60, 20);
    textStyle(BOLD);
    text('Money in Bank', 20, 106, 100, 40);
    pop();
}
