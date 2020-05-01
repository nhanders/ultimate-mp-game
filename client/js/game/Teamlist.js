/**
 * This class handles the rendering and updating of the Teamlist.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

/**
 * Teamlist class.
 */
class Teamlist {
  /**
   * Constructor for the teamlist class.
   * @param {container} container The container element for the teamlist
   */
  constructor(container) {
    this.container = container
    
  }

  /**
   * Factory method for creating a Scoreaboard object.
   * @param {string} containerElementID The ID of the container element
   * @return {Teamlist}
   */
  static create(containerElementID) {
    return new Teamlist(document.getElementById(containerElementID))
  }

  /**
   * Updates the Teamlist with the score.
   * @param {Player} currentplayer The current player
   * @param {Array<Player>} players The list of current players
   */
  update(currentPlayer, players) {

    const team1_name = document.getElementById('team1-name')
    const team2_name = document.getElementById('team2-name')

    const team1_list = document.getElementById('team1-list')
    const team2_list = document.getElementById('team2-list')

    // remove team lists
    while (team1_list.firstChild) { // remove team list
      team1_list.removeChild(team1_list.firstChild)
    }
    while (team2_list.firstChild) { // remove team list
      team2_list.removeChild(team2_list.firstChild)
    }

    // update team list
    var node = document.createElement("LI");
    node.id = currentPlayer.socketID;
    // console.log(currentPlayer)
    var textnode = document.createTextNode(currentPlayer.name);
    node.appendChild(textnode);

    // console.log(currentPlayer.team.name)

    if (currentPlayer.team.index === 1) {
      team1_list.appendChild(node)
      team1_name.textContent = currentPlayer.team.name
    }
    else {
      team2_list.appendChild(node)
      team2_name.textContent = currentPlayer.team.name
    }

    players.forEach(player => {
      var node = document.createElement("LI");
      node.id = player.socketID;
      var textnode = document.createTextNode(player.name);
      node.appendChild(textnode);

      if (player.team.index === 1) {
        team1_list.appendChild(node)
        team1_name.textContent = player.team.name
      }
      else {
        team2_list.appendChild(node)
        team2_name.textContent = player.team.name
      }
    });
  }
}

module.exports = Teamlist
