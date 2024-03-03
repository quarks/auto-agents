class QPart {
    #entities: Set<Entity>;
    get entities(): Array<Entity> { return [...this.#entities]; }
    #parent: QPart;
    get parent(): QPart { return this.#parent; }
    #children: Array<QPart>;
    get children(): Array<QPart> { return this.#children; }
    #level: number;
    get level(): number { return this.#level; }
    #depth: number;
    get depth(): number { return this.#depth; }

    #lowX: number;
    get lowX(): number { return this.#lowX; }
    #highX: number;
    get highX(): number { return this.#highX; }
    #lowY: number;
    get lowY(): number { return this.#lowY; }
    #highY: number;
    get highY(): number { return this.#highY; }
    #cX: number;
    get cX(): number { return this.#cX; }
    #cY: number;
    get cY(): number { return this.#cY; }

    get partSize(): number { return this.#highX - this.#lowX; }
    get treeSize(): number { return this.getRoot().partSize; }
    get leafSize(): number {
        return this.getRoot().partSize / 2 ** (this.#depth - 1);
    }
    get isLeaf(): boolean { return !this.#children; }
    get isRoot(): boolean { return !this.#parent; }
    get hasChildren(): boolean { return Boolean(this.#children); }

    /** 
     * Creates a single partition in a quadtree structure.
     * 
     * To create a quadtree data structure use the QPart.makeTree(...) 
     * function. 
     */
    constructor(parent: QPart, lowX: number, lowY: number, highX: number, highY: number,
        level: number, depth: number) {
        this.#parent = parent;
        this.#lowX = lowX;
        this.#lowY = lowY;
        this.#highX = highX;
        this.#highY = highY;
        this.#cX = (this.#lowX + this.#highX) / 2;
        this.#cY = (this.#lowY + this.#highY) / 2;
        this.#level = level;
        this.#depth = depth;
        this.#entities = new Set();
    }

    getRoot() {
        return this.isRoot ? this : this.#parent.getRoot();
    }

    // Find the partition that encompasses the specifies region. The specified region will be 
    // trimmed to fit inside the root if necessary.
    getEnclosingPartition(lowX: number, lowY: number, highX: number, highY: number): QPart {
        function findPartition(p: QPart, x0: number, y0: number, x1: number, y1: number) {
            if ((x0 >= p.lowX && x1 <= p.highX && y0 >= p.lowY && y1 <= p.highY)) {
                if (p.hasChildren) {
                    let q = ((x0 < p.#cX) ? 0 : 1) + ((y0 < p.#cY) ? 0 : 2);
                    return findPartition(p.#children[q], x0, y0, x1, y1);
                }
                else
                    return p;
            }
            else
                return (p.isRoot ? p : p.#parent);
        }
        let root = this.getRoot();
        let a = Geom2D.box_box_p(lowX, lowY, highX, highY,
            root.lowX, root.lowY, root.highX, root.highY);
        if (a.length > 0) {
            [lowX, lowY, highX, highY] = a;
            return findPartition(root, lowX, lowY, highX, highY);
        }
        return root;
    }

    getItemsInRegion(lowX: number, lowY: number, highX: number, highY: number) {
        function getParent(part) {
            if (!part) return;
            parts.push(part);
            ents.push(...part.#entities);
            getParent(part.#parent);
        }
        function getChildren(part) {
            parts.push(part);
            ents.push(...part.#entities);
            if (part.hasChildren)
                for (let child of part.#children)
                    if (Geom2D.box_box(lowX, lowY, highX, highY,
                        child.lowX, child.lowY, child.highX, child.highY))
                        getChildren(child);
            return;
        }
        let parts: Array<QPart> = [], ents: any = [];
        let encPart = this.getEnclosingPartition(lowX, lowY, highX, highY);
        getParent(encPart.#parent);
        getChildren(encPart);
        return { partitions: parts, entities: ents, enc_partition: encPart };
    }

    #childAt(part: QPart, entity: Entity): QPart {
        let q = ((entity.pos.x < part.#cX) ? 0 : 1) + ((entity.pos.y < part.#cY) ? 0 : 2);
        return part.#children[q];
    }

    addEntity(entity: Entity) {
        function findPartition(part: QPart, entity: Entity) {
            if (entity.fitsInside(part.lowX, part.lowY, part.highX, part.highY)) {
                if (part.hasChildren)
                    findPartition(part.#childAt(part, entity), entity);
                else
                    part.#entities.add(entity);
            }
            else
                part.isRoot ? part.#entities.add(entity) : part.#parent.#entities.add(entity);
        }
        findPartition(this.getRoot(), entity);
    }

    delEntity(entity: Entity) {
        function findPartition(part: QPart, entity: Entity) {
            if (part.#entities.delete(entity)) return true;
            if (part.hasChildren)
                return findPartition(part.#childAt(part, entity), entity);
            else
                return false;
        }
        return findPartition(this.getRoot(), entity);
    }

    countEntities() {
        function entityCount(part: QPart) {
            count += part.#entities.size;
            if (part.hasChildren)
                for (let child of part.#children) entityCount(child);
        }
        let count = 0;
        entityCount(this.getRoot());
        return count;
    }

    correctPartitionContents() {
        function processPartition(part: QPart, root: QPart) {
            // Only need to consider entiies that can move i.e. a Mover or Vehicle
            let me = [...part.#entities].filter(x => x instanceof Mover);
            for (let e of me) {
                if (e.fitsInside(part.lowX, part.lowY, part.highX, part.highY)) {
                    // Fits inside this partition attempt to move down as far as possible
                    if (part.hasChildren) {
                        let sp = part.#childAt(part, e);
                        if (e.fitsInside(sp.lowX, sp.lowY, sp.highX, sp.highY)) {
                            part.#entities.delete(e);
                            sp.addEntity(e);
                        }
                    }
                }
                else {
                    // Does not fit inside partition. If this is not the root then remove 
                    // from this partion and add back to tree
                    if (part != root) {
                        part.#entities.delete(e);
                        root.addEntity(e);
                    }
                }
            }
            part.#children?.forEach(p => processPartition(p, root));
        }
        let root = this.getRoot();
        processPartition(root, root);
    }

    getTreeLevelData() {
        function CountEntitiesByLevel(part: QPart) {
            let s = 0; part.#entities.forEach(e => { if (e instanceof Fence) s++; })
            levelFence[0] += s; levelFence[part.level] += s;
            s = 0; part.#entities.forEach(e => { if (e instanceof Wall) s++; })
            levelWall[0] += s; levelWall[part.level] += s;
            s = 0; part.#entities.forEach(e => { if (e instanceof Obstacle) s++; })
            levelObstacle[0] += s; levelObstacle[part.level] += s;
            s = 0; part.#entities.forEach(e => { if (e instanceof Mover) s++; })
            levelMover[0] += s; levelMover[part.level] += s;
            if (part.hasChildren)
                for (let child of part.children) CountEntitiesByLevel(child);
        }
        let levelMover = new Array(this.depth + 1).fill(0);
        let levelFence = new Array(this.depth + 1).fill(0);
        let levelWall = new Array(this.depth + 1).fill(0);
        let levelObstacle = new Array(this.depth + 1).fill(0);

        CountEntitiesByLevel(this.getRoot());
        return {
            'movers': levelMover, 'obstacles': levelObstacle, 'walls': levelWall,
            'fences': levelFence, 'depth': this.depth, 'treesize': this.treeSize,
            'leafsize': this.leafSize, 'lowX': this.lowX, 'lowY': this.lowY
        }
    }

    $$(len: number = 5) {
        console.log(this.$(len));
        return this.toString(len);
    }

    $(len: number = 5): string {
        return this.toString(len);
    }

    toString(len: number = 5): string {
        function fmt(n: number, nd: number, bufferLength: number) {
            let s = n.toFixed(nd).toString();
            while (s.length < bufferLength) s = ' ' + s;
            return s;
        }
        let p = this, t = '', s = `Partition Lvl: ${fmt(p.#level, 0, 2)}`;
        s += `    @ [${fmt(p.lowX, 0, 5)}, ${fmt(p.lowY, 0, 5)}]`;
        s += ` to [${fmt(p.highX, 0, 5)}, ${fmt(p.highY, 0, 5)}]`;
        s += ` contains ${this.#entities.size}  entities`;
        if (p.#entities.size > 0)
            t = [...p.#entities].map(x => x.id).reduce((x, y) => x + ' ' + y, '  ### ');
        return s + t;
    }

    static makeTree(lowX: number, lowY: number, size: number, depth: number): QPart {
        function buildSubTree(parent: QPart, level: number, depth: number) {
            if (level <= depth) {
                let x0 = parent.#lowX, x2 = parent.#highX, x1 = (x0 + x2) / 2;
                let y0 = parent.#lowY, y2 = parent.#highY, y1 = (y0 + y2) / 2;
                parent.#children = [];
                let a = parent.#children;
                a[0] = new QPart(parent, x0, y0, x1, y1, level, depth);
                a[1] = new QPart(parent, x1, y0, x2, y1, level, depth);
                a[2] = new QPart(parent, x0, y1, x1, y2, level, depth);
                a[3] = new QPart(parent, x1, y1, x2, y2, level, depth);
                buildSubTree(a[0], level + 1, depth);
                buildSubTree(a[1], level + 1, depth);
                buildSubTree(a[2], level + 1, depth);
                buildSubTree(a[3], level + 1, depth);
            }
        }
        let level = 1, root = new QPart(undefined, lowX, lowY, lowX + size, lowY + size, level, depth);
        buildSubTree(root, level + 1, depth);
        return root;
    }


}