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
    this.context.closePath();

    if (this.holdStallOut) { // hold stallout text
      this.context.beginPath();
      this.context.fillStyle = "rgba(255,255,255,"+this.opacity+")"
      // this.context.fillStyle = "white"
      this.context.font = "10px Verdana";
      this.context.fillText("STALLED OUT", this.stallOutX, this.stallOutY);
      this.context.closePath();
      this.opacity -= 0.02;

      if (Date.now() > this.endTime) {
        this.holdStallOut = false;
        // console.log("END")
      }
    }

    // draw still count
    if (player.timeWithDisc){
      this.context.beginPath();
      this.opacity = 1.0-(player.timeWithDisc/1000 - Math.floor(player.timeWithDisc/1000))
      this.context.fillStyle = "rgba(255,255,255,"+this.opacity+")"
      this.context.font = "10px Verdana";

      if (!player.stalledOut){
        this.context.fillText(`${Math.ceil(player.timeWithDisc/1000)}`, player.position.x+10, player.position.y-10);
      }
      else{
        // console.log("GOT HERE!")
        this.context.fillText("STALLED OUT", player.position.x+10, player.position.y-10);
        this.stallOutX = player.position.x+10
        this.stallOutY = player.position.y-10
        this.holdStallOut = true;
        this.endTime = Date.now() + 1000; // hold for one seconds
        // console.log("START")
        this.opacity = 1.0;
      }
      this.context.closePath();
    }
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
    this.context.fillStyle = Constants.DISC_NOTGROUND_COLOUR;
    this.context.arc(disc.position.x, disc.position.y, Constants.DISC_RAD, 0, Math.PI * 2);
    this.context.fill();
    this.context.closePath();

    if (disc.onGround) { // draw shadow over disc
      this.context.beginPath();
      if (disc.teamPossessionTracker[0]){ // team 1 has possession
        this.context.fillStyle = "blue";
      }
      else if (disc.teamPossessionTracker[1]){ // team 2 has possession
        this.context.fillStyle = "red";
      }
      else {
         // no team  has possession
      }
      this.context.arc(disc.position.x, disc.position.y, 2, 0, Math.PI * 2);
      this.context.fill();
      this.context.closePath();
    }


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
  }

  /**
   * Draws a rectangle over the scoring endzone for the player
   * @param {boolean} isSelf If this is true, then a blue circle will be draw
   *   to denote the player. Otherwise a red circle will be drawn to
   *   denote another player.
   * @param {Player} player The player object to draw.
   */
  drawScoringEndzone(currentPlayer) {
    this.context.save();
    // console.log("MADE IT HERE!!")

    this.context.fillStyle = (currentPlayer.team.index == Constants.TEAM_ONE_INDEX) ?
        Constants.ENDZONE_TEAM_ONE_COLOUR : Constants.ENDZONE_TEAM_TWO_COLOUR;

    if (currentPlayer.team.scoringEndzone == Constants.SCORING_ENDZONE_TOP){
      this.context.fillRect((Constants.CANVAS_WIDTH-Constants.FIELD_WIDTH)/2, Constants.FIELD_HEIGHT_OFFSET,
                             Constants.FIELD_WIDTH, Constants.ENDZONE_HEIGHT);

     this.context.fillStyle = "rgba(255,255,255,0.05)"
     this.context.font = "80px Impact";
     this.context.textAlign = "center";
     this.context.fillText("SCORE HERE", Constants.CANVAS_WIDTH/2, Constants.FIELD_HEIGHT_OFFSET + Constants.ENDZONE_HEIGHT/2 + 30);
    }
    else {
      this.context.fillRect((Constants.CANVAS_WIDTH-Constants.FIELD_WIDTH)/2, Constants.FIELD_HEIGHT_OFFSET+Constants.FIELD_HEIGHT-Constants.ENDZONE_HEIGHT,
                             Constants.FIELD_WIDTH, Constants.ENDZONE_HEIGHT);

     this.context.fillStyle = "rgba(255,255,255,0.05)"
     this.context.font = "80px Impact";
     this.context.textAlign = "center";
     this.context.fillText("SCORE HERE", Constants.CANVAS_WIDTH/2, Constants.CANVAS_HEIGHT - Constants.FIELD_HEIGHT_OFFSET-20);


    }
    this.context.restore();
  }

}

// for drawing stripes
// for (var i = 0; i<4; i++) {
//   this.context.beginPath();
//   this.context.moveTo(((Constants.CANVAS_WIDTH-Constants.FIELD_WIDTH)/2)+2+i*99, Constants.FIELD_HEIGHT_OFFSET+2)
//   this.context.lineTo(Constants.CANVAS_WIDTH/2-Constants.FIELD_WIDTH/2+(i+1)*99, Constants.FIELD_HEIGHT_OFFSET + Constants.ENDZONE_HEIGHT-5);
//   this.context.strokeStyle = "rgba(255, 0, 0, 0.5)";
//   this.context.lineWidth = 3;
//   this.context.stroke();
//   this.context.closePath();
// }

module.exports = Drawing
