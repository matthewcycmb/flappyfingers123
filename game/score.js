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

  addToLeaderboard(score) {
    const board = this.getLeaderboard();
    board.push({ score, date: Date.now() });
    board.sort((a, b) => b.score - a.score);
    const top10 = board.slice(0, 10);
    try {
      localStorage.setItem('flappyFingers_leaderboard', JSON.stringify(top10));
    } catch {
      // localStorage not available
    }
    return top10;
  }

  getLeaderboard() {
    try {
      return JSON.parse(localStorage.getItem('flappyFingers_leaderboard')) || [];
    } catch {
      return [];
    }
  }
}
