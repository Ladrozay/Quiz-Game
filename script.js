let timer = 90;
let runningTimer;
let score = 0;
let username = "";
let qNumber;
let finalScore;
const MAX_HIGH_SCORES = 7;

//DOM Objects

const startButton = document.getElementById("startButton");
const qContainer = document.getElementById("questionsContainer");
const qElement = document.getElementById("question");
const answerButtons = document.getElementById("answers");
const countdown = document.getElementById("timerArea");
const scoreArea = document.getElementById("scoreArea");
const highScoresButton = document.getElementById("showScoresButton");


//LocalStorage Objects
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
//

startButton.addEventListener("click", startGame);
highScoresButton.addEventListener("click", displayScores);


//start game 

function startGame() {
  startButton.classList.add("hide");
  scoreArea.classList.add("hide");
  answerButtons.classList.remove("hide");
  qNumber = 0;
  qContainer.classList.remove("hide");
  scoreArea.innerHTML = "";
  startClock();
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
  showQuestion(questions[qNumber]);
}


//start the timer
//runs countdown and when the time is up, runs the game over function
function startClock() {
  countdown.innerHTML = "Time Remaining: " + timer;
  if (timer <= 0) {
    gameOver();
  } else {
    timer -= 1;
    runningTimer = setTimeout(startClock, 1000);
  }
}


//Display questions
//loads one object from the questions array into the proper html elements, then runs the collect answers function
function showQuestion(question) {
  qElement.innerText = question.question;
  question.answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerButtons.appendChild(button);
  });
}


//function to collect answers
//listens for what answer the user clicks on, compare it to the correct answer, and decrease the timer if wrong. 
//run the next question function next
//unless the current question is the last, run the game over function

function selectAnswer(e) {
  const selectedButton = e.target;
  if (!selectedButton.dataset.correct) {
    timer = timer - 10;
    console.log(timer);
  }
  if (qNumber == questions.length - 1) {
    gameOver();
  } else {
    clearQuestion();
    qNumber++;
    showQuestion(questions[qNumber]);
    console.log(score);
  }
}

//function to clear the current question
//should empty the HTML elements that are occupied with the currently displayed question
function clearQuestion() {
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

//game over function
//get the current time remaining. set it as the score, hide the questions area, display the score to the user, 
//and give them the chance to try again or submit high scores via a text box

function gameOver() {
  clearInterval(runningTimer);
  countdown.innerHTML = "Finished";
  clearQuestion();
  showResults();
  startButton.innerText = "Restart";
  startButton.classList.remove("hide");
  timer = 90;
  score = 0;
}

function showResults() {
  finalScore = timer;
  if (finalScore < 0) {
    finalScore = 0;
  }
  qElement.innerText = "";
  scoreArea.classList.remove("hide");
  answerButtons.classList.add("hide");
  scoreArea.innerHTML = `Your score is ${finalScore}!<div id="init">Name: <input type="text" name="initials" id="initials" placeholder="Enter Your Name"><button id="save-btn" class="save-btn btn" onclick="submitScores(event)" disabled>Save</button>`;
  username = document.getElementById("initials");
  saveButton = document.getElementById("save-btn");
  username.addEventListener("keyup", function() {
    saveButton.disabled = !username.value;
  });
}

//function to submit high scores
//should grab the users score and initials and add it to the high scores object, ranked numerically, 
//and run the display the high scores function

function submitScores(e) {
  const score = {
    score: finalScore,
    name: username.value
  };
  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(MAX_HIGH_SCORES);

  localStorage.setItem("highScores", JSON.stringify(highScores));
  displayScores();
}

//function to display high scores
//fills the HTML with a ranked display of the high scores and and provide the option to clear the scores via a function
function displayScores() {
  clearInterval(runningTimer);
  countdown.innerHTML = "";
  clearQuestion();
  qElement.innerText = "";
  scoreArea.classList.remove("hide");

  scoreArea.innerHTML = `<h2>High Scores</h2><ul id="highScoresList"></ul><button id="clearScores" class="btn" onclick="clearScores()">Clear Scores</button>`;
  const highScoresList = document.getElementById("highScoresList");
  highScoresList.innerHTML = highScores
    .map(score => {
      return `<li class="scoresList">${score.name} - ${score.score}</li>`;
    })
    .join("");
  startButton.classList.remove("hide");
  highScoresButton.classList.add("hide");
}

//function to clear high scores
function clearScores() {
  highScores = [];
  highScoresList.innerHTML = "<h3>Scores have been Cleared</h3>";
  document.getElementById("clearScores").classList.add("hide");
}




//Questions
const questions = [
  {
    question: "What year was the United Nations established?",
    answers: [
      { text: "1950", correct: false },
      { text: "1945", correct: true },
      { text: "1960", correct: false },
      { text: "1900", correct: false }
    ]
  },
  {
    question: "Who has won the most total Academy Awards?",
    answers: [
      { text: "Christopher Nolan", correct: false },
      { text: "Tom Cruise", correct: false },
      { text: "Marlon Brando", correct: false },
      { text: "Walt Disney", correct: true }
    ]
  },
  {
    question: "How many minutes are in a full week?",
    answers: [
      { text: "10,080", correct: true },
      { text: "28,480", correct: false }
    ]
  },
  {
    question: 'In Javascript, How do you write "Hello World" in an alert box?',
    answers: [
      { text: 'msg("Hello World");', correct: false },
      { text: 'prompt("Hello World");', correct: false },
      { text: 'alertBox("Hello World");', correct: false },
      { text: 'alert("Hello World");', correct: true }
    ]
  },
  {
    question: "What artist has the most streams on Spotify?",
    answers: [
      { text: "Drake", correct: true },
      { text: "Rihanna", correct: false },
      { text: "Mozart", correct: false },
      { text: "Michael Jackson", correct: false }
    ]
  },
  {
    question: 'How many elements are in the periodic table?',
    answers: [
      { text: "108", correct: false },
      { text: "72", correct: false },
      { text: "118", correct: true },
      { text: "114", correct: false }
    ]
  },
  {
    question: "How many faces does a Dodecahedron have?",
    answers: [
      { text: "12", correct: true },
      { text: "11", correct: false },
      { text: "13", correct: false },
      { text: "14", correct: false }
    ]
  },
  {
    question: "What character has both Robert Downey Jr. and Benedict Cumberbatch played? Sherlock Holmes",
    answers: [
      { text: "James Bond", correct: false },
      { text: "Iron Man", correct: false },
      { text: "Hell Boy", correct: false },
      { text: "Sherlock Holmes", correct: true }
    ]
  },
  {
    question: "What sports car company manufactures the 911?",
    answers: [
      { text: "Porsche", correct: false },
      { text: "Ferrari", correct: false },
      { text: "Maserati", correct: true },
      { text: "Volvo", correct: false }
    ]
  }
];
