const ENTITY = Symbol.for('Entity');
const ARTEFACT = Symbol.for('Artefact');
const MOVER = Symbol.for('Mover');
const VEHICLE = Symbol.for('Vehicle');
const OBSTACLE = Symbol.for('Obstacle');
const WALL = Symbol.for('Wall');
const FENCE = Symbol.for('Fence');
// Bit positions for flags for internal library use.
// These are used to index the force
const BIT_WALL_AVOID = 0;
const BIT_OBSTACLE_AVOID = 1;
const BIT_EVADE = 2;
const BIT_FLEE = 3;
const BIT_SEPARATION = 4; // These three
const BIT_ALIGNMENT = 5; // together for
const BIT_COHESION = 6; // flocking
const BIT_SEEK = 7;
const BIT_ARRIVE = 8;
const BIT_WANDER = 9;
const BIT_PURSUIT = 10;
const BIT_OFFSET_PURSUIT = 11;
const BIT_INTERPOSE = 12;
const BIT_HIDE = 13;
const BIT_PATH = 14;
const BIT_FLOCK = 15;
const WEIGHTS_INDEX = new Map()
    .set('Wall Avoid', '0').set('Obstacle Avoid', 1).set('Evade', 2).set(`Flee`, 3)
    .set('Separation', 4).set('Alignment', 5).set('Cohesion', 6).set('Seek', 7)
    .set('Arrive', 8).set('Wander', 9).set('Pursuit', 10).set('Offset Pursuit', 11)
    .set('Interpose', 12).set('Hide', 13).set('Path', 14).set('Flock', 15);
const NBR_BEHAVIOURS = 16;
// Behaviour identifier constants (flag values)
const WALL_AVOID = 1 << BIT_WALL_AVOID;
const OBSTACLE_AVOID = 1 << BIT_OBSTACLE_AVOID;
const EVADE = 1 << BIT_EVADE;
const FLEE = 1 << BIT_FLEE;
const SEPARATION = 1 << BIT_SEPARATION; //  These three
const ALIGNMENT = 1 << BIT_ALIGNMENT; //  together for
const COHESION = 1 << BIT_COHESION; //      flocking
const SEEK = 1 << BIT_SEEK;
const ARRIVE = 1 << BIT_ARRIVE;
const WANDER = 1 << BIT_WANDER;
const PURSUIT = 1 << BIT_PURSUIT;
const OFFSET_PURSUIT = 1 << BIT_OFFSET_PURSUIT;
const INTERPOSE = 1 << BIT_INTERPOSE;
const HIDE = 1 << BIT_HIDE;
const PATH = 1 << BIT_PATH;
const FLOCK = 1 << BIT_FLOCK;
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
const NO_SIDE = Symbol.for('Ignore wall');
const INSIDE = Symbol.for('Rebound from inside plane');
const OUTSIDE = Symbol.for('Rebound from outside plane');
const BOTH_SIDES = Symbol.for('Rebound from boths sides');
const MAX_TURN_RATE = 25;
// Domain
const PASS_THROUGH = Symbol.for('Pass through');
const WRAP = Symbol.for('Wrap');
const REBOUND = Symbol.for('Rebound');
const EPSILON = 1E-10;
const PREC = 5;
const FXD = 2;
//# sourceMappingURL=constants.js.map