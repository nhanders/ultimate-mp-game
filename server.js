/**
 * This is the server app script that is run on the server.
 * @author Nick Anderson
 */

 const PORT = process.env.PORT || 5000
 const FRAME_RATE = 1000 / 60
 const CHAT_TAG = '[Game]'

// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
const morgan = require('morgan');
var socketIO = require('socket.io');

// Scripts
const Constants = require('./lib/Constants')
const Game = require('./server/Game');

// Initialization.
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var game = new Game();

app.set('port', PORT);

app.use(morgan('dev'));
app.use('/client', express.static(path.join(__dirname, '/client')))
app.use('/dist', express.static(path.join(__dirname, '/dist')))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views/index.html'))); // might be able to remove path here.

// add team names (NEEDS WORK!)
game.addTeams("Frisbaes", "Hammer Time")

var isGameOver = false;

/**
 * Server side input handler, modifies the state of the players and the
 * game based on the input it receives. Everything runs asynchronously with
 * the game loop.
 */
io.on('connection', socket => {

  socket.on(Constants.SOCKET_NEW_PLAYER, (data, callback) => {
    game.addNewPlayer(data.name, data.speed, data.throw_accuracy, data.endurance, socket)
    io.sockets.emit(Constants.SOCKET_CHAT_SERVER_CLIENT, {
      name: CHAT_TAG,
      message: `${data.name} has joined the game.`,
      isNotification: true
    })
    socket.emit(Constants.SOCKET_CHAT_SERVER_CLIENT, {
      name: CHAT_TAG,
      message: `Instructions: \nUse WASD keys to move. \nTo throw, click and the disc will go where you click. Also, use A (right-to-left) and D (left-to-right) to curve the disc.`,
      isNotification: true
    })
    callback()
  })

  socket.on(Constants.SOCKET_PLAYER_ACTION, data => {
    game.updatePlayerOnInput(socket.id, data)
  })

  socket.on(Constants.SOCKET_CHAT_CLIENT_SERVER, data => {
    io.sockets.emit(Constants.SOCKET_CHAT_SERVER_CLIENT, {
      name: game.getPlayerNameBySocketId(socket.id),
      message: data
    })
  })

  socket.on(Constants.SOCKET_DISCONNECT, () => {
    const name = game.removePlayer(socket.id)
    if (game.players.size == 0) {
      game = new Game();
      game.addTeams("Frisbaes", "Hammer Time")
    }
    io.sockets.emit(Constants.SOCKET_CHAT_SERVER_CLIENT, {
      name: CHAT_TAG,
      message: ` ${name} has left the game.`,
      isNotification: true
    })
  })

  socket.on('gameover', () => {
    // isGameOver = true;
    console.log("GAME OVER")
    // game.reset(); // everyone back to lines. scores zero.
  })
})

/**
 * Server side game loop, runs at 60Hz and sends out update packets to all
 * clients every update.
 */
setInterval(() => {
  if (!isGameOver) {
    game.update()
    game.sendState()
  }
}, FRAME_RATE)

// Starts the server.
server.listen(PORT, () => {
  console.log(`Starting server on port ${PORT}`)
})
