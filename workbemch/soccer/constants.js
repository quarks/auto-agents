// Player messages
const RECEIVE_BALL = 101;
const PASS_TO_ME = 102;
const SUPPORT_ATTACKER = 103;
const PLAYER_PREPARE_FOR_KICKOFF = 104;
const GO_TO_REGION = 105;
const TEND_GOAL = 107;
const AT_TARGET = 108;
const WAIT = 199;

// Team messages;
const PREPARE_FOR_KICKOFF = 201;
const DEFENDING = 202;
const ATTACKING = 203;

// Pitch messages
const TEAMS_PREPARE_FOR_KICK_OFF = 301;
const TEAMS_READY_FOR_KICK_OFF = 302;
const GOAL_SCORED = 303;
const STOP_GAME = 304;

const START_CLOCK = 310;
const KICKOFF = 311;
const PREMATCH = 312;

// State IDs
const PREPARE_FOR_KICKOFF_STATE = 901;
const DEFENDING_STATE = 902;
const ATTACKING_STATE = 903;

const GOALKEEPER = 1001;
const ATTACKER = 1002;
const DEFENDER = 1003;

const BALL_RADIUS = 4.5;
const BALL_MASS = 1.0;

const PLAYER_RADIUS = 5.5;
const PLAYER_MASS = 1.0;
const PLAYER_TURNRATE = 3.0;


const PITCH_LENGTH = 600;
const PITCH_WIDTH = 300;
const GOAL_WIDTH = 100;
const GOAL_DEPTH = 30;
const GOAL_NET_DEPTH = 18;

// Limits for goal scoring
const GOAL_HIGH_Y = (PITCH_WIDTH + GOAL_WIDTH) / 2 - BALL_RADIUS;
const GOAL_LOW_Y = (PITCH_WIDTH - GOAL_WIDTH) / 2 + BALL_RADIUS;

const KEEPER_TEND_DIST = GOAL_DEPTH / 2;

const MATCH_TIME = 20;              // Change to 120 when tested
const TIMER_LENGTH = 200;

//these values tweak the various rules used to calculate the support spots
const Spot_CanPassScore = 2.0;
const Spot_CanScoreFromPositionScore = 1.0;
const Spot_DistFromControllingPlayerScore = 2.0;
//    const Spot_ClosenessToSupportingPlayerScore   = 0.1;
//    const Spot_AheadOfAttackerScore        = 1.0;

// The maximum time between recalculation of the support spots
const SupportSpotUpdateInterval = 1000;

//the chance a player might take a random pot shot at the goal
const ChancePlayerAttemptsPotShot = 0.05;

//this is the chance that a player will receive a pass using the arrive
//steering behaviour, rather than Pursuit
const ChanceOfUsingArriveTypeReceiveBehavior = 0.5;


const FRICTION_MAG = -15.0;
const FRICTION_MAG_SQ = FRICTION_MAG * FRICTION_MAG;

// The keeper has to be this close to the ball to be able to interact with it
const KeeperInBallRange = PLAYER_RADIUS + BALL_RADIUS; // was 10
const KeeperInBallRangeSq = KeeperInBallRange * KeeperInBallRange;
const PlayerNearTargetRange = 20.0;
const PlayerNearTargetRangeSq = PlayerNearTargetRange * PlayerNearTargetRange;
const PlayerAtTargetRange = 2.0;
const PlayerAtTargetRangeSq = PlayerAtTargetRange * PlayerAtTargetRange;

// Player has to be this close to the ball to be able to kick it. The higher
// the value this gets, the easier it gets to tackle. 
const PlayerKickingDistance = PLAYER_RADIUS + BALL_RADIUS + 2; // 12.0;
const PlayerKickingDistanceSq = PlayerKickingDistance * PlayerKickingDistance;

// The minimum time (milliseconds) allowed between kicks by the same player
const PlayerKickInterval = 125;

const PlayerMaxForce = 1000;
const PlayerMaxSpeedWithBall = 36; // 30
const PlayerMaxSpeedWithoutBall = 66; // 60
const KeeperMaxSpeedWithoutBall = 45; // 60
const PlayerMaxTurnRate = 7.0;

//when an opponents comes within this range the player will attempt to pass
//the ball. Players tend to pass more often, the higher the value
const PlayerComfortZone = 50.0;
const PlayerComfortZoneSq = PlayerComfortZone * PlayerComfortZone;

//in the range zero to 1.0. adjusts the amount of noise added to a kick,
//the lower the value the worse the players get.
const PlayerKickingAccuracy = 0.95;

//the number of times the SoccerTeam::CanShoot method attempts to find
//a valid shot
const NumAttemptsToFindValidStrike = 5;

// Forces that can be applied when kicking the ball
const MaxShootingForce = 220;
const BaseForce = 180;
const MaxPassingForce = BaseForce;
const MaxDribbleForce = BaseForce / 4.6;
const MaxDribbleTurnForce = BaseForce / 5;

//the minimum distance a receiving player must be from the passing player
const FielderMinPassDistance = 120;
//the minimum distance a player must be from the goalkeeper before it will
//pass the ball
const KeeperMinPassDistance = 60.0;
// Pass threat distance
const PassThreatDistance = 70.0;

// when the ball becomes within this distance of the goalkeeper he
// changes state to intercept the ball
const GoalKeeperInterceptRange = 80.0;
const GoalKeeperInterceptRangeSq = GoalKeeperInterceptRange * GoalKeeperInterceptRange;

//how close the ball must be to a receiver before he starts chasing it
const BallWithinReceivingRange = 50.0;
const BallWithinReceivingRangeSq = BallWithinReceivingRange * BallWithinReceivingRange;

const offPitchHeading = new Vector2D(0, -1);

