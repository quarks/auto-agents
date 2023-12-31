class World {
    constructor(wsizeX, wsizeY, depth = 1) {
        this._postman = new Dispatcher(this);
        this._population = new Map();
        this._births = [];
        this._deaths = [];
        this._domain = new Domain(0, 0, wsizeX, wsizeY);
        this._tree = QPart.makeTree(0, 0, wsizeX, wsizeY, depth);
    }
    get postman() { return this._postman; }
    set painter(painter) { this._painter = painter; }
    birth(entity) {
        if (entity)
            this._births.push(entity);
    }
    death(entity) {
        if (Number.isFinite(entity))
            entity = this._population.get(Number(entity));
        if (entity instanceof Entity)
            this._deaths.push(entity);
    }
    update(elapsedTime) {
        // ======================================================================
        // Births and deaths
        while (this._births.length > 0)
            this._addEntity(this._births.pop());
        while (this._deaths.length > 0)
            this._subEntity(this._deaths.pop());
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
        for (let e of this._population.values())
            e.render();
    }
    _addEntity(entity) {
        this._population.set(entity.id, entity);
        this._tree.addEntity(entity);
        entity.world = this;
    }
    _subEntity(entity) {
        this._population.delete(entity.id);
        this._tree.subEntity(entity);
        entity.world = undefined;
    }
}
//# sourceMappingURL=world.js.map