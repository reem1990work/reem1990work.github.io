(() => {
  'use strict';

  const GRID_SIZE = 22;
  const START_SPEED = 145;
  const MIN_SPEED = 72;
  const SCORE_PER_FOOD = 10;
  const HIGH_SCORE_KEY = 'neon-snake-high-score';

  const canvas = document.querySelector('#game-board');
  const ctx = canvas.getContext('2d');
  const actionButton = document.querySelector('#action-button');
  const overlay = document.querySelector('#status-overlay');
  const overlayButton = document.querySelector('#overlay-button');
  const statusTitle = document.querySelector('#status-title');
  const statusMessage = document.querySelector('#status-message');
  const scoreEl = document.querySelector('#score');
  const highScoreEl = document.querySelector('#high-score');
  const gameStatus = document.querySelector('#game-status');

  const directions = {
    up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 }
  };
  const keyDirections = { ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right' };

  let snake, food, direction, queuedDirection, score, highScore, state = 'ready', turnQueued = false;
  let lastFrame = 0, elapsed = 0, boardSize = 0;

  function loadHighScore() {
    try { return Number.parseInt(localStorage.getItem(HIGH_SCORE_KEY), 10) || 0; } catch { return 0; }
  }

  function saveHighScore() {
    try { localStorage.setItem(HIGH_SCORE_KEY, String(highScore)); } catch { /* Game remains playable if storage is blocked. */ }
  }

  function resetGame() {
    snake = [{ x: 11, y: 11 }, { x: 10, y: 11 }, { x: 9, y: 11 }, { x: 8, y: 11 }];
    direction = directions.right;
    queuedDirection = direction;
    turnQueued = false;
    score = 0;
    elapsed = 0;
    food = createFood();
    updateScore();
  }

  function createFood() {
    const openCells = [];
    for (let y = 0; y < GRID_SIZE; y += 1) {
      for (let x = 0; x < GRID_SIZE; x += 1) {
        if (!snake.some(segment => segment.x === x && segment.y === y)) openCells.push({ x, y });
      }
    }
    return openCells[Math.floor(Math.random() * openCells.length)];
  }

  function speed() { return Math.max(MIN_SPEED, START_SPEED - Math.floor(score / SCORE_PER_FOOD) * 6); }

  function updateScore() {
    scoreEl.textContent = String(score).padStart(3, '0');
    highScoreEl.textContent = String(highScore).padStart(3, '0');
  }

  function showOverlay(title, message, buttonText, kicker) {
    statusTitle.textContent = title;
    statusMessage.textContent = message;
    overlayButton.textContent = buttonText;
    overlay.querySelector('.status-kicker').textContent = kicker;
    overlay.classList.remove('hidden');
  }

  function startGame() {
    resetGame();
    state = 'playing';
    actionButton.textContent = 'Restart';
    gameStatus.textContent = 'Running';
    overlay.classList.add('hidden');
  }

  function togglePause() {
    if (state === 'ready' || state === 'over') return;
    if (state === 'playing') {
      state = 'paused';
      gameStatus.textContent = 'Paused';
      showOverlay('Paused', 'Take a breath. The board is waiting.', 'Resume', 'GAME PAUSED');
    } else {
      state = 'playing';
      elapsed = 0;
      gameStatus.textContent = 'Running';
      overlay.classList.add('hidden');
    }
  }

  function requestDirection(name) {
    const next = directions[name];
    if (!next || state !== 'playing' || turnQueued) return;
    // One turn per tile keeps rapid key presses from becoming an instant reversal.
    if (next.x === -queuedDirection.x && next.y === -queuedDirection.y) return;
    queuedDirection = next;
    turnQueued = true;
  }

  function step() {
    direction = queuedDirection;
    turnQueued = false;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    const ateFood = head.x === food.x && head.y === food.y;
    // The tail moves away on a normal turn, so it is safe to enter its current cell.
    const collisionBody = ateFood ? snake : snake.slice(0, -1);
    const hitWall = head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE;
    const hitSnake = collisionBody.some(segment => segment.x === head.x && segment.y === head.y);
    if (hitWall || hitSnake) { endGame(); return; }

    snake.unshift(head);
    if (ateFood) {
      score += SCORE_PER_FOOD;
      if (score > highScore) { highScore = score; saveHighScore(); }
      food = createFood();
      updateScore();
      if (!food) {
        state = 'over';
        gameStatus.textContent = 'Board cleared';
        showOverlay('You win!', `Perfect run — final score: ${score}.`, 'Play again', 'GRID CLEARED');
      }
    } else snake.pop();
  }

  function endGame() {
    state = 'over';
    gameStatus.textContent = 'Game over';
    actionButton.textContent = 'Restart';
    showOverlay('Game over', `Final score: ${score}. Can you top ${highScore}?`, 'Play again', 'SYSTEM FAILURE');
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    boardSize = Math.round(rect.width);
    canvas.width = Math.round(boardSize * ratio);
    canvas.height = Math.round(boardSize * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  }

  function roundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();
  }

  function draw() {
    if (!boardSize || !snake) return;
    const cell = boardSize / GRID_SIZE;
    ctx.clearRect(0, 0, boardSize, boardSize);
    ctx.fillStyle = '#070d18';
    ctx.fillRect(0, 0, boardSize, boardSize);
    ctx.strokeStyle = 'rgba(132, 186, 209, 0.085)';
    ctx.lineWidth = 1;
    for (let i = 1; i < GRID_SIZE; i += 1) {
      const position = Math.round(i * cell) + 0.5;
      ctx.beginPath(); ctx.moveTo(position, 0); ctx.lineTo(position, boardSize); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, position); ctx.lineTo(boardSize, position); ctx.stroke();
    }
    const padding = Math.max(2, cell * 0.1);
    snake.slice().reverse().forEach((segment, reverseIndex) => {
      const isHead = reverseIndex === snake.length - 1;
      ctx.fillStyle = isHead ? '#a5ff68' : '#53e5ff';
      ctx.shadowColor = isHead ? 'rgba(165,255,104,.65)' : 'rgba(83,229,255,.32)';
      ctx.shadowBlur = isHead ? cell * 0.65 : cell * 0.35;
      roundedRect(segment.x * cell + padding, segment.y * cell + padding, cell - padding * 2, cell - padding * 2, cell * 0.23);
      ctx.shadowBlur = 0;
    });
    const head = snake[0];
    const centerX = (head.x + 0.5) * cell, centerY = (head.y + 0.5) * cell;
    const eyeOffset = cell * 0.18, eyeShift = cell * 0.13;
    ctx.fillStyle = '#071006';
    if (direction.x !== 0) {
      ctx.beginPath(); ctx.arc(centerX + direction.x * eyeShift, centerY - eyeOffset, cell * 0.06, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(centerX + direction.x * eyeShift, centerY + eyeOffset, cell * 0.06, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.beginPath(); ctx.arc(centerX - eyeOffset, centerY + direction.y * eyeShift, cell * 0.06, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(centerX + eyeOffset, centerY + direction.y * eyeShift, cell * 0.06, 0, Math.PI * 2); ctx.fill();
    }
    if (food) {
      ctx.fillStyle = '#ff5d94'; ctx.shadowColor = 'rgba(255,93,148,.75)'; ctx.shadowBlur = cell * 0.8;
      ctx.beginPath(); ctx.arc((food.x + 0.5) * cell, (food.y + 0.5) * cell, cell * 0.28, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffe1ec'; ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.arc((food.x + 0.42) * cell, (food.y + 0.41) * cell, cell * 0.07, 0, Math.PI * 2); ctx.fill();
    }
  }

  function loop(timestamp) {
    const delta = Math.min(timestamp - lastFrame, 100);
    lastFrame = timestamp;
    if (state === 'playing') {
      elapsed += delta;
      while (elapsed >= speed() && state === 'playing') { elapsed -= speed(); step(); }
    }
    draw();
    requestAnimationFrame(loop);
  }

  document.addEventListener('keydown', event => {
    const name = keyDirections[event.code];
    if (name) { event.preventDefault(); requestDirection(name); }
    if (event.code === 'Space') { event.preventDefault(); togglePause(); }
  });
  document.querySelectorAll('[data-direction]').forEach(button => button.addEventListener('click', () => requestDirection(button.dataset.direction)));
  actionButton.addEventListener('click', startGame);
  overlayButton.addEventListener('click', () => state === 'paused' ? togglePause() : startGame());
  window.addEventListener('resize', resizeCanvas);

  highScore = loadHighScore();
  resetGame();
  resizeCanvas();
  requestAnimationFrame(loop);
})();
