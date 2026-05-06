const PUZZLES = {
  easy: [
    "...#...",
    ".......",
    "#......",
    ".......",
    ".......",
    ".......",
    ".......",
  ],
  normal: [
    "....#...",
    "........",
    "........",
    "....#...",
    "........",
    "........",
    "....#...",
    "........",
  ],
  hard: [
    "...#.....",
    ".........",
    "#........",
    ".........",
    ".........",
    ".........",
    ".........",
    ".........",
    ".........",
  ],
};

const STORAGE_KEY = "akari-lanterns-records";
const boardEl = document.querySelector("#board");
const sceneEl = document.querySelector("#scene");
const litCountEl = document.querySelector("#lit-count");
const lampCountEl = document.querySelector("#lamp-count");
const errorCountEl = document.querySelector("#error-count");
const messageEl = document.querySelector("#message");
const canvas = document.querySelector("#spark-canvas");
const ctx = canvas.getContext("2d");
const dialog = document.querySelector("#result-dialog");
const resultCopy = document.querySelector("#result-copy");

let state;
let particles = [];

function parsePuzzle(id) {
  return PUZZLES[id].map((row) => row.split(""));
}

function createState(puzzle = "easy") {
  const grid = parsePuzzle(puzzle);
  return {
    puzzle,
    rows: grid.length,
    cols: grid[0].length,
    grid,
    lamps: new Set(),
    suggested: null,
    ended: false,
  };
}

function key(row, col) {
  return `${row},${col}`;
}

function fromKey(cellKey) {
  const [row, col] = cellKey.split(",").map(Number);
  return { row, col };
}

function isWall(row, col) {
  return state.grid[row][col] !== ".";
}

function isNumberWall(row, col) {
  return /^[0-4]$/.test(state.grid[row][col]);
}

function inBounds(row, col) {
  return row >= 0 && row < state.rows && col >= 0 && col < state.cols;
}

function litCells() {
  const lit = new Set();
  state.lamps.forEach((cellKey) => {
    const { row, col } = fromKey(cellKey);
    lit.add(cellKey);
    [
      { dr: -1, dc: 0 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 },
    ].forEach(({ dr, dc }) => {
      let nextRow = row + dr;
      let nextCol = col + dc;
      while (inBounds(nextRow, nextCol) && !isWall(nextRow, nextCol)) {
        lit.add(key(nextRow, nextCol));
        nextRow += dr;
        nextCol += dc;
      }
    });
  });
  return lit;
}

function lampConflicts() {
  const conflicts = new Set();
  state.lamps.forEach((cellKey) => {
    const { row, col } = fromKey(cellKey);
    [
      { dr: -1, dc: 0 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 },
    ].forEach(({ dr, dc }) => {
      let nextRow = row + dr;
      let nextCol = col + dc;
      while (inBounds(nextRow, nextCol) && !isWall(nextRow, nextCol)) {
        const nextKey = key(nextRow, nextCol);
        if (state.lamps.has(nextKey)) {
          conflicts.add(cellKey);
          conflicts.add(nextKey);
        }
        nextRow += dr;
        nextCol += dc;
      }
    });
  });
  return conflicts;
}

function adjacentLampCount(row, col) {
  return [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ].filter(([nextRow, nextCol]) => inBounds(nextRow, nextCol) && state.lamps.has(key(nextRow, nextCol))).length;
}

function numberedErrors() {
  const errors = new Set();
  for (let row = 0; row < state.rows; row += 1) {
    for (let col = 0; col < state.cols; col += 1) {
      if (!isNumberWall(row, col)) continue;
      const expected = Number(state.grid[row][col]);
      if (adjacentLampCount(row, col) > expected) errors.add(key(row, col));
    }
  }
  return errors;
}

function numberedSatisfiedErrors() {
  const errors = new Set();
  for (let row = 0; row < state.rows; row += 1) {
    for (let col = 0; col < state.cols; col += 1) {
      if (!isNumberWall(row, col)) continue;
      const expected = Number(state.grid[row][col]);
      if (adjacentLampCount(row, col) !== expected) errors.add(key(row, col));
    }
  }
  return errors;
}

function stats() {
  const lit = litCells();
  const conflicts = lampConflicts();
  const numberErrors = numberedErrors();
  let whiteCells = 0;
  let litWhite = 0;
  for (let row = 0; row < state.rows; row += 1) {
    for (let col = 0; col < state.cols; col += 1) {
      if (isWall(row, col)) continue;
      whiteCells += 1;
      if (lit.has(key(row, col))) litWhite += 1;
    }
  }
  return {
    lit,
    conflicts,
    numberErrors,
    whiteCells,
    litWhite,
    errors: conflicts.size + numberErrors.size,
  };
}

function isSolved() {
  const current = stats();
  return current.litWhite === current.whiteCells
    && current.conflicts.size === 0
    && numberedSatisfiedErrors().size === 0;
}

function updateHud() {
  const current = stats();
  litCountEl.textContent = `${String(current.litWhite).padStart(2, "0")}/${String(current.whiteCells).padStart(2, "0")}`;
  lampCountEl.textContent = String(state.lamps.size).padStart(3, "0");
  errorCountEl.textContent = String(current.errors).padStart(3, "0");
}

