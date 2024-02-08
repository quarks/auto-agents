	// the current angle to target on the wander circle
	private double wanderAngle = 0;
	// the maximum amount of angular displacement per second
	private double wanderAngleJitter = 60;
	// the radius of the constraining circle for the wander behaviour
	private double wanderRadius = 20.0;
	// distance the wander circle is projected in front of the agent
	private double wanderDist = 60.0;
	// The maximum angular displacement in this frame.
	private double wanderAngleDelta = 0;

	/**
	 * WANDER
	 * Used internally to calculate the wander force
	 */
	private Vector2D wander() {
    // this behaviour is dependent on the update rate, so this line must
    // be included when using time independent frame rate.
    wanderAngleDelta = wanderAngleJitter * deltaTime;
    wanderAngle += wanderAngleDelta * MathUtils.randomClamped();
    // Not really essential considering the range of the type double.
    if (wanderAngle < WANDER_MIN_ANGLE)
        wanderAngle += WANDER_ANGLE_RANGE;
    else if (wanderAngle > WANDER_MAX_ANGLE)
        wanderAngle -= WANDER_ANGLE_RANGE;

    // Calculate position on wander circle
    Vector2D targetLocal = new Vector2D(wanderRadius * FastMath.cos(wanderAngle),
            wanderRadius * FastMath.sin(wanderAngle));
    // Add wander distance
    targetLocal.add(wanderDist, 0);

    // project the target into world space
    Vector2D targetWorld = Transformations.pointToWorldSpace(targetLocal,
        owner.heading(),
        owner.side(),
        owner.pos());

    // and steer towards it
    targetWorld.sub(owner.pos());
    return targetWorld;
}
