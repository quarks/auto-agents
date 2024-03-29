class Pitch extends Entity {

    constructor(img, world) {
        super();
        this.image = img;
        this.Z = 9;
        this.domain = new Domain(0, 0, PITCH_LENGTH, PITCH_WIDTH, REBOUND);
        this.region = this.createRegions();
        this.centerSpot = new Vector2D(PITCH_LENGTH / 2, PITCH_WIDTH / 2);
        this.goal = [];
        this.goal.push(
            new Goal(this, 'left', getGoalImage('left')).enableFsm(world).born(world),
            new Goal(this, 'right', getGoalImage('right')).enableFsm(world).born(world));
        this.ball = new Ball(this).setPos(this.centerSpot).setVel(Vector2D.ZERO)
            .setDomain(this.domain).enableFsm(world).born(world);
        this.team = [];
        this.team.push(
            new Team(this, 0, Vector2D.PLUS_I, [1, 3, 5, 6, 8], [1, 4, 8, 12, 14], world),
            new Team(this, 1, Vector2D.MINUS_I, [16, 12, 14, 9, 11], [16, 13, 9, 3, 5], world),
        );
        this.teamName = ['', ''];
        this.score = [42, 70];
        this.changeTeams();
        this.enableFsm(world).born(world);
        this.fsm.globalState = pchGlobal;
        this.gameStarted = 0;
        this.clock = 0;
        this.gameOn = false;
    }

    changeTeams() {
        if (!this.teamsAvailable || this.teamsAvailable.length <= 1)
            this.teamsAvailable = shuffle([0, 1, 2, 3, 4, 5]);
        this.setTeams(this.teamsAvailable.pop(), this.teamsAvailable.pop());
    }

    setTeams(idx0, idx1) {
        let scheme = [teamDetails[idx0], teamDetails[idx1]];
        this.teamName = [scheme[0].name, scheme[1].name];
        for (let p of this.team[0].player) p.painter = paintPlayer(scheme[0]);
        for (let p of this.team[1].player) p.painter = paintPlayer(scheme[1]);
    }

    getAllPlayers() {
        return [...this.team[0].player, ...this.team[1].player];
    }

    regionPos(r) {
        return this.region[r];
    }

    inRegion(v) {
        if (v.x >= 0 && v.x < PITCH_LENGTH && v.y >= 0 && v.y < PITCH_WIDTH)
            return floor(v.y / 100) + 3 * floor(v.x / 100);
        return -1;
    }

    createRegions() {
        let r = []
        for (let i = 0; i < 18; i++)
            r[i] = new Vector2D(50 + floor(i / 3) * 100, 50 + (i % 3) * 100);
        return r;
    }

    render() {
        push(); image(this.image, 0, 0); pop();
    }

}

class Goal extends Entity {

    constructor(pitch, side, img) {
        let left = (side == 'left') ? -GOAL_NET_DEPTH + 4 : PITCH_LENGTH - 4;
        let top = (PITCH_WIDTH - GOAL_WIDTH) / 2;
        super([left, top]);
        this.pitch = pitch;
        this.image = img;
        this.norm = (side == 'left') ? Vector2D.PLUS_I : Vector2D.MINUS_I;
        this.Z = 10;
        this.y0 = GOAL_LOW_Y;
        this.y1 = GOAL_HIGH_Y;
    }

    render() {
        push(); image(this.image, this.x, this.y); pop();
    }

}

class Ball extends Mover {

    // Pitch pitch;
    // PlayerBase owner = null;

    // PlayerBase lastkickedBy = null;
    // long lastKickedAt = 0;

    // double lowGoalY, highGoalY;

    constructor(pitch) {
        super([PITCH_LENGTH / 2, PITCH_WIDTH / 2], BALL_RADIUS);
        this.pitch = pitch;
        this.owner = undefined;
        this.lastKickedBy = undefined;
        this.lastKickedAt = 0;
        this.maxSpeed = 1e12;
        this.maxForce = 1e12;
        this._pitch = pitch;
    }

    render() {
        push();
        stroke(255); strokeWeight(1); fill(0);
        ellipse(this.x, this.y, 2 * BALL_RADIUS, 2 * BALL_RADIUS);
        pop();
    }
}