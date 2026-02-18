export function drawMenuScreen(ctx, W, H) {
  // Sky background
  drawBackground(ctx, W, H);

  // Darken overlay
  const overlayGrad = ctx.createLinearGradient(0, 0, 0, H);
  overlayGrad.addColorStop(0, 'rgba(0,0,0,0.05)');
  overlayGrad.addColorStop(0.5, 'rgba(0,0,0,0.12)');
  overlayGrad.addColorStop(1, 'rgba(0,0,0,0.25)');
  ctx.fillStyle = overlayGrad;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.textAlign = 'center';

  // Animated bird on menu
  const birdY = H * 0.42 + Math.sin(Date.now() * 0.003) * 10;
  const wingAngle = Math.sin(Date.now() * 0.008) * 15;
  drawMenuBird(ctx, W / 2, birdY, wingAngle);

  // Title with bounce
  const titleBounce = Math.sin(Date.now() * 0.002) * 3;

  // "Flappy" shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.font = 'bold 54px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Flappy', W / 2 + 2, H * 0.15 + 3 + titleBounce);

  // "Flappy" text
  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 54px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Flappy', W / 2, H * 0.15 + titleBounce);
  ctx.strokeStyle = '#D35400';
  ctx.lineWidth = 3;
  ctx.strokeText('Flappy', W / 2, H * 0.15 + titleBounce);

  // "Fingers" shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.font = 'bold 58px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Fingers', W / 2 + 2, H * 0.23 + 3 + titleBounce);

  // "Fingers" text
  ctx.fillStyle = '#F7DC6F';
  ctx.font = 'bold 58px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Fingers', W / 2, H * 0.23 + titleBounce);
  ctx.strokeStyle = '#D4AC0D';
  ctx.lineWidth = 3;
  ctx.strokeText('Fingers', W / 2, H * 0.23 + titleBounce);

  // Hand icon
  const handAlpha = 0.6 + Math.sin(Date.now() * 0.004) * 0.3;
  ctx.font = '40px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = `rgba(255,255,255,${handAlpha})`;
  ctx.fillText('\u{1F90C}', W / 2, H * 0.33);

  // Subtitle
  ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#FFF';
  ctx.fillText('Pinch to flap!', W / 2, H * 0.58);

  // Instructions panel
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  roundRect(ctx, W / 2 - 140, H * 0.62, 280, 80, 12);
  ctx.fill();

  ctx.font = '14px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText('Touch your thumb & index finger', W / 2, H * 0.67);
  ctx.fillText('together to make the bird jump', W / 2, H * 0.71);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '13px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Spacebar or Click also work!', W / 2, H * 0.76);

  // Privacy notice
  ctx.font = '10px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillText('Camera processed on-device. No video transmitted.', W / 2, H - 70);

  ctx.restore();
}

