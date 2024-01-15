protected Vector2D obstacleAvoidance(MovingEntity me) {
    // Vector2D desiredVelocity = new Vector2D();
    Vector2D desiredVelocity = Vector2D.ZERO;

    // This maybe required by other behaviours
    if (obstacles == null)
        obstacles = world.getObstacles(me);
    if (obstacles == null || obstacles.isEmpty())
        return desiredVelocity;

    Obstacle closestIO = null;
    double distToClosestIP = Double.MAX_VALUE;
    Vector2D localPosOfClosestIO = null;
    double dboxLength = detectBoxLength * (1.0 + me.speed() / me.maxSpeed());

    Vector2D velocity = Vector2D.normalize(me.velocity());
    Vector2D vside = velocity.getPerp();

    for (Obstacle ob : obstacles) {
        Vector2D localPos = Transformations.pointToLocalSpace(ob.pos(), velocity, vside, me.pos());
        double expandedRadius = ob.colRadius() + me.colRadius();
        if (localPos.x >= 0 && localPos.x < dboxLength + expandedRadius) {
            if (FastMath.abs(localPos.y) < expandedRadius) {
                double cX = localPos.x;
                double cY = localPos.y;
                double sqrtPart = FastMath.sqrt(expandedRadius * expandedRadius - cY * cY);

                double ip = cX - sqrtPart;
                if (ip <= 0)
                    ip = cX + sqrtPart;

                if (ip < distToClosestIP) {
                    distToClosestIP = ip;
                    closestIO = ob;
                    localPosOfClosestIO = localPos;
                }
            }
        }
    } // end of for loop
    Vector2D sForce = new Vector2D();
    if (closestIO != null) {
        double multiplier = 1.0 + (dboxLength - localPosOfClosestIO.x) / dboxLength;
        sForce.y = (closestIO.colRadius() - localPosOfClosestIO.y) * multiplier;
        double breakingWeight = 0.01;
        sForce.x = (closestIO.colRadius() - localPosOfClosestIO.x) * breakingWeight;
        desiredVelocity = Transformations.vectorToWorldSpace(sForce, velocity, vside);
    }
    return desiredVelocity;
}
