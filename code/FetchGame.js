var http = require('http')
var console = require('console')

module.exports = function fetchGame() {
  console.log('test')
  var game = http.getUrl('https://raw.githubusercontent.com/Maljean/Bixby-Hangman/master/Games.json', { format: 'json' })
  game = game[Math.floor(Math.random() * game.length)]
  game.answer = game.answer.replace(new RegExp(' ', 'g'), '\n')
  game.incorrectGuesses = 0
  game.correctGuesses = 0
  game.startFlag = 0
  game.image = 'images/hangman0.png'
  game.message = "Say a letter"
  game.template = game.answer.replace(/[a-zA-Z]/g, '_ ')
  return game
}