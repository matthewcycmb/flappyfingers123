export class Bird {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 34;
    this.height = 24;
    this.velocity = 0;
    this.gravity = 0.5;
    this.flapStrength = -8;
    this.rotation = 0;
    this.flapFrame = 0;
    this.wingAngle = 0;
  }

  flap() {
    this.velocity = this.flapStrength;
    this.flapFrame = 10;
  }

  update(dt) {
    this.velocity += this.gravity * dt;
    this.y += this.velocity * dt;

    const targetRotation = Math.min(Math.max(this.velocity * 4, -35), 90) * (Math.PI / 180);
    this.rotation += (targetRotation - this.rotation) * 0.15;

    if (this.flapFrame > 0) {
      this.flapFrame--;
      this.wingAngle = Math.sin(this.flapFrame * 0.9) * 35;
    } else {
      this.wingAngle = Math.sin(Date.now() * 0.006) * 8;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.ellipse(2, 3, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = '#F7DC6F';
    ctx.beginPath();
    ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#D4AC0D';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Belly
    ctx.fillStyle = '#FCF3CF';
    ctx.beginPath();
    ctx.ellipse(2, 3, this.width / 3, this.height / 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wing
    ctx.save();
    ctx.translate(-2, 2);
    ctx.rotate(this.wingAngle * Math.PI / 180);
    ctx.fillStyle = '#F0C230';
    ctx.beginPath();
    ctx.ellipse(0, 4, 11, 7, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#D4AC0D';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Eye white
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(8, -5, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Pupil
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(10, -5, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Eye shine
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(11.5, -6.5, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#E74C3C';
    ctx.beginPath();
    ctx.moveTo(14, -1);
    ctx.lineTo(26, 2);
    ctx.lineTo(14, 6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#C0392B';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  getBounds() {
    return {
      x: this.x - this.width / 2 + 4,
      y: this.y - this.height / 2 + 4,
      width: this.width - 8,
      height: this.height - 8,
    };
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.velocity = 0;
    this.rotation = 0;
    this.flapFrame = 0;
  }
}
