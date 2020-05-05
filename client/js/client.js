/**
 * Client side script that initializes the game. This should be the only script
 * that depends on JQuery.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

require('../less/styles.less')

const $ = require('jquery')
const io = require('socket.io-client')

const Chat = require('./game/Chat')
const Game = require('./game/Game')

$(document).ready(() => {
  const socket = io()
  const game = Game.create(socket, 'canvas', 'leaderboard')
  Chat.create(socket, 'chat-display', 'chat-input')

  $('#name-input').focus()

  function updateSkillBudget(){
      var skillPointsUsed = Number($('#speed').val()) + Number($('#throw_accuracy').val());
      $('#skill-budget').text("Skill Budget: " + skillPointsUsed + "/8");
  }

  var idVar = setInterval(() => {
    updateSkillBudget()
  }, 100);

  function stopUpdatingSkills() {
	   clearInterval(idVar);
  }

  /**
   * Function to send the player name to the server.
   * @return {false}
   */
  const sendName = () => {
    const name = $('#name-input').val()
    var skillPointsUsed = Number($('#speed').val()) + Number($('#throw_accuracy').val());
    if (name && name.length < 20 && skillPointsUsed <= 8) {
      stopUpdatingSkills();
      $('#name-prompt-container').empty()
      $('#name-prompt-container').append(
        $('<span>').addClass('fa fa-2x fa-spinner fa-pulse'))
      socket.emit('new-player', { name }, () => {
        $('#name-prompt-overlay').remove()
        $('#canvas').focus()
        game.run()
      })
    }
    else {
      window.alert('Your name cannot be blank or over 20 characters and your skillbudget cannot be more than 8.')
    }
    return false
  }
  $('#name-form').submit(sendName)
  $('#name-submit').click(sendName)
})
