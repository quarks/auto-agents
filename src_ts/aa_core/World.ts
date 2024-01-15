class World {
    _domain: Domain;

    // Internal collection of entites to be added or removed
    // during world.update
    _births: Array<Entity>;
    _deaths: Array<Entity>;

    _biggestObsColRad = 0;

    _population: Map<number, Entity>;
    get population(): Array<Entity> { return [...this._population.values()]; }

    _postman: Dispatcher;
    get postman(): Dispatcher { return this._postman; }

    _painter: Function;
    set painter(painter: Function) { this._painter = painter; }

    get oX(): number { return this._domain.lowX }
    get oY(): number { return this._domain.lowY }
    get width(): number { return this._domain.width }
    get height(): number { return this._domain.height }

    _tree: QPart;
    get tree(): QPart { return this._tree }

    /** Size of top layer */
    _treeSize: number;

    constructor(wsizeX: number, wsizeY: number, depth: number = 1) {
        this._postman = new Dispatcher(this);
        this._population = new Map<number, Entity>();
        this._births = [];
        this._deaths = [];
        this._domain = new Domain(0, 0, wsizeX, wsizeY);
        this._treeSize = Math.max(wsizeX, wsizeY);
        this._tree = QPart.makeTree(0, 0, this._treeSize, this._treeSize, depth);
    }

    birth(entity: Entity) {
        if (entity.type == OBSTACLE)
            this._biggestObsColRad = Math.max(this._biggestObsColRad, entity.colRad);
        if (entity) this._births.push(entity);
    }

    death(entity: Entity | number) {
        if (Number.isFinite(entity))
            entity = this._population.get(Number(entity));
        if (entity instanceof Entity)
            this._deaths.push(entity);
    }


    update(elapsedTime: number): void {
        // ======================================================================
        // Births and deaths
        while (this._births.length > 0) this._addEntity(this._births.pop());
        while (this._deaths.length > 0) this._subEntity(this._deaths.pop());
        // ======================================================================
        // Process telegrams
        this._postman?.update();
        // ======================================================================
        // Update FSMs
        [...this._population.values()].forEach(v => v.fsm?.update(elapsedTime, this));
        // ======================================================================
        // Update all entities
        [...this._population.values()].forEach(v => v.update(elapsedTime, this));

        // ======================================================================
        // Correct partition data
        this._tree.correctPartitionContents();
    }

    render() {
        this._painter?.call(this);
        for (let e of this._population.values()) e.render();
    }

    _addEntity(entity: Entity) {
        this._population.set(entity.id, entity);
        this._tree.addEntity(entity);
        entity.world = this;
    }

    _subEntity(entity: Entity) {
        this._population.delete(entity.id);
        this._tree.subEntity(entity);
        entity.world = undefined;
    }

}