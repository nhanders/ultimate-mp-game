/**
 * This class stores global constants between the client and server.
 * @author nick@thalana.co.za (Nick Anderson)
 */

module.exports = {
  WORLD_MIN: 0,
  WORLD_MAX: 600,

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

  PLAYER_START: [250,10+100],

  TEAM_ONE_COLOUR: "blue",
  TEAM_TWO_COLOUR: "red",
  DISC_GROUND_ONE_COLOUR: "#0080FF",
  DISC_GROUND_TWO_COLOUR: "#c93030",
  DISC_NOTGROUND_COLOUR: "orange",

  DISC_DEST_COLOUR: "red",

  SCORING_ENDZONE_TOP: "top",
  SCORING_ENDZONE_BOT: "bottom",

  TEAM_ONE_INDEX: 1,
  TEAM_TWO_INDEX: 2,

}
