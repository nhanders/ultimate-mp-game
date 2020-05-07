/**
 * This class stores the state of a bullet on the server.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const Constants = require('../lib/Constants')
const Entity = require('../lib/Entity')
const Vector = require('../lib/Vector')
const Util = require('../lib/Util')

/**
 * Disc class.
 */
class Disc extends Entity {
  /**
   * Constructor for a Bullet object.
   * @constructor
   * @param {Vector} position The starting position vector
   * @param {Vector} velocity The starting velocity vector
   * @param {number} angle The orientation of the disc
   * @param {Player} source The Player object throwing the disc
   */
  constructor(position, velocity, angle, source) {
    // super(position, velocity, Vector.zero(), Constants.BULLET_HITBOX_SIZE)
    super(position)

    this.angle = angle
    this.source = source

    // this.damage = Constants.BULLET_DEFAULT_DAMAGE
    this.distanceTraveled = 0
    this.destroyed = false
    this.speedAtDest = Constants.SPEED_AT_DEST;
    this.speedDecayConst = Constants.SPEED_DECAY;
    this.hitboxSize = Constants.DISC_RAD

    this.throwDest = null
    this.position = position
    this.alpha = 10;
    this.positionSave = this.position.copy() // for curvature

    this.onGround = true;
    this.isHeld = false;
    this.firstTouch = true;
    this.teamPossessionTracker = [false, false]
    this.playerHoldingDisc = null;

    this.stopDisc()
  }

  /**
   * Creates a new Bullet object from a Player object firing it.
   * @param {Player} player The Player object firing the bullet
   * @param {number} [angleDeviation=0] The angle deviation if the bullet is
   *   not traveling in the direction of the turret
   * @return {Bullet}
   */
  static createNewDisc(position) {
    return new Disc(Vector.fromArray(position))
  }

  /**
   * Update the disc given the client's input data from Input.js
   * @param {Object} data A JSON Object storing the input state
   */
  updateOnInput(data) {
    this.onGround = false;

    // the disc moves around the player while it is held
    const throwDest = Vector.fromArray(data.mouseCoords);
    const throwSrc = this.position;
    const throwVect = Vector.sub(throwDest, throwSrc);
    var throwAngle = throwVect.angle
    throwAngle *= -1;

    if (data.right && this.isHeld) {
      if (this.playerHoldingDisc.team.scoringEndzone == Constants.SCORING_ENDZONE_BOT){
        this.position.y = this.playerHoldingDisc.position.y - 12*Math.cos(throwAngle);
        this.position.x = this.playerHoldingDisc.position.x - 12*Math.sin(throwAngle);
      }
      else {
        this.position.y = this.playerHoldingDisc.position.y + 12*Math.cos(throwAngle);
        this.position.x = this.playerHoldingDisc.position.x + 12*Math.sin(throwAngle);
      }
    }
    if (data.left && this.isHeld) {
      if (this.playerHoldingDisc.team.scoringEndzone == Constants.SCORING_ENDZONE_BOT){
        this.position.y = this.playerHoldingDisc.position.y + 12*Math.cos(throwAngle);
        this.position.x = this.playerHoldingDisc.position.x + 12*Math.sin(throwAngle);
      }
      else {
        this.position.y = this.playerHoldingDisc.position.y - 12*Math.cos(throwAngle);
        this.position.x = this.playerHoldingDisc.position.x - 12*Math.sin(throwAngle);
      }
    }

    // Hard throw
    if (data.up && this.isHeld) {
      this.speedAtDest = 2*Constants.SPEED_AT_DEST;
    }
    else {
      this.speedAtDest = Constants.SPEED_AT_DEST;
    }

    // Throwing
    if (data.throw){
      this.distanceTraveled = 0;

      this.throwPerfectDest = Vector.fromArray(data.mouseCoords);
      this.throwSrc = this.position;
      this.throwPerfectDistance = Vector.sub(this.throwPerfectDest, this.throwSrc).mag

      var throwErrX = this.throwPerfectDistance/Constants.FIELD_HEIGHT * Util.randRange(-this.playerHoldingDisc.throw_err, this.playerHoldingDisc.throw_err);
      var throwErrY = this.throwPerfectDistance/Constants.FIELD_HEIGHT * Util.randRange(-this.playerHoldingDisc.throw_err, this.playerHoldingDisc.throw_err);
      this.throwDest = Vector.add(this.throwPerfectDest, Vector.fromArray([throwErrX, throwErrY]));

      this.throwVect = Vector.sub(this.throwDest, this.throwSrc);
      this.throwDistance = this.throwVect.mag;
      this.throwVectAngle = this.throwVect.angle;

      const throwGradient = (this.throwDest.y-this.throwSrc.y)/(this.throwDest.x-this.throwSrc.x)
      const throwGradientVect = new Vector(1, -1/throwGradient);
      this.throwGradientVectNorm = throwGradientVect.scale(1/throwGradientVect.mag)
      this.throwDistanceRemaining = this.throwDistance;
      this.speed = this.throwDistanceRemaining*this.speedDecayConst+this.speedAtDest;
      this.velocity = Vector.fromPolar(this.speed, this.throwVectAngle)
      this.onGround = false;
      this.isHeld = false;
      this.playerHoldingDisc = null;

      // curve
      if (data.right) this.throwType = Constants.THROW_RIGHT_TO_LEFT;
      else if (data.left) this.throwType = Constants.THROW_LEFT_TO_RIGHT;
      else this.throwType = Constants.THROW_STRAIGHT;

      this.positionSave = this.position.copy() // for curvature
    }
  }

