

class QPart {
    _entities: Set<Entity>;
    _parent: QPart;
    _children: Array<QPart>;
    _level: number;

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
                a[0] = new QPart(parent, x0, y0, x1, y1, level);
                a[1] = new QPart(parent, x1, y0, x2, y1, level);
                a[2] = new QPart(parent, x0, y1, x1, y2, level);
                a[3] = new QPart(parent, x1, y1, x2, y2, level);
                buildSubTree(a[0], level + 1, depth);
                buildSubTree(a[1], level + 1, depth);
                buildSubTree(a[2], level + 1, depth);
                buildSubTree(a[3], level + 1, depth);
            }
        }
        let level = 1, root = new QPart(undefined, lowX, lowY, highX, highY, level);
        buildSubTree(root, level + 1, depth);
        return root;
    }

    get lowX(): number { return this._lowX; }
    get highX(): number { return this._highX; }
    get lowY(): number { return this._lowY; }
    get highY(): number { return this._highY; }

    get width(): number { return this.highX - this._lowX; }
    get height(): number { return this.highY - this._lowY; }


    get isLeaf(): boolean { return !this._children; }
    get isRoot(): boolean { return !this._parent; }
    get hasChildren(): boolean { return Boolean(this._children); }

    constructor(parent: QPart, lowX: number, lowY: number, highX: number, highY: number, level: number) {
        this._parent = parent;
        this._lowX = lowX;
        this._lowY = lowY;
        this._highX = highX;
        this._highY = highY;
        this._cX = (this._lowX + this._highX) / 2;
        this._cY = (this._lowY + this._highY) / 2;
        this._level = level;
        this._entities = new Set();
    }

    getRoot() {
        return this.isRoot ? this : this._parent.getRoot();
    }

    getEntitiesInPartition(part: QPart): Array<Entity> {
        function getEntities(part: QPart, ents: Array<Entity>) {
            ents.push(...part._entities);
            part._children?.forEach(value => getEntities(value, ents));
        }
        let entities = [];
        getEntities(part, entities);
        return entities;
    }

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
        return undefined;
    }

    addEntity(entity: Entity) {
        function findPartition(part: QPart, entity: Entity) {
            if (entity.fitsInside(part.lowX, part.lowY, part.highX, part.highY)) {
                if (part.hasChildren) {
                    let q = ((entity.pos.x < part._cX) ? 0 : 1) + ((entity.pos.y < part._cY) ? 0 : 2);
                    findPartition(part._children[q], entity);
                }
                else {
                    part._entities.add(entity);
                }
            }
            else {
                part.isRoot ? part._entities.add(entity) :
                    part._parent._entities.add(entity);
            }
        }
        findPartition(this.getRoot(), entity);
    }

    subEntity(entity: Entity) {
        function findPartition(part: QPart, entity: Entity) {
            if (part._entities.delete(entity)) return true;
            if (part.hasChildren) {
                let q = ((entity.pos.x < part._cX) ? 0 : 1) + ((entity.pos.y < part._cY) ? 0 : 2);
                return findPartition(part._children[q], entity);
            }
            else
                return false;
        }
        return findPartition(this.getRoot(), entity);
    }

    toString() {
        let p = this, t = '';
        let s = `Partition Lvl: ${p._level}  @ [${p.lowX}, ${p.lowY}] to [${p.highX}, ${p.highY}]`;
        if (p._entities.size > 0) {
            for (let e of p._entities) t += e.id + '  ';
            t = `   ###  ${t} `;
        }
        return s + t;
    }
}