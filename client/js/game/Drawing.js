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

  // /**
  //  * Convert an angle from the real math system to funky canvas coordinates.
  //  * @param {number} angle The angle to translate
  //  * @return {number}
  //  */
  // static translateAngle(angle) {
  //   return Util.normalizeAngle(angle + Math.PI / 2)
  // }

  // /**
  //  * Draws an image on the canvas at the centered at the origin.
  //  * @param {Image} image The image to draw on the canvas
  //  */
  // drawCenteredImage(image) {
  //   this.context.drawImage(image, -image.width / 2, -image.height / 2)
  // }

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
    this.context.fillStyle = 'blue';
    if (isSelf){
      this.context.arc(player.position.x, player.position.y, Constants.PLAYER_RAD, 0, Math.PI * 2);
      this.context.strokeStyle = "yellow";
      this.context.lineWidth = 4;
      this.context.stroke();
    }
    // if (isSelf) this.context.fillStyle = 'blue';
    // else this.context.fillStyle = 'red';
    this.context.arc(player.position.x, player.position.y, Constants.PLAYER_RAD, 0, Math.PI * 2);
    this.context.fill();
    this.context.restore();

    // const canvasCoords = this.viewport.toCanvas(player.position)
    // this.context.translate(canvasCoords.x, canvasCoords.y)

    // this.context.textAlign = 'center'
    // this.context.font = Constants.DRAWING_NAME_FONT
    // this.context.fillStyle = Constants.DRAWING_NAME_COLOR
    // this.context.fillText(player.name, 0, -50)

    // for (let i = 0; i < 10; ++i) {
    //   if (i < player.health) {
    //     this.context.fillStyle = Constants.DRAWING_HP_COLOR
    //   } else {
    //     this.context.fillStyle = Constants.DRAWING_HP_MISSING_COLOR
    //   }
    //   this.context.fillRect(-25 + 5 * i, -40, 5, 4)
    // }

    // this.context.rotate(Drawing.translateAngle(player.tankAngle))
    // this.drawCenteredImage(this.images[
    //   // eslint-disable-next-line multiline-ternary
    //   isSelf ? Constants.DRAWING_IMG_SELF_TANK :
    //     Constants.DRAWING_IMG_OTHER_TANK
    // ])
    // this.context.rotate(-Drawing.translateAngle(player.tankAngle))
    //
    // this.context.rotate(Drawing.translateAngle(player.turretAngle))
    // this.drawCenteredImage(this.images[
    //   // eslint-disable-next-line multiline-ternary
    //   isSelf ? Constants.DRAWING_IMG_SELF_TURRET :
    //     Constants.DRAWING_IMG_OTHER_TURRET
    // ])
    //
    // if (player.powerups[Constants.POWERUP_SHIELD]) {
    //   this.context.rotate(-Drawing.translateAngle(-player.turretAngle))
    //   this.drawCenteredImage(this.images[Constants.DRAWING_IMG_SHIELD])
    // }

    // this.context.restore()
  }

  /**
   * Draws the disc to the canvas as a circle..
   * @param {Disc} disc The disc object to draw.
   */
  drawDisc(disc) {
    this.context.save();
    this.context.beginPath();
    this.context.fillStyle = 'orange';
    this.context.arc(disc.position.x, disc.position.y, Constants.DISC_RAD, 0, Math.PI * 2);
    this.context.fill();
    this.context.restore();
  }

  // /**
  //  * Draws a bullet (tank shell) to the canvas.
  //  * @param {Bullet} bullet The bullet to draw to the canvas
  //  */
  // drawBullet(bullet) {
  //   this.context.save()
  //   const canvasCoords = this.viewport.toCanvas(bullet.position)
  //   this.context.translate(canvasCoords.x, canvasCoords.y)
  //   this.context.rotate(Drawing.translateAngle(bullet.angle))
  //   this.drawCenteredImage(this.images[Constants.DRAWING_IMG_BULLET])
  //   this.context.restore()
  // }

  // /**
  //  * Draws a powerup to the canvas.
  //  * @param {Powerup} powerup The powerup to draw
  //  */
  // drawPowerup(powerup) {
  //   this.context.save()
  //   const canvasCoords = this.viewport.toCanvas(powerup.position)
  //   this.context.translate(canvasCoords.x, canvasCoords.y)
  //   this.drawCenteredImage(this.images[powerup.type])
  //   this.context.restore()
  // }

  /**
   * Draws the background tiles to the canvas.
   */
  // drawTiles() {
  //   const start = this.viewport.toCanvas(
  //     { x: Constants.WORLD_MIN, y: Constants.WORLD_MIN })
  //   const end = this.viewport.toCanvas(
  //     { x: Constants.WORLD_MAX, y: Constants.WORLD_MAX })
  //   for (let x = start.x; x < end.x; x += Constants.DRAWING_TILE_SIZE) {
  //     for (let y = start.y; y < end.y; y += Constants.DRAWING_TILE_SIZE) {
  //       this.context.drawImage(this.images[Constants.DRAWING_IMG_TILE], x, y)
  //     }
  //   }
  // }

  // Drawing.prototype.drawDisc = function(x, y) {
  //   this.context.save();
  //   this.context.beginPath();
  //   this.context.fillStyle = 'orange';
  //   this.context.arc(x, y, 5, 0, Math.PI * 2);
  //   this.context.fill();
  //   this.context.restore();
  // };

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
