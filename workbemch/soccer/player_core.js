class Player extends Vehicle {

    constructor(team, rest_heading, def_region, att_region, off_pitch) {
        let tp = team.pitch;
        super(tp.regionPos(def_region), PLAYER_RADIUS);
        this.team = team;
        this.region = [def_region, att_region];
        this.regionPos = [tp.regionPos(def_region), tp.regionPos(att_region)];
        this.headingAtRest = rest_heading;
        this.offPitchPos = off_pitch;
        this.offPitchHeading = Vector2D.MINUS_J;
    }

}

class FieldPlayer extends Player {

    constructor(team, rest_heading, def_region, att_region, off_pitch, type) {
        super(team, rest_heading, def_region, att_region, off_pitch);
        this.type = type;
    }

}

class GoalKeeper extends Player {

    constructor(team, rest_heading, def_region, att_region, off_pitch) {
        super(team, rest_heading, def_region, att_region, off_pitch);
        this.type = GOALKEEPER;
    }

}