let board = document.querySelector(".board");
const gridSize = 3;

function makeGrid() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = `${i},${j}`;
      board.appendChild(cell);
    }
  }
}

makeGrid();

let xScore = document.getElementById("XScore");
let oScore = document.getElementById("OScore");
let gameStatus = document.getElementById("gameStatus");

///////////// Game Logic //////////////
let gameState = {
  board: [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
  gameType: "1p",
  currentPlayer: "x",
  isPlaying: false,
  playerX: "Player X",
  playerO: "Player O",
  playerXScore: 0,
  playerOScore: 0,
};

board.addEventListener("click", function (event) {
  // Figure out how to get the coordinates off event object (e.target.value)
  let coords = event.target.id;

  // Use those coordinates to reference indexes in our gameState.board
  let i = Number(coords[0]);
  let j = Number(coords[2]);

  // Set the position in our board to the current player
  if (gameState.isPlaying && gameState.board[i][j] === null) {
    gameState.board[i][j] = gameState.currentPlayer;
    renderGame(i, j);
    console.log("Win State: ", checkWin(i, j));
    if (checkWin(i, j)) {
      playerWins();
    } else if (boardIsFull()) {
      gameStatus.innerText = "No more moves! Reset to play again.";
    } else {
      switchPlayer();
    }
  }

  if (
    gameState.isPlaying &&
    gameState.gameType === "1p" &&
    gameState.currentPlayer === "o"
  ) {
    npcTurn();
  }
});

function renderGame(row, col) {
  let cell = document.getElementById(`${row},${col}`);
  cell.innerText = gameState.currentPlayer;
}

function switchPlayer() {
  if (gameState.currentPlayer === "x") {
    gameState.currentPlayer = "o";
  } else {
    gameState.currentPlayer = "x";
  }
}

function checkRow(row) {
  for (let i = 0; i < gameState.board.length; i++) {
    if (
      gameState.board[row][i] === null ||
      gameState.board[row][i] !== gameState.currentPlayer
    ) {
      return false;
    }
  }
  return true;
}

function checkColumn(col) {
  for (let i = 0; i < gameState.board.length; i++) {
    if (
      gameState.board[i][col] === null ||
      gameState.board[i][col] !== gameState.currentPlayer
    ) {
      return false;
    }
  }
  return true;
}

function checkDiagonals() {
  let leftdiag = true;
  let rightdiag = true;
  j = 2;

  for (let i = 0; i < 3; i++) {
    if (
      gameState.board[i][i] === null ||
      gameState.board[i][i] !== gameState.currentPlayer
    ) {
      leftdiag = false;
      break;
    }
  }

  for (let i = 0; i < 3; i++) {
    if (
      gameState.board[i][j] === null ||
      gameState.board[i][j] !== gameState.currentPlayer
    ) {
      rightdiag = false;
      break;
    }
    j--;
  }

  return leftdiag || rightdiag;
}

function checkWin(row, col) {
  return checkRow(row) || checkColumn(col) || checkDiagonals();
}

function boardIsFull() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (gameState.board[i][j] === null) {
        return false;
      }
    }
  }
  return true;
}

function playerWins() {
  let winningPlayer = gameState.currentPlayer;
  gameState.isPlaying = false;
  if (winningPlayer === "x") {
    gameState.playerXScore += 1;
    xScore.innerText = `${gameState.playerX} Score: ${gameState.playerXScore}`;
    gameStatus.innerText = `${gameState.playerX} wins! Reset to play again.`;
  } else if (winningPlayer === "o") {
    gameState.playerOScore += 1;
    oScore.innerText = `${gameState.playerO} Score: ${gameState.playerOScore}`;
    gameStatus.innerText = `${gameState.playerO} Wins! Reset to play again.`;
  }
}

/////// Reset Button Logic ////////

let resetButton = document.querySelector(".reset");
resetButton.addEventListener("click", function (e) {
  resetGame();
});