function drawMenuBird(ctx, x, y, wingAngle) {
  ctx.save();
  ctx.translate(x, y);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath();
  ctx.ellipse(3, 5, 28, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = '#F7DC6F';
  ctx.beginPath();
  ctx.ellipse(0, 0, 28, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#D4AC0D';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Belly
  ctx.fillStyle = '#FCF3CF';
  ctx.beginPath();
  ctx.ellipse(3, 4, 18, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wing
  ctx.save();
  ctx.translate(-3, 3);
  ctx.rotate((wingAngle * Math.PI) / 180);
  ctx.fillStyle = '#F0C230';
  ctx.beginPath();
  ctx.ellipse(0, 6, 14, 9, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#D4AC0D';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Eye
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(12, -7, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Pupil
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(14, -7, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Shine
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(16, -9, 2, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = '#E74C3C';
  ctx.beginPath();
  ctx.moveTo(20, -2);
  ctx.lineTo(36, 3);
  ctx.lineTo(20, 8);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#C0392B';
  ctx.lineWidth = 1.5;
  ctx.stroke();

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

export function drawGameOverScreen(ctx, W, H, score, highScore, isNewHigh, leaderboard, playerName) {
  // Dark overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.textAlign = 'center';

  // Score panel
  const panelW = 260;
  const panelH = 180;
  const px = (W - panelW) / 2;
  const py = H * 0.08;

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

  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 2;
  roundRect(ctx, px + 6, py + 6, panelW - 12, panelH - 12, 12);
  ctx.stroke();

  // Game Over text
  ctx.fillStyle = '#C0392B';
  ctx.font = 'bold 32px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Game Over', W / 2, py + 40);

  // Score
  ctx.fillStyle = '#333';
  ctx.font = '16px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Score', W / 2 - 50, py + 75);
  ctx.fillText('Best', W / 2 + 50, py + 75);
  ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#2C3E50';
  ctx.fillText(score.toString(), W / 2 - 50, py + 115);
  ctx.fillStyle = '#666';
  ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
  ctx.fillText(highScore.toString(), W / 2 + 50, py + 112);

  if (isNewHigh) {
    ctx.fillStyle = '#E74C3C';
    ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
    ctx.fillText('New High Score!', W / 2, py + 145);
  }

  // Leaderboard panel
  if (leaderboard && leaderboard.length > 0) {
    const lbTop = py + panelH + 14;
    const rowH = 24;
    const shown = leaderboard.slice(0, 5);
    const lbH = 36 + shown.length * rowH + 10;
    const lbW = 260;
    const lx = (W - lbW) / 2;

    // Panel shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    roundRect(ctx, lx + 3, lbTop + 3, lbW, lbH, 12);
    ctx.fill();

    // Panel bg
    ctx.fillStyle = 'rgba(44, 62, 80, 0.85)';
    roundRect(ctx, lx, lbTop, lbW, lbH, 12);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, lx, lbTop, lbW, lbH, 12);
    ctx.stroke();

    // Title
    ctx.fillStyle = '#F7DC6F';
    ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Leaderboard', W / 2, lbTop + 24);

    // Rows
    ctx.font = '14px "Segoe UI", monospace';
    for (let i = 0; i < shown.length; i++) {
      const y = lbTop + 48 + i * rowH;
      const entry = shown[i];
      const name = entry.name || playerName || '???';
      const isYou = name === playerName && entry.score === score;

      if (isYou) {
        ctx.fillStyle = 'rgba(247, 220, 111, 0.15)';
        roundRect(ctx, lx + 8, y - 14, lbW - 16, rowH - 2, 4);
        ctx.fill();
      }

      // Rank
      ctx.textAlign = 'left';
      ctx.fillStyle = i === 0 ? '#F1C40F' : i === 1 ? '#BDC3C7' : i === 2 ? '#CD7F32' : 'rgba(255,255,255,0.6)';
      ctx.font = 'bold 14px "Segoe UI", monospace';
      ctx.fillText(`#${i + 1}`, lx + 16, y);

      // Name
      ctx.fillStyle = isYou ? '#F7DC6F' : 'rgba(255,255,255,0.85)';
      ctx.font = isYou ? 'bold 13px "Segoe UI", sans-serif' : '13px "Segoe UI", sans-serif';
      const displayName = name.length > 10 ? name.slice(0, 10) + '..' : name;
      ctx.fillText(displayName, lx + 52, y);

      // Score
      ctx.textAlign = 'right';
      ctx.fillStyle = isYou ? '#F7DC6F' : '#FFF';
      ctx.font = isYou ? 'bold 14px "Segoe UI", monospace' : '14px "Segoe UI", monospace';
      ctx.fillText(entry.score.toString(), lx + lbW - 18, y);

      ctx.textAlign = 'center';
    }
  }

  // Play again
  ctx.textAlign = 'center';
  ctx.font = '16px "Segoe UI", Arial, sans-serif';
  const restartAlpha = 0.5 + Math.sin(Date.now() * 0.004) * 0.5;
  ctx.fillStyle = `rgba(255,255,255,${restartAlpha})`;
  ctx.fillText('Pinch / Click / Space to retry', W / 2, H - 35);

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
