/**
 * Game class on the server to manage the state of existing players and
 * and entities.
 * @author Nick Anderson
 */

const Player = require('./Player')
const Timer = require('./Timer')
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
    this.disc = Disc.createNewDisc([Constants.CANVAS_WIDTH/2,Constants.CANVAS_HEIGHT/2])
    this.timer = Timer.create();
    this.teams = null;

    this.lastUpdateTime = 0
    this.deltaTime = 0
    this.numberOfPlayers = 0
    this.toggle = true

    this.discState = [null, null]
    this.discOldState = [null, null]
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
    if (this.teams[1].size >= this.teams[0].size) {
      this.players.set(socket.id, Player.create(name, socket.id, this.teams[0]))
      this.teams[0].size += 1;
      this.toggle = !this.toggle;
    }
    else {
      this.players.set(socket.id, Player.create(name, socket.id, this.teams[1]))
      this.teams[1].size += 1;
      this.toggle = !this.toggle;
    }

    // this.numberOfPlayers = this.players.size;

    const newplayer = this.players.get(socket.id);
    if (newplayer.team.index == Constants.TEAM_ONE_INDEX) {
      newplayer.setStartPosition([Constants.PLAYER_TEAM_ONE_START[0]+(newplayer.team.size-1)*20, Constants.PLAYER_TEAM_ONE_START[1]]);
    }
    else{
      newplayer.setStartPosition([Constants.PLAYER_TEAM_TWO_START[0]+(newplayer.team.size-1)*20, Constants.PLAYER_TEAM_TWO_START[1]]);
    }
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
      player.team.size -= 1;
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
     this.timer.update()
     if (this.players.size == 0) this.timer.reset()
     if (this.timer.isDone) this.timer.reset()

    const entities = [
      ...this.players.values(),
      this.disc
    ]
    entities.forEach(
      entity => { entity.update(this.lastUpdateTime, this.deltaTime) })

    this.discState = [this.disc.onGround, this.disc.isHeld] // set new disc state
    // Disc on ground
    if (this.disc.onGround){
      this.toggleTeamsPossession();
    }

    this.players.forEach(player => {
      player.hasDisc = false; // could get rid of this

      if (player != this.disc.playerHoldingDisc) { // disc space
        player.boundPlayerDiscSpace(this.disc.playerHoldingDisc);
      }

      // stall out
      if (player.isStalledOut){
        // console.log("STALLED OUT!")
        player.hasDisc = false;
        this.disc.onGround = true;
        this.disc.isHeld = false;
        this.disc.playerHoldingDisc = null;
        this.toggleTeamsPossession();
      }
      // COLLISIONS
      if (player.collided(this.disc)) {
        // Player-Disc collision interaction
        if (this.disc.firstTouch){ // start of game. First person to get disc
          this.disc.firstTouch = false;
          player.team.hasPossession = true;
          // ugly, but nedded for plotting
          this.disc.teamPossessionTracker[0] = this.teams[0].hasPossession
          this.disc.teamPossessionTracker[1] = this.teams[1].hasPossession
        }
        else if (player.team.hasPossession && this.disc.onGround && player.inField) { // pick up from ground
          player.hasDisc = true;
          this.disc.playerHoldingDisc = player;
          this.disc.isHeld = true;
          player.stopMovement();
          this.disc.stopDisc();
        }
        else if (this.disc.playerHoldingDisc==player) { // player holding disc
          player.hasDisc = true;
          this.disc.isHeld = true;
          this.disc.playerHoldingDisc = player;
          player.stopMovement();
          this.disc.stopDisc();
        }
        else if (player.team.hasPossession && !this.disc.onGround && !this.disc.isHeld && player.inField) { // catch from own player
          player.hasDisc = true;
          this.disc.isHeld = true;
          this.disc.playerHoldingDisc = player;
          player.stopMovement();
          this.disc.stopDisc();
        }
        else if (!player.team.hasPossession && !this.disc.onGround && !this.disc.isHeld && player.inField) { // interception
          player.hasDisc = true;
          this.disc.isHeld = true;
          this.disc.playerHoldingDisc = player;
          player.stopMovement();
          this.disc.stopDisc();
          this.toggleTeamsPossession();
        }
        else if (player.team.hasPossession && !this.disc.onGround && !this.disc.isHeld && !player.inField) { // catch out of field
          player.hasDisc = false;
          this.disc.isHeld = false;
          this.disc.playerHoldingDisc = null;
          this.disc.onGround = true;
          this.disc.stopDisc();
          this.toggleTeamsPossession();
        }
        else if (!player.team.hasPossession && !this.disc.onGround && !this.disc.isHeld && !player.inField) { // interception out of field
          player.hasDisc = false;
          this.disc.isHeld = false;
          this.disc.playerHoldingDisc = null;
          this.disc.onGround = true;
          this.disc.stopDisc();
          this.toggleTeamsPossession();
        }

        // Player scored event
        if (player.hasScored) {
          player.team.score += 1; // increment score
          this.teams[0].toggleScoringEndzone();
          this.teams[1].toggleScoringEndzone();
        }
      }
    });

    this.discOldState = this.discState;
  }

  /**
   * Toggle teams possession once.
   */
  toggleTeamsPossession() {
    this.discState = [this.disc.onGround, this.disc.isHeld] // set new disc state

    if (this.discOldState[0] !== null){ // if there has been an old state (i.e. not first iteration)
      if (this.discState[0]!=this.discOldState[0] || this.discState[1]!=this.discOldState[1]){
        this.teams[0].togglePossession()
        this.teams[1].togglePossession()
        // ugly, but nedded for plotting
        this.disc.teamPossessionTracker[0] = this.teams[0].hasPossession
        this.disc.teamPossessionTracker[1] = this.teams[1].hasPossession
        // console.log(this.disc.teamPossessionTracker)
      }
    }
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
        disc: this.disc,
        timer: this.timer
      })
    })
  }
}

module.exports = Game
