/**
 * This class handles the rendering and updating of the Timer.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const Constants = require('../lib/Constants')

/**
 * Timer class.
 */
class Timer {
  /**
   * Constructor for the Timer class.
   * @param {container} container The container element for the Timer
   */
  constructor() {
    // this.endTime = Date.now() + 5*1000*60 // 5 minutes
    this.endTime = Date.now() + Constants.GAME_TIME_MS // 5 minutes
    this.isDone = false;
  }

  /**
   * Factory method for creating a Scoreaboard object.
   * @param {string} containerElementID The ID of the container element
   * @return {Timer}
   */
  static create() {
    return new Timer()
  }

  /**
   * Updates the Timer with the score.
   * @param {Player} currentplayer The current player
   * @param {Array<Player>} players The list of current players
   */
  update() {

    this.timerTime_ms = this.endTime - Date.now();

    if (this.isDone) this.timerTime_ms = 0;
    // create a new Date object
    var dateObj = new Date(this.timerTime_ms);

    // Get minutes part from the timestamp
    var minutes = dateObj.getUTCMinutes();

    // Get seconds part from the timestamp
    var seconds = dateObj.getUTCSeconds();

    var formattedTime = minutes.toString().padStart(2, '0') + ':' +
                    seconds.toString().padStart(2, '0');

    this.timerTimeStr = formattedTime
    // const timer = document.getElementById('timer')
    // timer.textContent = formattedTime
  }

  /**
   * Updates the Timer with the score.
   * @param {Player} currentplayer The current player
   * @param {Array<Player>} players The list of current players
   */
  setIsDone() {
    this.isDone = (this.timerTime_ms <= 0);
  }
}

module.exports = Timer
