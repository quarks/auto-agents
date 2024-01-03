
wander(owner: Vehicle, elapsedTime: number) {
    let wanderAngleDelta = this._maxWanderAngleJitter * elapsedTime;
    this._wanderAngle += wanderAngleDelta * (Math.random() - Math.random());
    this._wanderAngle += (this._wanderAngle < WANDER_MIN_ANGLE) ? WANDER_ANGLE_RANGE :
        (this._wanderAngle > WANDER_MAX_ANGLE) ? -WANDER_ANGLE_RANGE : 0;
    let targetLocal = new Vector2D(this._wanderRadius * Math.cos(this._wanderAngle),
        this._wanderRadius * Math.cos(this._wanderAngle));
    targetLocal = targetLocal.add(this._wanderDist);
    let targetWorld = Transformations.pointToWorldSpace(targetLocal,
        owner.heading.normalize(), owner.side.normalize(), owner.pos);
    return targetWorld;
}