var console = require('console')
var fetchGame = require('./FetchGame')

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function updateMessage(game, guess) {
  if (game.incorrectGuesses == 6) {
    game.message = 'Game over, you lose'
    game.startFlag = 5
  } else if (game.incorrectGuesses != 6) {
    game.message = 'Sorry there\'s no ' + guess[0]
  }
  game.image = 'images/hangman' + game.incorrectGuesses + '.png'
  return game
}

function incrementScores(game, correct, guess) {
  if (correct) {
    game.correctGuesses++
    game = updateMessage(game, guess)
    game.message = 'Nice guess!\n ' + guess[0] + ' is correct'
  } else {
    game.incorrectGuesses++
    game = updateMessage(game, guess)
  }
  return game
}

function convertGuess(guess) {
  var asrKey = {
    c: ['see', 'sea'],
    n: ['end'],
    e: ['he'],
    n: ['end'],
    r: ['are'],
    u: ['you'],
    y: ['why']
  }

  for (key in asrKey)
    if (asrKey[key].indexOf(guess) > -1)
      return key
  return guess
}

function checkGuess(game, correct, guess) {
  var tmp = ''

  game.template = replaceAll(game.template, '_ ', '_')
  for (var i = 0; i < game.answer.length; i++) {
    if (game.answer[i].toLowerCase() == guess.toLowerCase()) {
      tmp += game.answer[i]
      correct = 1
    } else
      tmp += game.template[i]
  }
  if (!game.incorrectLetters)
    game.incorrectLetters = ' '
  if (!correct)
    game.incorrectLetters += guess + ' '
  game.template = replaceAll(tmp, '_', '_ ')
  game = incrementScores(game, correct, guess)
  return game
}

module.exports.function = function updateGame(game, guess) {
  var correct = 0

  if (game.startFlag) {
    if (game.message != 'Congratulations, you win!' && game.message != 'Game over, you lose') {
      if (guess) {
        guess = convertGuess(guess.toLowerCase()).toUpperCase()
        console.log(guess)
        if (guess.includes('NEW GAME')) {
          game = fetchGame()
          game.startFlag = 1
          return game
        } else if (guess.includes('GIVE UP')) {
          game.incorrectGuesses = 6
          game.incorrectLetters = 'Q U I T E R 💔'
          return updateMessage(game, guess)
        } else if (replaceAll(guess, ' ', '\n') == game.answer.toUpperCase()) {
          game.template = game.answer
          game.correctGuesses++
          game.message = 'Congratulations, you win!'
          game.startFlag = 5
          return game
        } else if ((game.incorrectGuesses && game.incorrectLetters.includes(guess[0])) || game.template.toUpperCase().includes(guess[0])) {
          game.message = 'You already used ' + guess[0] + '...'
        } else if (game.incorrectGuesses != 6) {
          game = checkGuess(game, correct, guess[0])
        }
      }
      if (!game.template.includes('_')) {
        game.message = 'Congratulations, you win!'
        game.startFlag = 5
      }
    } else
      game.startFlag--
  }
  !game.startFlag ? game.startFlag = 1 : 0

  return game
}