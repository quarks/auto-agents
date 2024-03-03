const ENTITY = Symbol.for('Entity');
const ARTEFACT = Symbol.for('Artefact');
const MOVER = Symbol.for('Mover');
const VEHICLE = Symbol.for('Vehicle');
const OBSTACLE = Symbol.for('Obstacle');
const WALL = Symbol.for('Wall');
const FENCE = Symbol.for('Fence');
// Bit positions for flags for internal library use.
// These are used to index the force
const IDX_WALL_AVOID = 0;
const IDX_OBSTACLE_AVOID = 1;
const IDX_EVADE = 2;
const IDX_FLEE = 3;
const IDX_SEPARATION = 4; // These three
const IDX_ALIGNMENT = 5; // together for
const IDX_COHESION = 6; // flocking
const IDX_SEEK = 7;
const IDX_ARRIVE = 8;
const IDX_WANDER = 9;
const IDX_PURSUIT = 10;
const IDX_OFFSET_PURSUIT = 11;
const IDX_INTERPOSE = 12;
const IDX_HIDE = 13;
const IDX_PATH = 14;
const IDX_FLOCK = 15;
const WEIGHTS_INDEX = new Map()
    .set('Wall Avoid', '0').set('Obstacle Avoid', 1).set('Evade', 2).set(`Flee`, 3)
    .set('Separation', 4).set('Alignment', 5).set('Cohesion', 6).set('Seek', 7)
    .set('Arrive', 8).set('Wander', 9).set('Pursuit', 10).set('Offset Pursuit', 11)
    .set('Interpose', 12).set('Hide', 13).set('Path', 14).set('Flock', 15);
const NBR_BEHAVIOURS = 16;
// Behaviour identifier constants (flag values)
const WALL_AVOID = 1 << IDX_WALL_AVOID;
const OBSTACLE_AVOID = 1 << IDX_OBSTACLE_AVOID;
const EVADE = 1 << IDX_EVADE;
const FLEE = 1 << IDX_FLEE;
const SEPARATION = 1 << IDX_SEPARATION; //  These three
const ALIGNMENT = 1 << IDX_ALIGNMENT; //  together for
const COHESION = 1 << IDX_COHESION; //      flocking
const SEEK = 1 << IDX_SEEK;
const ARRIVE = 1 << IDX_ARRIVE;
const WANDER = 1 << IDX_WANDER;
const PURSUIT = 1 << IDX_PURSUIT;
const OFFSET_PURSUIT = 1 << IDX_OFFSET_PURSUIT;
const INTERPOSE = 1 << IDX_INTERPOSE;
const HIDE = 1 << IDX_HIDE;
const PATH = 1 << IDX_PATH;
const FLOCK = 1 << IDX_FLOCK;
// All behaviours mask used when switching off a behaviour
const ALL_SB_MASK = 0x0000ffff;
// Arrive
const DECEL_TWEEK = [0.0, 0.3, 0.6, 0.9];
const FAST = 1;
const NORMAL = 2;
const SLOW = 3;
// Wander
const WANDER_MIN_ANGLE = -Math.PI;
const WANDER_MAX_ANGLE = Math.PI;
const WANDER_ANGLE_RANGE = WANDER_MAX_ANGLE - WANDER_MIN_ANGLE;
// Wall avoid
const NO_SIDE = Symbol.for('noside');
const INSIDE = Symbol.for('inside');
const OUTSIDE = Symbol.for('outside');
const BOTH_SIDES = Symbol.for('bothsides');
const MAX_TURN_RATE = 25;
// Domain
const PASS_THROUGH = Symbol.for('passthrough');
const WRAP = Symbol.for('wrap');
const REBOUND = Symbol.for('rebound');
const EPSILON = 1E-10;
const PREC = 5;
const FXD = 2;
//# sourceMappingURL=constants.js.map