export function checkCollision(bird, pipeManager, canvasHeight, groundHeight) {
  const bounds = bird.getBounds();

  // Ground
  if (bounds.y + bounds.height >= canvasHeight - groundHeight) {
    return { collided: true, type: 'ground' };
  }

  // Ceiling
  if (bounds.y <= 0) {
    return { collided: true, type: 'ceiling' };
  }

  // Pipes
  for (const pipe of pipeManager.pipes) {
    const topRect = pipeManager.getTopPipeRect(pipe);
    const bottomRect = pipeManager.getBottomPipeRect(pipe);
    if (aabbOverlap(bounds, topRect) || aabbOverlap(bounds, bottomRect)) {
      return { collided: true, type: 'pipe' };
    }
  }

  return { collided: false };
}

function aabbOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
