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
var _World_instances, _World_births, _World_deaths, _World_domain, _World_population, _World_dispatcher, _World_painter, _World_width, _World_height, _World_tree, _World_elapsedTime, _World_maxObstacleSize, _World_preventOverlap, _World_addEntity, _World_delEntity, _World_ensureNoOverlap, _World_testForOverlap;
class World {
    constructor(wsizeX, wsizeY, depth = 1, border = 0) {
        _World_instances.add(this);
        _World_births.set(this, void 0);
        _World_deaths.set(this, void 0);
        _World_domain.set(this, void 0);
        _World_population.set(this, void 0);
        _World_dispatcher.set(this, void 0);
        _World_painter.set(this, void 0);
        _World_width.set(this, void 0);
        _World_height.set(this, void 0);
        _World_tree.set(this, void 0);
        _World_elapsedTime.set(this, void 0);
        // Largest obstacle collision radius
        _World_maxObstacleSize.set(this, 0);
        _World_preventOverlap.set(this, true);
        __classPrivateFieldSet(this, _World_width, wsizeX, "f");
        __classPrivateFieldSet(this, _World_height, wsizeY, "f");
        __classPrivateFieldSet(this, _World_dispatcher, new Dispatcher(this), "f");
        __classPrivateFieldSet(this, _World_population, new Map(), "f");
        __classPrivateFieldSet(this, _World_births, [], "f");
        __classPrivateFieldSet(this, _World_deaths, [], "f");
        __classPrivateFieldSet(this, _World_domain, new Domain(0, 0, wsizeX, wsizeY), "f");
        let ts = Math.max(wsizeX, wsizeY) + 2 * border;
        __classPrivateFieldSet(this, _World_tree, QPart.makeTree(-(ts - wsizeX) / 2, -(ts - wsizeY) / 2, ts, depth), "f");
    }
    get births() { return __classPrivateFieldGet(this, _World_births, "f"); }
    get deaths() { return __classPrivateFieldGet(this, _World_deaths, "f"); }
    get domain() { return __classPrivateFieldGet(this, _World_domain, "f"); }
    set domain(d) { __classPrivateFieldSet(this, _World_domain, d, "f"); }
    get populationMap() { return __classPrivateFieldGet(this, _World_population, "f"); }
    get population() { return [...__classPrivateFieldGet(this, _World_population, "f").values()]; }
    get dispatcher() { return __classPrivateFieldGet(this, _World_dispatcher, "f"); }
    set painter(painter) { __classPrivateFieldSet(this, _World_painter, painter, "f"); }
    get width() { return __classPrivateFieldGet(this, _World_width, "f"); }
    get height() { return __classPrivateFieldGet(this, _World_height, "f"); }
    get tree() { return __classPrivateFieldGet(this, _World_tree, "f"); }
    get maxObstacleSize() { return __classPrivateFieldGet(this, _World_maxObstacleSize, "f"); }
    set maxObstacleSize(n) { __classPrivateFieldSet(this, _World_maxObstacleSize, Math.max(__classPrivateFieldGet(this, _World_maxObstacleSize, "f"), n), "f"); }
    get isPreventOverlapOn() { return __classPrivateFieldGet(this, _World_preventOverlap, "f"); }
    ;
    set preventOverlap(b) { __classPrivateFieldSet(this, _World_preventOverlap, b, "f"); }
    birth(entity) {
        let a = [];
        Array.isArray(entity) ? a = entity : a = [entity];
        a.forEach(ent => ent.born(this));
    }
    death(entity) {
        let a = [];
        Array.isArray(entity) ? a = entity : a = [entity];
        a.forEach(ent => {
            if (Number.isFinite(ent))
                ent = __classPrivateFieldGet(this, _World_population, "f").get(Number(entity));
            if (ent instanceof Entity)
                ent.dies(this);
        });
        // if (Number.isFinite(entity))
        //     entity = this.#population.get(Number(entity));
        // if (entity instanceof Entity)
        //     entity.dies(this);
    }
    update(elapsedTime) {
        __classPrivateFieldSet(this, _World_elapsedTime, elapsedTime, "f");
        // ====================================================================
        // Births and deaths
        while (__classPrivateFieldGet(this, _World_births, "f").length > 0)
            __classPrivateFieldGet(this, _World_instances, "m", _World_addEntity).call(this, __classPrivateFieldGet(this, _World_births, "f").pop());
        while (__classPrivateFieldGet(this, _World_deaths, "f").length > 0)
            __classPrivateFieldGet(this, _World_instances, "m", _World_delEntity).call(this, __classPrivateFieldGet(this, _World_deaths, "f").pop());
        // ====================================================================
        // Process telegrams
        __classPrivateFieldGet(this, _World_dispatcher, "f")?.update(elapsedTime);
        // ====================================================================
        // Update FSMs
        [...__classPrivateFieldGet(this, _World_population, "f").values()]
            .forEach(v => v.fsm?.update(elapsedTime));
        // ====================================================================
        // Update all entities
        [...__classPrivateFieldGet(this, _World_population, "f").values()]
            .forEach(v => v.update(elapsedTime, this));
        // ====================================================================
        // Ensure Zero Overlap?
        if (__classPrivateFieldGet(this, _World_preventOverlap, "f"))
            __classPrivateFieldGet(this, _World_instances, "m", _World_ensureNoOverlap).call(this);
        // ====================================================================
        // Correct partition data
        __classPrivateFieldGet(this, _World_tree, "f").correctPartitionContents();
    }
    render() {
        __classPrivateFieldGet(this, _World_painter, "f")?.call(this);
        let ents = [...__classPrivateFieldGet(this, _World_population, "f").values()].sort((a, b) => a.Z - b.Z);
        for (let e of ents)
            e.render(__classPrivateFieldGet(this, _World_elapsedTime, "f"), this);
    }
    quadtreeAnalysis() {
        let array = [];
        let d = this.tree.getTreeLevelData();
        //console.log(d);
        let m = d.movers, o = d.obstacles, w = d.walls, f = d.fences, a = d.artefacts;
        array.push('#########   Quadtree Analysis Data   #########');
        array.push(`Depth    :   ${d.depth} level(s)`);
        array.push(`Position :   X ${d.lowX.toFixed(2)}   Y ${d.lowY.toFixed(2)}`);
        array.push(`Size     :   Tree ${d.treesize.toFixed(1)}   Leaf ${d.leafsize.toFixed(1)}`);
        if (m[0].length > 0) {
            let mvrs = this.population.filter(e => e instanceof Mover);
            let minCR = mvrs[0].colRad, maxCR = mvrs[0].colRad;
            mvrs.forEach(m => {
                minCR = Math.min(minCR, m.colRad);
                maxCR = Math.max(maxCR, m.colRad);
            });
            array.push(`Movers col. radius :  Min ${minCR.toFixed(1)}   Max ${maxCR.toFixed(1)}`);
        }
        let hr = '===================';
        let r0 = '  Levels > |  All |';
        let r1 = '-----------+------+';
        for (let i = 1; i <= d.depth; i++) {
            r0 += i.toString().padStart(4, ' ') + '  |';
            r1 += '------+';
            hr += '=======';
        }
        let r4 = 'Artefacts  |', r5 = 'Fences     |', r7 = 'Obstacles  |', r6 = 'Walls      |', r8 = 'Movers     |';
        for (let i = 0; i <= d.depth; i++) {
            r4 += a[i].toString().padStart(5, ' ') + ' |';
            r5 += f[i].toString().padStart(5, ' ') + ' |';
            r6 += w[i].toString().padStart(5, ' ') + ' |';
            r7 += o[i].toString().padStart(5, ' ') + ' |';
            r8 += m[i].toString().padStart(5, ' ') + ' |';
        }
        array.push(hr, r0, r1, r4, r5, r6, r7, r8, hr);
        console.log(array.join('\n'));
        return array;
    }
}
_World_births = new WeakMap(), _World_deaths = new WeakMap(), _World_domain = new WeakMap(), _World_population = new WeakMap(), _World_dispatcher = new WeakMap(), _World_painter = new WeakMap(), _World_width = new WeakMap(), _World_height = new WeakMap(), _World_tree = new WeakMap(), _World_elapsedTime = new WeakMap(), _World_maxObstacleSize = new WeakMap(), _World_preventOverlap = new WeakMap(), _World_instances = new WeakSet(), _World_addEntity = function _World_addEntity(entity) {
    __classPrivateFieldGet(this, _World_population, "f").set(entity.id, entity);
    __classPrivateFieldGet(this, _World_tree, "f").addEntity(entity);
    // entity.world = this;
}, _World_delEntity = function _World_delEntity(entity) {
    __classPrivateFieldGet(this, _World_population, "f").delete(entity.id);
    __classPrivateFieldGet(this, _World_tree, "f").delEntity(entity);
    // entity.world = undefined;
}, _World_ensureNoOverlap = function _World_ensureNoOverlap() {
    function processPartitionData(part, w) {
        if (part.hasChildren)
            for (let child of part.children)
                processPartitionData(child, w);
        // Process this partition
        let mvrs = [...part.entities].filter(e => e instanceof Mover);
        let np = mvrs.length;
        if (np > 0) {
            for (let i = 0; i < np - 1; i++)
                for (let j = i + 1; j < np; j++)
                    __classPrivateFieldGet(w, _World_instances, "m", _World_testForOverlap).call(w, mvrs[i], mvrs[j]);
            //Process movers in parent patitions
            let pmvrs = [];
            let parentPart = part.parent;
            while (parentPart) {
                pmvrs.push(...parentPart.entities);
                parentPart = parentPart.parent;
            }
            pmvrs = pmvrs.filter(e => e instanceof Mover);
            let npp = pmvrs.length;
            if (npp > 0)
                for (let i = 0; i < np; i++)
                    for (let j = 0; j < npp; j++)
                        __classPrivateFieldGet(w, _World_instances, "m", _World_testForOverlap).call(w, mvrs[i], pmvrs[j]);
        }
    }
    processPartitionData(this.tree, this);
}, _World_testForOverlap = function _World_testForOverlap(mvr0, mvr1) {
    let cnLen = Vector2D.dist(mvr1.pos, mvr0.pos);
    let overlap = mvr0.colRad + mvr1.colRad - cnLen;
    if (overlap > 0 && cnLen > 0) {
        let cnVec = mvr1.pos.sub(mvr0.pos).div(cnLen);
        let mass = mvr0.mass + mvr1.mass;
        mvr0.pos = mvr0.pos.sub(cnVec.mult(overlap * mvr1.mass / mass));
        mvr1.pos = mvr1.pos.add(cnVec.mult(overlap * mvr0.mass / mass));
    }
};
//# sourceMappingURL=world.js.map