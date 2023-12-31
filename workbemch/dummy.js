private Vector2D calculatePrioritised() {
    double maxForce = owner.maxForce();
    accum.set(0, 0);
    f.set(0, 0);
    if ((flags & WALL_AVOID) != 0) {
        f = wallAvoidance();
        f.mult(weightings[BIT_WALL_AVOID]);
        if (!accumulateForce(accum, f, maxForce))
            return accum;
    }
    if ((flags & OBSTACLE_AVOID) != 0) {
        f = obstacleAvoidance();
        f.mult(weightings[BIT_OBSTACLE_AVOID]);
        if (!accumulateForce(accum, f, maxForce))
            return accum;
    }
    if ((flags & EVADE) != 0) {
        f = evade();
        f.mult(weightings[BIT_EVADE]);
        if (!accumulateForce(accum, f, maxForce))
            return accum;
    }
    if ((flags & FLEE) != 0) {
        f = flee();
        f.mult(weightings[BIT_FLEE]);
        if (!accumulateForce(accum, f, maxForce))
            return accum;
    }
    if ((flags & FLOCK) != 0) {
        f = flock();
        f.mult(weightings[BIT_FLOCK]);
        if (!accumulateForce(accum, f, maxForce))
            return accum;
    } else {
        if ((flags & SEPARATION) != 0) {
            f = separation();
            f.mult(weightings[BIT_SEPARATION]);
            if (!accumulateForce(accum, f, maxForce))
                return accum;
        }
        if ((flags & ALIGNMENT) != 0) {
            f = alignment();
            f.mult(weightings[BIT_ALIGNMENT]);
            if (!accumulateForce(accum, f, maxForce))
                return accum;
        }
        if ((flags & COHESION) != 0) {
            f = cohesion();
            f.mult(weightings[BIT_COHESION]);
            if (!accumulateForce(accum, f, maxForce))
                return accum;
        }
    }
    if ((flags & SEEK) != 0) {
        f = seek();
        f.mult(weightings[BIT_SEEK]);
        if (!accumulateForce(accum, f, maxForce))
            return accum;
    }
    if ((flags & ARRIVE) != 0) {
        f = arrive();
        f.mult(weightings[BIT_ARRIVE]);
        if (!accumulateForce(accum, f, maxForce))
            return accum;
    }
    if ((flags & WANDER) != 0) {
        f = wander();
        f.mult(weightings[BIT_WANDER]);
        if (!accumulateForce(accum, f, maxForce))
            return accum;
    }
    if ((flags & PURSUIT) != 0) {
        f = pursuit();
        f.mult(weightings[BIT_PURSUIT]);
        if (!accumulateForce(accum, f, maxForce))
            return accum;
    }
    if ((flags & OFFSET_PURSUIT) != 0) {
        f = offsetPursuit();
        f.mult(weightings[BIT_OFFSET_PURSUIT]);
        if (!accumulateForce(accum, f, maxForce))
            return accum;
    }
    if ((flags & INTERPOSE) != 0) {
        f = interpose();
        f.mult(weightings[BIT_INTERPOSE]);
        if (!accumulateForce(accum, f, maxForce))
            return accum;
    }
    if ((flags & HIDE) != 0) {
        f = hide();
        f.mult(weightings[BIT_HIDE]);
        if (!accumulateForce(accum, f, maxForce))
            return accum;
    }
    if ((flags & PATH) != 0) {
        f = pathFollow();
        f.mult(weightings[BIT_PATH]);
        if (!accumulateForce(accum, f, maxForce))
            return accum;
    }
    return accum;
}
