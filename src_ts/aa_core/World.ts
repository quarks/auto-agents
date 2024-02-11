class World {
    #births: Array<Entity>;
    get births(): Array<Entity> { return this.#births; }

    #deaths: Array<Entity>;
    get deaths(): Array<Entity> { return this.#deaths; }

    #domain: Domain;
    get domain(): Domain { return this.#domain; }

    #population: Map<number, Entity>;
    get populationMap(): Map<number, Entity> { return this.#population; }
    get population(): Array<Entity> { return [...this.#population.values()]; }

    #postman: Dispatcher;
    get postman(): Dispatcher { return this.#postman; }

    #painter: Function;
    set painter(painter: Function) { this.#painter = painter; }

    #width: number;
    get width(): number { return this.#width }
    #height: number;
    get height(): number { return this.#height }

    #tree: QPart;
    get tree(): QPart { return this.#tree }

    // Largest obstacle collision radius
    #maxObstacleSize = 0;
    get maxObstacleSize(): number { return this.#maxObstacleSize; }
    set maxObstacleSize(n: number) { this.#maxObstacleSize = Math.max(this.#maxObstacleSize, n); }

    // Number of tests performed when avoiding overlap
    #nbrTests: number;

    #preventOverlap = true;
    get isPreventOverlapOn(): boolean { return this.#preventOverlap };
    set preventOverlap(b: boolean) { this.#preventOverlap = b; }

    constructor(wsizeX: number, wsizeY: number, depth: number = 1, border = 0) {
        this.#width = wsizeX;
        this.#height = wsizeY;
        this.#postman = new Dispatcher(this);
        this.#population = new Map<number, Entity>();
        this.#births = [];
        this.#deaths = [];
        this.#domain = new Domain(0, 0, wsizeX, wsizeY);
        let ts = Math.max(wsizeX, wsizeY) + 2 * border;
        this.#tree = QPart.makeTree(-(ts - wsizeX) / 2, -(ts - wsizeY) / 2, ts, depth);
    }

    birth(entity: Entity) {
        if (entity) entity.born(this.#births, this);
    }

    death(entity: Entity | number) {
        if (Number.isFinite(entity))
            entity = this.#population.get(Number(entity));
        if (entity instanceof Entity)
            entity.dies(this.#deaths, this)
    }

    _addEntity(entity: Entity) {
        this.#population.set(entity.id, entity);
        this.#tree.addEntity(entity);
        entity.world = this;
    }

    _subEntity(entity: Entity) {
        this.#population.delete(entity.id);
        this.#tree.subEntity(entity);
        entity.world = undefined;
    }

    update(elapsedTime: number): void {
        // ======================================================================
        // Births and deaths
        while (this.#deaths.length > 0) this._subEntity(this.#deaths.pop());
        while (this.#births.length > 0) this._addEntity(this.#births.pop());
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
        if (this.#preventOverlap) this._ensureNoOverlap();
        // ======================================================================
        // Correct partition data
        this.#tree.correctPartitionContents();
    }

    render() {
        this.#painter?.call(this);
        for (let e of this.#population.values()) e.render();
    }

    quadtreeAnalysis(): Array<string> {
        let a: Array<string> = [];
        let d = this.tree.getTreeLevelData();
        let m = d.movers, o = d.obstacles, w = d.walls;
        a.push('#########   Quadtree Analysis Data   #########');
        a.push(`Depth    :   ${d.depth} level(s)`)
        a.push(`Position :   X ${d.lowX.toFixed(2)}   Y ${d.lowX.toFixed(2)}`)
        a.push(`Size     :   Tree ${d.treesize.toFixed(1)}   Leaf ${d.leafsize.toFixed(1)}`)
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
        let r1 = '-----------+------+'
        for (let i = 1; i <= d.depth; i++) {
            r0 += i.toString().padStart(4, ' ') + '  |';
            r1 += '------+'; hr += '=======';
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

    _estimateNbrTests(movers: Array<number>, lowX: number, lowY: number, treesize: number, depth: number): number {
        let prevCumAvg = 0, total = 1 - movers[0];
        for (let lvl = 1; lvl <= depth; lvl++) {
            let ftr = 2 ** (lvl - 1) / treesize;
            let x0 = - lowX * ftr, x1 = (this.width - lowX) * ftr;
            let y0 = - lowY * ftr, y1 = (this.height - lowY) * ftr;
            let nbrParts = (Math.ceil(x1) - Math.floor(x0)) * (Math.ceil(y1) - Math.floor(y0));
            let partAvg = movers[lvl] / nbrParts;
            total += nbrParts * (partAvg * (partAvg - 1) / 2 + prevCumAvg * partAvg);
            prevCumAvg = prevCumAvg + partAvg;
        }
        return total;
    }

    _ensureNoOverlap() {
        function processPartitionData(part: QPart, w: World) {
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

    _testForOverlap(mvr0: any, mvr1: any) {
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