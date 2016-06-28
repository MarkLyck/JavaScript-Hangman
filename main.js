var d = document;
var word = '';
var displayArray = [];
var turns = 10;
var guessedChars = [];
var correctChars = [];
var turnsRemaining = d.querySelector('#turnsRemaining');
var guessWord = d.querySelector('#guessWord');
var input = d.querySelector('input');

newGame();
function newGame() {
  var randomNumber = Math.round(Math.random()*commonWords.length);
  word = commonWords[randomNumber];
  // Set up underscores
  displayArray = [];
  word.split('').forEach(function(char){
    //Using regex allows for sentences to have commas, and periods (for more advanced hangman)
    displayArray.push('_');
    // guessWord.textContent = word.replace(/[a-zA-Z]/g, '_ ');
  });
  guessWord.textContent = displayArray.join(' ');
  turns = 10;
  console.log('New word = ' + word);
}

input.addEventListener('keyup', function(e){
  if (e.keyCode === 13) {
    testInput(input.value);
  }
});

function testInput(guess) {
  input.value = '';
  if (guess.length > 1) { // If user is trying to guess the entire word
    turns--;
    if (guess === word) {
      console.log('YOU WON!');
    }
  } else if (guess.length === 0) { // If nothing was typed in
    throw new Error('You didn\'t type in anything');

  } else if (guessedChars.indexOf(guess) !== -1) { // If character was already guessed
    console.log('You have already guessed this character');

  } else if (word.indexOf(guess) !== -1) { // If the player guesses a correct character
    turns--;
    console.log('Correct char guess');
    guessedChars.push(guess);

    displayArray = []; // Reset displayArray
    word.split('').forEach(function(char) {
      if (guessedChars.indexOf(char) !== -1) {
        displayArray.push(char); // Add guessed chars to array
      } else {
        displayArray.push('_'); // Add underscores for not yet guessed chars
      }
    });

    guessWord.textContent = displayArray.join(' '); // Update p tag

    console.log(displayArray.indexOf('_'));
    if (displayArray.indexOf('_') === -1) { // If all letters have been guessed
      console.log('YOU WON!');
    }

  } else {
    turns--;
    console.log('Wrong');
  }

  updateTurns();

  if (turns === 0) {
    console.log('YOU LOST!');
    newGame();
    updateTurns();
  }
}

function updateTurns() {
  if (turns !== 1) {
    turnsRemaining.textContent = turns + ' turns left';
  } else {
    turnsRemaining.textContent = turns + ' turn left';
  }

}
