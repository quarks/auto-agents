class Entity {
    constructor(position) {
        this.type = ENTITY;
        this._pos = new Vector2D();
        this.id = Entity.NEXT_ID++;
        this._pos.set(position);
    }
    /**
     * @returns x position for testing in partition
     */
    oX() {
        return this._pos.x;
    }
    /**
     * @returns y position for testing in partition
     */
    oY() {
        return this._pos.y;
    }
    addFSM(fsm) {
        this.fsm = fsm;
    }
    colDetect(e, elist) { return false; }
}
Entity.NEXT_ID = 0;
//# sourceMappingURL=Entity.js.map