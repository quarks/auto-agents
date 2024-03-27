class Entity {

    static #NEXT_ID = 0;

    constructor(position: Array<number> | _XY_ = Vector2D.ZERO, colRadius = 1) {
        this.#id = Entity.#NEXT_ID++;
        this.#pos = Vector2D.from(position);
        this.#colRad = colRadius;
    }

    /** Every entity should be given a unique ID number */
    #id: number;
    get id(): number { return this.#id; }

    /** Position */
    #pos: Vector2D = new Vector2D();
    get pos(): Vector2D { return this.#pos }
    set pos(v: Vector2D) { this.#pos = v; }
    setPos(v: Vector2D) { this.#pos = v; return this; }
    /** Position coordinates */
    get x(): number { return this.#pos.x; }
    get y(): number { return this.#pos.y; }

    /** The colision radius */
    #colRad: number = 0;
    get colRad(): number { return this.#colRad; }
    set colRad(value) { this.#colRad = value; }
    setColRad(value: number): Entity { this.#colRad = value; return this; }

    /** The tag property */
    #tag: string | number;
    get tag(): string | number { return this.#tag; }
    set tag(value) { this.#tag = value; }
    setTag(value: number | number): Entity { this.#tag = value; return this; }

    /** The finite state machine */
    #fsm: FiniteStateMachine;
    get fsm(): FiniteStateMachine { return this.#fsm; }
    enableFsm(world: World): Entity { this.#fsm = new FiniteStateMachine(this, world); return this; };

    /** Set the renderer */
    #painter: Function;
    set painter(painter: Function) { this.#painter = painter; }
    setPainter(painter: Function): Entity { this.#painter = painter; return this; }

    /** visibility */
    #visible = true;
    show(): Entity { this.#visible = true; return this; }
    hide(): Entity { this.#visible = false; return this; }
    isVisible() { return this.#visible; }

    /** The z-order display order property */
    __Z: number = 0;
    get Z(): number { return this.__Z; }
    set Z(value) { this.__Z = value; }

    /** Override this in entities reqiiring special actions e.g. Obstacle, Fence */
    born(world: World): Entity {
        world.births.push(this);
        return this;
    }

    /** Override this in entities reqiiring special actions e.g. Fence */
    dies(world: World): Entity {
        world.deaths.push(this);
        return this;
    }

    fitsInside(lowX: number, lowY: number, highX: number, highY: number): boolean {
        let p = this.#pos, cr = this.#colRad;
        return p.x - cr >= lowX && p.x + cr <= highX && p.y - cr >= lowY && p.y + cr <= highY;
    }

    isEitherSide(p0: Vector2D, p1: Vector2D): boolean {
        return Geom2D.line_circle(p0.x, p0.y, p1.x, p1.y,
            this.pos.x, this.pos.y, this.colRad);
    }

    update(elapsedTime: number, world: World): void { }


    currentState(): State { return this.#fsm?.currentState; }

    isCurrentState(state: State): boolean { return this.#fsm?.currentState == state; }

    changeState(newState: State) { this.#fsm?.changeState(newState); }

    revertToPreviousState() { this.#fsm?.revertToPreviousState(); }

    hasFSM() { return this.#fsm ? true : false; }


    render(elapsedTime: number, world: World) { if (this.isVisible) this.#painter?.call(this, elapsedTime, world); }

    $$() {
        console.log(this.toString());
    }

    $() {
        return this.toString();
    }

    toString(): string {
        return `${this.constructor.name}  @  [${this.x.toFixed(2)}, ${this.y.toFixed(2)}]  Col. radius: ${this.colRad.toFixed(2)}`;
    }
}

