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
    #elapsedTime;
    // Largest obstacle collision radius
    #maxObstacleSize = 0;
    get maxObstacleSize() { return this.#maxObstacleSize; }
    set maxObstacleSize(n) { this.#maxObstacleSize = Math.max(this.#maxObstacleSize, n); }
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
        if (entity)
            entity.born(this);
    }
    death(entity) {
        if (Number.isFinite(entity))
            entity = this.#population.get(Number(entity));
        if (entity instanceof Entity)
            entity.dies(this);
    }
    #addEntity(entity) {
        this.#population.set(entity.id, entity);
        this.#tree.addEntity(entity);
        // entity.world = this;
    }
    #delEntity(entity) {
        this.#population.delete(entity.id);
        this.#tree.delEntity(entity);
        // entity.world = undefined;
    }
    update(elapsedTime) {
        this.#elapsedTime = elapsedTime;
        // ======================================================================
        // Births and deaths
        while (this.#births.length > 0)
            this.#addEntity(this.#births.pop());
        while (this.#deaths.length > 0)
            this.#delEntity(this.#deaths.pop());
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
            this.#ensureNoOverlap();
        // ======================================================================
        // Correct partition data
        this.#tree.correctPartitionContents();
    }
    render() {
        this.#painter?.call(this);
        let ents = [...this.#population.values()].sort((a, b) => a.Z - b.Z);
        //console.log
        for (let e of ents)
            e.render(this, this.#elapsedTime);
    }
    quadtreeAnalysis() {
        let a = [];
        let d = this.tree.getTreeLevelData();
        //console.log(d);
        let m = d.movers, o = d.obstacles, w = d.walls, f = d.fences;
        a.push('#########   Quadtree Analysis Data   #########');
        a.push(`Depth    :   ${d.depth} level(s)`);
        a.push(`Position :   X ${d.lowX.toFixed(2)}   Y ${d.lowY.toFixed(2)}`);
        a.push(`Size     :   Tree ${d.treesize.toFixed(1)}   Leaf ${d.leafsize.toFixed(1)}`);
        if (m[0].length > 0) {
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
        //  let r7 = 'Obstacles  |', r6 = 'Walls      |', r8 = 'Movers     |';
        let r5 = 'Fences     |', r7 = 'Obstacles  |', r6 = 'Walls      |', r8 = 'Movers     |';
        for (let i = 0; i <= d.depth; i++) {
            r5 += f[i].toString().padStart(5, ' ') + ' |';
            r6 += w[i].toString().padStart(5, ' ') + ' |';
            r7 += o[i].toString().padStart(5, ' ') + ' |';
            r8 += m[i].toString().padStart(5, ' ') + ' |';
        }
        a.push(hr, r0, r1, r5, r6, r7, r8, hr);
        console.log(a.join('\n'));
        return a;
    }
    #ensureNoOverlap() {
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
                        w.#testForOverlap(mvrs[i], mvrs[j]);
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
                            w.#testForOverlap(mvrs[i], pmvrs[j]);
            }
        }
        processPartitionData(this.tree, this);
    }
    #testForOverlap(mvr0, mvr1) {
        let cnLen = Vector2D.dist(mvr1.pos, mvr0.pos);
        let overlap = mvr0.colRad + mvr1.colRad - cnLen;
        if (overlap > 0 && cnLen > 0) {
            let cnVec = mvr1.pos.sub(mvr0.pos).div(cnLen);
            let mass = mvr0.mass + mvr1.mass;
            mvr0.pos = mvr0.pos.sub(cnVec.mult(overlap * mvr1.mass / mass));
            mvr1.pos = mvr1.pos.add(cnVec.mult(overlap * mvr0.mass / mass));
        }
    }
}
//# sourceMappingURL=world.js.map