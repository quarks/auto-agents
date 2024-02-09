var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _World_births, _World_deaths, _World_domain, _World_population, _World_postman, _World_painter;
class World {
    constructor(wsizeX, wsizeY, depth = 1, border = 0) {
        _World_births.set(this, void 0);
        _World_deaths.set(this, void 0);
        _World_domain.set(this, void 0);
        _World_population.set(this, void 0);
        _World_postman.set(this, void 0);
        _World_painter.set(this, void 0);
        // Largest obstacle collision radius
        this._maxObstacleSize = 0;
        this._preventOverlap = true;
        this._width = wsizeX;
        this._height = wsizeY;
        __classPrivateFieldSet(this, _World_postman, new Dispatcher(this), "f");
        __classPrivateFieldSet(this, _World_population, new Map(), "f");
        __classPrivateFieldSet(this, _World_births, [], "f");
        __classPrivateFieldSet(this, _World_deaths, [], "f");
        __classPrivateFieldSet(this, _World_domain, new Domain(0, 0, wsizeX, wsizeY), "f");
        let ts = Math.max(wsizeX, wsizeY) + 2 * border;
        this._tree = QPart.makeTree(-(ts - wsizeX) / 2, -(ts - wsizeY) / 2, ts, depth);
    }
    get births() { return __classPrivateFieldGet(this, _World_births, "f"); }
    get deaths() { return __classPrivateFieldGet(this, _World_deaths, "f"); }
    get domain() { return __classPrivateFieldGet(this, _World_domain, "f"); }
    get populationMap() { return __classPrivateFieldGet(this, _World_population, "f"); }
    get population() { return [...__classPrivateFieldGet(this, _World_population, "f").values()]; }
    get postman() { return __classPrivateFieldGet(this, _World_postman, "f"); }
    set painter(painter) { __classPrivateFieldSet(this, _World_painter, painter, "f"); }
    get width() { return this._width; }
    get height() { return this._height; }
    get tree() { return this._tree; }
    get isPreventOverlapOn() { return this._preventOverlap; }
    ;
    set preventOverlap(b) { this._preventOverlap = b; }
    birth(entity) {
        if (entity instanceof Obstacle)
            this._maxObstacleSize = Math.max(this._maxObstacleSize, entity.colRad);
        if (entity)
            __classPrivateFieldGet(this, _World_births, "f").push(entity);
    }
    death(entity) {
        if (Number.isFinite(entity))
            entity = __classPrivateFieldGet(this, _World_population, "f").get(Number(entity));
        if (entity instanceof Entity)
            __classPrivateFieldGet(this, _World_deaths, "f").push(entity);
    }
    update(elapsedTime) {
        // ======================================================================
        // Births and deaths
        while (__classPrivateFieldGet(this, _World_deaths, "f").length > 0)
            this._subEntity(__classPrivateFieldGet(this, _World_deaths, "f").pop());
        while (__classPrivateFieldGet(this, _World_births, "f").length > 0)
            this._addEntity(__classPrivateFieldGet(this, _World_births, "f").pop());
        // ======================================================================
        // Process telegrams
        __classPrivateFieldGet(this, _World_postman, "f")?.update();
        // ======================================================================
        // Update FSMs
        [...__classPrivateFieldGet(this, _World_population, "f").values()].forEach(v => v.fsm?.update(elapsedTime, this));
        // ======================================================================
        // Update all entities
        [...__classPrivateFieldGet(this, _World_population, "f").values()].forEach(v => v.update(elapsedTime, this));
        // ======================================================================
        // Ensure Zero Overlap?
        if (this._preventOverlap)
            this._ensureNoOverlap();
        // ======================================================================
        // Correct partition data
        this._tree.correctPartitionContents();
    }
    render() {
        __classPrivateFieldGet(this, _World_painter, "f")?.call(this);
        for (let e of __classPrivateFieldGet(this, _World_population, "f").values())
            e.render();
    }
    quadtreeAnalysis() {
        let a = [];
        let d = this.tree.getTreeLevelData();
        let m = d.movers, o = d.obstacles, w = d.walls;
        a.push('#########   Quadtree Analysis Data   #########');
        a.push(`Depth    :   ${d.depth} level(s)`);
        a.push(`Position :   X ${d.lowX.toFixed(2)}   Y ${d.lowX.toFixed(2)}`);
        a.push(`Size     :   Tree ${d.treesize.toFixed(1)}   Leaf ${d.leafsize.toFixed(1)}`);
        if (m.length > 0) {
            let mvrs = this.population.filter(e => e instanceof Mover);
            let minCR = mvrs[0].colRad, maxCR = mvrs[0].colRad;
            mvrs.forEach(m => {
                minCR = Math.min(minCR, m.colRad);
                maxCR = Math.max(maxCR, m.colRad);
            });
            a.push(`Movers col. radius :  Min ${minCR.toFixed(1)}   Max ${maxCR.toFixed(1)}`);
        }
        let hr = '===================';
        let r0 = '  Levels > |  All |';
        let r1 = '-----------+------+';
        for (let i = 1; i <= d.depth; i++) {
            r0 += i.toString().padStart(4, ' ') + '  |';
            r1 += '------+';
            hr += '=======';
        }
        let r2 = 'Obstacles  |', r3 = 'Walls      |', r4 = 'Movers     |';
        for (let i = 0; i <= d.depth; i++) {
            r2 += o[i].toString().padStart(5, ' ') + ' |';
            r3 += w[i].toString().padStart(5, ' ') + ' |';
            r4 += m[i].toString().padStart(5, ' ') + ' |';
        }
        a.push(hr, r0, r1, r2, r3, r4, hr);
        // Now calculate factor
        let total = this._nbrTests > 0 ? this._nbrTests :
            this._estimateNbrTests(m, d.lowX, d.lowY, d.treesize, d.depth);
        // Brute force count 
        let bfc = m[0] * (m[0] - 1) / 2 - (m[0] - 1); //Quadtree with just 1 level
        let qtFactor = Math.round((100 * (bfc - total) / bfc));
        a.push(`Quadtree effectiveness:  ${qtFactor}% (rough estimate)`);
        console.log(a.join('\n'));
        return a;
    }
    _estimateNbrTests(movers, lowX, lowY, treesize, depth) {
        let prevCumAvg = 0, total = 1 - movers[0];
        for (let lvl = 1; lvl <= depth; lvl++) {
            let ftr = 2 ** (lvl - 1) / treesize;
            let x0 = -lowX * ftr, x1 = (this.width - lowX) * ftr;
            let y0 = -lowY * ftr, y1 = (this.height - lowY) * ftr;
            let nbrParts = (Math.ceil(x1) - Math.floor(x0)) * (Math.ceil(y1) - Math.floor(y0));
            let partAvg = movers[lvl] / nbrParts;
            total += nbrParts * (partAvg * (partAvg - 1) / 2 + prevCumAvg * partAvg);
            prevCumAvg = prevCumAvg + partAvg;
        }
        return total;
    }
    _addEntity(entity) {
        __classPrivateFieldGet(this, _World_population, "f").set(entity.id, entity);
        this._tree.addEntity(entity);
        entity.world = this;
    }
    _subEntity(entity) {
        __classPrivateFieldGet(this, _World_population, "f").delete(entity.id);
        this._tree.subEntity(entity);
        entity.world = undefined;
    }
    _ensureNoOverlap() {
        function processPartitionData(part, w) {
            if (part.hasChildren)
                for (let child of part.children)
                    processPartitionData(child, w);
            // Process this partition
            let mvrs = [...part.entities].filter(e => e instanceof Mover);
            let np = mvrs.length;
            if (np > 0) {
                for (let i = 0; i < np - 2; i++)
                    for (let j = i + 1; j < np - 1; j++)
                        w._testForOverlap(mvrs[i], mvrs[j]);
                //Process movers in parent patitions
                let pmvrs = [];
                let ppart = part.parent;
                while (ppart) {
                    pmvrs.push(...ppart.entities);
                    ppart = ppart.parent;
                }
                pmvrs = pmvrs.filter(e => e instanceof Mover);
                let npp = pmvrs.length;
                if (npp > 0)
                    for (let i = 0; i < np; i++)
                        for (let j = 0; j < npp; j++)
                            w._testForOverlap(mvrs[i], pmvrs[j]);
            }
        }
        this._nbrTests = 0;
        processPartitionData(this.tree, this);
    }
    _testForOverlap(mvr0, mvr1) {
        this._nbrTests++;
        let cnLen = Vector2D.dist(mvr1.pos, mvr0.pos);
        let overlap = mvr0.colRad + mvr1.colRad - cnLen;
        if (overlap > 0) {
            let cnVec = mvr1.pos.sub(mvr0.pos).div(cnLen);
            let mass = mvr0.mass + mvr1.mass;
            mvr0.pos = mvr0.pos.sub(cnVec.mult(overlap * mvr1.mass / mass));
            mvr1.pos = mvr1.pos.add(cnVec.mult(overlap * mvr0.mass / mass));
        }
    }
}
_World_births = new WeakMap(), _World_deaths = new WeakMap(), _World_domain = new WeakMap(), _World_population = new WeakMap(), _World_postman = new WeakMap(), _World_painter = new WeakMap();
//# sourceMappingURL=world.js.map