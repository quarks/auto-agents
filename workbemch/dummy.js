class __QPart {

    /**
     * Use this method to create the root partition for a dynamic 
     * quadtree.
     * @param size the length and width of the tree domain
     * @param depth maximum number of levels in the tree
     * @param splitAt build subtree when this occupancy is reached or exceeded
     * @returns the quadtree root partition
     */
    static makeTree(size: number, depth: number, splitAt: number) {
        return new __QPart(undefined, size / 2, size / 2, size, 0, depth, splitAt);
    }

    /**
     * Do not use this constructor to create a quadtree partition. Use the
     * WorldPart.makeTree(...) to create the root partition for a
     * quadtree. All sub level partitions will be created bor you as
     * neccessary.
     * @param parent the parent partition. If null then this is the root
     * @param cX the X position of the partition's centre
     * @param cY the Y position of the partition's centre
     * @param size the length of the partition's side
     * @param level the level of the partition (0 being the root level)
     */
    constructor(parent: __QPart, cX: number, cY: number, size: number,
        level: number, depth: number, splitAt: number) {
        this.parent = parent;
        this.cX = cX;
        this.cY = cY;
        this.size = size;
        let hs = size / 2;
        this.lowX = cX - hs;
        this.highX = cX + hs;
        this.lowY = cY - hs;
        this.highY = cY + hs;
        this.halfSize = hs;
        this.level = level;
        this.depth = depth;
        this.splitAt = splitAt
        let halfSize = size / 2;
        this.lowX = cX - halfSize;
        this.highX = cX + halfSize;
        this.lowY = cY - halfSize;
        this.highY = cY + halfSize;
    }

    populateGrid(grid: Array<Array<__QPart>>, partSize: number, minCellSize: number) {
        let x = Math.round(this.lowX / minCellSize);
        let y = Math.round(this.lowY / minCellSize);
        for (let gx = 0; gx < partSize; gx++)
            for (let gy = 0; gy < partSize; gy++)
                grid[x + gx][y + gy] = this;
        // console.log(` ${x}:${x + partSize - 1}   ${y}:${y + partSize - 1}   cX: ${this.cX}  cY:${this.cY}  size: ${this.size}`)
        this.children?.forEach(p => p.populateGrid(grid, partSize / 2, minCellSize));
    }

    /**
     * Entry point for updating the quadtree. 
     * It first finds the tree root and then 
     * (1) moves the entities
     * (2) updates the partitions
     *     a) entities that don't fit their partition are moved up the tree
     *     b) try to move all other enti into child partitions if they fit
     *     c) build a sub tree if required
     * (3) performs collision detection
    *
     * @param time the elapsed time since last update in seconds
     */
    updateTree(time: number) {
        // make sure we are starting from the root partition
        let root = this.getRoot();
        this._moveEnities(root, time);
        root._updatePartitions();
        root._collisionDetection();
    }

    /*
    ---------------- PARTITION UPDATE ALGORITHM -----------------
    if this is not a leaf partition and has no children and the occupancy >= splitAt then
        build sub tree
    for each ball
        if ball is contained by this partition then
            if it has children and it fits inside a child then
                remove ball from this partition
                add ball to child partition
        else (ball is not contained by this partition)
            if not root node
                find nearest ancester where the ball fits
                    remove ball from this partition
                    add ball to the nearest ancester partition
    */
    _updatePartitions() {
        let balls = [...this._entities];
        if (!this._isLeaf() && !this.children && balls.length >= this.splitAt) {
            this._buildSubTree();
        }
        balls.forEach(b => {
            if (this._contains(b)) { // Contains ball
                // Identify possible child partition
                if (this.children) {
                    let q = ((b._pos.x < this.cX) ? 0 : 1) + ((b._pos.y < this.cY) ? 0 : 2);
                    if (this.children[q]._contains(b)) {
                        this._entities = this._entities.filter(ball => ball !== b);
                        this.children[q]._entities.push(b);
                    }
                }
            }
            else { //  Does not contain ball
                if (this.parent) {
                    let dst = this.parent;
                    while (dst && !dst._contains(b)) dst = dst.parent;
                    if (dst && dst !== this) {
                        this._entities = this._entities.filter(ball => ball !== b);
                        dst._entities.push(b);
                    }
                }
            }
        });
        this.children?.forEach(part => { part._updatePartitions() })
    }

    /**
    *                        Child arrangement:  0|1 
    * Create the next level down in the sub      ---
    * tree andattempt to push down nodes         2|3
    */
    _buildSubTree() {
        this.children = [];
        let cX = this.cX, cY = this.cY, size2 = this.size / 2, size4 = this.size / 4;
        let level = this.level + 1, depth = this.depth, splitAt = this.splitAt;
        this.children[0] = new __QPart(this, cX - size4, cY - size4, size2, level, depth, splitAt);
        this.children[1] = new __QPart(this, cX + size4, cY - size4, size2, level, depth, splitAt);
        this.children[2] = new __QPart(this, cX - size4, cY + size4, size2, level, depth, splitAt);
        this.children[3] = new __QPart(this, cX + size4, cY + size4, size2, level, depth, splitAt);
    }

    /**
     * Perform collision detection in this partition.
     */
    _collisionDetection() {
        // Depth first so we start with leaf partitions
        this.children?.forEach(p => p._collisionDetection());
        // If there are 2 or more balls in this partition then test for
        // collisions between them
        if (this._entities.length > 1) {
            for (let i = 0; i < this._entities.length - 1; i++) {
                let entity = this._entities[i];
                for (let j = i + 1; j < this._entities.length; j++) {
                    this.nbrTests++;
                    if (entity.colDetect(entity, this._entities[j]))
                        this.nbrCollisions++;
                }
            }
        }
        // If we have at least 1 object in this partition then test them against
        // any possible balls in upper level partitions
        if (this._entities.length > 0 && this.level > 0) {
            this.parent._cdBorderObjects(this._entities);
        }
    }

    /**
     * This method is called by lower level partitions to check for collisions
     * between their entities and those in the upper level partitions. Start with the
     * root partition and work recursively down until we reach the parent partition.
     * @param entitiesInChildLevel
     */
    _cdBorderObjects(entitiesInChildLevel: Array<Entity>) {
        if (this.parent != null)
            this.parent._cdBorderObjects(entitiesInChildLevel);
        if (this._entities.length > 0) {
            for (let i = 0; i < this._entities.length; i++) {
                //let entity = this._entities[i];
                for (let j = 0; j < entitiesInChildLevel.length; j++) {
                    this.nbrTests++;
                    // if (Entity.colDetect(entity, entitiesInChildLevel[j])) 
                    //     this.nbrCollisions++;
                }
            }
        }
    }


    /**
     * Returns true if it completely encompasses the object
     * @param ball
     * @return
     */
    _contains(entity: Entity): boolean {
        return entity.fitsInside(this.lowX, this.highX, this.lowY, this.highY);
    }

    /**
     * Get the root of the quadtree
     */
    getRoot(): __QPart {
        return this.parent ? this.parent.getRoot() : this;
    }

    /**
     * @returns true if this partition is the root
     */
    _isRoot() {
        return Boolean(this.parent);
    }
    /**
     * @returns true if this is a leaf partition i.e. at lowest level
     */
    _isLeaf() {
        return this.level === this.depth - 1;
    }

    toString(): string {
        let s = `lowX: ${Math.round(this.lowX)}  lowY: ${Math.round(this.lowY)}    `;
        s += `highX: ${Math.round(this.highX)}  highY: ${Math.round(this.highY)}    `;
        return s;
    }

    center(): string {
        return `cX: ${this.cX}   cY: ${this.cY}`;
    }
    // Each partition is linked to its parent and children. If parent is undefined
    // then it is the root partition
    parent: __QPart = undefined;
    children: Array<__QPart> = undefined;

    qpx: number = 0;
    qpy: number = 0;

    _entities: Array<Entity> = [];
    level = 0;
    lowX = 0; highX = 0; lowY = 0; highY = 0;
    cX = 0; cY = 0;
    size = 0;
    halfSize = 0;
    // We use these to gather statistics on collision detection
    nbrTests = 0;
    nbrCollisions = 0;
    // The depth and splitAt is the same for all partitions so could
    // be set up as static methods on the class. This way we can have 
    // multiple quadtrees with different configurations.
    depth: number;      // number of levels in the quadtree
    splitAt: number;    // child partitions are created if we get this occupancy
}

