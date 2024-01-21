protected Vector2D hide(MovingEntity me, MovingEntity from) {
	double distToNearest = Double.MAX_VALUE;
	Vector2D bestHidingSpot = null;
	// Obstacle closest = null;

	// This maybe required by other behaviours
	if (obstacles == null)
		obstacles = world.getObstacles(me);
	if (obstacles == null || obstacles.size() < 2)
		return Vector2D.ZERO;

	for (Obstacle ob : obstacles) {
		// calculate the position of the hiding spot for this obstacle
		Vector2D hidingSpot = getHidingPosition(me, ob, from);

		// work in distance-squared space to find the closest hiding
		// spot to the agent
		double dist = Vector2D.distSq(hidingSpot, me.pos());

		if (dist < distToNearest) {
			distToNearest = dist;
			bestHidingSpot = hidingSpot;
		}
	}
	// if no suitable obstacles found then Evade the hunter
	if (bestHidingSpot == null)
		return evade(me, from);
	else // Go to hiding place
		return arrive(me, bestHidingSpot, FAST);
}