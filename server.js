/**
 * This is the server app script that is run on the server.
 * @author Nick Anderson
 */

 const PORT = process.env.PORT || 5000
 const FRAME_RATE = 1000 / 60
 // const CHAT_TAG = '[Tank Anarchy]'

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
game.addTeams("Tigers", "Wolves")

var isGameOver = false;

/**
 * Server side input handler, modifies the state of the players and the
 * game based on the input it receives. Everything runs asynchronously with
 * the game loop.
 */
io.on('connection', socket => {

  socket.on(Constants.SOCKET_NEW_PLAYER, (data, callback) => {
    game.addNewPlayer(data.name, socket)
    callback()
  })

  socket.on(Constants.SOCKET_PLAYER_ACTION, data => {
    game.updatePlayerOnInput(socket.id, data)
  })

  socket.on(Constants.SOCKET_DISCONNECT, () => {
    const name = game.removePlayer(socket.id)
  })

  socket.on('gameover', () => {
    isGameOver = true;
    console.log("GAME OVER")
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
