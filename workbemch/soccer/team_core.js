class Team extends Entity {

    constructor(pitch, side, rest_heading, def_regions, att_regions, world) {
        super();
        this.pitch = pitch;
        this.side = side; // 0 = LHS  : 1 = RHS
        this.norm = side == 0 ? Vector2D.PLUS_I : Vector2D.MINUS_I;
        this.mode = DEFENDING;
        let offPitchX = side == 0 ? 285 : 315;
        this.player = [];
        this.player.push(
            new GoalKeeper(this, rest_heading, def_regions[0], att_regions[0], new Vector2D(offPitchX, 335)),
            new FieldPlayer(this, rest_heading, def_regions[1], att_regions[1], new Vector2D(offPitchX, 380), DEFENDER),
            new FieldPlayer(this, rest_heading, def_regions[2], att_regions[2], new Vector2D(offPitchX, 350), DEFENDER),
            new FieldPlayer(this, rest_heading, def_regions[3], att_regions[3], new Vector2D(offPitchX, 365), ATTACKER),
            new FieldPlayer(this, rest_heading, def_regions[4], att_regions[4], new Vector2D(offPitchX, 395), ATTACKER),
        )
        for (let p of this.player) {
            p.enableFsm(world).born(world);
            p.turnRate = PLAYER_TURNRATE;
        }
        this.enableFsm(world).born(world);
    }

    getClosestTeamMemberToBall() {
        let bp = this.pitch.ball.pos, d = Number.MAX_VALUE, nearest = undefined;
        for (let ply of this.player) {
            let d2 = Vector2D.distSq(ply.pos, bp);
            if (d2 <= d) {
                d = d2;
                nearest = ply;
            }
        }
        return nearest;
    }

    // getClosestTeamMemberToBall() {
    //     let bp = this.pitch.ball.pos, d = Number.MAX_VALUE, nearest = undefined;
    //     for (let ply of this.player) {
    //         let d2 = Vector2D.distSq(ply.pos, bp);
    //         if (d2 <= d) {
    //             d = d2;
    //             nearest = ply;
    //         }
    //     }
    //     return nearest;
    // }


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