class Pitch extends Entity {

    constructor(img) {
        super();
        this.image = img;
        this.Z = 9;
        this.domain = new Domain(0, 0, PITCH_LENGTH, PITCH_WIDTH, REBOUND);
        this.region = this.createRegions();
        this.centerSpot = new Vector2D(PITCH_LENGTH / 2, PITCH_WIDTH / 2);
        this.enableFsm(world).born(world);
        this.fsm.globalState = pchGlobal;
        this.gameStarted = 0;
        this.clock = 0;
        this.gameOn = false;

        this.nbrOffPitch = 0;
        this.nbrAtHome = 0;

        this.keeperHasBall = false;
        this.teamInControl = undefined;
    }

    getAllPlayers(order = BY_RANDOM) {
        let p = [];
        switch (order) {
            case BY_TEAM:
                p = [...team[0].player, ...team[1].player];
                break;
            case BY_PLAYER:
                for (let pn = 0; pn < 5; pn++) {
                    p.push(team[0].player[pn]);
                    p.push(team[1].player[pn]);
                }
                break;
            case BY_RANDOM:
            default:
                p = [...team[0].player, ...team[1].player];
                shuffle(p, true);
        }
        return p;
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

    constructor(side) {
        let left = (side == LHS) ? -GOAL_NET_DEPTH + 4 : PITCH_LENGTH - 4;
        let top = (PITCH_WIDTH - GOAL_WIDTH) / 2;
        super([left, top]);
        this.side = side;
        this.image = getGoalImage(side);
        this.norm = (side == LHS) ? Vector2D.PLUS_I : Vector2D.MINUS_I;
        this.Z = 10;
        this.y0 = GOAL_LOW_Y;
        this.y1 = GOAL_HIGH_Y;
        this.center = new Vector2D(side == LHS ? 0 : PITCH_LENGTH, (this.y0 + this.y1) / 2);
    }

    render() {
        push(); image(this.image, this.x, this.y); pop();
    }

    $$() { console.log(this.toString()); }

    toString() {
        let s = `Goal ${this.side == 0 ? 'LHS' : 'RHS'}     Center ${this.center.$(4)}   `;
        s += `Facing  ${this.norm.$(4)}`

        return s;
    }

}

class Ball extends Mover {

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

    kick(kicker, dir, force) {
        this.lastKickedBy = kicker;
        this.lastKickedAt = millis();
        this.vel = dir.resize(force / this.mass);
    }

    readyToBeKickedBy(kicker) {
        return !(this.lastKickedBy == kicker && millis() - this.lastKickedAt < PlayerKickInterval);
    }

    getLastKickedBy() { return this.lastKickedBy; }

    timeToCoverDistance(from, to, force) {
        // this will be the velocity of the ball in the next time step *if*
        // the player was to make the pass.
        let speed = force / this.mass;
        // calculate the velocity at 'to' using the equation
        //  v^2 = u^2 + 2as
        let distanceToCover = Vector2D.dist(from, to);
        let v2 = speed * speed + 2 * distanceToCover * FRICTION_MAG;
        // if (u^2 + 2as) is negative it means the ball cannot reach point 'to'
        if (v2 <= 0) return -1;
        // it IS possible for the ball to reach B and we know its speed when it
        // gets there, so calculate the time using the equation
        //    t = (v-u) / a
        let v = sqrt(v2);
        return (v - speed) / FRICTION_MAG;
    }

    futurePosition(time) {
        // Use the equation s = ut + (at^2)/2
        // where s = distance, a = friction, u = start velocity to calculate
        // the future position s
        let ut = this.vel.mult(time);                    // ut term
        let half_a_t_squared = 0.5 * FRICTION_MAG * time * time;
        let dir = this.vel.resize(half_a_t_squared);    // (at^2)/2 term
        return ut.add(dir);   //  ut + (at^2)/2
    }

    trap(player) {
        this.owner = player;
        Vector2D.mutate(this.vel, [0, 0]);
    }

    keeperHasBall() {
        return Boolean(this.owner?.isGoalKeeper);
    }

    release() {
        this.owner = undefined;
    }

    toCenterSpot() {
        this.pos = new Vector2D(PITCH_LENGTH / 2, PITCH_WIDTH / 2);
        this.heading = new Vector2D(0, 1);
        this.vel = new Vector2D(0, 0);
    }

    /**
     * Update method for any moving entity in the world that is not under
     * the influence of a steering behaviour.
     * @param elapsedTime elapsed time since last update (milliseconds)
     * @param world the game world object
     */
    update(elapsedTime, world) {
        // Remember the starting position
        this.prevPos = this.pos;
        // Update position
        this.pos = this.pos.add(this.vel.mult(elapsedTime));
        // Apply domain constraint, REBOUND will only change velocity vector
        this.applyDomainConstraint(this.domain ? this.domain : world.domain);
        // Apply friction by reducing ball velocity
        if (this.vel.lengthSq() > elapsedTime * FRICTION_MAG_SQ) {
            let decel = this.vel.resize(elapsedTime * FRICTION_MAG);
            this.vel = this.vel.add(decel);
        }
        else
            Vector2D.mutate(this.vel, [0, 0]);
        // Now see if a goal has been scored
        let x = this.pos.x, y = this.pos.y;
        // Only need to check if y is inside goal mouth
        if (y >= GOAL_LOW_Y && y <= GOAL_HIGH_Y) {
            // Goal scored if it is over either end of the pitch
            if ((x - BALL_RADIUS < 0) || (x + BALL_RADIUS > PITCH_LENGTH)) {
                let teamNo = x < PITCH_LENGTH / 2 ? 1 : 0;
                dispatcher.postTelegram(0, this, pitch, GOAL_SCORED, teamNo);
            }
        }
    }

    render() {
        push();
        stroke(255); strokeWeight(1); fill(0);
        ellipse(this.x, this.y, 2 * BALL_RADIUS, 2 * BALL_RADIUS);
        pop();
    }
}