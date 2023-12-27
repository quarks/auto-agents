class Entity {
    constructor(position, colRadius = 0) {
        this._type = ENTITY;
        this._visible = true;
        this._pos = new Vector2D();
        this._zorder = 0;
        this._colRad = 0;
        this._id = Entity.NEXT_ID++;
        this._pos = Vector2D.from(position);
        this.colRad = colRadius;
    }
    /** Position coordinates */
    get x() { return this._pos.x; }
    get y() { return this._pos.y; }
    get pos() { return this._pos; }
    ;
    /** The colision radius */
    get world() { return this._world; }
    set world(world) { this._world = world; }
    /** The colision radius */
    get colRad() { return this._colRad; }
    set colRad(value) { this._colRad = value; }
    /** Get the id property */
    get id() { return this._id; }
    /** Get the entity type  */
    get type() { return this._type; }
    /** The tag property */
    get tag() { return this._tag; }
    set tag(value) { this._tag = value; }
    /** The finite state machine */
    get fsm() { return this._fsm; }
    set fsm(value) { this._fsm = value; }
    /** Set the renderer */
    set painter(painter) { this._painter = painter; }
    /** Get the z-order property */
    get Z() { return this._zorder; }
    /** Set the z-order property */
    set Z(value) { this._zorder = value; }
    isInDomain(d, inclusive = true) {
        if (this.x >= d.lowX && this.y >= d.lowY) {
            return inclusive ?
                (this.x <= d.highX && this.y <= d.highY) :
                (this.x < d.highX && this.y < d.highY);
        }
        return false;
    }
    fitsInside(lowX, lowY, highX, highY) {
        let p = this._pos, cr = this._colRad;
        // let result = p.x - cr >= lowX && p.x + cr <= highX && p.y - cr >= lowY && p.y + cr <= highY;
        // if (this.id == 1) {
        //     console.log(`${p.x - cr} >= ${lowX} && ${p.x + cr} <= ${highX} && ${p.y - cr} >= ${lowY} && ${p.y + cr} <= ${highY}   Result ${result}`)
        // }
        return p.x - cr >= lowX && p.x + cr <= highX && p.y - cr >= lowY && p.y + cr <= highY;
    }
    update(elapsedTime, world) {
    }
    changeState(newState) {
        this._fsm?.changeState(newState);
    }
    revertToPreviousState() {
        this._fsm?.revertToPreviousState();
    }
    render() {
        this._painter?.call(this);
    }
    /** See if entity has FSM */
    hasFSM() {
        return this._fsm ? true : false;
    }
    colDetect(e, elist) { return false; }
}
Entity.NEXT_ID = 0;
//# sourceMappingURL=entity.js.map