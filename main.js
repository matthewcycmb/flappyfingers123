import { Bird } from './game/bird.js';
import { PipeManager } from './game/pipe.js';
import { checkCollision } from './game/collision.js';
import { ScoreManager } from './game/score.js';
import { AudioManager } from './audio.js';
import { HandTracker } from './hand-tracking.js';
import {
  drawMenuScreen,
  drawReadyScreen,
  drawGameOverScreen,
  drawScore,
  drawBackground,
  drawGround,
} from './ui/screens.js';
import { CameraPiP } from './ui/camera-pip.js';
import {
  initLeaderboard,
  submitScore,
  getTopScores,
  isOnline,
} from './leaderboard.js';

// ── Constants ──────────────────────────────────────────────
const GAME_WIDTH = 480;
const GAME_HEIGHT = 640;
const GROUND_HEIGHT = 60;
const BIRD_X = 120;
const BIRD_START_Y = GAME_HEIGHT * 0.45;
const SPEED_INCREASE_INTERVAL = 10;
const SPEED_INCREASE_FACTOR = 1.05;
const MIN_GAP = 120;
const GAP_DECREASE_AMOUNT = 2;

// ── State ──────────────────────────────────────────────────
let state = 'MENU'; // MENU | READY | PLAYING | GAME_OVER
let lastTimestamp = 0;
let groundOffset = 0;
let cameraReady = false;
let restartCooldown = 0;
let flashAlpha = 0;
let frameCount = 0;
let playerName = '';
let sharedLeaderboard = null;

// ── Canvas setup ───────────────────────────────────────────
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// ── Game objects ───────────────────────────────────────────
const bird = new Bird(BIRD_X, BIRD_START_Y);
const pipes = new PipeManager(GAME_WIDTH, GAME_HEIGHT, GROUND_HEIGHT);
const scoreManager = new ScoreManager();
const audio = new AudioManager();
const handTracker = new HandTracker();
const cameraPiP = new CameraPiP();

const videoEl = document.getElementById('webcamVideo');

// ── Name handling ──────────────────────────────────────────
const nameOverlay = document.getElementById('nameOverlay');
const nameInput = document.getElementById('nameInput');
const nameSubmitBtn = document.getElementById('nameSubmitBtn');

function loadPlayerName() {
  try {
    return localStorage.getItem('flappyFingers_playerName') || '';
  } catch {
    return '';
  }
}

function savePlayerName(name) {
  playerName = name;
  try {
    localStorage.setItem('flappyFingers_playerName', name);
  } catch {}
}

function showNameInput() {
  nameOverlay.classList.add('visible');
  nameInput.value = playerName;
  nameInput.focus();
}

function hideNameInput() {
  nameOverlay.classList.remove('visible');
}

function confirmName() {
  const name = nameInput.value.trim();
  if (!name) return;
  savePlayerName(name);
  hideNameInput();
  state = 'READY';
}

nameSubmitBtn.addEventListener('click', confirmName);
nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') confirmName();
  e.stopPropagation();
});
nameInput.addEventListener('keyup', (e) => e.stopPropagation());

playerName = loadPlayerName();

// ── Mute button ────────────────────────────────────────────
const muteBtn = document.getElementById('muteBtn');
muteBtn.addEventListener('click', () => {
  const muted = audio.toggleMute();
  muteBtn.textContent = muted ? 'Unmute' : 'Mute';
});

// ── Start button ───────────────────────────────────────────
const startBtn = document.getElementById('startBtn');
const loadingMsg = document.getElementById('loadingMsg');

// Init Firebase leaderboard in background
initLeaderboard();

