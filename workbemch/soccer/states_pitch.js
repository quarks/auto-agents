class EndMatch extends State { // Pitch state
    constructor(world) { super(world, 'End match'); }

    enter(pitch) {
        //console.log(`Enter state  ${this.name}   ${Date.now() / 1000}   Pitch clock ${pitch.clock}`)
        pitch.gameOn = false;
        pitch.clock = $('MatchTime');
        ball.toCenterSpot();
        pitch.nbrOffPitch = 0;
        team[0].changeState(tmDefending);
        team[1].changeState(tmDefending);
        for (let p of pitch.getAllPlayers(BY_TEAM))
            this.sendMessage(0, pitch, p, LEAVE_PITCH);
    }

    execute(pitch, elapsedTime) {
        if (pitch.nbrOffPitch >= 10) pitch.changeState(pchPreMatch);
    }

    onMessage(pitch, tgram) {
        switch (tgram.msgID) {
            case ARIVED_OFF_PITCH:
                pitch.nbrOffPitch++;
                return true;
        }
        return false;
    }

    exit(pitch) {
        ball.pos = pitch.centerSpot;
    }
}


class PreMatch extends State {
    constructor(world) { super(world, 'Pre match'); }

    enter(pitch) {
        pitch.clock = 0;
        changeTeams();
        score = [0, 0];
        if ($('AutoRepeat'))
            this.sendMessage(5, pitch, pitch, PREPARE_FOR_KICKOFF);
    }
}

// Move players to defensive
class PrepForKickOff extends State {
    constructor(world) { super(world, 'Prepare for kick off'); }

    enter(pitch) {
        pitch.counterB = 0;
        ball.toCenterSpot();

        pitch.teamInControl = undefined;
        console.log(`Prep for Kick Off`)
        for (let p of pitch.getAllPlayers())
            p.changeState(plyReturnHome);
    }

    execute(pitch, elapsedTime) {
        if (team[0].areAllPlayersHome() && team[1].areAllPlayersHome())
            pitch.changeState(pchKickOff);

    }
}


class KickOff extends State {
    constructor(world) { super(world, 'Kick off'); }

    enter(pitch) {
        console.log(`Kick Off`)
        if (pitch.clock == 0) {
            pitch.gameOn = true;
            pitch.gameStarted = millis() / 1000;
            // Stop the game when the timer reaches full time
            this.sendMessage($('MatchTime'), pitch.id, pitch.id, STOP_GAME);
        }
        ball.toCenterSpot();
        let cpt0 = team[0].getClosestTeamMemberToBall();
        let cpt1 = team[1].getClosestTeamMemberToBall();
        let t0 = 1 + random(0.5), t1 = 1 + random(0.5);
        this.sendMessage(t0, pitch.id, cpt0, CHASE_BALL);
        this.sendMessage(t1, pitch.id, cpt1, CHASE_BALL);
        pitch.changeState(pchGameOn);
    }

}

class GameOn extends State {
    constructor(world) { super(world, 'Game on'); }

    execute(player, elapsedTime) {
        pitch.clock = millis() / 1000 - pitch.gameStarted;
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
            case KICKOFF:
                pitch.changeState(pchKickOff);
                return true;
            case TEAMS_READY_FOR_KICK_OFF:
                return true;
            case GOAL_SCORED:
                let teamNo = Number(tgram.extraInfo);
                score[teamNo]++;
                pitch.changeState(pchPrepForKickOff);
                return true;
            case STOP_GAME:
                pitch.changeState(pchEndMatch);
                return true;
        }
        return false;
    }

    execute(pitch, elapsedTime) {
        if (pitch.gameOn) pitch.clock = millis() / 1000 - pitch.gameStarted;
    }
}
