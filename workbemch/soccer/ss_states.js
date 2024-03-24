class PitchGlobal extends State {

    constructor(world) {
        super(world, 'Pitch Global State');
    }

    enter(user) { }

    execute(user, elapsedTime) { }

    exit(user) { }

    onMessage(user, tgram) {
        switch (tgram.msgID) {
            case PREPARE_FOR_KICKOFF:
                return false;
            case TEAMS_READY_FOR_KICK_OFF:
                return false;
            case GOAL_SCORED:
                return false;
            case STOP_GAME:
                return false;
        }
        return false;
    }
}

class StartMatch extends State {
    constructor(world) {
        super(world, 'Game start');
    }

    enter(user) {

    }
}

class EndMatch extends State { // Pitch state
    constructor(world) {
        super(world, 'End match');
    }

    enter(pitch) {
        pitch.counter = 0;
        pitch.ball.pos = pitch.centerSpot;
        pitch.ball.vel = Vector2D.ZERO;
        for (let p of pitch.getAllPlayers()) {
            p.changeState(plyLeavePitch);
        }
    }

    execute(pitch, elapsedTime) {
        if (pitch.counter >= 10) pitch.changeState(preMatch);
    }

    exit(pitch) {
        pitch.team[0].setTeamMode(DEFENDING, false);
        pitch.team[1].setTeamMode(DEFENDING, false);
    }
}

class PreMatch extends State { // Pitch state
    constructor(world) {
        super(world, 'Pre match');
    }

    enter(pitch) {
        pitch.changeTeamColors();
    }

    execute(pitch, elapsedTime) {

    }

    exit(pitch) {

    }
}

class ReturnToHomeRegion extends State {

    constructor(world) {
        super(world, 'Return to home region');
    }

    enter(player) {
        player.pilot.arriveOn(player.homeRegionPos);
        player.headingAtRest = player.team.norm;
    }

    execute(player, elapsedTime) {
        if (player.isAtTarget()) {
            player.pilot.arriveOff();
            player.changeState(plyWait);
        }
    }

    exit(player) {
        player.team.pitch.counter++;
        // console.log(`Returned home ${player.team.pitch.counter}`);
    }

}


class LeavePitch extends State { // Player state

    constructor(world) {
        super(world, 'Leave Pitch');
    }

    enter(player) {
        player.pilot.arriveOn(player.offPitchPos, FAST);
        player.headingAtRest = player.offPitchHeading;
    }

    execute(player, elapsedTime) {
        if (player.isAtTarget()) {
            player.pilot.arriveOff();
            player.changeState(plyWait);
        }
    }

    exit(player) {
        player.team.pitch.counter++;
        // console.log(`Arrived off pitch ${player.team.pitch.counter}`);
    }

}

class Wait extends State {

    constructor(world) {
        super(world, 'Wait');
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