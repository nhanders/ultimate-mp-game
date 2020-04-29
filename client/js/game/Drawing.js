/**
 * Methods for drawing all the sprites onto the HTML5 canvas.
 * @author kennethli.3470@gmail.com (Kenneth Li)
 */

const Constants = require('../../../lib/Constants')
const Util = require('../../../lib/Util')

/**
 * Drawing class.
 */
class Drawing {
  /**
   * Constructor for the Drawing class.
   * @param {CanvasRenderingContext2D} context The canvas context to draw to
   *   world coordinates to relative cannon coordinates.
   */
  constructor(context) {
    this.context = context

    this.width = context.canvas.width
    this.height = context.canvas.height
  }

  /**
   * Factory method for creating a Drawing object.
   * @param {Element} canvas The canvas element to draw to
   * @return {Drawing}
   */
  static create(canvas) {
    const context = canvas.getContext('2d')
    return new Drawing(context)
  }

  /**
   * Clears the canvas.
   */
  clear() {
    this.context.clearRect(0, 0, this.width, this.height)
  }


  /**
   * Draws a player to the canvas as a circle.
   * @param {boolean} isSelf If this is true, then a blue circle will be draw
   *   to denote the player. Otherwise a red circle will be drawn to
   *   denote another player.
   * @param {Player} player The player object to draw.
   */
  drawPlayer(isSelf, player) {
    this.context.save();
    this.context.beginPath();
    this.context.fillStyle = (player.team.index==Constants.TEAM_ONE_INDEX) ?
          Constants.TEAM_ONE_COLOUR : Constants.TEAM_TWO_COLOUR

    if (isSelf){
      this.context.arc(player.position.x, player.position.y, Constants.PLAYER_RAD, 0, Math.PI * 2);
      this.context.strokeStyle = "yellow";
      this.context.lineWidth = 4;
      this.context.stroke();
    }
    this.context.arc(player.position.x, player.position.y, Constants.PLAYER_RAD, 0, Math.PI * 2);
    this.context.fill();
    this.context.restore();
  }

  /**
   * Draws the disc to the canvas as a circle..
   * @param {Disc} disc The disc object to draw.
   */
  drawDisc(disc) {
    this.context.save();
    // draw disc
    this.context.beginPath();
    if (disc.onGround) this.context.fillStyle = Constants.DISC_GROUND_ONE_COLOUR;
    else this.context.fillStyle = Constants.DISC_NOTGROUND_COLOUR;
    this.context.arc(disc.position.x, disc.position.y, Constants.DISC_RAD, 0, Math.PI * 2);
    this.context.fill();
    //draw landing spot
    if (disc.throwDest){
      this.context.beginPath();
      this.context.arc(disc.throwDest.x, disc.throwDest.y, 0.5*Constants.DISC_RAD, 0, Math.PI * 2);
      this.context.strokeStyle = Constants.DISC_DEST_COLOUR;
      this.context.lineWidth = 3;
      this.context.setLineDash([1, 1]);
      this.context.stroke();
    }
    this.context.restore();
  }

  /**
   * Draws the surrounds to the canvas.
   */
  drawField() {
    this.context.save();
    // draw surrounds
    this.context.fillStyle = "#D3D3D3"; // light grey
    this.context.fillRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
    // draw field
    this.context.fillStyle = "green"; // green
    this.context.fillRect(Constants.CANVAS_WIDTH/2-Constants.FIELD_WIDTH/2, Constants.FIELD_HEIGHT_OFFSET, Constants.FIELD_WIDTH, Constants.FIELD_HEIGHT);
    // top endzone
    this.context.beginPath();
    this.context.moveTo(Constants.CANVAS_WIDTH/2-Constants.FIELD_WIDTH/2, Constants.FIELD_HEIGHT_OFFSET+Constants.ENDZONE_HEIGHT);
    this.context.lineTo(Constants.CANVAS_WIDTH/2-Constants.FIELD_WIDTH/2+Constants.FIELD_WIDTH, Constants.FIELD_HEIGHT_OFFSET+Constants.ENDZONE_HEIGHT);
    this.context.strokeStyle = "#FFFFFF";
    this.context.lineWidth = 5;
    this.context.stroke();
    this.context.closePath();
    // bottom endzone
    this.context.beginPath();
    this.context.moveTo(Constants.CANVAS_WIDTH/2-Constants.FIELD_WIDTH/2, Constants.FIELD_HEIGHT_OFFSET+Constants.FIELD_HEIGHT-Constants.ENDZONE_HEIGHT);
    this.context.lineTo(Constants.CANVAS_WIDTH/2-Constants.FIELD_WIDTH/2+Constants.FIELD_WIDTH, Constants.FIELD_HEIGHT_OFFSET+Constants.FIELD_HEIGHT-Constants.ENDZONE_HEIGHT);
    this.context.strokeStyle = "#FFFFFF";
    this.context.lineWidth = 5;
    this.context.stroke();
    this.context.closePath();
    // restore
    this.context.restore();
  };

}

module.exports = Drawing
