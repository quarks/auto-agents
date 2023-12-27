class World {
    _domain: Domain;
    _painter: Function;
    _tree: QPart;
    _population: Map<number, Entity>;
    _births: Array<Entity>;
    _deaths: Array<Entity>;

    _postman: Dispatcher;

    get postman(): Dispatcher { return this._postman; }

    set painter(painter: Function) { this._painter = painter; }

    constructor(wsizeX: number, wsizeY: number, depth: number = 1) {
        this._postman = new Dispatcher(this);
        this._population = new Map<number, Entity>();
        this._births = [];
        this._deaths = [];
        this._domain = new Domain(0, 0, wsizeX, wsizeY);
        this._tree = QPart.makeTree(0, 0, wsizeX, wsizeY, depth);
    }

    birth(entity: Entity) {
        if (entity) this._births.push(entity);
    }

    death(entity: Entity | number) {
        if (Number.isFinite(entity))
            entity = this._population.get(Number(entity));
        if (entity instanceof Entity)
            this._deaths.push(entity);
    }



    update(elapsedTime: number): void {
        // Births and deaths
        while (this._births.length > 0) this._addEntity(this._births.pop());
        while (this._deaths.length > 0) this._subEntity(this._deaths.pop());
        // Process telegrams
        this._postman?.update();
        // Entity movement
        for (let e of this._population.values()) e.update(elapsedTime, this);
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