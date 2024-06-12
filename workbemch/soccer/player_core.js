class Player extends Vehicle {

    constructor(team, def_region, att_region, off_pitch) {
        super(Vector2D.from(off_pitch).add(new Vector2D(0, 50)), PLAYER_RADIUS);
        this.team = team;
        this.defRegion = def_region;
        this.attRegion = att_region;
        this.homeRegion = this.defRegion;  // The current home region depends on team state 
        this.headingAtRest = team.norm; //rest_heading;
        this.offPitchPos = new Vector2D(off_pitch[0], off_pitch[1]);
        this.offPitchHeading = Vector2D.MINUS_J;
        this.maxForce = PlayerMaxForce;
        this.maxTurnRate = PlayerMaxTurnRate;
    }

    get homeRegionPos() { return pitch.regionPos(this.homeRegion); }

    isControllingPlayer(player) {
        return this == this.team.getControllingPlayer();
    }

    setHomeRegion(teamMode) {
        switch (teamMode) {
            case ATTACKING:
                this.homeRegion = this.attRegion;
                break;
            case DEFENDING:
            default:
                this.homeRegion = this.defRegion;
                break;
        }
    }

    trackBall() {
        this.headingAtRest = ball.pos.sub(this.pos);
    }

    isAtHomeRegion() {
        return Vector2D.distSq(this.pos, this.homeRegionPos) <= PlayerAtTargetRangeSq;
    }

    isAtTarget() {
        return Vector2D.distSq(this.pos, this.pilot.target) <= PlayerAtTargetRangeSq;
    }

    isNearTarget() {
        return Vector2D.distSq(this.pos, this.pilot.target) <= PlayerNearTargetRangeSq;
    }

    isClosestToBall() {
        return this.team.getClosestTeamMemberToBall() == this;
    }

    isBallWithinKickingRange() {
        return (Vector2D.distSq(this.pos, ball.pos) <= PlayerKickingDistanceSq);
    }

}

class FieldPlayer extends Player {

    constructor(team, def_region, att_region, off_pitch, type) {
        super(team, def_region, att_region, off_pitch);
        this.type = type;
        this.maxSpeed = PlayerMaxSpeedWithoutBall;
    }

    get isGoalKeeper() { return false; }
    get isFielder() { return true; }
    get isDefender() { return this.type == DEFENDER; }
    get isAttacker() { return this.type == ATTACKER; }
}

class GoalKeeper extends Player {

    constructor(team, def_region, att_region, off_pitch) {
        super(team, def_region, att_region, off_pitch);
        this.type = GOALKEEPER;
        this.maxSpeed = KeeperMaxSpeedWithoutBall;
    }

    isBallWithinRange() {
        return Vector2D.distSq(this.pos, this.team.pitch.ball.pos) <= KeeperInBallRangeSq;
    }

    isBallWithinInterceptRange() {
        return Vector2D.distSq(this.team.goal.cemter, this.team.pitch.ball.pos) <= GoalKeeperInterceptRangeSq;
    }

    tooFarFromGoalMouth() {
        return Vector2D.distSq(this.pos, this.getRearInterposeTarget()) > GoalKeeperInterceptRangeSq;
    }

    getRearInterposeTarget() {
        let x = this.team.goal.center.x;
        let y = (PITCH_WIDTH - GOAL_WIDTH) / 2 + (this.team.pitch.ball.pos.y * GOAL_WIDTH / PITCH_WIDTH);
        let target = new Vector2D(x, y);
        return target;
    }

    get isGoalKeeper() { return true; }
    get isFieldPlayer() { return false; }
    get isDefender() { return false; }
    get isAttacker() { return false; }
}