startBtn.addEventListener('click', async () => {
  audio.init();
  audio.resume();
  audio.playSwoosh();
  startBtn.style.display = 'none';
  loadingMsg.style.display = 'block';
  loadingMsg.textContent = 'Loading hand tracking model...';

  try {
    await handTracker.init(videoEl);
    loadingMsg.textContent = 'Requesting camera access...';
    await handTracker.startCamera();
    cameraReady = true;
    loadingMsg.style.display = 'none';
  } catch (e) {
    console.error('Camera/tracking setup failed:', e);
    loadingMsg.textContent = 'Camera unavailable — use Space/Click to play!';
    loadingMsg.style.color = '#FFD54F';
    cameraReady = false;
    setTimeout(() => {
      loadingMsg.style.display = 'none';
    }, 3000);
  }

  // Show name input if no name saved, otherwise go to READY
  if (!playerName) {
    showNameInput();
  } else {
    state = 'READY';
  }
});

// ── Input handling ─────────────────────────────────────────
function handleFlap() {
  audio.init();
  audio.resume();

  if (state === 'READY') {
    startGame();
  } else if (state === 'PLAYING') {
    bird.flap();
    audio.playFlap();
    flashAlpha = 0.15;
  } else if (state === 'GAME_OVER' && restartCooldown <= 0) {
    resetGame();
  }
}

// Hand tracker pinch callback
handTracker.onPinch = () => {
  handleFlap();
};

// Keyboard
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    if (state === 'MENU') {
      startBtn.click();
    } else {
      handleFlap();
    }
  }
});

// Mouse / Touch
canvas.addEventListener('click', () => {
  if (state === 'MENU') {
    startBtn.click();
  } else {
    handleFlap();
  }
});

// ── Game lifecycle ─────────────────────────────────────────
function startGame() {
  state = 'PLAYING';
  bird.reset(BIRD_X, BIRD_START_Y);
  pipes.reset();
  pipes.gap = 150;
  scoreManager.reset();
  bird.flap();
  audio.playFlap();
  audio.playSwoosh();
  flashAlpha = 0.15;
}

function resetGame() {
  audio.playSwoosh();
  sharedLeaderboard = null;
  state = 'READY';
}

function gameOver() {
  state = 'GAME_OVER';
  audio.playHit();
  restartCooldown = 30; // frames before restart allowed
  flashAlpha = 0.5;
  scoreManager.addToLeaderboard(scoreManager.score, playerName);

  // Submit to shared leaderboard and fetch latest
  submitScore(playerName, scoreManager.score);
  getTopScores(10).then((scores) => {
    if (scores) sharedLeaderboard = scores;
  });
}