function renderBoard() {
  const current = stats();
  boardEl.innerHTML = "";
  boardEl.style.setProperty("--rows", state.rows);
  boardEl.style.setProperty("--cols", state.cols);
  for (let row = 0; row < state.rows; row += 1) {
    for (let col = 0; col < state.cols; col += 1) {
      const cell = document.createElement("button");
      const cellKey = key(row, col);
      cell.type = "button";
      cell.className = "cell-button";
      cell.dataset.row = row;
      cell.dataset.col = col;
      if (isWall(row, col)) {
        cell.classList.add("wall");
        cell.textContent = state.grid[row][col] === "#" ? "" : state.grid[row][col];
        cell.disabled = true;
      } else {
        cell.classList.toggle("lit", current.lit.has(cellKey));
        cell.classList.toggle("lamp", state.lamps.has(cellKey));
        cell.classList.toggle("suggested", state.suggested === cellKey);
      }
      cell.classList.toggle("error", current.conflicts.has(cellKey) || current.numberErrors.has(cellKey));
      boardEl.append(cell);
    }
  }
  updateBoardScale();
}

function toggleLamp(row, col) {
  if (state.ended || isWall(row, col)) return;
  const cellKey = key(row, col);
  state.suggested = null;
  if (state.lamps.has(cellKey)) {
    state.lamps.delete(cellKey);
  } else {
    state.lamps.add(cellKey);
    emitCellParticles(row, col, "#ffd45e", 10);
  }
  renderBoard();
  updateHud();
  if (isSolved()) {
    state.ended = true;
    saveRecord(state.puzzle, state.lamps.size);
    emitSceneParticles("#ffd45e", 100);
    resultCopy.textContent = `${state.lamps.size}個のランプで全て照らしました。`;
    if (typeof dialog.showModal === "function") dialog.showModal();
  } else {
    const current = stats();
    messageEl.textContent = current.errors ? "赤い場所の条件を直しましょう" : "白マスをすべて照らしましょう";
  }
}

function showHint() {
  const current = stats();
  for (let row = 0; row < state.rows; row += 1) {
    for (let col = 0; col < state.cols; col += 1) {
      const cellKey = key(row, col);
      if (!isWall(row, col) && !current.lit.has(cellKey)) {
        state.suggested = cellKey;
        renderBoard();
        messageEl.textContent = "光っていないマスの周辺を考えましょう";
        return;
      }
    }
  }
  messageEl.textContent = "数字条件とランプ同士の見通しを確認しましょう";
}

function saveRecord(puzzle, lamps) {
  try {
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    if (!records[puzzle] || lamps < records[puzzle]) {
      records[puzzle] = lamps;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
  } catch {
    // Ignore storage errors.
  }
}

function startGame(puzzle = state?.puzzle || "easy") {
  state = createState(puzzle);
  renderBoard();
  updateHud();
  messageEl.textContent = "白マスをすべて照らしましょう";
  document.querySelectorAll("[data-puzzle]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.puzzle === puzzle));
  });
}

boardEl.addEventListener("click", (event) => {
  const cell = event.target.closest(".cell-button");
  if (!cell || !boardEl.contains(cell)) return;
  toggleLamp(Number(cell.dataset.row), Number(cell.dataset.col));
});

document.querySelector("#new-game").addEventListener("click", () => startGame());
document.querySelector("#hint").addEventListener("click", showHint);
document.querySelectorAll("[data-puzzle]").forEach((button) => {
  button.addEventListener("click", () => startGame(button.dataset.puzzle));
});

dialog.addEventListener("close", () => {
  if (dialog.returnValue === "restart") startGame(state.puzzle);
});

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(rect.width * scale);
  canvas.height = Math.floor(rect.height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  updateBoardScale();
}

function updateBoardScale() {
  if (!state) return;
  const rect = sceneEl.getBoundingClientRect();
  const gap = rect.width < 560 ? 4 : 6;
  const pad = rect.width < 560 ? 8 : 10;
  const widthCell = (rect.width - 24 - pad * 2 - gap * (state.cols - 1)) / state.cols;
  const heightCell = (rect.height - 24 - pad * 2 - gap * (state.rows - 1)) / state.rows;
  const cellSize = Math.max(32, Math.floor(Math.min(widthCell, heightCell, 60)));
  boardEl.style.setProperty("--gap", `${gap}px`);
  boardEl.style.setProperty("--board-pad", `${pad}px`);
  boardEl.style.setProperty("--cell-size", `${cellSize}px`);
}

function cellCenter(row, col) {
  const boardRect = boardEl.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();
  const step = parseFloat(getComputedStyle(boardEl).getPropertyValue("--cell-size")) + parseFloat(getComputedStyle(boardEl).getPropertyValue("--gap"));
  const pad = parseFloat(getComputedStyle(boardEl).getPropertyValue("--board-pad"));
  return {
    x: boardRect.left - canvasRect.left + pad + col * step + step / 2,
    y: boardRect.top - canvasRect.top + pad + row * step + step / 2,
  };
}

function emitCellParticles(row, col, color, count) {
  const center = cellCenter(row, col);
  for (let i = 0; i < count; i += 1) {
    particles.push({
      x: center.x,
      y: center.y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 24 + Math.random() * 18,
      age: 0,
      size: 2 + Math.random() * 3,
      color,
    });
  }
}

function emitSceneParticles(color, count) {
  const rect = canvas.getBoundingClientRect();
  for (let i = 0; i < count; i += 1) {
    particles.push({
      x: rect.width * Math.random(),
      y: rect.height * Math.random(),
      vx: (Math.random() - 0.5) * 4,
      vy: -1 - Math.random() * 4,
      life: 45 + Math.random() * 35,
      age: 0,
      size: 2 + Math.random() * 4,
      color,
    });
  }
}

function animateParticles() {
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
  particles = particles.filter((particle) => particle.age < particle.life);
  particles.forEach((particle) => {
    particle.age += 1;
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.04;
    const alpha = Math.max(0, 1 - particle.age / particle.life);
    if (alpha <= 0) return;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  window.requestAnimationFrame(animateParticles);
}

window.addEventListener("resize", resizeCanvas);
startGame("easy");
resizeCanvas();
animateParticles();
