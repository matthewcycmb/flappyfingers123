export class CameraPiP {
  constructor() {
    this.pipWidth = 160;
    this.pipHeight = 120;
    this.margin = 12;
    this.cornerRadius = 10;
  }

  draw(ctx, canvasWidth, canvasHeight, videoElement, handTracker) {
    if (!videoElement || videoElement.readyState < 2) return;

    const x = canvasWidth - this.pipWidth - this.margin;
    const y = canvasHeight - this.pipHeight - this.margin - 60; // above ground

    ctx.save();

    // Clip to rounded rect
    ctx.beginPath();
    this.roundRect(ctx, x, y, this.pipWidth, this.pipHeight, this.cornerRadius);
    ctx.clip();

    // Draw mirrored video
    ctx.save();
    ctx.translate(x + this.pipWidth, y);
    ctx.scale(-1, 1);
    ctx.drawImage(videoElement, 0, 0, this.pipWidth, this.pipHeight);
    ctx.restore();

    // Draw hand landmarks on top
    if (handTracker) {
      ctx.save();
      ctx.translate(x, y);
      handTracker.drawLandmarks(ctx, this.pipWidth, this.pipHeight);
      ctx.restore();
    }

    ctx.restore();

    // Border
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    this.roundRect(ctx, x, y, this.pipWidth, this.pipHeight, this.cornerRadius);
    ctx.stroke();

    // Shadow
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    this.roundRect(
      ctx,
      x - 1,
      y - 1,
      this.pipWidth + 2,
      this.pipHeight + 2,
      this.cornerRadius + 1
    );
    ctx.stroke();

    // "LIVE" badge
    if (handTracker && handTracker.running) {
      const badgeX = x + 8;
      const badgeY = y + 8;
      ctx.fillStyle = handTracker.landmarks ? '#E74C3C' : '#888';
      ctx.beginPath();
      ctx.arc(badgeX + 4, badgeY + 6, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(badgeX + 12, badgeY, 32, 14);
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('LIVE', badgeX + 14, badgeY + 11);
    }
  }

  roundRect(ctx, x, y, w, h, r) {
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
}
