class Pitch extends Entity {

    constructor(img, world) {
        super();
        this.image = img;
        this.playerDomain = new Domain(-10, -10, 610, 600, REBOUND);
        this.region = this.createRegions();
        this.goal = [];
        this.goal.push(
            new Goal(this, 'left', getGoalImage('left')).enableFsm(world).born(world),
            new Goal(this, 'right', getGoalImage('right')).enableFsm(world).born(world));
        this.ball = new Ball(this).setVel(Vector2D.fromRandom(150, 150)).enableFsm(world).born(world);
        this.team = [];
        this.team.push(
            new Team(this, 0, Vector2D.PLUS_I, [1, 3, 5, 6, 8], [1, 4, 8, 12, 14], 0, world),
            new Team(this, 1, Vector2D.MINUS_I, [16, 12, 14, 9, 11], [16, 13, 9, 3, 5], 1, world),
        );
        this.Z = 9;
        this.enableFsm(world).born(world);
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
        // Position on pitch
        //     BALL_RADIUS, // Collision radius
        //     new Vector2D(0, 0), // Velocity
        //     Float.MAX_VALUE, // Maximum velocity
        //     new Vector2D(0, 1), // Heading
        //     BALL_MASS, // Ball mass
        //     1, // Max turning rate
        //     Float.MAX_VALUE                  // Maximum force
        // );
        this._pitch = pitch;
    }

    render() {
        push();
        stroke(255); strokeWeight(1); fill(0);
        ellipse(this.x, this.y, 2 * BALL_RADIUS, 2 * BALL_RADIUS);
        pop();
    }
}