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
    this.keepHighlightedTime = 1*1000; // 1 second
    this.highlightedPlayerID = null
  }

  /**
   * Factory method for creating a Scoreaboard object.
   * @param {string} containerElementID The ID of the container element
   * @return {Scoreboard}
   */
  static create(containerElementID) {

    const p1_score = document.getElementById('t1_score')
    const p2_score = document.getElementById('t2_score')
    p1_score.innerText = 0;
    p2_score.innerText = 0;
    this.endTime = 1000000*Date.now()

    return new Scoreboard(document.getElementById(containerElementID))
  }

  /**
   * Updates the Scoreboard with the score.
   * @param {Player} currentplayer The current player
   * @param {Array<Player>} players The list of current players
   */
  update(currentPlayer, players) {
    const t1_name = document.getElementById("t1_name")
    const t2_name = document.getElementById("t2_name")

    if (Date.now() >= this.endTime){
      document.getElementById(currentPlayer.socketID).classList.remove("highlight")
      players.forEach(player => {document.getElementById(player.socketID).classList.remove("highlight")})
    }

    if (currentPlayer.team.index === 1) t1_name.textContent = currentPlayer.team.name
    else t2_name.textContent = currentPlayer.team.name

    if (currentPlayer.hasScored) {
      const p_score = document.getElementById('t'+currentPlayer.team.index+'_score')
      p_score.innerText = currentPlayer.team.score;
      const p_name = document.getElementById(currentPlayer.socketID)
      p_name.classList.add("highlight")
      this.endTime = Date.now() + this.keepHighlightedTime
      // this.highlightedPlayerID = currentPlayer.socketID;
    }
    else {
      players.forEach(player => {
        if (player.hasScored) {
          const p_score = document.getElementById('t'+player.team.index+'_score')
          p_score.innerText = player.team.score;
          const p_name = document.getElementById(player.socketID)
          p_name.classList.add("highlight")
          this.endTime = Date.now() + this.keepHighlightedTime
          // this.highlightedPlayerID = player.socketID;
        }
        if (player.team.index === 1) t1_name.textContent = player.team.name
        else t2_name.textContent = player.team.name
      });
    }
  }
}

module.exports = Scoreboard