function startGame() {
  xScore.innerText = `${gameState.playerX} Score: ${gameState.playerXScore}`;
  oScore.innerText = `${gameState.playerO} Score: ${gameState.playerOScore}`;
  gameState.isPlaying = true;
  gameStatus.innerText = `Game in progress. Good luck! ${gameState.playerX} first.`;
}

function resetGame() {
  let cell;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      gameState.board[i][j] = null;
      cell = document.getElementById(`${i},${j}`);
      cell.innerText = "";
    }
  }
  gameState.currentPlayer = "x";
  gameState.isPlaying = true;
  gameStatus.innerText = `Game in progress. Good luck! ${gameState.playerX} first.`;
}

///////// Player Button Logic //////////
let player1Button = document.querySelector(".player1");
let player2Button = document.querySelector(".player2");
let footer = document.querySelector("footer");
let startButton = document.createElement("button");
startButton.classList.add("startButton");
startButton.innerText = "Start Game";
let nameXInput = document.createElement("input");
let nameOInput = document.createElement("input");

player1Button.addEventListener("click", function (e) {
  nameXInput.classList.add("p1NameInput");
  nameXInput.placeholder = "Enter Player 1's Name";
  footer.appendChild(nameXInput);
  footer.appendChild(startButton);
  player1Button.disabled = true;
  player2Button.disabled = true;
  gameState.gameType = "1p";
});

player2Button.addEventListener("click", function (e) {
  nameXInput.classList.add("p1NameInput");
  nameXInput.placeholder = "Enter Player 1's Name";
  nameOInput.classList.add("p2NameInput");
  nameOInput.placeholder = "Enter Player 2's Name";

  footer.appendChild(nameXInput);
  footer.appendChild(nameOInput);
  footer.appendChild(startButton);
  player2Button.disabled = true;
  player1Button.disabled = true;
  gameState.gameType = "2p";
});

startButton.addEventListener("click", function (e) {
  if (nameXInput.value === "") {
    gameState.playerX = "Player X";
  } else {
    gameState.playerX = nameXInput.value;
  }

  if (gameState.gameType === "1p") {
    gameState.playerO = "Computer";
  } else if (nameOInput.value === "") {
    gameState.playerO = "Player O";
  } else {
    gameState.playerO = nameOInput.value;
  }
  startButton.disabled = true;
  startGame();
});

//////// reset players button////////
let resetPlayersButton = document.querySelector(".resetPlayers");
resetPlayersButton.addEventListener("click", function (e) {
  let footerArray = Array.from(footer.childNodes);
  if (footerArray.includes(nameXInput)) {
    footer.removeChild(nameXInput);
  }
  if (footerArray.includes(nameOInput)) {
    footer.removeChild(nameOInput);
  }
  if (footerArray.includes(startButton)) {
    footer.removeChild(startButton);
  }

  resetGame();
  gameState.playerX = "Player X";
  gameState.playerO = "Player O";

  xScore.innerText = `${gameState.playerX} Score: ${gameState.playerXScore}`;
  oScore.innerText = `${gameState.playerO} Score: ${gameState.playerOScore}`;

  gameStatus.innerText = "Choose One Player or Two.";

  player2Button.disabled = false;
  player1Button.disabled = false;
  startButton.disabled = false;
  gameState.playerXScore = 0;
  gameState.playerOScore = 0;

  gameState.isPlaying = false;
});

/////// NPC Stuff /////////
function npcTurn() {
  let row;
  let col;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (gameState.isPlaying && gameState.board[i][j] === null) {
        gameState.board[i][j] = gameState.currentPlayer;
        renderGame(i, j);
        row = i;
        col = j;
        break;
      }
    }
    if (row > 2) {
      i = 0;
    }
    if (col > 2) {
      col = 0;
    }
    if (gameState.board[row][col] === "o") {
      break;
    }
  }
  if (checkWin(row, col)) {
    playerWins();
  } else if (boardIsFull()) {
    gameStatus.innerText = "No more moves! Reset to play again.";
  } else {
    switchPlayer();
  }
}
