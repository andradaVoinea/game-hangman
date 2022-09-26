var programming_languages = [
  "python",
  "javascript",
  "mongodb",
  "json",
  "java",
  "html",
  "css",
  "c",
  "csharp",
  "golang",
  "kotlin",
  "php",
  "sql",
  "ruby",
];

let maxWrong = 6; //maxMistakes
let mistakes = 0;
let guessed = [];
let wordStatus = "";
async function apiWord() {
  try {
    // after this line, our function will wait for the `fetch()` call to be settled
    // the `fetch()` call will either return a Response or throw an error
    const response = await fetch(
      "http://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=noun&minCorpusCount=8000&maxCorpusCount=-1&minDictionaryCount=3&maxDictionaryCount=-1&minLength=6&maxLength=12&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5"
    );
    if (!response.ok) {
      throw new Error(`word could not be found ${response.status}`);
    }
    // after this line, our function will wait for the `response.json()` call to be settled
    // the `response.json()` call will either return the parsed JSON object or throw an error
    const data = await response.json();
    console.log(data.word);
    return data.word.toLowerCase();
  } catch (error) {
    console.log(`Could not get proper word ${error}`);
    let word = randomWord(); //fallback function
    console.log(word);
    return word;
  }
}
function randomWord() {
  return programming_languages[
    Math.floor(Math.random() * programming_languages.length)
  ];
}
//generate buttons for the HTML
function generateButtons() {
  let buttonsHTML = "abcdefghijklmnopqrstuvwxyz-"
    .split("")
    .map(
      (letter) =>
        `
      <button
        class="btn btn-lg btn-primary m-2" 
        id='` +
        letter +
        `'
        onClick="handleGuess('` +
        letter +
        `')"
      >
        ` +
        letter +
        `
      </button>
    `
    )
    .join(""); //pt a scapa de virgulele din html

  document.getElementById("keyboard").innerHTML = buttonsHTML;
}
function guessedWord(guessedArray, answerExepcted) {
  wordStatus = answerExepcted
    .split("")
    .map((letter) => (guessedArray.indexOf(letter) >= 0 ? letter : " _ "))
    .join("");
  // guessed.indexOf(letter) - check if the letter exists in the array created with the randomWord() function
  //if it exists >=0, then print _ on screen (ternary writing)
  document.getElementById("wordUnderscore").innerHTML = wordStatus;
}
function handleGuess(chosenLetter) {
  guessed.push(chosenLetter);
  //if chosen letter exists,push the guessed chosen letter into the array,
  document.getElementById(chosenLetter).setAttribute("disabled", true);
  //we disable the button with the clicked letter, so that it doesn't duplicate
  if (answer.indexOf(chosenLetter) >= 0) {
    //if the letter we chose exists, we want to run the following functions
    guessedWord(guessed, answer); //it updates the letters
  } else {
    mistakes++;
    updateMistakes(mistakes); //run the function to update the number of mistakes
    updateHangmanPicture(mistakes);
  }
  gameStatus();
}
function updateMistakes(misses) {
  document.getElementById("mistakes").innerHTML = misses;
}
function gameStatus() {
  if (wordStatus === answer) {
    document.getElementById("keyboard").innerHTML = "You Won!";
  } else if (mistakes === maxWrong) {
    document.getElementById("keyboard").innerHTML = "You Lost!";
    document.getElementById("wordUnderscore").innerHTML =
      "The answer was: " + answer;
    //messaage to write if the answer was wrong, and you lost
  }
}
function reset() {
  mistakes = 0;
  guessed = [];
  document.getElementById("hangmanPic").src = "./images/0.jpg";

  apiWord().then((result) => {
    answer = result; //generate a new random word
    guessedWord(guessed, result);
  }); //reset the guessed Word, so that it moves to underscores
  updateMistakes(mistakes); //update mistakes in the HTML
  generateButtons(); //generate the buttons again, so that they don't stay disabled
}
function updateHangmanPicture(misses) {
  document.getElementById("hangmanPic").src = "./images/" + misses + ".jpg";
}
document.getElementById("maxWrong").innerHTML = maxWrong;

apiWord().then((result) => {
  answer = result;
  guessedWord(guessed, result);
});
generateButtons();
