// global variables
let letters = "abcdefghijklmnopqrstuvwxyz";
let allWords = ["blue", "black", "yellow", "red", "green", "brown", "grey", "khaki", "purple", "aquamarine",
  "pink", "tan", "teal", "turquoise", "sienna", "cyan", "chartreuse", "chocolate", "magenta", "white", "orange", "olive", "plum", "silver", "gold", "lime", "crimson", "coral", "violet", "navy", "cerulean", "dandelion"];
let words = [];
let playerGuess = [];
let blankArray = [];
let currentWord = "";
let displayLetters = document.getElementById("panel");
let displayWins = document.getElementById("wins");
let displayLoses = document.getElementById("loses");
let displayRemaining = document.getElementById("remaining");
let displayGuessHistory = document.getElementById("guess-history");
let displayMessage = document.getElementById("message");
let gameOn = false;
let counters = {
  wins: 0,
  loses: 0,
  remaining: 0
};

console.log(allWords.length)

// ---- Functions -----
// ---- Initializing Game -----

// Start game 
function startGame() {
  if (!gameOn && event.key === " ") {
    // reset logic to allow users to start a consecutive match/game w/ spacebar
    counters.wins = 0;
    counters.loses = 0;
    displayLetters.textContent = "...";
    displayWins.innerHTML = "0";
    displayLoses.innerHTML = "0";
    // words array -- the 4 rounds for the user --  reset
    setWordsArray();
    // trigger app to choose a word
    displayBlankWord(chooseWord());
    setRemaining();
    gameOn = true;
    displayMessage.innerHTML = " ";
  }
}

// App chooses smaller subset of words
function setWordsArray() {
  for (let i = 0; i < 4; i++) {
    let allWordsIndex = Math.floor(Math.random() * Math.floor(allWords.length));
    words.push(allWords[allWordsIndex]);
  }
}


// App chooses chooses word for player to guess
function chooseWord() {
  if (words.length > 0) {
    // random number to pull a random element in words array 
    let wordIndex = Math.floor(Math.random() * Math.floor(words.length));
    currentWord = words[wordIndex];
    // send currentWord as a class while keeping the classes in HTML
    let newClass = currentWord + " card mx-auto";
    document.getElementById('color-tile').setAttribute('class', newClass);
    // remove word from array so that comp won't pick it again
    words.splice(wordIndex, 1);
  } else {
    // end game -- consider if new point is needed
    currentWord = "";
    endGame();
  }
  return currentWord;
}

// App prints current word as hidden word to page
function displayBlankWord(arg) {
  // loop currentWord.length and populate blanks
  for (let i = 0; i < arg.length; i++) {
    blankArray.push("_");
    displayLetters.innerHTML = blankArray.join(" ");
  }
}

// ---- Scoreboard functions ------

// Add point to win
function addWin() {
  counters.wins++;
  displayWins.textContent = counters.wins;
}

// Add point to loses
function addLose() {
  counters.loses++;
  displayLoses.textContent = counters.loses;
}

// Subtract available guesses
function minusRemaining() {
  counters.remaining--;
  displayRemaining.textContent = counters.remaining;
}

// Reset available guesses per word
function setRemaining() {
  counters.remaining = 5;
  displayRemaining.textContent = counters.remaining;
}

// --- Sound Effects ----

// Make a sound for new words
function audioNewWord() {
  let audioElement = document.createElement("audio");
  audioElement.setAttribute("src", "./assets/sounds/Magic-chimes-transition-reverb.mp3");
  audioElement.playbackRate = 2.5;
  audioElement.play();
  console.log("play ", audioElement.play())
}

// Make a sound for successful letter guesses
function audioCorrectLetter() {
  let audioElement = document.createElement("audio");
  audioElement.setAttribute("src", "./assets/sounds/Successful-sound.mp3");
  audioElement.playbackRate = 3.0;
  audioElement.play();
  console.log("play ", audioElement.play())
}

// Make a sound for incorrect letter guesses
function audioWrongLetter() {
  let audioElement = document.createElement("audio");
  audioElement.setAttribute("src", "./assets/sounds/Error-sound.mp3");
  audioElement.playbackRate = 1.5;
  audioElement.play();
  console.log("play ", audioElement.play())
}



// --- Functions Processing User Input Mid-Game ------

// Store player's key press into an array & display it on screen
function storeGuess() {
  // only store new key presses into playerGuess array
  if (!playerGuess.includes(event.key.toLowerCase())) {
    playerGuess.push(event.key.toLowerCase());
    // display player guesses
    displayGuessHistory.innerHTML = playerGuess.join(" ");
    // call function to compare the new letter to current word
    compareLetter();
  } else { // do nothing
  }
}

// Compare player's key press to letters in word
function compareLetter() {
  //decide if it is a correct letter
  if (currentWord.includes(event.key)) {
    // @ consider making a sound
    // find the index of matching letters
    for (let i = 0; i < currentWord.length; i++) {
      if (currentWord[i] === event.key.toLowerCase()) {
        // revisit blanks array to splice in letter
        blankArray.splice(i, 1, currentWord[i]);
        // display the edited array 
        displayLetters.textContent = blankArray.join(" ");
        //play sound
        audioCorrectLetter();
      } else { // do nothing
      }
    };
  } else {
    // lose a remaining guess
    minusRemaining();
    // play sound
    audioWrongLetter();
  }
}

// Choose the next word based on win or lose condition
function nextWord() {
  // Win condition: If there are no blanks left, clear screen and choose a new word
  if (!blankArray.includes("_")) {
    displayMessage.innerHTML = "You guessed the correct word! Keep going!";
    // add point
    addWin();
    // clear arrays
    blankArray = [];
    playerGuess = [];
    // clear screen
    displayGuessHistory.textContent = playerGuess;
    setRemaining();
    // choose new word
    audioNewWord();
    displayBlankWord(chooseWord());
  } else if (counters.remaining === 0) {
    // Lose condition: 0 remaining guesses. 
    displayMessage.innerHTML = "You ran out of guesses, but here is a new word. Keep going!";
    // add lose
    addLose();
    // clear arrays
    blankArray = [];
    playerGuess = [];
    // clear screen
    displayGuessHistory.textContent = playerGuess;
    // reset remaining guesses
    setRemaining();
    // choose new word
    audioNewWord();
    displayBlankWord(chooseWord());
  }
}

// Choose Game Over message -- Called after words array is empty.
function endGame() {
  if (counters.wins === 4) {
    displayMessage.innerHTML = "Congrats! You completed the game with a perfect score! You know your stuff! <br> Press Space to play again.";
    gameOn = false;
  } else {
    displayMessage.innerHTML = "You completed all the rounds for the game! <br> Play again to see if you get a higher score. <br> Press Space to play again.";
    // stop game from accepting key presses that aren't space
    gameOn = false;
  }
}






// --- Main App ----
document.onkeyup = function (event) {
  // start game function waiting for space bar to be pressed
  startGame();
  // only react to key presses that are letters
  if (gameOn && letters.includes(event.key.toLowerCase())) {
    //app processes the letter key
    storeGuess();
    nextWord();
  }
};

