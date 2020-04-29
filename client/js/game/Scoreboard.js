/**
 * This class handles the rendering and updating of the Scoreboard.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

/**
 * Scoreboard class.
 */
class Scoreboard {
  /**
   * Constructor for the Leaderboard class.
   * @param {container} container The container element for the leaderboard
   */
  constructor(container) {
    this.container = container
  }

  /**
   * Factory method for creating a Scoreaboard object.
   * @param {string} containerElementID The ID of the container element
   * @return {Scoreboard}
   */
  static create(containerElementID) {
    return new Scoreboard(document.getElementById(containerElementID))
  }

  /**
   * Updates the Scoreboard with the score.
   * @param {Player} currentplayer The current player
   * @param {Array<Player>} players The list of current players
   */
  update(currentPlayer, players) {
    if (currentPlayer.hasScored) {
      const p_score = document.getElementById('t'+currentPlayer.team.index+'_score')
      p_score.innerText = currentPlayer.team.score;
    }
    else {
      players.forEach(player => {
        if (player.hasScored) {
          const p_score = document.getElementById('t'+player.team.index+'_score')
          p_score.innerText = player.team.score;
        }
      });
    }
  }
}

module.exports = Scoreboard
