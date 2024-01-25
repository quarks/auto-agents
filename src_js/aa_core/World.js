class World {
    constructor(wsizeX, wsizeY, depth = 1) {
        // Largest obstacle collision radius
        this._biggestObsColRad = 0;
        this._postman = new Dispatcher(this);
        this._population = new Map();
        this._births = [];
        this._deaths = [];
        this._domain = new Domain(0, 0, wsizeX, wsizeY);
        this._treeSize = Math.max(wsizeX, wsizeY);
        this._tree = QPart.makeTree(0, 0, this._treeSize, this._treeSize, depth);
    }
    get domain() { return this._domain; }
    get population() { return [...this._population.values()]; }
    get postman() { return this._postman; }
    set painter(painter) { this._painter = painter; }
    get oX() { return this._domain.lowX; }
    get oY() { return this._domain.lowY; }
    get width() { return this._domain.width; }
    get height() { return this._domain.height; }
    get tree() { return this._tree; }
    birth(entity) {
        if (entity.type == OBSTACLE)
            this._biggestObsColRad = Math.max(this._biggestObsColRad, entity.colRad);
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
        while (this._deaths.length > 0)
            this._subEntity(this._deaths.pop());
        while (this._births.length > 0)
            this._addEntity(this._births.pop());
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
        // Ensure Zero  Overlap
        this.ensureNoOverlap();
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
    ensureNoOverlap() {
        let mvrs = this.population.filter(e => e instanceof Mover);
        let n = mvrs.length;
        for (let i = 0; i < n - 2; i++)
            for (let j = i + 1; j < n - 1; j++)
                this._ensureNoMoverOverlap(mvrs[i], mvrs[j]);
    }
    _ensureNoMoverOverlap(mvr0, mvr1) {
        let cnLen = Vector2D.dist(mvr1.pos, mvr0.pos);
        let overlap = mvr0.colRad + mvr1.colRad - cnLen;
        if (overlap > 0) {
            let cnVec = mvr1.pos.sub(mvr0.pos).div(cnLen);
            let mass = mvr0.mass + mvr1.mass;
            mvr0.pos = mvr0.pos.sub(cnVec.mult(overlap * mvr1.mass / mass));
            mvr1.pos = mvr1.pos.add(cnVec.mult(overlap * mvr0.mass / mass));
            //     console.log(`Overlap ${overlap.toPrecision(4)}   Prev: ${mvr1.prevPos.$(4)}  Curr: ${mvr1.pos.$(4)}  Dist: ${Vector2D.dist(mvr1.pos, mvr1.prevPos)}`);
        }
    }
}
//# sourceMappingURL=world.js.map