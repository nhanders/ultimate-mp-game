/**
 * Class encapsulating the client side of the game, handles drawing and
 * updates.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

 const Scoreboard = require('./Scoreboard')
 const Teamlist = require('./Teamlist')
const Drawing = require('./Drawing')
const Input = require('./Input')

const Constants = require('../../../lib/Constants')
const Vector = require('../../../lib/Vector')
const Util = require('../../../lib/Util')

/**
 * Game class.
 */
class Game {
  /**
   * Creates a Game class.
   * @param {Socket} socket The socket connected to the server
   * @param {Drawing} drawing The Drawing object for canvas rendering
   * @param {Input} input The Input object for tracking user input
   * @param {Scoreboard} input The Scoreboard object for scorebaord container
   */
  constructor(socket, drawing, input, scoreboard, teamlist) {
    this.socket = socket

    this.drawing = drawing
    this.input = input
    this.scoreboard = scoreboard
    this.teamlist = teamlist

    this.self = null
    this.players = []

    this.animationFrameId = null
    this.lastUpdateTime = 0
    this.deltaTime = 0
  }

  /**
   * Factory method for creating a Game class instance.
   * @param {Socket} socket The socket connected to the server
   * @param {string} canvasElementID The ID of the canvas element to render the
   *   game to
   * @param {string} scoreboardElementID The ID of the DOM element which will
   *   hold the Scoreboard
   * @param {string} teamlistElementID The ID of the DOM element which will
   *   hold the Teamlist
   * @return {Game}
   */
  static create(socket, canvasElementID, scoreboardElementID, teamlistElementID) {
    const canvas = document.getElementById(canvasElementID)
    canvas.width = Constants.CANVAS_WIDTH
    canvas.height = Constants.CANVAS_HEIGHT

    const drawing = Drawing.create(canvas)
    const input = Input.create(document, canvas)

    const scoreboard = Scoreboard.create(scoreboardElementID)
    const teamlist = Teamlist.create(scoreboardElementID)

    const game = new Game(socket, drawing, input, scoreboard, teamlist)
    game.init()
    return game
  }

  /**
   * Initializes the Game object and binds the socket event listener.
   */
  init() {
    this.lastUpdateTime = Date.now()
    this.socket.on(Constants.SOCKET_UPDATE,
      this.onReceiveGameState.bind(this))
  }

  /**
   * Socket event handler.
   * @param {Object} state The game state received from the server
   */
  onReceiveGameState(state) {
    this.self = state.self
    this.players = state.players
    this.disc = state.disc
    this.scoreboard.update(state.self, state.players)
    this.teamlist.update(state.self, state.players)
  }

  /**
   * Starts the animation and update loop to run the game.
   */
  run() {
    const currentTime = Date.now()
    this.deltaTime = currentTime - this.lastUpdateTime
    this.lastUpdateTime = currentTime

    this.update()
    this.draw()
    this.animationFrameId = window.requestAnimationFrame(this.run.bind(this))
  }

  /**
   * Stops the animation and update loop for the game.
   */
  stop() {
    window.cancelAnimationFrame(this.animationFrameId)
  }

  /**
   * Updates the client state of the game and sends user input to the server.
   */
  update() {
    if (this.self) {
      this.socket.emit(Constants.SOCKET_PLAYER_ACTION, {
        up: this.input.up,
        down: this.input.down,
        left: this.input.left,
        right: this.input.right,
        throw: this.input.mouseDown,
        mouseCoords: this.input.mouseCoords
      })
    }
  }

  /**
   * Draws the state of the game to the canvas.
   */
  draw() {
    if (this.self) {
      this.drawing.clear()
      this.drawing.drawField()
      this.drawing.drawDisc(this.disc)
      this.drawing.drawPlayer(true, this.self)
      this.players.forEach(player => this.drawing.drawPlayer(false, player))
    }
  }
}

module.exports = Game