  /**
   * Update the disc given the client's input data from Input.js
   * @param {Object} data A JSON Object storing the input state
   */
  stopDisc() {
    this.velocity = Vector.zero();
    this.throwDest = null;
  }

  /**
   * Performs a physics update.
   * @param {number} lastUpdateTime The last timestamp an update occurred
   * @param {number} deltaTime The timestep to compute the update with
   */
  update(lastUpdateTime, deltaTime) {
    const distanceStep = Vector.scale(this.velocity, deltaTime)
    this.positionSave.add(distanceStep)
    this.distanceTraveled += distanceStep.mag
    if ((!this.inWorld() && this.onGround) || this.distanceTraveled > this.throwDistance) {
      this.onGround = true;
      this.stopDisc();
      this.distanceTraveled = 0;
      if (!this.inWorld()){
        this.adjustDiscPositionSideline() // move the disc off the sidelines
      }
    }
    if (this.inEndzone() && this.onGround){
      this.adjustDiscPositionEndzone() // move the disc to top of endzone
    }
    else if (this.throwDest){ // the disc is not on the ground and there is a throw
      this.throwDistanceRemaining = Vector.sub(this.throwDest, this.positionSave).mag
      const gamma = this.gammaFunc(this.throwDistanceRemaining)
      this.position.x = this.positionSave.x + gamma*this.throwGradientVectNorm.x
      this.position.y = this.positionSave.y + gamma*this.throwGradientVectNorm.y
      this.speed = this.throwDistanceRemaining*this.speedDecayConst+this.speedAtDest;
      this.velocity = Vector.fromPolar(this.speed, this.throwVectAngle)
    }
  }

  /**
   * Moves the disc off the sidelines if it is out of bounds.
   */
  adjustDiscPositionSideline(){
    if (this.position.x <= Constants.FIELD_MIN_X) this.position.x += 5;
    if (this.position.x >= Constants.FIELD_MAX_X) this.position.x -= 5;
    if (this.position.y <= Constants.FIELD_MIN_Y) this.position.y += 5;
    if (this.position.y >= Constants.FIELD_MAX_Y) this.position.y -= 5;
  }

  /**
   * Moves the disc off the sidelines if it is out of bounds.
   */
  adjustDiscPositionEndzone(){
    // bottom endzone
    if (this.position.y > Constants.FIELD_HEIGHT+Constants.FIELD_HEIGHT_OFFSET-Constants.ENDZONE_HEIGHT &&
        this.position.y < Constants.CANVAS_HEIGHT-Constants.FIELD_HEIGHT_OFFSET &&
        this.position.x > Constants.FIELD_MIN_X &&
        this.position.x < Constants.FIELD_MAX_X){

        this.position.y = Constants.FIELD_HEIGHT+Constants.FIELD_HEIGHT_OFFSET-Constants.ENDZONE_HEIGHT;
    }
    // top endzone
    else if (this.position.y > Constants.FIELD_HEIGHT_OFFSET &&
             this.position.y < Constants.FIELD_HEIGHT_OFFSET+Constants.ENDZONE_HEIGHT &&
             this.position.x > Constants.FIELD_MIN_X &&
             this.position.x < Constants.FIELD_MAX_X){

      this.position.y = Constants.FIELD_HEIGHT_OFFSET+Constants.ENDZONE_HEIGHT;
    }
  }

  /**
   * Function to add curve to the disc.
   */
  gammaFunc(x){
    if (this.throwType == Constants.THROW_STRAIGHT) return 0
    else if (this.throwType == Constants.THROW_LEFT_TO_RIGHT) return (x/(this.throwDistance)*(x-this.throwDistance))
    else if (this.throwType == Constants.THROW_RIGHT_TO_LEFT) return (-x/(this.throwDistance)*(x-this.throwDistance))
  }

  /**
   * Return true if disc is in an endzone
   */
  inEndzone() {
      return ((this.position.y > Constants.FIELD_HEIGHT+Constants.FIELD_HEIGHT_OFFSET-Constants.ENDZONE_HEIGHT &&
              this.position.y < Constants.CANVAS_HEIGHT-Constants.FIELD_HEIGHT_OFFSET &&
              this.position.x > Constants.FIELD_MIN_X &&
              this.position.x < Constants.FIELD_MAX_X) ||
              (this.position.y > Constants.FIELD_HEIGHT_OFFSET &&
              this.position.y < Constants.FIELD_HEIGHT_OFFSET+Constants.ENDZONE_HEIGHT &&
              this.position.x > Constants.FIELD_MIN_X &&
              this.position.x < Constants.FIELD_MAX_X))
  }
}

module.exports = Disc
