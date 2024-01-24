class QPart {
    _entities: Set<Entity>;

    _parent: QPart;
    _children: Array<QPart>;
    _level: number;
    _depth: number;

    _lowX: number;
    _highX: number;
    _lowY: number;
    _highY: number;
    _cX: number;
    _cY: number;

    static makeTree(lowX: number, lowY: number, highX: number, highY: number, depth: number): QPart {
        function buildSubTree(parent: QPart, level: number, depth: number) {
            if (level <= depth) {
                let x0 = parent._lowX, x2 = parent._highX, x1 = (x0 + x2) / 2;
                let y0 = parent._lowY, y2 = parent._highY, y1 = (y0 + y2) / 2;
                parent._children = [];
                let a = parent._children;
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
        console.assert((highX - lowX == highY - lowY), `Quadtree must be square for consistant behaviour.  Requested size (${highX - lowX} x ${highY - lowY}) is invalid.`);
        let level = 1, root = new QPart(undefined, lowX, lowY, highX, highY, level, depth);
        buildSubTree(root, level + 1, depth);
        return root;
    }

    get lowX(): number { return this._lowX; }
    get highX(): number { return this._highX; }
    get lowY(): number { return this._lowY; }
    get highY(): number { return this._highY; }
    get cX(): number { return this._cX; }
    get cY(): number { return this._cY; }
    get width(): number { return this.highX - this._lowX; }
    get height(): number { return this.highY - this._lowY; }

    get level(): number { return this._level; }
    get depth(): number { return this._depth; }
    get leafSize(): number {
        let r = this.getRoot();
        while (r._children) r = r._children[0];
        return r.width;
    }

    get isLeaf(): boolean { return !this._children; }
    get isRoot(): boolean { return !this._parent; }
    get hasChildren(): boolean { return Boolean(this._children); }

    get entities(): Array<Entity> { return [...this._entities]; }

    /** 
     * Creates a single partition in a quadtree structure.
     * 
     * To create a quadtree data structure use the QPart.makeTree(...) 
     * function. 
     */
    constructor(parent: QPart, lowX: number, lowY: number, highX: number, highY: number,
        level: number, depth: number) {
        this._parent = parent;
        this._lowX = lowX;
        this._lowY = lowY;
        this._highX = highX;
        this._highY = highY;
        this._cX = (this._lowX + this._highX) / 2;
        this._cY = (this._lowY + this._highY) / 2;
        this._level = level;
        this._depth = depth;
        this._entities = new Set();
    }

    getRoot() {
        return this.isRoot ? this : this._parent.getRoot();
    }

    // Find the partition that encompasses the specifies region. The specified region will be 
    // trimmed to fit inside the root if necessary.
    getEnclosingPartition(lowX: number, lowY: number, highX: number, highY: number): QPart {
        function findPartition(p: QPart, x0: number, y0: number, x1: number, y1: number) {
            if ((x0 >= p.lowX && x1 <= p.highX && y0 >= p.lowY && y1 <= p.highY)) {
                if (p.hasChildren) {
                    let q = ((x0 < p._cX) ? 0 : 1) + ((y0 < p._cY) ? 0 : 2);
                    return findPartition(p._children[q], x0, y0, x1, y1);
                }
                else
                    return p;
            }
            else
                return (p.isRoot ? p : p._parent);
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
            parts.push(part); ents.push(...part._entities);
            getParent(part._parent);
        }
        function getChildren(part) {
            parts.push(part); ents.push(...part._entities);
            if (part.hasChildren)
                for (let child of part._children)
                    if (Geom2D.box_box(lowX, lowY, highX, highY,
                        child.lowX, child.lowY, child.highX, child.highY))
                        getChildren(child);
            return;
        }
        let parts: Array<QPart> = [], ents: any = [];
        let encPart = this.getEnclosingPartition(lowX, lowY, highX, highY);
        getParent(encPart._parent);
        getChildren(encPart);
        return { partitions: parts, entities: ents, enc_partition: encPart };
    }

    _childAt(part: QPart, entity: Entity): QPart {
        let q = ((entity.pos.x < part._cX) ? 0 : 1) + ((entity.pos.y < part._cY) ? 0 : 2);
        return part._children[q];
    }

    addEntity(entity: Entity) {
        function findPartition(part: QPart, entity: Entity) {
            if (entity.fitsInside(part.lowX, part.lowY, part.highX, part.highY)) {
                if (part.hasChildren)
                    findPartition(part._childAt(part, entity), entity);
                else
                    part._entities.add(entity);
            }
            else
                part.isRoot ? part._entities.add(entity) : part._parent._entities.add(entity);
        }
        findPartition(this.getRoot(), entity);
    }

    subEntity(entity: Entity) {
        function findPartition(part: QPart, entity: Entity) {
            if (part._entities.delete(entity)) return true;
            if (part.hasChildren)
                return findPartition(part._childAt(part, entity), entity);
            else
                return false;
        }
        return findPartition(this.getRoot(), entity);
    }

    countEntities() {
        function entityCount(part: QPart) {
            count += part._entities.size;
            if (part.hasChildren)
                for (let child of part._children) entityCount(child);
        }
        let count = 0;
        entityCount(this.getRoot());
        return count;
    }

    correctPartitionContents() {
        function processPartition(part: QPart, root: QPart) {
            // Only need to consider entiies that can move i.e. has a velocity attribute
            let me = [...part._entities].filter(x => x['_vel']);
            for (let e of me) {
                if (e.fitsInside(part.lowX, part.lowY, part.highX, part.highY)) {
                    // Fits inside this partition attempt to move down as far as possible
                    if (part.hasChildren) {
                        let sp = part._childAt(part, e);
                        if (e.fitsInside(sp.lowX, sp.lowY, sp.highX, sp.highY)) {
                            part._entities.delete(e);
                            sp.addEntity(e);
                        }
                    }
                }
                else {
                    // Does not fit inside partition. If this is not the root then remove 
                    // from this partion and add back to tree
                    if (part != root) {
                        part._entities.delete(e);
                        root.addEntity(e);
                    }
                }
            }
            part._children?.forEach(p => processPartition(p, root));
        }
        let root = this.getRoot();
        processPartition(root, root);
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
        let p = this, t = '', s = `Partition Lvl: ${fmt(p._level, 0, 2)}`;
        s += `    @ [${fmt(p.lowX, 0, 5)}, ${fmt(p.lowY, 0, 5)}]`;
        s += ` to [${fmt(p.highX, 0, 5)}, ${fmt(p.highY, 0, 5)}]`;
        s += ` contains ${this._entities.size}  entities`;
        if (p._entities.size > 0)
            t = [...p._entities].map(x => x.id).reduce((x, y) => x + ' ' + y, '  ### ');
        return s + t;
    }
}