var http = require('http')

module.exports.function = function fetchGame() {
  var game = http.getUrl('https://raw.githubusercontent.com/Maljean/Bixby-Hangman/master/Games.json', { format: 'json' })
  game = game[Math.floor(Math.random() * game.length)]
  game.answer = game.answer.replace(new RegExp(' ', 'g'), '\n')
  game.incorrectGuesses = 0
  game.correctGuesses = 0
  game.guesses = " "
  game.image = 'images/hangman0.png'
  game.message = "Say a letter"
  game.startFlag = 0
  game.template = game.answer.replace(/[a-zA-Z]/g, '_ ')
  return game
}