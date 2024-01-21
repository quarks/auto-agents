let stateSleepUntilRested;

function setup() {
    //console.clear();
    let p5canvas = createCanvas(400, 400);
    p5canvas.parent('sketch');
    world = new World(300, 300);
    miner = new Miner('Sam');
    world.birth(miner);
    stateDigForGold = new DigForNugget();
    stateDepositGold = new DepositGold();
    stateSleepUntilRested = new SleepUntilRested();

    miner.changeState(stateDigForGold);
}


function draw() {
    background(200, 200, 255);
    world.update(deltaTime);
}