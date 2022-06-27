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
  currentPlayer: "x",
  isPlaying: true,
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
    xScore.innerText = `Player X Score: ${gameState.playerXScore}`;
    gameStatus.innerText = "Player X Wins! Reset to play again.";
  } else if (winningPlayer === "o") {
    gameState.playerOScore += 1;
    oScore.innerText = `Player O Score: ${gameState.playerOScore}`;
    gameStatus.innerText = "Player O Wins! Reset to play again.";
  }
}

/////// Reset Button Logic ////////

let resetButton = document.querySelector(".reset");
resetButton.addEventListener("click", function (e) {
  resetGame();
});

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
  gameStatus.innerText = "Game in progress. Good luck! X Plays first.";
}
