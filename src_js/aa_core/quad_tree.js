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
var _QPart_instances, _QPart_entities, _QPart_parent, _QPart_children, _QPart_level, _QPart_depth, _QPart_lowX, _QPart_highX, _QPart_lowY, _QPart_highY, _QPart_cX, _QPart_cY, _QPart_childAt;
class QPart {
    /**
     * Creates a single partition in a quadtree structure.
     *
     * To create a quadtree data structure use the QPart.makeTree(...)
     * function.
     */
    constructor(parent, lowX, lowY, highX, highY, level, depth) {
        _QPart_instances.add(this);
        _QPart_entities.set(this, void 0);
        _QPart_parent.set(this, void 0);
        _QPart_children.set(this, void 0);
        _QPart_level.set(this, void 0);
        _QPart_depth.set(this, void 0);
        _QPart_lowX.set(this, void 0);
        _QPart_highX.set(this, void 0);
        _QPart_lowY.set(this, void 0);
        _QPart_highY.set(this, void 0);
        _QPart_cX.set(this, void 0);
        _QPart_cY.set(this, void 0);
        __classPrivateFieldSet(this, _QPart_parent, parent, "f");
        __classPrivateFieldSet(this, _QPart_lowX, lowX, "f");
        __classPrivateFieldSet(this, _QPart_lowY, lowY, "f");
        __classPrivateFieldSet(this, _QPart_highX, highX, "f");
        __classPrivateFieldSet(this, _QPart_highY, highY, "f");
        __classPrivateFieldSet(this, _QPart_cX, (__classPrivateFieldGet(this, _QPart_lowX, "f") + __classPrivateFieldGet(this, _QPart_highX, "f")) / 2, "f");
        __classPrivateFieldSet(this, _QPart_cY, (__classPrivateFieldGet(this, _QPart_lowY, "f") + __classPrivateFieldGet(this, _QPart_highY, "f")) / 2, "f");
        __classPrivateFieldSet(this, _QPart_level, level, "f");
        __classPrivateFieldSet(this, _QPart_depth, depth, "f");
        __classPrivateFieldSet(this, _QPart_entities, new Set(), "f");
    }
    get entities() { return [...__classPrivateFieldGet(this, _QPart_entities, "f")]; }
    get parent() { return __classPrivateFieldGet(this, _QPart_parent, "f"); }
    get children() { return __classPrivateFieldGet(this, _QPart_children, "f"); }
    get level() { return __classPrivateFieldGet(this, _QPart_level, "f"); }
    get depth() { return __classPrivateFieldGet(this, _QPart_depth, "f"); }
    get lowX() { return __classPrivateFieldGet(this, _QPart_lowX, "f"); }
    get highX() { return __classPrivateFieldGet(this, _QPart_highX, "f"); }
    get lowY() { return __classPrivateFieldGet(this, _QPart_lowY, "f"); }
    get highY() { return __classPrivateFieldGet(this, _QPart_highY, "f"); }
    get cX() { return __classPrivateFieldGet(this, _QPart_cX, "f"); }
    get cY() { return __classPrivateFieldGet(this, _QPart_cY, "f"); }
    get partSize() { return __classPrivateFieldGet(this, _QPart_highX, "f") - __classPrivateFieldGet(this, _QPart_lowX, "f"); }
    get treeSize() { return this.getRoot().partSize; }
    get leafSize() {
        return this.getRoot().partSize / 2 ** (__classPrivateFieldGet(this, _QPart_depth, "f") - 1);
    }
    get isLeaf() { return !__classPrivateFieldGet(this, _QPart_children, "f"); }
    get isRoot() { return !__classPrivateFieldGet(this, _QPart_parent, "f"); }
    get hasChildren() { return Boolean(__classPrivateFieldGet(this, _QPart_children, "f")); }
    getRoot() {
        return this.isRoot ? this : __classPrivateFieldGet(this, _QPart_parent, "f").getRoot();
    }
    // Find the partition that encompasses the specifies region. The specified region will be 
    // trimmed to fit inside the root if necessary.
    getEnclosingPartition(lowX, lowY, highX, highY) {
        function findPartition(p, x0, y0, x1, y1) {
            if ((x0 >= p.lowX && x1 <= p.highX && y0 >= p.lowY && y1 <= p.highY)) {
                if (p.hasChildren) {
                    let q = ((x0 < __classPrivateFieldGet(p, _QPart_cX, "f")) ? 0 : 1) + ((y0 < __classPrivateFieldGet(p, _QPart_cY, "f")) ? 0 : 2);
                    return findPartition(__classPrivateFieldGet(p, _QPart_children, "f")[q], x0, y0, x1, y1);
                }
                else
                    return p;
            }
            else
                return (p.isRoot ? p : __classPrivateFieldGet(p, _QPart_parent, "f"));
        }
        let root = this.getRoot();
        let a = Geom2D.box_box_p(lowX, lowY, highX, highY, root.lowX, root.lowY, root.highX, root.highY);
        if (a.length > 0) {
            [lowX, lowY, highX, highY] = a;
            return findPartition(root, lowX, lowY, highX, highY);
        }
        return root;
    }
    getItemsInRegion(lowX, lowY, highX, highY) {
        function getParent(part) {
            if (!part)
                return;
            parts.push(part);
            ents.push(...__classPrivateFieldGet(part, _QPart_entities, "f"));
            getParent(__classPrivateFieldGet(part, _QPart_parent, "f"));
        }
        function getChildren(part) {
            parts.push(part);
            ents.push(...__classPrivateFieldGet(part, _QPart_entities, "f"));
            if (part.hasChildren)
                for (let child of __classPrivateFieldGet(part, _QPart_children, "f"))
                    if (Geom2D.box_box(lowX, lowY, highX, highY, child.lowX, child.lowY, child.highX, child.highY))
                        getChildren(child);
            return;
        }
        let parts = [], ents = [];
        let encPart = this.getEnclosingPartition(lowX, lowY, highX, highY);
        getParent(__classPrivateFieldGet(encPart, _QPart_parent, "f"));
        getChildren(encPart);
        return { partitions: parts, entities: ents, enc_partition: encPart };
    }
    addEntity(entity) {
        function findPartition(part, entity) {
            if (entity.fitsInside(part.lowX, part.lowY, part.highX, part.highY)) {
                if (part.hasChildren)
                    findPartition(__classPrivateFieldGet(part, _QPart_instances, "m", _QPart_childAt).call(part, part, entity), entity);
                else
                    __classPrivateFieldGet(part, _QPart_entities, "f").add(entity);
            }
            else
                part.isRoot ? __classPrivateFieldGet(part, _QPart_entities, "f").add(entity) : __classPrivateFieldGet(__classPrivateFieldGet(part, _QPart_parent, "f"), _QPart_entities, "f").add(entity);
        }
        findPartition(this.getRoot(), entity);
    }
    delEntity(entity) {
        function findPartition(part, entity) {
            if (__classPrivateFieldGet(part, _QPart_entities, "f").delete(entity))
                return true;
            if (part.hasChildren)
                return findPartition(__classPrivateFieldGet(part, _QPart_instances, "m", _QPart_childAt).call(part, part, entity), entity);
            else
                return false;
        }
        return findPartition(this.getRoot(), entity);
    }
    countEntities() {
        function entityCount(part) {
            count += __classPrivateFieldGet(part, _QPart_entities, "f").size;
            if (part.hasChildren)
                for (let child of __classPrivateFieldGet(part, _QPart_children, "f"))
                    entityCount(child);
        }
        let count = 0;
        entityCount(this.getRoot());
        return count;
    }
    correctPartitionContents() {
        function processPartition(part, root) {
            // Only need to consider entiies that can move i.e. a Mover or Vehicle
            let me = [...__classPrivateFieldGet(part, _QPart_entities, "f")].filter(x => x instanceof Mover);
            for (let e of me) {
                if (e.fitsInside(part.lowX, part.lowY, part.highX, part.highY)) {
                    // Fits inside this partition attempt to move down as far as possible
                    if (part.hasChildren) {
                        let sp = __classPrivateFieldGet(part, _QPart_instances, "m", _QPart_childAt).call(part, part, e);
                        if (e.fitsInside(sp.lowX, sp.lowY, sp.highX, sp.highY)) {
                            __classPrivateFieldGet(part, _QPart_entities, "f").delete(e);
                            sp.addEntity(e);
                        }
                    }
                }
                else {
                    // Does not fit inside partition. If this is not the root then remove 
                    // from this partion and add back to tree
                    if (part != root) {
                        __classPrivateFieldGet(part, _QPart_entities, "f").delete(e);
                        root.addEntity(e);
                    }
                }
            }
            __classPrivateFieldGet(part, _QPart_children, "f")?.forEach(p => processPartition(p, root));
        }
        let root = this.getRoot();
        processPartition(root, root);
    }
    getTreeLevelData() {
        function CountEntitiesByLevel(part) {
            let s = 0;
            __classPrivateFieldGet(part, _QPart_entities, "f").forEach(e => { if (e instanceof Artefact)
                s++; });
            levelArtefact[0] += s;
            levelArtefact[part.level] += s;
            s = 0;
            __classPrivateFieldGet(part, _QPart_entities, "f").forEach(e => { if (e instanceof Fence)
                s++; });
            levelFence[0] += s;
            levelFence[part.level] += s;
            s = 0;
            __classPrivateFieldGet(part, _QPart_entities, "f").forEach(e => { if (e instanceof Wall)
                s++; });
            levelWall[0] += s;
            levelWall[part.level] += s;
            s = 0;
            __classPrivateFieldGet(part, _QPart_entities, "f").forEach(e => { if (e instanceof Obstacle)
                s++; });
            levelObstacle[0] += s;
            levelObstacle[part.level] += s;
            s = 0;
            __classPrivateFieldGet(part, _QPart_entities, "f").forEach(e => { if (e instanceof Mover)
                s++; });
            levelMover[0] += s;
            levelMover[part.level] += s;
            if (part.hasChildren)
                for (let child of part.children)
                    CountEntitiesByLevel(child);
        }
        let levelArtefact = new Array(this.depth + 1).fill(0);
        let levelMover = new Array(this.depth + 1).fill(0);
        let levelFence = new Array(this.depth + 1).fill(0);
        let levelWall = new Array(this.depth + 1).fill(0);
        let levelObstacle = new Array(this.depth + 1).fill(0);
        CountEntitiesByLevel(this.getRoot());
        return {
            'movers': levelMover, 'obstacles': levelObstacle, 'walls': levelWall,
            'fences': levelFence, 'artefacts': levelArtefact,
            'depth': this.depth, 'treesize': this.treeSize,
            'leafsize': this.leafSize, 'lowX': this.lowX, 'lowY': this.lowY
        };
    }
    $$(len = 5) {
        console.log(this.$(len));
        return this.toString(len);
    }
    $(len = 5) {
        return this.toString(len);
    }
    toString(len = 5) {
        function fmt(n, nd, bufferLength) {
            let s = n.toFixed(nd).toString();
            while (s.length < bufferLength)
                s = ' ' + s;
            return s;
        }
        let p = this, t = '', s = `Partition Lvl: ${fmt(__classPrivateFieldGet(p, _QPart_level, "f"), 0, 2)}`;
        s += `    @ [${fmt(p.lowX, 0, 5)}, ${fmt(p.lowY, 0, 5)}]`;
        s += ` to [${fmt(p.highX, 0, 5)}, ${fmt(p.highY, 0, 5)}]`;
        s += ` contains ${__classPrivateFieldGet(this, _QPart_entities, "f").size}  entities`;
        if (__classPrivateFieldGet(p, _QPart_entities, "f").size > 0)
            t = [...__classPrivateFieldGet(p, _QPart_entities, "f")].map(x => x.id).reduce((x, y) => x + ' ' + y, '  ### ');
        return s + t;
    }
    static makeTree(lowX, lowY, size, depth) {
        function buildSubTree(parent, level, depth) {
            if (level <= depth) {
                let x0 = __classPrivateFieldGet(parent, _QPart_lowX, "f"), x2 = __classPrivateFieldGet(parent, _QPart_highX, "f"), x1 = (x0 + x2) / 2;
                let y0 = __classPrivateFieldGet(parent, _QPart_lowY, "f"), y2 = __classPrivateFieldGet(parent, _QPart_highY, "f"), y1 = (y0 + y2) / 2;
                __classPrivateFieldSet(parent, _QPart_children, [], "f");
                let a = __classPrivateFieldGet(parent, _QPart_children, "f");
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
_QPart_entities = new WeakMap(), _QPart_parent = new WeakMap(), _QPart_children = new WeakMap(), _QPart_level = new WeakMap(), _QPart_depth = new WeakMap(), _QPart_lowX = new WeakMap(), _QPart_highX = new WeakMap(), _QPart_lowY = new WeakMap(), _QPart_highY = new WeakMap(), _QPart_cX = new WeakMap(), _QPart_cY = new WeakMap(), _QPart_instances = new WeakSet(), _QPart_childAt = function _QPart_childAt(part, entity) {
    let q = ((entity.pos.x < __classPrivateFieldGet(part, _QPart_cX, "f")) ? 0 : 1) + ((entity.pos.y < __classPrivateFieldGet(part, _QPart_cY, "f")) ? 0 : 2);
    return __classPrivateFieldGet(part, _QPart_children, "f")[q];
};
//# sourceMappingURL=quad_tree.js.map