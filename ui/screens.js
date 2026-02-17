export function drawMenuScreen(ctx, W, H) {
  // Sky background
  drawBackground(ctx, W, H);

  // Darken overlay
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(0, 0, W, H);

  // Title
  ctx.save();
  ctx.textAlign = 'center';

  // Title shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.font = 'bold 52px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Flappy', W / 2 + 2, H * 0.22 + 2);
  ctx.font = 'bold 56px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Fingers', W / 2 + 2, H * 0.30 + 2);

  // Title text
  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 52px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Flappy', W / 2, H * 0.22);
  ctx.strokeStyle = '#D35400';
  ctx.lineWidth = 3;
  ctx.strokeText('Flappy', W / 2, H * 0.22);

  ctx.fillStyle = '#F7DC6F';
  ctx.font = 'bold 56px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Fingers', W / 2, H * 0.30);
  ctx.strokeStyle = '#D4AC0D';
  ctx.lineWidth = 3;
  ctx.strokeText('Fingers', W / 2, H * 0.30);

  // Subtitle
  ctx.font = '20px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#FFF';
  ctx.fillText('Pinch to flap!', W / 2, H * 0.37);

  // Instructions
  ctx.font = '15px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('Touch your thumb and index finger', W / 2, H * 0.52);
  ctx.fillText('together to make the bird jump', W / 2, H * 0.56);
  ctx.fillText('', W / 2, H * 0.62);
  ctx.fillText('Spacebar or Click also work!', W / 2, H * 0.62);

  // Privacy notice
  ctx.font = '11px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fillText(
    'Camera feed is processed entirely on your device.',
    W / 2,
    H - 80
  );
  ctx.fillText('No video is recorded or transmitted.', W / 2, H - 65);

  ctx.restore();
}

export function drawReadyScreen(ctx, W, H, handDetected) {
  ctx.save();
  ctx.textAlign = 'center';

  // Pulsing text
  const alpha = 0.6 + Math.sin(Date.now() * 0.004) * 0.4;

  if (handDetected) {
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Pinch to begin!', W / 2, H * 0.25);

    ctx.font = '16px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText('or press Space / Click', W / 2, H * 0.31);
  } else {
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Show your hand to the camera', W / 2, H * 0.25);
    ctx.font = '16px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText('or press Space / Click to start', W / 2, H * 0.31);
  }

  ctx.restore();
}

export function drawGameOverScreen(ctx, W, H, score, highScore, isNewHigh) {
  // Dark overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.textAlign = 'center';

  // Score panel background
  const panelW = 260;
  const panelH = 240;
  const px = (W - panelW) / 2;
  const py = H * 0.25;

  // Panel shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  roundRect(ctx, px + 4, py + 4, panelW, panelH, 16);
  ctx.fill();

  // Panel
  ctx.fillStyle = '#DEB887';
  roundRect(ctx, px, py, panelW, panelH, 16);
  ctx.fill();
  ctx.strokeStyle = '#8B6914';
  ctx.lineWidth = 3;
  roundRect(ctx, px, py, panelW, panelH, 16);
  ctx.stroke();

  // Inner border
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 2;
  roundRect(ctx, px + 6, py + 6, panelW - 12, panelH - 12, 12);
  ctx.stroke();

  // Game Over text
  ctx.fillStyle = '#C0392B';
  ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Game Over', W / 2, py + 48);

  // Score
  ctx.fillStyle = '#333';
  ctx.font = '18px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Score', W / 2, py + 85);
  ctx.font = 'bold 42px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#2C3E50';
  ctx.fillText(score.toString(), W / 2, py + 130);

  // High score
  ctx.font = '16px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#666';
  ctx.fillText(`Best: ${highScore}`, W / 2, py + 160);

  // New high score badge
  if (isNewHigh) {
    ctx.fillStyle = '#E74C3C';
    ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
    ctx.fillText('New High Score!', W / 2, py + 190);
  }

  // Play again
  ctx.font = '16px "Segoe UI", Arial, sans-serif';
  const restartAlpha = 0.5 + Math.sin(Date.now() * 0.004) * 0.5;
  ctx.fillStyle = `rgba(255,255,255,${restartAlpha})`;
  ctx.fillText('Pinch / Click / Space to retry', W / 2, py + panelH + 40);

  ctx.restore();
}

export function drawScore(ctx, W, score) {
  ctx.save();
  ctx.textAlign = 'center';

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.font = 'bold 48px "Segoe UI", Arial, sans-serif';
  ctx.fillText(score.toString(), W / 2 + 2, 62);

  // Score
  ctx.fillStyle = '#FFF';
  ctx.fillText(score.toString(), W / 2, 60);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2.5;
  ctx.strokeText(score.toString(), W / 2, 60);

  ctx.restore();
}

export function drawBackground(ctx, W, H) {
  // Sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
  skyGrad.addColorStop(0, '#4FC3F7');
  skyGrad.addColorStop(0.6, '#81D4FA');
  skyGrad.addColorStop(1, '#B3E5FC');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H);

  // Clouds
  drawCloud(ctx, W * 0.15, H * 0.12, 0.8);
  drawCloud(ctx, W * 0.55, H * 0.08, 1.1);
  drawCloud(ctx, W * 0.8, H * 0.2, 0.6);
  drawCloud(ctx, W * 0.35, H * 0.28, 0.5);
}

export function drawGround(ctx, W, H, groundHeight, offset) {
  const groundY = H - groundHeight;

  // Dirt
  const dirtGrad = ctx.createLinearGradient(0, groundY, 0, H);
  dirtGrad.addColorStop(0, '#8B6914');
  dirtGrad.addColorStop(0.15, '#A0722A');
  dirtGrad.addColorStop(1, '#7A5C12');
  ctx.fillStyle = dirtGrad;
  ctx.fillRect(0, groundY, W, groundHeight);

  // Grass
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(0, groundY, W, 12);

  // Grass highlight
  ctx.fillStyle = '#66BB6A';
  ctx.fillRect(0, groundY, W, 5);

  // Grass tufts
  ctx.fillStyle = '#388E3C';
  const turfSpacing = 24;
  for (let x = -(offset % turfSpacing); x < W; x += turfSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.lineTo(x + 6, groundY - 6);
    ctx.lineTo(x + 12, groundY);
    ctx.fill();
  }

  // Top border line
  ctx.strokeStyle = '#2E7D32';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(W, groundY);
  ctx.stroke();
}

function drawCloud(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.beginPath();
  ctx.arc(0, 0, 25, 0, Math.PI * 2);
  ctx.arc(25, -5, 20, 0, Math.PI * 2);
  ctx.arc(50, 0, 25, 0, Math.PI * 2);
  ctx.arc(15, -18, 18, 0, Math.PI * 2);
  ctx.arc(35, -15, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
