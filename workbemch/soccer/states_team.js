class Defending extends State {
    constructor(world) { super(world, 'Defend'); }

    enter(team) {
        team.player.forEach(p => {
            let cstate = p.fsm.currentState;
            p.homeRegion = p.defRegion;
            if (cstate == plyWait || cstate == plyReturnHome)
                p.changeState(plyReturnHome);
            else
                console.log(cstate?.name)
        });
    }

    execute(team, elapsedTime) {
        if (team.isInControl()) team.changeState(tmAttacking);
    }

    onMessage(team, tgram) { }

    exit(team) { }
}

class Attacking extends State {
    constructor(world) { super(world, 'Attack'); }

    enter(team) {
        team.player.forEach(p => {
            let cstate = p.fsm.currentState;
            p.homeRegion = p.attRegion;
            if (cstate == plyWait || cstate == plyReturnHome)
                p.changeState(plyReturnHome);
        });
    }

    execute(team, elapsedTime) {
        if (!team.isInControl()) team.changeState(tmDefending);
    }

    onMessage(team, tgram) { }

    exit(team) { }
}


class TeamGlobal extends State {

    constructor(world) { super(world, 'State  goal'); }

    enter(team) { }

    onMessage(team, tgram) {
        switch (tgram.msgID) {
            case RETURN_HOME:
                team.changeState(plyReturnHome);
                return true;
            case LEAVE_PITCH:
                team.changeState(plyLeavePitch);
                return true;

        }
        return false;
    }

    execute(team, elapsedTime) { }

    exit(team) { }
}
