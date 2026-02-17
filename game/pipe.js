export class PipeManager {
  constructor(canvasWidth, canvasHeight, groundHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.groundHeight = groundHeight;
    this.pipes = [];
    this.pipeWidth = 56;
    this.gap = 150;
    this.spacing = 260;
    this.speed = 3;
    this.baseSpeed = 3;
    this.capHeight = 28;
    this.capOverhang = 4;
  }

  reset() {
    this.pipes = [];
    this.speed = this.baseSpeed;
  }

  spawn() {
    const minY = 90 + this.gap / 2;
    const maxY = this.canvasHeight - this.groundHeight - 90 - this.gap / 2;

    let gapY;
    if (this.pipes.length > 0) {
      // Constrain gap position relative to previous pipe so transitions are always reachable
      const lastGapY = this.pipes[this.pipes.length - 1].gapY;
      const maxDelta = 130;
      const lo = Math.max(minY, lastGapY - maxDelta);
      const hi = Math.min(maxY, lastGapY + maxDelta);
      gapY = lo + Math.random() * (hi - lo);
    } else {
      gapY = minY + Math.random() * (maxY - minY);
    }

    this.pipes.push({ x: this.canvasWidth + this.pipeWidth, gapY, passed: false });
  }

  update(dt) {
    for (const pipe of this.pipes) {
      pipe.x -= this.speed * dt;
    }
    this.pipes = this.pipes.filter(p => p.x + this.pipeWidth > -10);
    if (
      this.pipes.length === 0 ||
      this.pipes[this.pipes.length - 1].x < this.canvasWidth - this.spacing
    ) {
      this.spawn();
    }
  }

  draw(ctx) {
    for (const pipe of this.pipes) {
      this.drawPipe(ctx, pipe);
    }
  }

  drawPipe(ctx, pipe) {
    const topBottom = pipe.gapY - this.gap / 2;
    const botTop = pipe.gapY + this.gap / 2;

    this.drawSinglePipe(ctx, pipe.x, 0, topBottom, false);
    this.drawSinglePipe(ctx, pipe.x, botTop, this.canvasHeight - botTop, true);
  }

  drawSinglePipe(ctx, x, y, height, isBottom) {
    const w = this.pipeWidth;
    const capH = this.capHeight;
    const overhang = this.capOverhang;

    // Body gradient
    const grad = ctx.createLinearGradient(x, 0, x + w, 0);
    grad.addColorStop(0, '#5A9E1E');
    grad.addColorStop(0.15, '#73BF2E');
    grad.addColorStop(0.4, '#8ED442');
    grad.addColorStop(0.6, '#8ED442');
    grad.addColorStop(0.85, '#73BF2E');
    grad.addColorStop(1, '#5A9E1E');

    // Pipe body
    ctx.fillStyle = grad;
    if (isBottom) {
      ctx.fillRect(x, y + capH, w, height - capH);
      // Body border
      ctx.strokeStyle = '#3D7A0F';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y + capH, w, height - capH);
    } else {
      ctx.fillRect(x, y, w, height - capH);
      ctx.strokeStyle = '#3D7A0F';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, height - capH);
    }

    // Cap gradient
    const capGrad = ctx.createLinearGradient(x - overhang, 0, x + w + overhang, 0);
    capGrad.addColorStop(0, '#4A8515');
    capGrad.addColorStop(0.15, '#6AB828');
    capGrad.addColorStop(0.4, '#7EC838');
    capGrad.addColorStop(0.6, '#7EC838');
    capGrad.addColorStop(0.85, '#6AB828');
    capGrad.addColorStop(1, '#4A8515');

    // Cap
    const capY = isBottom ? y : y + height - capH;
    ctx.fillStyle = capGrad;
    ctx.fillRect(x - overhang, capY, w + overhang * 2, capH);
    ctx.strokeStyle = '#3D7A0F';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - overhang, capY, w + overhang * 2, capH);

    // Highlight stripe on body
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    if (isBottom) {
      ctx.fillRect(x + 6, y + capH, 6, height - capH);
    } else {
      ctx.fillRect(x + 6, y, 6, height - capH);
    }
  }

  getTopPipeRect(pipe) {
    return {
      x: pipe.x,
      y: 0,
      width: this.pipeWidth,
      height: pipe.gapY - this.gap / 2,
    };
  }

  getBottomPipeRect(pipe) {
    const topY = pipe.gapY + this.gap / 2;
    return {
      x: pipe.x,
      y: topY,
      width: this.pipeWidth,
      height: this.canvasHeight - topY,
    };
  }

  increaseSpeed(factor) {
    this.speed *= factor;
  }
}
