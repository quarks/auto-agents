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
var _Fence_lowX, _Fence_lowY, _Fence_highX, _Fence_highY, _Fence_tri, _Fence_walls, _Fence_contour;
class Fence extends Entity {
    /**
     * A series of walls joined end-to-end making a fence or enclosure.
     *
     * The contour should be an open list of vectors for the 'fence posts'. For
     * consistant behaviour when using wall avoidance they should be in listed
     * in anti-clockwise order.
     *
     * An 'open' list is one where the first and last elements are not the same
     * position.
     *
     * A wall will be created between all adjacent elements in the array. So a
     * contour (array) of length 'n' will create 'n-1' walls. To create a wall
     * between the first and last element of the contour the second parameter
     * should be true.
     *
     *
     * @param contour an open list of vertices
     * @param makeEnclosure make the fence a closed enclosure.
     * @param repelSide which side of the wall is detectable to moving entities.
     */
    constructor(contour, makeEnclosure = false, repelSide = BOTH_SIDES, noWallAt = []) {
        // Find XY limits
        let lowX = contour[0].x, lowY = contour[0].y;
        let highX = contour[0].x, highY = contour[0].y;
        contour.forEach(v => {
            lowX = Math.min(lowX, v.x);
            lowY = Math.min(lowY, v.y);
            highX = Math.max(highX, v.x);
            highY = Math.max(highY, v.y);
        });
        super([(lowX + highX) / 2, (lowY + highY) / 2], 1);
        _Fence_lowX.set(this, void 0);
        _Fence_lowY.set(this, void 0);
        _Fence_highX.set(this, void 0);
        _Fence_highY.set(this, void 0);
        _Fence_tri.set(this, void 0);
        _Fence_walls.set(this, new Map());
        _Fence_contour.set(this, void 0);
        __classPrivateFieldSet(this, _Fence_lowX, lowX, "f");
        __classPrivateFieldSet(this, _Fence_lowY, lowY, "f");
        __classPrivateFieldSet(this, _Fence_highX, highX, "f");
        __classPrivateFieldSet(this, _Fence_highY, highY, "f");
        for (let i = 1; i < contour.length; i++)
            __classPrivateFieldGet(this, _Fence_walls, "f").set(i - 1, new Wall(contour[i - 1], contour[i], repelSide));
        if (makeEnclosure)
            __classPrivateFieldGet(this, _Fence_walls, "f").set(contour.length - 1, new Wall(contour[contour.length - 1], contour[0], repelSide));
        noWallAt.forEach(idx => __classPrivateFieldGet(this, _Fence_walls, "f").delete(idx));
        let closed = contour[0].equals(contour[contour.length - 1]);
        __classPrivateFieldSet(this, _Fence_tri, Geom2D.triangulate(contour, closed).map(idx => contour[idx]), "f");
        __classPrivateFieldSet(this, _Fence_contour, contour, "f");
    }
    get lowX() { return __classPrivateFieldGet(this, _Fence_lowX, "f"); }
    get lowY() { return __classPrivateFieldGet(this, _Fence_lowY, "f"); }
    get highX() { return __classPrivateFieldGet(this, _Fence_highX, "f"); }
    get highY() { return __classPrivateFieldGet(this, _Fence_highY, "f"); }
    get triangles() { return __classPrivateFieldGet(this, _Fence_tri, "f"); }
    get walls() { return [...__classPrivateFieldGet(this, _Fence_walls, "f").values()]; }
    get contour() { return __classPrivateFieldGet(this, _Fence_contour, "f"); }
    /** Overrides entity.born */
    born(world) {
        world.births.push(this);
        world.births.push(...__classPrivateFieldGet(this, _Fence_walls, "f").values());
    }
    /** Overrides entity.dies */
    dies(world) {
        world.deaths.push(this);
        world.deaths.push(...__classPrivateFieldGet(this, _Fence_walls, "f").values());
    }
    deleteWall(idx, world) {
        let wall = __classPrivateFieldGet(this, _Fence_walls, "f").get(idx);
        if (world && wall)
            world.deaths.push(wall);
    }
    wallRepelSide(idx, repelSide) {
        let wall = __classPrivateFieldGet(this, _Fence_walls, "f").get(idx);
        console.log(`Fence clss: ${String(repelSide)}`);
        wall?.setRepelSide(repelSide);
    }
    fitsInside(lowX, lowY, highX, highY) {
        return __classPrivateFieldGet(this, _Fence_lowX, "f") >= lowX && __classPrivateFieldGet(this, _Fence_lowY, "f") >= lowY && __classPrivateFieldGet(this, _Fence_highX, "f") <= highX && __classPrivateFieldGet(this, _Fence_highY, "f") <= highY;
    }
    update(elapsedTime) {
        // Use enity method?
    }
}
_Fence_lowX = new WeakMap(), _Fence_lowY = new WeakMap(), _Fence_highX = new WeakMap(), _Fence_highY = new WeakMap(), _Fence_tri = new WeakMap(), _Fence_walls = new WeakMap(), _Fence_contour = new WeakMap();
//# sourceMappingURL=fence.js.map