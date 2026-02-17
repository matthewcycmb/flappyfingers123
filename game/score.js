export class ScoreManager {
  constructor() {
    this.score = 0;
    this.highScore = this.loadHighScore();
    this.isNewHighScore = false;
  }

  increment() {
    this.score++;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.isNewHighScore = true;
      this.saveHighScore();
    }
  }

  reset() {
    this.score = 0;
    this.isNewHighScore = false;
  }

  loadHighScore() {
    try {
      return parseInt(localStorage.getItem('flappyFingers_highScore')) || 0;
    } catch {
      return 0;
    }
  }

  saveHighScore() {
    try {
      localStorage.setItem('flappyFingers_highScore', this.highScore.toString());
    } catch {
      // localStorage not available
    }
  }
}
