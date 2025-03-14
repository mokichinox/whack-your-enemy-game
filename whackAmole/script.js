const gameBoard = document.getElementById("gameBoard");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const bestScoreDisplay = document.getElementById("bestScore");
const recordMessage = document.getElementById("recordMessage");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const quitButton = document.getElementById("quitButton");
const upload = document.getElementById("upload");


let enemyImageSrc = "";

let score = 0;
let timeLeft = 30;
let bestScore = 0;
let gameInterval;
let countdown;
let isPaused = false;

// Punch sound effect from SoundJay
const punchSound = new Audio("punchSFX.mp3");
// New record sound effect (applause)
const newRecordSound = new Audio("cheering.mp3");

upload.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        enemyImageSrc = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
  
  function createGameBoard() {
    gameBoard.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      const hole = document.createElement("div");
      hole.classList.add("hole");
      const enemy = document.createElement("img");
      enemy.classList.add("enemy");
      enemy.src = enemyImageSrc;
      enemy.style.display = "none";
      hole.appendChild(enemy);
      hole.addEventListener("click", () => {
        // Check if the enemy is fully visible using computed opacity
        if (parseFloat(getComputedStyle(enemy).opacity) === 1) {
          // Apply punch effect to enemy and shake effect to hole
          enemy.classList.add("punch-effect");
          hole.classList.add("hole-punch-effect");
          punchSound.currentTime = 0;
          punchSound.play();
  
          score++;
          scoreDisplay.textContent = score;
          setTimeout(() => {
            enemy.classList.remove("punch-effect");
            hole.classList.remove("hole-punch-effect");
          }, 300);
          enemy.style.opacity = "0";
          setTimeout(() => (enemy.style.display = "none"), 200);
        }
      });
      gameBoard.appendChild(hole);
    }
  }
  
  
  function popEnemy() {
    const holes = document.querySelectorAll(".hole");
    holes.forEach((hole) => {
      const enemy = hole.querySelector(".enemy");
      enemy.style.display = "none";
      enemy.style.opacity = "0";
    });
  
    const randomHole = holes[Math.floor(Math.random() * holes.length)];
    const enemy = randomHole.querySelector(".enemy");
    enemy.style.display = "block";
    enemy.style.opacity = "0";
    setTimeout(() => {
      enemy.style.opacity = "1"; // Fade in
    }, 50);
    setTimeout(() => {
      enemy.style.opacity = "0"; // Fade out after 800ms
    }, 800);
  }
  
  
  function startGame() {
    if (!enemyImageSrc) {
      alert("Please upload an image first!");
      return;
    }
    // Show pause and quit buttons once the game starts
    pauseButton.style.display = "inline-block";
    quitButton.style.display = "inline-block";
  
    recordMessage.style.display = "none";
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    createGameBoard();
    clearInterval(gameInterval);
    clearInterval(countdown);
    isPaused = false;
    pauseButton.textContent = "Pause";
    gameInterval = setInterval(popEnemy, 1000);
    countdown = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(gameInterval);
        clearInterval(countdown);
        if (score > bestScore) {
          bestScore = score;
          bestScoreDisplay.textContent = bestScore;
          recordMessage.style.display = "block";
          recordMessage.textContent = "New Record!";
          newRecordSound.currentTime = 0;
          newRecordSound.play();
          const celebration = document.getElementById("celebration");
          celebration.style.display = "block";
          setTimeout(() => {
            celebration.style.display = "none";
          }, 1000);
        }
        alert("Game Over! Your score: " + score);
      }
    }, 1000);
  }
  
  function pauseGame() {
    if (!isPaused) {
      clearInterval(gameInterval);
      clearInterval(countdown);
      isPaused = true;
      pauseButton.textContent = "Resume";
    } else {
      gameInterval = setInterval(popEnemy, 1000);
      countdown = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
          clearInterval(gameInterval);
          clearInterval(countdown);
          if (score > bestScore) {
            bestScore = score;
            bestScoreDisplay.textContent = bestScore;
            recordMessage.style.display = "block";
            recordMessage.textContent = "New Record!";
            newRecordSound.currentTime = 0;
            newRecordSound.play();
            const celebration = document.getElementById("celebration");
            celebration.style.display = "block";
            setTimeout(() => {
              celebration.style.display = "none";
            }, 1000);
          }
          alert("Game Over! Your score: " + score);
        }
      }, 1000);
      isPaused = false;
      pauseButton.textContent = "Pause";
    }
  }
  
  function quitGame() {
    clearInterval(gameInterval);
    clearInterval(countdown);
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    gameBoard.innerHTML = "";
    alert("Game Quit!");
    isPaused = false;
    pauseButton.textContent = "Pause";
    // Hide the pause and quit buttons after quitting
    pauseButton.style.display = "none";
    quitButton.style.display = "none";
  }
  
  startButton.addEventListener("click", startGame);
  pauseButton.addEventListener("click", pauseGame);
  quitButton.addEventListener("click", quitGame);
