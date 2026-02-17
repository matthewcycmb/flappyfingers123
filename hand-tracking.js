export class HandTracker {
  constructor() {
    this.handLandmarker = null;
    this.video = null;
    this.stream = null;
    this.running = false;
    this.onPinch = null;
    this.landmarks = null;
    this.loaded = false;
    this.error = null;

    // Gesture state machine
    this.gestureState = 'OPEN';
    this.pinchThreshold = 0.05;
    this.releaseThreshold = 0.07;

    this.lastDetectionTime = -1;
  }

  async init(videoElement) {
    this.video = videoElement;

    try {
      const { HandLandmarker, FilesetResolver } = await import(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/vision_bundle.mjs'
      );

      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
      );

      this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 1,
        minHandDetectionConfidence: 0.7,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      this.loaded = true;
    } catch (e) {
      this.error = e;
      console.error('Hand tracking init failed:', e);
    }
  }

  async startCamera() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: 640, height: 480 },
    });
    this.video.srcObject = this.stream;
    await new Promise((resolve) => {
      this.video.onloadedmetadata = () => {
        this.video.play();
        resolve();
      };
    });
    this.running = true;
  }

  detect(timestamp) {
    if (
      !this.running ||
      !this.handLandmarker ||
      !this.video ||
      this.video.readyState < 2
    ) {
      return this.landmarks;
    }

    if (timestamp <= this.lastDetectionTime) {
      return this.landmarks;
    }
    this.lastDetectionTime = timestamp;

    try {
      const results = this.handLandmarker.detectForVideo(this.video, timestamp);
      if (results.landmarks && results.landmarks.length > 0) {
        this.landmarks = results.landmarks[0];
        this.processGesture(this.landmarks);
      } else {
        this.landmarks = null;
      }
    } catch {
      // detection frame skip
    }

    return this.landmarks;
  }

  processGesture(landmarks) {
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const dx = thumbTip.x - indexTip.x;
    const dy = thumbTip.y - indexTip.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (this.gestureState === 'OPEN' && distance < this.pinchThreshold) {
      this.gestureState = 'PINCHED';
      if (this.onPinch) this.onPinch();
    } else if (
      this.gestureState === 'PINCHED' &&
      distance > this.releaseThreshold
    ) {
      this.gestureState = 'OPEN';
    }
  }

  drawLandmarks(ctx, displayWidth, displayHeight) {
    if (!this.landmarks) return;
    const lm = this.landmarks;

    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [5, 6], [6, 7], [7, 8],
      [0, 17], [5, 9], [9, 13], [13, 17],
      [9, 10], [10, 11], [11, 12],
      [13, 14], [14, 15], [15, 16],
      [17, 18], [18, 19], [19, 20],
    ];

    ctx.strokeStyle = 'rgba(0, 255, 100, 0.6)';
    ctx.lineWidth = 2;
    for (const [i, j] of connections) {
      ctx.beginPath();
      ctx.moveTo((1 - lm[i].x) * displayWidth, lm[i].y * displayHeight);
      ctx.lineTo((1 - lm[j].x) * displayWidth, lm[j].y * displayHeight);
      ctx.stroke();
    }

    for (let i = 0; i < lm.length; i++) {
      const x = (1 - lm[i].x) * displayWidth;
      const y = lm[i].y * displayHeight;

      if (i === 4 || i === 8) {
        ctx.fillStyle =
          this.gestureState === 'PINCHED' ? '#FF4444' : '#00FF88';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  stop() {
    this.running = false;
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }
}
