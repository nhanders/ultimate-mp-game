/**
 * Game class on the server to manage the state of existing players and
 * and entities.
 * @author Nick Anderson
 */

const Player = require('./Player')
const Disc = require('./Disc')
const Team = require('./Team')

const Constants = require('../lib/Constants')

/**
 * Game class.
 */
class Game {
  /**
   * Constructor for a Game object.
   */
  constructor() {
    /**
     * This is a Map containing all the connected socket ids and socket
     * instances.
     */
    this.clients = new Map()
    /**
     * This is a Map containing all the connected socket ids and the players
     * associated with them. This should always be parallel with sockets.
     */
    this.players = new Map()
    this.disc = Disc.createNewDisc([200,200])
    this.teams = null;

    this.lastUpdateTime = 0
    this.deltaTime = 0
    this.numberOfPlayers = 0
    this.toggle = true
  }

  /**
   * Creates a new Game object.
   * @return {Game}
   */
  static create() {
    const game = new Game()
    game.init()
    return game
  }

  /**
   * Initializes the game state.
   */
  init() {
    this.lastUpdateTime = Date.now()
  }

  /**
   * Creates a new player with the given name and ID.
   * @param {string} name The display name of the player.
   * @param {Object} socket The socket object of the player.
   */
  addNewPlayer(name, socket) {
    this.clients.set(socket.id, socket)
    if (this.toggle) {
      this.players.set(socket.id, Player.create(name, socket.id, this.teams[0]))
      this.toggle = !this.toggle;
    }
    else {
      this.players.set(socket.id, Player.create(name, socket.id, this.teams[1]))
      this.toggle = !this.toggle;
    }

    this.numberOfPlayers = this.players.size;

    const newplayer = this.players.get(socket.id);
    newplayer.setStartPosition([Constants.PLAYER_START[0]+this.numberOfPlayers*20, Constants.PLAYER_START[1]]);
  }

  /**
   * Creates a new player with the given name and ID.
   * @param {string} team1Name The display name of the player.
   * @param {string} team2Name The display name of the player.
   */
  addTeams(team1Name, team2Name) {
    this.teams = [Team.create(team1Name, Constants.TEAM_ONE_INDEX, Constants.SCORING_ENDZONE_TOP),
                  Team.create(team2Name, Constants.TEAM_TWO_INDEX, Constants.SCORING_ENDZONE_BOT)];
  }

  /**
   * Removes the player with the given socket ID and returns the name of the
   * player removed.
   * @param {string} socketID The socket ID of the player to remove.
   * @return {string}
   */
  removePlayer(socketID) {
    if (this.clients.has(socketID)) {
      this.clients.delete(socketID)
    }
    if (this.players.has(socketID)) {
      const player = this.players.get(socketID)
      this.players.delete(socketID)
      return player.name
    }
  }

  /**
   * Returns the name of the player with the given socket id.
   * @param {string} socketID The socket id to look up.
   * @return {string}
   */
  getPlayerNameBySocketId(socketID) {
    if (this.players.has(socketID)) {
      return this.players.get(socketID).name
    }
  }

  /**
   * Updates the player with the given socket ID according to the input state
   * object sent by the player's client.
   * @param {string} socketID The socket ID of the player to update
   * @param {Object} data The player's input state
   */
  updatePlayerOnInput(socketID, data) {
    const player = this.players.get(socketID)
    if (player) {
      if (!player.hasDisc) { // player can move
        player.updateOnInput(data);
      }
      else if (player.hasDisc) { // player can't move but can throw
        this.disc.updateOnInput(data);
      }
    }
  }

  // addNewDisc() {
  //   this.disc = Disc.createNewDisc([200,200])
  // }

  /**
   * Updates the state of all the objects in the game.
   */
  update() {
    const currentTime = Date.now()
    this.deltaTime = currentTime - this.lastUpdateTime
    this.lastUpdateTime = currentTime

    /**
     * Perform a physics update and collision update for all entities
     * that need it.
     */
    const entities = [
      ...this.players.values(),
      this.disc
    ]
    entities.forEach(
      entity => { entity.update(this.lastUpdateTime, this.deltaTime) })
    for (let i = 0; i < entities.length; ++i) {
      for (let j = i + 1; j < entities.length; ++j) {
        let e2 = entities[j]
        let e1 = entities[i]
        if (entities[i] instanceof Player) e1.hasDisc = false; // reset all players
        if (!e1.collided(e2)) continue;

        // Player-Disc collision interaction
        if (e1 instanceof Disc && e2 instanceof Player) {
          e1 = entities[j]
          e2 = entities[i]
        }
        if (e1 instanceof Player && e2 instanceof Disc) {
          e1.hasDisc = true;
          e1.stopMovement();
          e2.stopDisc();
        }

        // Player scored event
        if (entities[i] instanceof Player && entities[i].hasScored) {
          entities[i].team.score += 1; // increment score
          this.teams.forEach(team => { // toggle endzones
            team.toggleScoringEndzone();
          });
        }
      }
    }

    // /**
    //  * Filters out destroyed projectiles and powerups.
    //  */
    // this.projectiles = this.projectiles.filter(
    //   projectile => !projectile.destroyed)
    // this.powerups = this.powerups.filter(
    //   powerup => !powerup.destroyed)
    //
    // /**
    //  * Repopulate the world with new powerups.
    //  */
    // while (this.powerups.length < Constants.POWERUP_MAX_COUNT) {
    //   this.powerups.push(Powerup.create())
    // }
  }

  /**
   * Sends the state of the game to all connected players.
   */
  sendState() {
    const players = [...this.players.values()]
    this.clients.forEach((client, socketID) => {
      // console.log(players.filter((player) => player.socketID != socketID))
      const currentPlayer = this.players.get(socketID)
      this.clients.get(socketID).emit(Constants.SOCKET_UPDATE, {
        self: currentPlayer,
        players: players.filter((player) => player.socketID != socketID),
        disc: this.disc
      })
    })
  }
}

module.exports = Game
