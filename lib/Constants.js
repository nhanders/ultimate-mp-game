/**
 * This class stores global constants between the client and server.
 * @author nick@thalana.co.za (Nick Anderson)
 */

module.exports = {
  FIELD_MIN_X: 100,
  FIELD_MAX_X: 500,
  FIELD_MIN_Y: 10,
  FIELD_MAX_Y: 580,

  CANVAS_WIDTH: 600,
  CANVAS_HEIGHT: 600,
  FIELD_WIDTH: 400,
  FIELD_HEIGHT: 580,
  FIELD_HEIGHT_OFFSET: 10,
  ENDZONE_HEIGHT: 100,
  LINE_THICKNESS: 5,
  PLAYER_RAD: 7,
  PLAYER_SPEED: 2,

  DISC_RAD: 7,

  SOCKET_UPDATE: 'update',
  SOCKET_NEW_PLAYER: 'new-player',
  SOCKET_PLAYER_ACTION: 'player-action',
  SOCKET_DISCONNECT: 'disconnect',

  PLAYER_DEFAULT_SPEED: 0.1,
  PLAYER_DEFAULT_HITBOX_SIZE: 20,

  PLAYER_START: [250,10+100]
}
