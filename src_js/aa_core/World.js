class World {
    #births;
    get births() { return this.#births; }
    #deaths;
    get deaths() { return this.#deaths; }
    #domain;
    get domain() { return this.#domain; }
    #population;
    get populationMap() { return this.#population; }
    get population() { return [...this.#population.values()]; }
    #postman;
    get postman() { return this.#postman; }
    #painter;
    set painter(painter) { this.#painter = painter; }
    #width;
    get width() { return this.#width; }
    #height;
    get height() { return this.#height; }
    #tree;
    get tree() { return this.#tree; }
    // Largest obstacle collision radius
    #maxObstacleSize = 0;
    get maxObstacleSize() { return this.#maxObstacleSize; }
    set maxObstacleSize(n) { this.#maxObstacleSize = Math.max(this.#maxObstacleSize, n); }
    // Number of tests performed when avoiding overlap
    #nbrTests;
    #preventOverlap = true;
    get isPreventOverlapOn() { return this.#preventOverlap; }
    ;
    set preventOverlap(b) { this.#preventOverlap = b; }
    constructor(wsizeX, wsizeY, depth = 1, border = 0) {
        this.#width = wsizeX;
        this.#height = wsizeY;
        this.#postman = new Dispatcher(this);
        this.#population = new Map();
        this.#births = [];
        this.#deaths = [];
        this.#domain = new Domain(0, 0, wsizeX, wsizeY);
        let ts = Math.max(wsizeX, wsizeY) + 2 * border;
        this.#tree = QPart.makeTree(-(ts - wsizeX) / 2, -(ts - wsizeY) / 2, ts, depth);
    }
    birth(entity) {
        // if (entity instanceof Obstacle)
        //     this.#maxObstacleSize = Math.max(this.#maxObstacleSize, entity.colRad);
        //if (entity) this.#births.push(entity);
        if (entity)
            entity.born(this.#births, this);
    }
    _addEntity(entity) {
        this.#population.set(entity.id, entity);
        this.#tree.addEntity(entity);
        entity.world = this;
    }
    death(entity) {
        if (Number.isFinite(entity))
            entity = this.#population.get(Number(entity));
        if (entity instanceof Entity)
            this.#deaths.push(entity);
    }
    _subEntity(entity) {
        this.#population.delete(entity.id);
        this.#tree.subEntity(entity);
        entity.world = undefined;
    }
    update(elapsedTime) {
        // ======================================================================
        // Births and deaths
        while (this.#deaths.length > 0)
            this._subEntity(this.#deaths.pop());
        while (this.#births.length > 0)
            this._addEntity(this.#births.pop());
        // ======================================================================
        // Process telegrams
        this.#postman?.update();
        // ======================================================================
        // Update FSMs
        [...this.#population.values()].forEach(v => v.fsm?.update(elapsedTime, this));
        // ======================================================================
        // Update all entities
        [...this.#population.values()].forEach(v => v.update(elapsedTime, this));
        // ======================================================================
        // Ensure Zero Overlap?
        if (this.#preventOverlap)
            this._ensureNoOverlap();
        // ======================================================================
        // Correct partition data
        this.#tree.correctPartitionContents();
    }
    render() {
        this.#painter?.call(this);
        for (let e of this.#population.values())
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
        let total = this.#nbrTests > 0 ? this.#nbrTests :
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
        this.#nbrTests = 0;
        processPartitionData(this.tree, this);
    }
    _testForOverlap(mvr0, mvr1) {
        this.#nbrTests++;
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
//# sourceMappingURL=world.js.map