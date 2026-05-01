
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;
let isSinglePlayer = false;

let scores = {
  X: 0,
  O: 0,
  draw: 0,
};

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// DOM Elements
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("game-status");
const multiplayerBtn = document.getElementById("multiplayer-btn");
const singleplayerBtn = document.getElementById("singleplayer-btn");
const playerOneInput = document.getElementById("player-one");
const playerTwoInput = document.getElementById("player-two");
const playerTwoGroup = document.getElementById("player-two-group");
const startGameBtn = document.getElementById("start-game-btn");
const restartBtn = document.getElementById("restart-btn");
const resetBtn = document.getElementById("reset-btn");
const popup = document.getElementById("winner-popup");
const popupMessage = document.getElementById("popup-message");
const newGameBtn = document.getElementById("new-game-btn");

const scoreX = document.getElementById("score-x");
const scoreO = document.getElementById("score-o");
const drawScore = document.getElementById("draw-score");
const playerOneName = document.getElementById("player-one-name");
const playerTwoName = document.getElementById("player-two-name");

// Mode Selection
function setGameMode(singlePlayerMode) {
  isSinglePlayer = singlePlayerMode;

  multiplayerBtn.classList.toggle("active", !singlePlayerMode);
  singleplayerBtn.classList.toggle("active", singlePlayerMode);

  if (singlePlayerMode) {
    playerTwoGroup.style.display = "none";
    playerTwoName.textContent = "Computer";
  } else {
    playerTwoGroup.style.display = "block";
    playerTwoName.textContent = "P2";
  }
}

// Start Game
function startGame() {
  const player1 = playerOneInput.value.trim() || "P1";
  const player2 = isSinglePlayer
    ? "Computer"
    : playerTwoInput.value.trim() || "P2";

  playerOneName.textContent = player1;
  playerTwoName.textContent = player2;

  gameActive = true;
  resetBoard();
}

// Handle Cell Click
function handleCellClick(event) {
  const clickedCell = event.target;
  const index = clickedCell.dataset.index;

  if (!gameActive || board[index] !== "") return;

  makeMove(index, currentPlayer);

  if (isSinglePlayer && currentPlayer === "O" && gameActive) {
    setTimeout(computerMove, 500);
  }
}

// Make Move
function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;

  if (checkWinner(player)) {
    statusText.textContent = `${getPlayerName(player)} Won!`;
    showPopup(`${getPlayerName(player)} Won!`);
    scores[player]++;
    updateScoreBoard();
    gameActive = false;
    return;
  }

  if (checkDraw()) {
    statusText.textContent = "It's a Draw!";
    showPopup("It's a Draw!");
    scores.draw++;
    updateScoreBoard();
    gameActive = false;
    return;
  }

  currentPlayer = player === "X" ? "O" : "X";
  statusText.textContent = `${getPlayerName(currentPlayer)}'s Turn`;
}

// Winner Check
function checkWinner(player) {
  return winningCombinations.some((combo) => {
    return combo.every((index) => board[index] === player);
  });
}

// Draw Check
function checkDraw() {
  return board.every((cell) => cell !== "");
}

// Computer Logic (Smart Basic)
function computerMove() {
  let move = findBestMove("O") || findBestMove("X") || getBestAvailableMove();

  if (move !== null) {
    makeMove(move, "O");
  }
}

function findBestMove(player) {
  for (let combo of winningCombinations) {
    const values = combo.map((index) => board[index]);

    if (
      values.filter((value) => value === player).length === 2 &&
      values.includes("")
    ) {
      return combo[values.indexOf("")];
    }
  }
  return null;
}

function getBestAvailableMove() {
  if (board[4] === "") return 4;

  const corners = [0, 2, 6, 8];
  for (let index of corners) {
    if (board[index] === "") return index;
  }

  const sides = [1, 3, 5, 7];
  for (let index of sides) {
    if (board[index] === "") return index;
  }

  return null;
}

// Helpers
function getPlayerName(player) {
  return player === "X" ? playerOneName.textContent : playerTwoName.textContent;
}

function updateScoreBoard() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  drawScore.textContent = scores.draw;
}

function resetBoard() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  statusText.textContent = `${getPlayerName("X")}'s Turn`;

  cells.forEach((cell) => {
    cell.textContent = "";
  });
}

function resetEverything() {
  scores = {
    X: 0,
    O: 0,
    draw: 0,
  };

  updateScoreBoard();
  resetBoard();
  gameActive = true;
}

function showPopup(message) {
  popupMessage.textContent = message;
  popup.style.display = "flex";
}

// Event Listeners
multiplayerBtn.addEventListener("click", () => setGameMode(false));
singleplayerBtn.addEventListener("click", () => setGameMode(true));
startGameBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", () => {
  resetBoard();
  gameActive = true;
});
resetBtn.addEventListener("click", resetEverything);

cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

newGameBtn.addEventListener("click", () => {
  popup.style.display = "none";
  resetBoard();
  gameActive = true;
});


// Default Mode
setGameMode(true);
updateScoreBoard();
