class Team extends Entity {

    constructor(side, defHome, attHome) {
        super();
        this.team_name = '';
        this.side = side; // LHS (0) or RHS (1)
        this.norm = side == LHS ? Vector2D.PLUS_I : Vector2D.MINUS_I;
        let offPitchX = side == LHS ? 287 : 313;
        this.mode = DEFENDING;
        this.createSupportingSpots(this.side);
        this.player = [];
        this.player.push(
            new GoalKeeper(this, defHome[0], attHome[0], [offPitchX, 335]),
            new FieldPlayer(this, defHome[1], attHome[1], [offPitchX, 380], DEFENDER),
            new FieldPlayer(this, defHome[2], attHome[2], [offPitchX, 350], DEFENDER),
            new FieldPlayer(this, defHome[3], attHome[3], [offPitchX, 365], ATTACKER),
            new FieldPlayer(this, defHome[4], attHome[4], [offPitchX, 395], ATTACKER),
        )
        for (let pn = 0; pn < this.player.length; pn++) {
            let p = this.player[pn];
            p.turnRate = PLAYER_TURNRATE;
            p.enableFsm(world).born(world);
            p.fsm.globalState = pn == 0 ? kprGlobal : plyGlobal;
        }
        this.ctrlPly = undefined;
        this.sptPly = undefined;
        this.recPly = undefined;

        this.info = undefined;
        this.enableFsm(world).born(world);
    }

    set scheme(s) {
        this.team_name = s.name;
        this.player.forEach(p => p.painter = paintPlayer(s));
    }
    get name() { return this.team_name; }

    setControllingPlayer(player) { this.ctrlPly = player; return this; }
    set controllingPlayer(player) { this.ctrlPly = player; }
    get controllingPlayer() { return this.ctrlPly; }
    hasControllingPlayer() { return Boolean(this.ctrlPly); }

    setSupportingPlayer(player) { this.sptPly = player; return this; }
    set supportingPlayer(player) { this.sptPly = player; }
    get supportingPlayer() { return this.sptPly; }
    hasSupportingPlayer() { return Boolean(this.sptPly); }

    setReceiver(player) { this.recPly = player; return this; }
    set receiver(player) { this.recPly = player; }
    get receiver() { return this.recPly; }
    hasReceiver() { return Boolean(this.recPly); }

    putInControl() { pitch.teamInControl = this; };
    loseControl() { pitch.teamInControl = undefined; };
    isInControl() { return pitch.teamInControl == this; }

    get oppTeam() { return team[1 - this.side]; }
    get oppTeamPlayers() { return team[1 - this.side].player; }

    get ownGoalCenter() { return goal[this.side].centre; }
    get oppGoalCenter() { return goal[1 - this.side].centre; }

    areAllPlayersHome() {
        let ok = true;
        this.player.forEach(p => ok &= p.isAtHomeRegion());
        return ok;
    }

    sendFieldPlayersHome() {
        this.player.filter(p => p.isFielder).forEach(p => p.changeState(plyReturnHome));
    }

    sendAllPlayersHome() {
        this.player.forEach(p => p.changeState(plyReturnHome));
    }

    getClosestTeamMemberToBall() {
        let bp = ball.pos, d = Number.MAX_VALUE, nearest = undefined;
        this.player.forEach(p => {
            let d2 = Vector2D.distSq(p.pos, bp);
            if (d2 <= d) { d = d2; nearest = p; }
        })
        return nearest;
    }

    isPassSafeFromOpponent(from, target, receiver, opp, passingForce) {
        let toTarget = target.sub(from).normalize();
        let perp = toTarget.gerPerp();
        let localPosOpp = Transform.pointToLocalSpace(opp.pos(), toTarget, perp, from);
        if (localPosOpp.x <= 0) return true;
        if (from.distSq(target) < opp.pos.distSq(from))
            if (this.hasReceiver())
                return target.distSq(opp.pos) > target.distSq(receiver.pos);
            else
                return true;
        let timeForBall = pitch.ball.timeToCoverDistance(Vector2D.ZERO, new Vector2D(localPosOpp.x, 0), passingForce);
        let reach = opp.maxSpeed() * timeForBall + pitch.ball.colRadius() + opp.colRadius();
        return (Math.abs(localPosOpp.y) >= reach);
    }

    isPassSafeFromAllOpponents(from, target,
        receiver, passingForce) {
        let opponents = getOtherTeam().player;
        for (let opp of opponents)
            if (!isPassSafeFromOpponent(from, target, receiver, opp, passingForce))
                return false;
        return true;
    }

    requestPass(player) {
        // Only 10% chance of request sent
        if (Math.random() > 0.1 || controllingPlayer == null)
            return;
        if (isPassSafeFromAllOpponents(controllingPlayer.pos, player.pos, player, MaxPassingForce)) {
            //Dispatcher.dispatch(0, player.ID(), controllingPlayer.ID(), PASS_TO_ME, player);
        }
    }



    /*


  public void requestPass(PlayerBase player) {
    // Only 10% chance of request sent
    if (Math.random() > 0.01 || controllingPlayer == null)
      return;
    if (isPassSafeFromAllOpponents(controllingPlayer.pos(), player.pos(), player, MaxPassingForce)) {
      Dispatcher.dispatch(0, player.ID(), controllingPlayer.ID(), PASS_TO_ME, player);
    }
  }
    */


    createSupportingSpots(side) {
        let vert = [56, 93, 130, 170, 207, 244];
        let horz = [72, 111, 150, 189, 228];
        let f = side == LHS ? 1 : -1;
        this.ssp = [];
        this.ssv = new Array(30).fill(1);
        for (let v = 0; v < vert.length; v++)
            for (let h = 0; h < horz.length; h++)
                this.ssp.push(new Vector2D(300 + horz[h] * f, vert[v]));
    }

    $$() { console.log(this.toString()) };

    toString() {
        let s = `Team ${this.side == 0 ? 'LHS' : 'RHS'}   Facing  ${this.norm.$(4)}`
        return s;
    }
}