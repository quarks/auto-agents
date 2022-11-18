abstract class Entity {

    static NEXT_ID = 0;

    type = ENTITY;
    id: number;
    _pos: Vector2D = new Vector2D();
    fsm: FiniteStateMachine;

    constructor(position: Vector2D) {
        this.id = Entity.NEXT_ID++;
        this._pos.set(position);
    }

    /**
     * @returns x position for testing in partition
     */
    oX(): number {
        return this._pos.x;
    }

    /**
     * @returns y position for testing in partition
     */
    oY(): number {
        return this._pos.y;
    }

    addFSM(fsm: FiniteStateMachine) {
        this.fsm = fsm;
    }

    colDetect(e, elist){return false;}

    abstract fits_inside(lowX: number, lowY: number, highX: number, highY: number): boolean;

    abstract update(elapsedTime: number, world :World): void;

}

