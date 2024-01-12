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

getItemsOfInterest(lowX: number, lowY: number, highX: number, highY: number) {
    function getParent(part) {
        if (!part) return;
        parts.push(part); ents.push(...part._entities);
        getParent(part._parent);
    }
    function getChildren(part) {
        parts.push(part); ents.push(...part._entities);
        if (part.hasChildren)
            for (let child of part._children)
                getChildren(child);
        return;
    }
    let parts: Array<QPart> = [], ents: Array<Entity> = [];
    let encPart = this.getEnclosingPartition(lowX, lowY, highX, highY);
    getParent(encPart._parent);
    getChildren(encPart);
    return { 'partitions': parts, 'entities': ents };
}

_childAt(part: QPart, entity: Entity): QPart {
    let q = ((entity.pos.x < part._cX) ? 0 : 1) + ((entity.pos.y < part._cY) ? 0 : 2);
    return part._children[q];
}