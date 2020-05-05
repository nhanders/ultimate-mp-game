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

const MAXSKILLPOINTS = 12;

$(document).ready(() => {
  const socket = io()
  const game = Game.create(socket, 'canvas', 'leaderboard')
  Chat.create(socket, 'chat-display', 'chat-input')

  $('#name-input').focus()

  function updateSkillBudget(){
      var skillPointsUsed = Number($('#speed').val()) + Number($('#throw_accuracy').val()) + Number($('#endurance').val());
      $('#skill-budget').text("Skill Budget: " + skillPointsUsed + "/"+MAXSKILLPOINTS);
      if (skillPointsUsed>MAXSKILLPOINTS){
        document.getElementById("skill-budget").classList.add("color-red")
      }
      else{
        document.getElementById("skill-budget").classList.remove("color-red")
      }
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
    const speed = Number($('#speed').val())
    const throw_accuracy = Number($('#throw_accuracy').val())
    const endurance = Number($('#endurance').val())
    var skillPointsUsed = speed + throw_accuracy + endurance;
    if (name && name.length < 20 && skillPointsUsed <= MAXSKILLPOINTS) {
      stopUpdatingSkills();
      $('#name-prompt-container').empty()
      $('#name-prompt-container').append(
        $('<span>').addClass('fa fa-2x fa-spinner fa-pulse'))
      socket.emit('new-player', {
        name: name,
        speed: speed,
        throw_accuracy: throw_accuracy,
        endurance: endurance
      }, () => {
        $('#name-prompt-overlay').remove()
        $('#canvas').focus()
        game.run()
      })
    }
    else {
      window.alert('Your name cannot be blank or over 20 characters and your skillbudget cannot be more than ' + MAXSKILLPOINTS)
    }
    return false
  }
  $('#name-form').submit(sendName)
  $('#name-submit').click(sendName)
})
