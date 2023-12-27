const ENTITY = Symbol.for('Entity');
const ARTEFACT = Symbol.for('Artefact');
const MOVER = Symbol.for('Mover');
const VEHICLE = Symbol.for('Vehicle');
const OBSTACLE = Symbol.for('Obstacle');
const WALL = Symbol.for('Wall');
const BUILDING = Symbol.for('Building');

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

// Behaviour identifier constants (flag values)
const WALL_AVOID = 1 << BIT_WALL_AVOID;
const OBSTACLE_AVOID = 1 << BIT_OBSTACLE_AVOID;
const EVADE = 1 << BIT_EVADE;
const FLEE = 1 << BIT_FLEE;
const SEPARATION = 1 << BIT_SEPARATION;	// These three
const ALIGNMENT = 1 << BIT_ALIGNMENT;	// together for
const COHESION = 1 << BIT_COHESION;	// flocking
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
const ALL_SB_MASK = 0x0ffffff;

const WEIGHTED = 1;
const WEIGHTED_PRIORITIZED = 2;

const DECEL_TWEEK = [0.0, 0.3, 0.6, 0.9];
const FAST = 1;
const NORMAL = 2;
const SLOW = 3;

// These refer to array index values so don't change them.
const AGENT0 = 0;
const AGENT1 = 1;
const AGENT_TO_PURSUE = 2;
const AGENT_TO_EVADE = 3;
const NBR_AGENT_ARRAY = 4;

const PASS_THROUGH = 10000;
const WRAP = 10001;
const REBOUND = 10002;

const SAFE_TIME_INTERVAL = 250;

const EPSILON = 1E-10;

// interface Position {
//     x: number;
//     y: number;
// }