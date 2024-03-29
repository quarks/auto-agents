class EndMatch extends State { // Pitch state
    constructor(world) { super(world, 'End match'); }

    enter(pitch) {
        pitch.gameOn = false;
        pitch.clock = $('MatchTime') * 1000;
        pitch.ball.vel = Vector2D.ZERO;
        pitch.counterA = 0;
        for (let p of pitch.getAllPlayers())
            p.changeState(plyLeavePitch);
    }

    execute(pitch, elapsedTime) {
        if (pitch.counterA >= 10) {
            pitch.counterA = 0;
            this.sendMessage(1, pitch.id, pitch.id, PREMATCH);
        }
    }

    exit(pitch) {
        pitch.ball.pos = pitch.centerSpot; pitch.ball.vel = Vector2D.ZERO;
        pitch.team[0].setTeamMode(DEFENDING, false);
        pitch.team[1].setTeamMode(DEFENDING, false);
    }
}


class PreMatch extends State {
    constructor(world) { super(world, 'Pre match'); }

    enter(pitch) {
        pitch.clock = 0;
        pitch.changeTeams();
        if ($('AutoRepeat'))
            this.sendMessage(5, pitch, pitch, PREPARE_FOR_KICKOFF);
    }
}

// Move players to defensive
class PrepForKickOff extends State {
    constructor(world) { super(world, 'Prepare for kick off'); }

    enter(pitch) {
        pitch.counterB = 0;
        pitch.ball.pos = pitch.centerSpot;
        pitch.ball.vel = Vector2D.ZERO;
        pitch.team[0].setTeamMode(DEFENDING, false);
        pitch.team[1].setTeamMode(DEFENDING, false);
        for (let p of pitch.getAllPlayers())
            p.changeState(plyReturnToHomeRegion);
    }

    execute(pitch, elapsedTime) {
        if (pitch.counterB >= 10) {
            pitch.counterB = 0;
            this.sendMessage(5, pitch.id, pitch.id, KICKOFF);
        }
    }
}


class KickOff extends State {
    constructor(world) { super(world, 'Kick off'); }

    enter(pitch) {
        if (pitch.clock == 0) {
            pitch.gameOn = true;
            pitch.gameStarted = millis();
            this.sendMessage($('MatchTime'), pitch.id, pitch.id, STOP_GAME);
        }
        pitch.ball.pos = pitch.centerSpot; pitch.ball.vel = Vector2D.ZERO;
        pitch.team[0].getClosestTeamMemberToBall().changeState(plyChaseBall);
        pitch.team[1].getClosestTeamMemberToBall().changeState(plyChaseBall);
        pitch.changeState(pchGameOn);
    }

}

class GameOn extends State {
    constructor(world) { super(world, 'Game on'); }

    execute(player, elapsedTime) {
        pitch.clock = millis() - pitch.gameStarted;
    }
}

class ReturnToHomeRegion extends State {
    constructor(world) { super(world, 'Return to home region'); }

    enter(player) {
        player.pilot.arriveOn(player.homeRegionPos);
        player.headingAtRest = player.team.norm;
    }

    execute(player, elapsedTime) {
        if (player.isAtTarget()) {
            player.vel = Vector2D.ZERO;
            player.trackBall();
            player.changeState(plyWait);
        }
    }

    exit(player) {
        player.pilot.arriveOff();
        player.team.pitch.counterB++;
    }
}


class Wait extends State {
    constructor(world) { super(world, 'Wait'); }

    enter(player) {
        player.vel = Vector2D.ZERO;
    }

    execute(player, elapsedTime) {
        if (!player.isAtTarget()) {
            player.pilot.arriveOn();
            return;
        }
        else {
            player.vel = new Vector2D();
            player.trackBall();
        }
    }
}


class LeavePitch extends State {
    constructor(world) { super(world, 'Leave Pitch'); }

    enter(player) {
        player.pilot.arriveOn(player.offPitchPos, FAST);
        player.headingAtRest = player.offPitchHeading;
    }

    execute(player, elapsedTime) {
        if (player.isAtTarget())
            player.changeState(plyWait);
    }

    exit(player) {
        player.team.pitch.counterA++;
        player.pilot.arriveOff();
    }
}


class ChaseBall extends State {
    constructor(world) { super(world, 'Chase ball'); }

    enter(player) {
        player.pilot.seekOn(player.team.pitch.ball.pos);
    }

    execute(player, elapsedTime) {
        if (player.isClosestToBall()) {
            player.pilot.target = player.team.pitch.ball.pos;
            return;
        }
        player.changeState(plyReturnToHomeRegion);
    }

    exit(player) {
        player.pilot.seekOff();
    }
}

// Message central
class PitchGlobal extends State {
    constructor(world) { super(world, 'Pitch Global State'); }

    onMessage(pitch, tgram) {
        switch (tgram.msgID) {
            case PREPARE_FOR_KICKOFF:
                pitch.changeState(pchPrepForKickOff);
                return true;
            case PREMATCH:
                pitch.changeState(pchPreMatch);
                return true;
            case KICKOFF:
                pitch.changeState(pchKickOff);
                return true;
            case START_CLOCK:
                pitch.clock = millis();
            case TEAMS_READY_FOR_KICK_OFF:
                return true;
            case GOAL_SCORED:
                return true;
            case STOP_GAME:
                pitch.clock = $('MatchTime') * 1000;
                pitch.changeState(pchEndMatch);
                return true;
        }
        return false;
    }

    execute(pitch, elapsedTime) {
        if (pitch.gameOn) pitch.clock = millis() - pitch.gameStarted;
    }
}
