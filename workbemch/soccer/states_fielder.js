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

    onMessage(player, tgram) {
        switch (tgram.msgID) {
            case CHASE_BALL:
                player.changeState(plyChaseBall);
                return true;
        }
    }

    exit(player) {
        player.pilot.arriveOff();
    }
}


class ReceiveBall extends State {

    constructor(world) { super(world, 'Receive ball'); }

    enter(player) { }

    onMessage(player, tgram) { }

    execute(player, elapsedTime) { }

    exit(player) { }
}


class KickBall extends State {
    constructor(world) { super(world, 'Kick ball'); }

    enter(player) {
        player.team.setControllingPlayer(player);
        if (!ball.readyToBeKickedBy(player))
            player.changeState(plyChaseBall);
    }

    execute(player, elapsedTime) {
        let toBall = ball.pos.sub(player.pos);
        let dot = player.heading.dotNorm(toBall);

        let power = (0.6 + 0.4 * dot) * MaxShootingForce;
        let ballTarget = player.pos.add(player.vel);
        ball.kick(player, player.vel, power);
        player.changeState(plyChaseBall);
    }

    exit(player) {
    }
}


class Dribble extends State {

    constructor(world) { super(world, 'Dribble'); }

    enter(player) {
        player.team.setControllingPlayer(player);
    }

    onMessage(player, tgram) { }

    execute(player, elapsedTime) { }

    exit(player) { }
}


class ChaseBall extends State {
    constructor(world) { super(world, 'Chase ball'); }

    enter(player) {
        player.pilot.seekOn(ball.pos);
    }

    execute(player, elapsedTime) {
        if (player.isBallWithinKickingRange()) {
            player.changeState(plyKickBall);
            return;
        }
        if (player.isClosestToBall()) {
            player.pilot.target = ball.pos;
            return;
        }
        player.changeState(plyReturnHome);
    }

    exit(player) {
        player.pilot.seekOff();
    }
}

class ReturnHome extends State {
    constructor(world) { super(world, 'Return to home region'); }

    enter(player) {
        player.pilot.arriveOn(player.homeRegionPos);
        player.headingAtRest = player.team.norm;
    }

    execute(player, elapsedTime) {
        if (player.isAtTarget()) {
            pitch.counterB++;
            player.vel = new Vector2D(0, 0);
            player.trackBall();
            player.changeState(plyWait);
        }
    }

    exit(player) {
        player.pilot.arriveOff();

    }
}


class SupportAttacker extends State {

    constructor(world) { super(world, 'Support attacker'); }

    enter(player) { }

    onMessage(player, tgram) { }

    execute(player, elapsedTime) { }

    exit(player) { }
}


class LeavePitch extends State {
    constructor(world) { super(world, 'Leave Pitch'); }

    enter(player) {
        player.pilot.arriveOn(player.offPitchPos, FAST);
        player.headingAtRest = player.offPitchHeading;
    }

    execute(player, elapsedTime) {
        if (player.isAtTarget()) {
            this.sendMessage(0, player, pitch, ARIVED_OFF_PITCH);
            pitch.counterA++;
            player.changeState(plyWait);
        }
    }

    exit(player) {
        player.pilot.arriveOff();
    }
}


class PlayerGlobal extends State {

    constructor(world) { super(world, 'State  goal'); }

    enter(player) { }

    onMessage(player, tgram) {
        switch (tgram.msgID) {
            case RETURN_HOME:
                player.changeState(plyReturnHome);
                return true;
            case LEAVE_PITCH:
                player.changeState(plyLeavePitch);
                return true;

        }
        return false;
    }

    execute(player, elapsedTime) { }

    exit(player) { }
}
