function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

var d = document;
var word = '';
var displayArray = [];
var turns = 6;
var guessedChars = [];
var correctChars = [];
// var turnsRemaining = d.querySelector('#turnsRemaining');
var guessWord = d.querySelector('#guessWord');
// var guessedContainer = d.querySelector('#guessed-container');
var harhar = new Audio('assets/sounds/Nelson.mp3');
var winCounter = 0;
var lossCounter = 0;
var newGameBtn = d.querySelector('#newGame');
var modalContainer = d.querySelector('.modal-container');
var modalTitle = d.querySelector('.modal h3');
var winLoss = d.querySelector('#winLoss');
var hangMan = d.querySelector('.hangman');
var correctWord = d.querySelector('#correct-word');

newGameBtn.addEventListener('click', function(){
  modalContainer.style.display = 'none';
  newGame();
});

var letters = d.querySelectorAll('.letter');

function guess(e) {

  if (guessedChars.indexOf(e.target.innerHTML) === -1) {
    guessedChars.push(e.target.innerHTML);
    // e.target.style.background = 'red';
    e.target.classList.add('guessed');
    testInput(e.target.innerHTML);
  } else {
    console.log('This character has already been guessed');
  }
}

letters.forEach(function(letter) {
  letter.addEventListener('click', guess);
});

newGame();
function newGame() {
  var randomNumber = Math.round(Math.random()*commonWords.length);
  // word = commonWords[randomNumber].toUpperCase();
  var saveWord = httpGet('http://randomword.setgetgo.com/get.php');
  word = saveWord.toUpperCase();

  displayArray = [];
  word.split('').forEach(function(char){
    displayArray.push('_');
  });
  guessWord.textContent = displayArray.join(' ');
  turns = 6;
  console.log('New word = ' + word);

  letters.forEach(function(letter) { // Reset letter styling
    letter.classList.remove('guessed');
  });

  guessedChars = [];
  updateTurns();
}




function testInput(guess) {
  if (guess.length === 0) { // If nothing was typed in
    throw new Error('You didn\'t type in anything');
  } else if (word.indexOf(guess) !== -1) { // If the player guesses a correct character
    displayArray = []; // Reset displayArray
    word.split('').forEach(function(char) {
      if (guessedChars.indexOf(char) !== -1) {

        displayArray.push(char); // Add guessed chars to array
      } else {
        displayArray.push('_'); // Add underscores for not yet guessed chars
      }
    });
    guessWord.textContent = displayArray.join(' '); // Update p tag
    if (displayArray.indexOf('_') === -1) { // If all letters have been guessed
      win();
    }
  } else if (turns !== 1) {
    turns--;
  } else {
    updateTurns();
    loss();
  }
  updateTurns();
}






function updateTurns() {
  if (turns === 6) {
    hangMan.style.background = 'url(\'assets/images/hangman1.png\') no-repeat';
  } else if (turns === 5) {
    hangMan.style.background = 'url(\'assets/images/hangman2.png\') no-repeat';
  } else if (turns === 4) {
    hangMan.style.background = 'url(\'assets/images/hangman3.png\') no-repeat';
  } else if (turns === 3) {
    hangMan.style.background = 'url(\'assets/images/hangman4.png\') no-repeat';
  } else if (turns === 2) {
    hangMan.style.background = 'url(\'assets/images/hangman5.png\') no-repeat';
  } else if (turns === 1) {
    hangMan.style.background = 'url(\'assets/images/hangman6.png\') no-repeat';
  } else {
    hangMan.style.background = 'url(\'assets/images/hangman7.png\') no-repeat';
  }
}


function win() {
  modalContainer.style.display = 'flex';
  modalTitle.style.color = 'rgb(55, 221, 166)';
  newGameBtn.style.background = 'rgb(55, 221, 166)';
  modalTitle.textContent = 'You Won!';
  correctWord.textContent = '';
  winCounter++;
  updateWLCounter();
  updateTurns();
}

function loss() {
  hangMan.style.background = 'url(\'assets/images/hangman7.png\') no-repeat';
  harhar.play();
  modalContainer.style.display = 'flex';
  modalTitle.style.color = '#e74c3c';
  newGameBtn.style.background = '#e74c3c';
  modalTitle.textContent = 'You Lost!';
  correctWord.textContent = 'The correct word was: ' + word;
  lossCounter++;
  updateWLCounter();
  updateTurns();
}

function updateWLCounter() {
  if (winCounter === 1 && lossCounter === 1) {
    winLoss.textContent = winCounter + ' win & ' + lossCounter + ' loss';
  } else if (winCounter === 1 && lossCounter !== 1) {
    winLoss.textContent = winCounter + ' win & ' + lossCounter + ' losses';
  } else if (winCounter !== 1 && lossCounter === 1) {
    winLoss.textContent = winCounter + ' wins & ' + lossCounter + ' loss';
  } else {
    winLoss.textContent = winCounter + ' wins & ' + lossCounter + ' losses';
  }
}
