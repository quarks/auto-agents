class Player extends Vehicle {

    constructor(team, rest_heading, def_region, att_region, off_pitch) {
        super(off_pitch.add(new Vector2D(0, 50)), PLAYER_RADIUS);
        let tp = team.pitch;
        this.team = team;
        this.defRegion = def_region;
        this.attRegion = att_region;
        this.homeRegion = this.defRegion;
        this.homeRegionPos = tp.regionPos(this.homeRegion);
        this.headingAtRest = rest_heading;
        this.offPitchPos = off_pitch;
        this.offPitchHeading = Vector2D.MINUS_J;
        this.maxForce = PlayerMaxForce;
        this.maxTurnRate = PlayerMaxTurnRate;
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
        this.homeRegionPos = this.team.pitch.regionPos(this.homeRegion);
    }

    trackBall() {
        this.headingAtRest = this.team.pitch.ball.pos.sub(this.pos);
    }


    isAtTarget() {
        let dist = Vector2D.distSq(this.pos, this.pilot.target);
        return dist <= PlayerAtTargetRange;

    }
}

class FieldPlayer extends Player {

    constructor(team, rest_heading, def_region, att_region, off_pitch, type) {
        super(team, rest_heading, def_region, att_region, off_pitch);
        this.type = type;
        this.maxSpeed = PlayerMaxSpeedWithoutBall;
    }

}

class GoalKeeper extends Player {

    constructor(team, rest_heading, def_region, att_region, off_pitch) {
        super(team, rest_heading, def_region, att_region, off_pitch);
        this.type = GOALKEEPER;
        this.maxSpeed = KeeperMaxSpeedWithoutBall;
    }

}