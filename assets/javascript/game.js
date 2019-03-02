// global variables
//let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
let letters = "abcdefghijklmnopqrstuvwxyz";
let allWords = ["blue", "black", "yellow", "red", "green", "brown", "grey", "khaki", "purple", "aquamarine",
  "pink", "tan", "teal", "turquoise", "sienna", "cyan", "chartreuse", "chocolate", "magenta", "white", "orange", "olive", "plum", "silver", "gold", "lime", "crimson", "coral", "violet", "navy"]
//let words = ["samus", "peach", "shulk", "lucas"];
let words = []
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

// ---- Functions -----
// ---- Initializing Game -----

// Start game 
function startGame() {
  if (!gameOn && event.key === " ") {
    // reset logic to allow users to start a consecutive match/game w/ spacebar
    counters.wins = 0;
    counters.loses = 0;
    displayLetters.innerHTML = "...";
    displayWins.innerHTML = "0";
    displayLoses.innerHTML = "0";
    //words array reset
    setWordsArray();
    //words = ["samus", "peach", "shulk", "lucas"];
    // trigger app to choose a word
    displayBlankWord(chooseWord());
    setRemaining();
    gameOn = true;
    console.log("game started!");
    displayMessage.innerHTML = " ";
    console.log("start or reset: ", gameOn);
  }
}

// App chooses smaller subset of words
function setWordsArray() {
  for (let i = 0; i < 4; i++) {
    let allWordsIndex = Math.floor(Math.random() * Math.floor(allWords.length));
    words.push(allWords[allWordsIndex]);
    console.log(words)
  }
}


// App chooses chooses word for player to guess
function chooseWord() {
  if (words.length > 0) {
    // random number to pull a random element in words array 
    let wordIndex = Math.floor(Math.random() * Math.floor(words.length));
    currentWord = words[wordIndex];
    //remove word from array so that comp won't pick it again
    words.splice(wordIndex, 1);
  } else {
    // end game -- consider if new point is needed
    currentWord = "";
    endGame();
  }
  console.log("chooseword func:", currentWord);
  return currentWord;
}

// App prints word to page
function displayBlankWord(arg) {
  //loop currentWord.length and populate blanks
  for (let i = 0; i < arg.length; i++) {
    blankArray.push("_");
    // console.log("displayBlankWord: ", arg);
    displayLetters.innerHTML = blankArray.join(" ");
    // console.log(currentWord);
    // console.log(blankArray);
    // console.log(arg);
  }
}

// ---- Scoreboard functions ------

// add point to win
function addWin() {
  counters.wins++;
  displayWins.textContent = counters.wins;
  console.log("wins: ", counters.wins)
}

// add point to loses
function addLose() {
  counters.loses++;
  displayLoses.textContent = counters.loses;
  console.log("loses: ", counters.loses)
}

// subtract available guesses
function minusRemaining() {
  counters.remaining--;
  displayRemaining.textContent = counters.remaining;
  console.log("remaining: ", counters.remaining)
}

// set available guesses
function setRemaining() {
  counters.remaining = 5;
  displayRemaining.textContent = counters.remaining;
}

// --- Mid-Game User Input Functions ------

// Store player's key press into an array & display it on screen
function storeGuess() {
  // only store unique letter key presses into playerGuess array
  if (!playerGuess.includes(event.key.toLowerCase())) {
    playerGuess.push(event.key.toLowerCase());
    // display player guesses
    displayGuessHistory.innerHTML = playerGuess.join(" ");
    // call the logic to compare a new unique letter to current word
    compareLetter();
  } else { // do nothing
  }
}

// Compare player's key press to letters in word
function compareLetter() {
  if (currentWord.includes(event.key)) {
    // @ consider making a sound
    // loop the word
    console.log("i'm in compareLetter function")
    for (let i = 0; i < currentWord.length; i++) {
      // find the index of a match
      if (currentWord[i] === event.key.toLowerCase()) {
        // revisit blanks array to splice in letter
        console.log("compare:", currentWord[i]);
        blankArray.splice(i, 1, currentWord[i]);
        // display the edited array 
        console.log(blankArray);
        displayLetters.textContent = blankArray.join(" ");
      } else { // do nothing
      }
    };
  } else {
    // lose a remaining guess
    minusRemaining();
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
    displayGuessHistory.textContent = playerGuess
    // choose new word
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
    displayBlankWord(chooseWord());
  }
}

// Games lost

// Choose Game Over message -- Called after words array is empty.
function endGame() {
  if (counters.wins === 4) {
    displayMessage.innerHTML = "Congrats! You completed the game with a perfect score! You know your stuff! <br> Press Space to play again. ";
    gameOn = false;
  } else {
    displayMessage.innerHTML = "You completed all the rounds for the game! Play again to see if you get a higher score. <br> Press Space to play again.";
    //stop game
    gameOn = false;
  }
}



// --- Main App ----
document.onkeyup = function (event) {
  startGame();
  // only respect key presses that are letters and after game is initialized after space bar
  if (gameOn && letters.includes(event.key.toLowerCase())) {
    //compareLetter();
    console.log(event.key);
    console.log("player guess: ", playerGuess);
    //app processes user guess
    storeGuess();
    nextWord();
  }
};