// ── Resize handling ────────────────────────────────────────
function resizeCanvas() {
  const container = document.getElementById('gameContainer');
  const maxW = window.innerWidth;
  const maxH = window.innerHeight;
  const ratio = GAME_WIDTH / GAME_HEIGHT;

  let w, h;
  if (maxW / maxH > ratio) {
    h = maxH;
    w = h * ratio;
  } else {
    w = maxW;
    h = w / ratio;
  }

  container.style.width = w + 'px';
  container.style.height = h + 'px';
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ── Main game loop ─────────────────────────────────────────
function gameLoop(timestamp) {
  requestAnimationFrame(gameLoop);

  if (!lastTimestamp) {
    lastTimestamp = timestamp;
    return;
  }

  const rawDt = (timestamp - lastTimestamp) / (1000 / 60);
  const dt = Math.min(rawDt, 1.5); // tight cap so frame drops slow the game instead of dropping the bird
  lastTimestamp = timestamp;

  // Run hand detection every 3rd frame to avoid blocking the game loop
  frameCount++;
  if (cameraReady && frameCount % 3 === 0) {
    handTracker.detect(timestamp);
  }

  // ── Update ─────────────────────────────────────────────
  if (state === 'PLAYING') {
    bird.update(dt);
    pipes.update(dt);
    groundOffset = (groundOffset + pipes.speed * dt) % 24;

    // Score check
    for (const pipe of pipes.pipes) {
      if (!pipe.passed && pipe.x + pipes.pipeWidth < bird.x) {
        pipe.passed = true;
        scoreManager.increment();
        audio.playScore();

        // Difficulty scaling
        if (
          scoreManager.score % SPEED_INCREASE_INTERVAL === 0 &&
          scoreManager.score > 0
        ) {
          pipes.increaseSpeed(SPEED_INCREASE_FACTOR);
          if (pipes.gap > MIN_GAP) {
            pipes.gap = Math.max(MIN_GAP, pipes.gap - GAP_DECREASE_AMOUNT);
          }
        }
      }
    }

    // Collision
    const result = checkCollision(bird, pipes, GAME_HEIGHT, GROUND_HEIGHT);
    if (result.collided) {
      // Clamp bird to ground if ground collision
      if (result.type === 'ground') {
        bird.y = GAME_HEIGHT - GROUND_HEIGHT - bird.height / 2;
        bird.velocity = 0;
      }
      gameOver();
    }
  } else if (state === 'READY') {
    // Idle bobbing
    bird.y = BIRD_START_Y + Math.sin(Date.now() * 0.003) * 8;
    bird.rotation = 0;
    bird.wingAngle = Math.sin(Date.now() * 0.006) * 10;
    groundOffset = (groundOffset + 1 * dt) % 24;
  } else if (state === 'GAME_OVER') {
    if (restartCooldown > 0) restartCooldown -= dt;
    // Bird falls to ground
    if (bird.y < GAME_HEIGHT - GROUND_HEIGHT - bird.height / 2) {
      bird.velocity += bird.gravity * dt;
      bird.y += bird.velocity * dt;
      bird.rotation = Math.min(bird.rotation + 0.05 * dt, Math.PI / 2);
      if (bird.y >= GAME_HEIGHT - GROUND_HEIGHT - bird.height / 2) {
        bird.y = GAME_HEIGHT - GROUND_HEIGHT - bird.height / 2;
        bird.velocity = 0;
      }
    }
  }

  // Flash decay
  if (flashAlpha > 0) {
    flashAlpha -= 0.02 * dt;
    if (flashAlpha < 0) flashAlpha = 0;
  }

  // ── Render ─────────────────────────────────────────────
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  if (state === 'MENU') {
    drawMenuScreen(ctx, GAME_WIDTH, GAME_HEIGHT);
    drawGround(ctx, GAME_WIDTH, GAME_HEIGHT, GROUND_HEIGHT, 0);
    return;
  }

  // Background
  drawBackground(ctx, GAME_WIDTH, GAME_HEIGHT);

  // Pipes
  if (state === 'PLAYING' || state === 'GAME_OVER') {
    pipes.draw(ctx);
  }

  // Ground
  drawGround(ctx, GAME_WIDTH, GAME_HEIGHT, GROUND_HEIGHT, groundOffset);

  // Bird
  bird.draw(ctx);

  // Flash effect
  if (flashAlpha > 0) {
    ctx.fillStyle = `rgba(255,255,255,${flashAlpha})`;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  }

  // UI overlays
  if (state === 'READY') {
    drawReadyScreen(
      ctx,
      GAME_WIDTH,
      GAME_HEIGHT,
      handTracker.landmarks !== null
    );
  } else if (state === 'PLAYING') {
    drawScore(ctx, GAME_WIDTH, scoreManager.score);
  } else if (state === 'GAME_OVER') {
    drawGameOverScreen(
      ctx,
      GAME_WIDTH,
      GAME_HEIGHT,
      scoreManager.score,
      scoreManager.highScore,
      scoreManager.isNewHighScore,
      sharedLeaderboard || scoreManager.getLeaderboard(),
      playerName
    );
  }

  // Camera PiP
  if (cameraReady && state !== 'MENU') {
    cameraPiP.draw(ctx, GAME_WIDTH, GAME_HEIGHT, videoEl, handTracker);
  }
}

// ── Kick off ───────────────────────────────────────────────
requestAnimationFrame(gameLoop);
