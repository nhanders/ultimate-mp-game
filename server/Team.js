/**
 * This class stores the state of a bullet on the server.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const Constants = require('../lib/Constants')
const Entity = require('../lib/Entity')
const Vector = require('../lib/Vector')

/**
 * Team class.
 */
class Team {
  /**
   * Constructor for Team object.
   * @constructor
   */
  constructor(teamName, teamIndex, scoringEndzone) {
    this.name = teamName;
    this.index = teamIndex;
    this.score = 0;
    this.scoringEndzone = scoringEndzone;
  }

  /**
   * Creates a new team object.
   * @param {string} teamName The display name of the team
   * @param {int} teamIndex The index of the team
   * @param {string} scoringEndzone The starting scoring endzone
   */
  static create(teamName, teamIndex, scoringEndzone) {
    const team = new Team(teamName, teamIndex, scoringEndzone)
    return team
  }

  /**
   * changes the scoring enzone of the player based on team and previous endzone.
   * @param {Array} startPosition the x and y coordinates of the starting position
   */
    toggleScoringEndzone() {
      this.scoringEndzone = (this.scoringEndzone == Constants.SCORING_ENDZONE_BOT) ?
          Constants.SCORING_ENDZONE_TOP : Constants.SCORING_ENDZONE_BOT;
    }

}

module.exports = Team
