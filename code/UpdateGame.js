var console = require('console')

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function incrementScores(game, correct, guess) {
  if (correct) {
    game.correctGuesses++
    game.message = 'Nice guess!\n '+guess[0]+' is correct'
  } else {
    game.incorrectGuesses++
    if (game.incorrectGuesses != 6) {
      game.message = 'Sorry there\'s no ' + guess
    } else {
      game.message = 'Game over, you lose'
      game.startFlag = 5
    }
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

  game.guesses += guess + ' '
  game.template = replaceAll(game.template, '_ ', '_')
  for (var i = 0; i < game.answer.length; i++) {
    if (game.answer[i].toLowerCase() == guess.toLowerCase()) {
      tmp += game.answer[i]
      correct = 1
    } else
      tmp += game.template[i]
  }
  game.template = replaceAll(tmp, '_', '_ ')
  game = incrementScores(game, correct, guess)
  game.image = 'images/hangman' + game.incorrectGuesses + '.png'
  return game
}

module.exports.function = function updateGame(game, guess) {
  var correct = 0

  if (game.startFlag) {
    if (game.message != 'Congratulations, you win!' && game.message != 'Game over, you lose') {
      if (typeof game.guesses == 'object')
        game.guesses = game.guesses[0]
      if (typeof game.template == 'object')
        game.template = game.template[0]
      if (guess)
        guess = convertGuess(guess.toLowerCase()).toUpperCase()
      if (guess && game.guesses.includes(guess))
        game.message = 'You already tried '+guess[0]+'...'
      else if (guess && game.incorrectGuesses != 6)
        game = checkGuess(game, correct, guess[0])
      if (!game.template.includes('_')) {
        game.message = 'Congratulations, you win!'
        game.startFlag = 5
      }
    } else {
      game.startFlag--
    }
  }
  !game.startFlag ? game.startFlag = 1 : 0

  return game
}