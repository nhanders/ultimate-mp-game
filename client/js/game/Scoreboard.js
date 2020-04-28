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
   * Updates the Scoreboard with the list of current players.
   * @param {Array<Player>} players The list of current players
   */
  update(players) {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild)
    }
    // players.sort((a, b) => { return b.kills - a.kills })
    // players.slice(0, 10).forEach(player => {
    //   const containercontainer = document.createElement('li')
    //   const text =
    //     `${player.name} - Kills: ${player.kills} Deaths: ${player.deaths}`
    //   containercontainer.appendChild(document.createTextNode(text))
    //   this.container.appendChild(containercontainer)
    // })
  }
}

module.exports = Scoreboard
