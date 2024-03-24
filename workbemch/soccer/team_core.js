class Team extends Entity {

    constructor(pitch, side, rest_heading, def_regions, att_regions, colSchemeID, world) {
        super();
        this.pitch = pitch;
        this.side = side; // 0 = LHS  : 1 = RHS
        this.norm = side == 0 ? Vector2D.PLUS_I : Vector2D.MINUS_I;
        this.mode = DEFENDING;
        let offPitchX = side == 0 ? 285 : 315;
        this.player = [];
        this.player.push(
            new GoalKeeper(this, rest_heading, def_regions[0], att_regions[0], new Vector2D(offPitchX, 350)),
            new FieldPlayer(this, rest_heading, def_regions[1], att_regions[1], new Vector2D(offPitchX, 370), DEFENDER),
            new FieldPlayer(this, rest_heading, def_regions[2], att_regions[2], new Vector2D(offPitchX, 410), DEFENDER),
            new FieldPlayer(this, rest_heading, def_regions[3], att_regions[3], new Vector2D(offPitchX, 390), ATTACKER),
            new FieldPlayer(this, rest_heading, def_regions[4], att_regions[4], new Vector2D(offPitchX, 430), ATTACKER),
        )
        for (let p of this.player) {
            p.enableFsm(world).born(world);
            p.turnRate = PLAYER_TURNRATE;
        }
        this.enableFsm(world).born(world);
    }

    // mode = DEFENDING or ATTACKING
    // move = true if game isin progress
    setTeamMode(mode, withMove = true) {
        if (this.mode != mode) {
            this.mode = mode;
            for (let p of this.player) {
                let cstate = p.fsm.currentState;
                let mustMove = withMove && p.attRegion != p.defRegion
                    && (cstate == plyWait || cstate == plyReturnToHomeRegion);
                p.setHomeRegion(this.mode);
                if (mustMove) p.changeState(plyReturnToHomeRegion);
            }
        }
    }
}