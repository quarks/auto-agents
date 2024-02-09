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
var _Vehicle_autopilot, _Vehicle_forceRecorder, _Vehicle_force, _Vehicle_accel;
class Vehicle extends Mover {
    constructor(position, radius) {
        super(position, radius);
        _Vehicle_autopilot.set(this, void 0);
        _Vehicle_forceRecorder.set(this, void 0);
        _Vehicle_force.set(this, new Vector2D());
        _Vehicle_accel.set(this, new Vector2D());
        __classPrivateFieldSet(this, _Vehicle_autopilot, new AutoPilot(this), "f");
    }
    get pilot() { return __classPrivateFieldGet(this, _Vehicle_autopilot, "f"); }
    get recorder() { return __classPrivateFieldGet(this, _Vehicle_forceRecorder, "f"); }
    setForce(force) { __classPrivateFieldGet(this, _Vehicle_force, "f").set(force); return this; }
    set force(force) { __classPrivateFieldGet(this, _Vehicle_force, "f").set(force); }
    get force() { return __classPrivateFieldGet(this, _Vehicle_force, "f"); }
    setAccel(accel) { __classPrivateFieldGet(this, _Vehicle_accel, "f").set(accel); return this; }
    set accel(accel) { __classPrivateFieldGet(this, _Vehicle_accel, "f").set(accel); }
    get accel() { return __classPrivateFieldGet(this, _Vehicle_accel, "f"); }
    fits_inside(lowX, lowY, highX, highY) {
        let fits = (this.pos.x - this._colRad >= lowX)
            && (this.pos.x + this._colRad <= highX)
            && (this.pos.y - this._colRad >= lowY)
            && (this.pos.y + this._colRad <= highY);
        return fits;
    }
    /**
     * Enable the force recorder on for this Vehicle. This will delete any
     * collected data and start the logger. <br>
     *
     * The recorder will record the minimum, maximum average and number of readings
     * for each steering force. <br>
     *
     * This is useful in tweaking max force values for vehicles and to
     * help decide on the best force calculation method to use. <br>
     *
     * The force recorder should be switched off in the final sketch.
     */
    forceRecorderOn() {
        if (this.pilot)
            __classPrivateFieldSet(this, _Vehicle_forceRecorder, new ForceRecorder(this, this.pilot._weight), "f");
        return this;
    }
    forceRecorderOff() {
        console.log(this.recorder.toString());
        __classPrivateFieldSet(this, _Vehicle_forceRecorder, undefined, "f");
        return this;
    }
    /** Display the steering force data for this Vehicle.   */
    printForceData() {
        console.log(this.recorder?.toString());
    }
    clearForceData() {
        this.recorder?.clearData();
    }
    /**
     * Update method for any moving entity in the world that is under
     * the influence of a steering behaviour.
     * @param elapsedTime elapsed time since last update
     * @param world the game world object
     */
    update(elapsedTime, world) {
        // Remember the starting position
        this.prevPos.set(this.pos);
        // Init accumulator variables
        __classPrivateFieldGet(this, _Vehicle_force, "f").set([0, 0]);
        __classPrivateFieldGet(this, _Vehicle_accel, "f").set([0, 0]);
        if (__classPrivateFieldGet(this, _Vehicle_autopilot, "f")) {
            __classPrivateFieldGet(this, _Vehicle_force, "f").set(__classPrivateFieldGet(this, _Vehicle_autopilot, "f").calculateForce(elapsedTime, world));
            __classPrivateFieldSet(this, _Vehicle_force, __classPrivateFieldGet(this, _Vehicle_force, "f").truncate(this.maxForce), "f");
            __classPrivateFieldSet(this, _Vehicle_accel, __classPrivateFieldGet(this, _Vehicle_force, "f").mult(elapsedTime / this.mass), "f");
            this.vel = this.vel.add(__classPrivateFieldGet(this, _Vehicle_accel, "f"));
        }
        // Make sure we don't exceed maximum speed
        this.vel = this.vel.truncate(this.maxSpeed);
        // Change position according to velocity and elapsed time
        this.pos = this.pos.add(this.vel.mult(elapsedTime));
        // Apply domain constraints
        this.applyDomainConstraint(this.domain ? this.domain : world.domain);
        // Update heading
        if (this.vel.lengthSq() > 0.02)
            this.rotateHeadingToAlignWith(elapsedTime, this.vel);
        else {
            this.vel.set([0, 0]);
            if (this.headingAtRest)
                this.rotateHeadingToAlignWith(elapsedTime, this.headingAtRest);
        }
        // Ensure heading and side are normalised
        this.heading = this.heading.normalize();
        this.side.set([-this.heading.y, this.heading.x]);
    }
}
_Vehicle_autopilot = new WeakMap(), _Vehicle_forceRecorder = new WeakMap(), _Vehicle_force = new WeakMap(), _Vehicle_accel = new WeakMap();
//# sourceMappingURL=vehicle.js.map