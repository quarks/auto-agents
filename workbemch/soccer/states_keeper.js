class TendGoal extends State {

    constructor(world) { super(world, 'Tend goal'); }

    enter(keeper) {
        let target = keeper.getRearInterposeTarget();
        target.$$();
        keeper.pilot.interposeOn(keeper.pitch.ball, target);
    }

    onMessage(keeper, tgram) { return false; }

    execute(keeper, elapsedTime) {
        // Update interpose rear tragte (position to protect on goal line)
        Vector2D.mutate(keeper.pilot.agent1.pos, keeper.getRearInterposeTarget());


        if (keeper.isBallWithinRange()) {
            keeper.team.pitch.ball.trap();
            keeper.team.pitch.keeperHasBall = true;
            keeper.changeState(kprPutBallBackInPlay);
            return;
        }

        // // If within intercept range and the other team are in control go for it
        // if (keeper.isBallWithinInterceptRange() && !keeper.team.isInControl()) {
        //     keeper.changeState(kprInterceptBall);
        //     return;
        // }
        // // If within intercept range and keepers team are in control go for it
        // if (keeper.isBallWithinInterceptRange() && keeper.team.isInControl() && keeper.team.getReceivingPlayer() == null) {
        //     keeper.FSM().changeState(kprInterceptBall);
        //     return;
        // }

        // if (keeper.tooFarFromGoalMouth() && keeper.team.isInControl()) {
        //     keeper.changeState(kprReturnHome);
        //     return;
        // }
    }

    exit(keeper) {
        keeper.pilot.interposeOff();
    }
}


class PutBallBackInPlay extends State {

    constructor(world) { super(world, 'Put back back in play name'); }

    enter(keeper) { }

    onMessage(keeper, tgram) { }

    execute(keeper, elapsedTime) { }

    exit(keeper) { }
}

class InterceptBall extends State {

    constructor(world) { super(world, 'State name'); }

    enter(keeper) { }

    onMessage(keeper, tgram) { }

    execute(keeper, elapsedTime) { }

    exit(keeper) { }
}

class KeeperGlobal extends State {

    constructor(world) { super(world, 'State name'); }

    enter(keeper) { }

    onMessage(keeper, tgram) {
        switch (tgram.msgID) {
            case RETURN_HOME:
                console.log('Return home')
                keeper.changeState(kprReturnHome);
                return true;
            case RECEIVE_BALL:
                keeper.changeState(kprInterceptBall);
                return true;
            case LEAVE_PITCH:
                keeper.changeState(plyLeavePitch);
                return true;
        }
        return false;
    }

    execute(keeper, elapsedTime) { }

    exit(keeper) { }
}



// class KeeperReturnHome extends State {
//     constructor(world) { super(world, 'Return to home region'); }

//     enter(keeper) {
//         keeper.pilot.arriveOn(keeper.homeRegionPos);
//         keeper.headingAtRest = keeper.team.norm;
//     }

//     execute(keeper, elapsedTime) {
//         if (keeper.isAtTarget()) {
//             keeper.pitch.counterB++;
//             keeper.vel = new Vector2D(0, 0);
//             keeper.trackBall();
//             keeper.changeState(plyWait);
//         }
//     }

//     exit(keeper) {
//         keeper.pilot.arriveOff();

//     }
// }