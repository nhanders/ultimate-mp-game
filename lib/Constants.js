/**
 * This class stores global constants between the client and server.
 * @author nick@thalana.co.za (Nick Anderson)
 */

module.exports = {
  CANVAS_WIDTH: 600,
  CANVAS_HEIGHT: 600,
  FIELD_WIDTH: 400,
  FIELD_HEIGHT: 580,
  FIELD_HEIGHT_OFFSET: 10,
  ENDZONE_HEIGHT: 100,
  LINE_THICKNESS: 5,
  PLAYER_RAD: 7,
  PLAYER_SPEED: 2,

  SOCKET_UPDATE: 'update',
  SOCKET_NEW_PLAYER: 'new-player',
  SOCKET_PLAYER_ACTION: 'player-action',
  SOCKET_DISCONNECT: 'disconnect',
}
