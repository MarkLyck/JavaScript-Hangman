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
var turns = 10;
var guessedChars = [];
var correctChars = [];
var turnsRemaining = d.querySelector('#turnsRemaining');
var guessWord = d.querySelector('#guessWord');
var guessedContainer = d.querySelector('#guessed-container');
var harhar = new Audio('assets/sounds/Nelson.mp3');
var winCounter = 0;
var lossCounter = 0;
var newGameBtn = d.querySelector('#newGame');
var modalContainer = d.querySelector('.modal-container');
var modalTitle = d.querySelector('.modal h3');

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
  console.log(saveWord);
  word = saveWord.toUpperCase();

  displayArray = [];
  word.split('').forEach(function(char){
    displayArray.push('_');
  });
  guessWord.textContent = displayArray.join(' ');
  turns = 10;
  console.log('New word = ' + word);

  letters.forEach(function(letter) { // Reset letter styling
    letter.classList.remove('guessed');
  });

  guessedChars = [];
  updateGuesses();
  updateTurns();
}




function testInput(guess) {

  console.log(guess);
  if (guess.length === 0) { // If nothing was typed in
    throw new Error('You didn\'t type in anything');
  } else if (word.indexOf(guess) !== -1) { // If the player guesses a correct character
    console.log('Correct char guess');
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
      console.log('YOU WON!');
      win();
    }
  } else if (turns !== 1) {
    turns--;
    console.log('Wrong');
  } else {
    console.log('YOU LOST!');
    loss();
  }
  updateGuesses();
  updateTurns();
}






function updateTurns() {
  if (turns !== 1) {
    turnsRemaining.textContent = turns + ' turns remaining';
  } else {
    turnsRemaining.textContent = turns + ' turn remaining';
  }
}







function updateGuesses() {
  while (guessedContainer.firstChild) {
    guessedContainer.removeChild(guessedContainer.firstChild);
  }
  guessedChars.forEach(function(guess) {
    var node = document.createElement("li");
    var textNode = document.createTextNode(guess);
    node.appendChild(textNode);
    guessedContainer.appendChild(node);
  });
}


function win() {
  modalContainer.style.display = 'flex';
  modalTitle.style.color = 'rgb(55, 221, 166)';
  newGameBtn.style.background = 'rgb(55, 221, 166)';
  modalTitle.textContent = 'You Won!';
  winCounter++;
  updateTurns();
}

function loss() {
  harhar.play();
  modalContainer.style.display = 'flex';
  modalTitle.style.color = '#e74c3c';
  newGameBtn.style.background = '#e74c3c';
  modalTitle.textContent = 'You Lost!';
  lossCounter++;
  updateTurns();
}
