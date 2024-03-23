class Team extends Entity {

    constructor(pitch, side, rest_heading, def_regions, att_regions, colSchemeID, world) {
        super();
        this.pitch = pitch;
        this.side = side;
        let offPitchX = side == 0 ? 285 : 315;
        this.player = [];
        this.player.push(
            new GoalKeeper(this, rest_heading, def_regions[0], att_regions[0], new Vector2D(offPitchX, 350)),
            new FieldPlayer(this, rest_heading, def_regions[1], att_regions[1], new Vector2D(offPitchX, 370), DEFENDER),
            new FieldPlayer(this, rest_heading, def_regions[2], att_regions[2], new Vector2D(offPitchX, 390), DEFENDER),
            new FieldPlayer(this, rest_heading, def_regions[3], att_regions[3], new Vector2D(offPitchX, 410), ATTACKER),
            new FieldPlayer(this, rest_heading, def_regions[4], att_regions[4], new Vector2D(offPitchX, 430), ATTACKER),
        )
        let teamPainter = paintPlayer(teamColor[colSchemeID]);
        for (let p of this.player) {
            p.setPainter(teamPainter).enableFsm(world).born(world);
            p.turnRate = PLAYER_TURNRATE;
        }
        this.enableFsm(world).born(world);
    }

}