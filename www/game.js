
const board = document.getElementById("board");
const scoreText = document.getElementById("score");
const movesText = document.getElementById("moves");
const levelText = document.getElementById("level");
const restartButton = document.getElementById("restart");

const SIZE = 8;
const candies = ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠"];

let grid = [];
let score = 0;
let moves = 30;
let level = 1;
let selected = null;
let busy = false;

function randomCandy() {
  return candies[Math.floor(Math.random() * candies.length)];
}

function createBoard() {
  grid = [];

  for (let r = 0; r < SIZE; r++) {
    grid[r] = [];

    for (let c = 0; c < SIZE; c++) {
      let candy;

      do {
        candy = randomCandy();
      } while (
        (c >= 2 && grid[r][c - 1] === candy && grid[r][c - 2] === candy) ||
        (r >= 2 && grid[r - 1][c] === candy && grid[r - 2][c] === candy)
      );

      grid[r][c] = candy;
    }
  }

  drawBoard();
}

function drawBoard() {
  board.innerHTML = "";

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const button = document.createElement("button");

      button.className = "bubble";
      button.textContent = grid[r][c];
      button.dataset.row = r;
      button.dataset.col = c;

      if (selected && selected.r === r && selected.c === c) {
        button.classList.add("selected");
      }

      button.addEventListener("click", () => selectCandy(r, c));
      board.appendChild(button);
    }
  }

  scoreText.textContent = score;
  movesText.textContent = moves;
  levelText.textContent = level;
}

function selectCandy(r, c) {
  if (busy || moves <= 0) return;

  if (!selected) {
    selected = { r, c };
    drawBoard();
    return;
  }

  const first = selected;
  selected = null;

  const adjacent =
    Math.abs(first.r - r) + Math.abs(first.c - c) === 1;

  if (!adjacent) {
    selected = { r, c };
    drawBoard();
    return;
  }

  swapCandies(first.r, first.c, r, c);
}

async function swapCandies(r1, c1, r2, c2) {
  busy = true;

  const temp = grid[r1][c1];
  grid[r1][c1] = grid[r2][c2];
  grid[r2][c2] = temp;

  drawBoard();

  let matches = findMatches();

  if (matches.length === 0) {
    await wait(250);

    const back = grid[r1][c1];
    grid[r1][c1] = grid[r2][c2];
    grid[r2][c2] = back;

    drawBoard();
    busy = false;
    return;
  }

  moves--;
  await clearMatches();

  busy = false;
  checkGameOver();
}

function findMatches() {
  const found = new Set();

  // افقی میچ
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE - 2; c++) {
      const candy = grid[r][c];

      if (
        candy &&
        candy === grid[r][c + 1] &&
        candy === grid[r][c + 2]
      ) {
        let k = c;

        while (k < SIZE && grid[r][k] === candy) {
          found.add(`${r},${k}`);
          k++;
        }
      }
    }
  }

  // عمودی میچ
  for (let c = 0; c < SIZE; c++) {
    for (let r = 0; r < SIZE - 2; r++) {
      const candy = grid[r][c];

      if (
        candy &&
        candy === grid[r + 1][c] &&
        candy === grid[r + 2][c]
      ) {
        let k = r;

        while (k < SIZE && grid[k][c] === candy) {
          found.add(`${k},${c}`);
          k++;
        }
      }
    }
  }

  return [...found].map(item => item.split(",").map(Number));
}

async function clearMatches() {
  let matches = findMatches();

  while (matches.length > 0) {
    score += matches.length * 10;

    matches.forEach(([r, c]) => {
      grid[r][c] = null;
    });

    drawBoard();
    await wait(250);

    // اوپر سے نئی کینڈی نیچے لانا
    for (let c = 0; c < SIZE; c++) {
      let column = [];

      for (let r = 0; r < SIZE; r++) {
        if (grid[r][c] !== null) {
          column.push(grid[r][c]);
        }
      }

      while (column.length < SIZE) {
        column.unshift(randomCandy());
      }

      for (let r = 0; r < SIZE; r++) {
        grid[r][c] = column[r];
      }
    }

    drawBoard();
    await wait(250);

    matches = findMatches();
  }

  if (score >= level * 500) {
    level++;
    alert("🎉 Congratulations! Next Level!");
  }

  drawBoard();
}

function checkGameOver() {
  if (moves <= 0) {
    alert("Game Over! Your Score: " + score);
  }
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function restartGame() {
  score = 0;
  moves = 30;
  level = 1;
  selected = null;
  busy = false;
  createBoard();
}

restartButton.addEventListener("click", restartGame);

createBoard();
