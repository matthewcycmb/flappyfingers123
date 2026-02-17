# Flappy Fingers - Product Requirements Document

## Overview

Flappy Fingers is a browser-based game inspired by Flappy Bird where the player controls a bird using real-time hand gesture recognition via their webcam. Instead of tapping a screen or pressing a key, the player makes the bird "flap" by pinching their thumb and index finger together. Each pinch registers as a jump. The game runs entirely client-side in the browser with no backend required.

---

## Core Concept

- A side-scrolling game where a bird must navigate through gaps between pipes
- The webcam captures the player's hand in real time
- The game detects when the player's **thumb tip and index finger tip touch** (pinch gesture)
- Each detected pinch triggers a single upward flap/jump
- Releasing the pinch resets the gesture so the player must re-pinch to flap again
- Gravity continuously pulls the bird downward when not flapping

---

## Target Platform

| Attribute | Detail |
|---|---|
| Platform | Web browser (desktop) |
| Rendering | HTML5 Canvas or WebGL |
| Camera Access | WebRTC (`getUserMedia`) |
| Hand Tracking | MediaPipe Hands (JavaScript SDK) |
| Languages | JavaScript/TypeScript, HTML, CSS |
| Backend | None — fully client-side |

---

## User Flow

1. **Landing screen** — Player sees the game title, a brief instruction ("Pinch your thumb and index finger to flap"), and a "Start" button.
2. **Camera permission** — On clicking Start, the browser requests webcam access. If denied, display an error message explaining the camera is required.
3. **Calibration/ready screen** — Once the camera feed is active, show a live preview of the webcam with the detected hand skeleton overlay. Display a message: "Pinch to begin". The game starts on the first detected pinch.
4. **Gameplay** — The bird flaps through an endless side-scrolling pipe field. The webcam feed is shown in a small picture-in-picture window in the corner so the player can see their hand. Score increments by 1 for each pipe pair successfully passed.
5. **Game over** — When the bird collides with a pipe or the ground/ceiling, the game freezes. Display the score, high score (persisted in `localStorage`), and a "Play Again" button (or pinch to restart).

---

## Functional Requirements

### FR-1: Hand Tracking & Gesture Detection

- Use **MediaPipe Hands** to detect hand landmarks from the webcam feed in real time.
- Track landmark **4** (thumb tip) and landmark **8** (index finger tip) from the 21-point hand model.
- Calculate the Euclidean distance between these two landmarks each frame.
- Define a **pinch threshold** distance (tunable, default ~30px in normalized coordinates) below which a pinch is considered active.
- Implement a **state machine** for the gesture:
  - `OPEN` — fingers are apart. Waiting for pinch.
  - `PINCHED` — fingers came together. Fire **one** flap event on transition from OPEN to PINCHED.
  - Transition back to `OPEN` only when distance exceeds the threshold (with a small hysteresis buffer to prevent flickering).
- The gesture system must operate at a minimum of **15 fps** detection rate to feel responsive.
- Support detection of either hand (left or right). If multiple hands are visible, use the first detected hand.

### FR-2: Game Mechanics

- **Bird physics:**
  - The bird has a vertical velocity affected by gravity (constant downward acceleration).
  - A flap event applies an instantaneous upward velocity impulse, overriding current downward velocity.
  - The bird's vertical position is updated each frame based on velocity.
  - The bird rotates slightly based on velocity (nose up when rising, nose down when falling) for visual feedback.
- **Pipes:**
  - Pairs of pipes (top and bottom) scroll from right to left at a constant horizontal speed.
  - The vertical gap between each pipe pair is fixed (tunable, default ~150px).
  - The gap's vertical position is randomized within a safe range each time a new pipe pair spawns.
  - New pipe pairs spawn at a fixed horizontal interval (tunable, default ~300px apart).
  - Pipes are removed from memory once they scroll off the left edge of the screen.
- **Collision detection:**
  - Axis-aligned bounding box (AABB) collision between the bird's hitbox and each pipe rectangle.
  - Collision with the top of the screen (ceiling) and bottom of the screen (ground) also ends the game.
- **Scoring:**
  - Score increments by 1 each time the bird's x-position passes the trailing edge of a pipe pair.
  - Display current score prominently at the top-center of the screen during gameplay.
- **Difficulty progression:**
  - Pipe scroll speed increases gradually over time or after score milestones (e.g., +5% speed every 10 points).
  - Gap size may optionally decrease slightly at higher scores (minimum gap size enforced).

### FR-3: Game States

| State | Description |
|---|---|
| `MENU` | Title screen with start button. Camera not yet active. |
| `READY` | Camera active, hand tracking running, webcam preview visible. Waiting for first pinch. |
| `PLAYING` | Active gameplay. Bird responds to pinch gestures. Pipes scroll. Score counts. |
| `GAME_OVER` | Bird has collided. Show score and high score. Accept pinch or click to restart. |

### FR-4: Camera Feed Display

- During `READY`, `PLAYING`, and `GAME_OVER` states, show the webcam feed in a small overlay (picture-in-picture style) in the bottom-left or bottom-right corner of the screen.
- The feed should be **mirrored horizontally** so the player's movements feel natural.
- Optionally overlay the MediaPipe hand skeleton on the feed so the player can see their tracked landmarks.
- The PiP window should be small enough not to obstruct gameplay (~15-20% of screen width).

### FR-5: Score Persistence

- Store the all-time high score in `localStorage`.
- Display the high score on the game-over screen alongside the current run's score.
- If the current score exceeds the high score, update `localStorage` and show a "New High Score!" indicator.

### FR-6: Audio & Visual Feedback

- Play a short sound effect on each flap.
- Play a sound on scoring (passing a pipe).
- Play a sound on collision/game over.
- Provide a visual flash or bird animation on flap to give immediate feedback that the gesture was detected.
- All sounds should be optional and togglable via a mute button.

### FR-7: Fallback Input

- Support **spacebar** and **mouse click / tap** as alternative flap inputs for accessibility and for users whose cameras are unavailable.
- The gesture input and keyboard/mouse inputs should work simultaneously — either can trigger a flap.

---

## Non-Functional Requirements

### NFR-1: Performance

- Target **60 fps** game rendering loop.
- Hand tracking inference should run in a separate animation frame or web worker where possible to avoid blocking the game loop.
- Total input latency from pinch to on-screen flap should be under **100ms**.

### NFR-2: Browser Compatibility

- Support latest versions of Chrome, Edge, and Firefox on desktop.
- Safari support is a stretch goal (WebRTC and MediaPipe support may be limited).

### NFR-3: Responsiveness

- The game canvas should scale to fit the browser window while maintaining aspect ratio.
- The PiP camera feed should reposition and resize appropriately on window resize.

### NFR-4: Privacy

- No video data is sent to any server. All processing is local.
- Display a brief privacy notice on the landing screen: "Your camera feed is processed entirely on your device. No video is recorded or transmitted."

---

## UI / Screen Descriptions

### Menu Screen
- Game title: "Flappy Fingers" in large, playful font.
- Subtitle: "Pinch to flap!"
- Animated bird idle sprite in the center.
- "Start" button.
- Mute/unmute toggle in the corner.
- Privacy notice text at the bottom.

### Ready Screen
- Background shows a static game scene (pipes, ground, sky) — not scrolling yet.
- Bird is visible at its starting position, gently bobbing up and down.
- PiP camera feed is active with hand skeleton overlay.
- Center text: "Pinch to begin" (pulsing animation).

### Playing Screen
- Scrolling background (sky, clouds) and ground.
- Pipes scrolling left to right.
- Bird in the center-left of the screen, responding to physics and flaps.
- Current score displayed at the top center.
- PiP camera feed in the corner.

### Game Over Screen
- Game scene freezes in place.
- Semi-transparent dark overlay.
- Score panel in the center showing:
  - "Game Over"
  - Current score
  - High score
  - "New High Score!" badge if applicable
  - "Pinch or Click to Play Again" button/text.

---

## Technical Architecture

```
index.html
  |
  +-- main.js (entry point, state management, game loop)
  |
  +-- hand-tracking.js (MediaPipe Hands setup, gesture state machine)
  |
  +-- game/
  |     +-- bird.js (bird entity, physics, rendering)
  |     +-- pipe.js (pipe generation, scrolling, removal)
  |     +-- collision.js (AABB collision detection)
  |     +-- score.js (scoring logic, localStorage persistence)
  |
  +-- ui/
  |     +-- screens.js (menu, ready, game-over screen rendering)
  |     +-- camera-pip.js (webcam PiP overlay management)
  |
  +-- assets/
  |     +-- sprites/ (bird, pipes, background, ground)
  |     +-- sounds/ (flap, score, hit, swoosh)
  |
  +-- styles.css
```

### Key Technical Decisions

- **MediaPipe Hands** via the `@mediapipe/hands` npm package (or CDN). Configured with `maxNumHands: 1`, `modelComplexity: 1`, `minDetectionConfidence: 0.7`, `minTrackingConfidence: 0.5`.
- **Canvas 2D** for rendering (simpler than WebGL, sufficient for 2D sprite game).
- **requestAnimationFrame** for the game loop with delta-time-based physics to ensure consistent speed regardless of frame rate.
- **No build step required** — can run with vanilla JS and ES modules, or optionally use a bundler (Vite) for dev convenience.

---

## Gesture Detection — Detailed Specification

```
Landmarks used:
  - Thumb tip:  landmark[4]
  - Index tip:  landmark[8]

Distance calculation:
  d = sqrt((x4 - x8)^2 + (y4 - y8)^2)

  (coordinates are normalized 0.0 - 1.0 by MediaPipe)

Pinch detection:
  PINCH_THRESHOLD = 0.05       (normalized distance)
  RELEASE_THRESHOLD = 0.07     (slightly larger for hysteresis)

State machine:
  State: OPEN
    if d < PINCH_THRESHOLD -> transition to PINCHED, emit "flap" event

  State: PINCHED
    if d > RELEASE_THRESHOLD -> transition to OPEN

  (No flap event emitted while staying in PINCHED state)
```

---

## Tunable Parameters

| Parameter | Default | Description |
|---|---|---|
| `GRAVITY` | 0.5 px/frame^2 | Downward acceleration on the bird |
| `FLAP_VELOCITY` | -8 px/frame | Upward velocity impulse on flap |
| `PIPE_SPEED` | 3 px/frame | Horizontal scroll speed of pipes |
| `PIPE_GAP` | 150 px | Vertical gap between top and bottom pipes |
| `PIPE_SPACING` | 300 px | Horizontal distance between pipe pairs |
| `PINCH_THRESHOLD` | 0.05 | Normalized distance to trigger pinch |
| `RELEASE_THRESHOLD` | 0.07 | Normalized distance to release pinch |
| `SPEED_INCREASE_INTERVAL` | 10 points | Score interval for speed increase |
| `SPEED_INCREASE_FACTOR` | 1.05 | Multiplier applied to pipe speed |
| `MIN_GAP` | 120 px | Minimum allowed pipe gap at high difficulty |

---

## MVP Scope

The minimum viable product includes:

1. Webcam-based hand tracking with pinch-to-flap gesture detection
2. Core Flappy Bird gameplay (bird, pipes, gravity, collision, scoring)
3. Menu, ready, playing, and game-over screens
4. PiP camera feed during gameplay
5. High score persistence in localStorage
6. Spacebar/click fallback input
7. Basic sound effects and mute toggle

---

## Stretch Goals

- Mobile support with front-facing camera
- Two-hand mode (left hand flaps, right hand controls horizontal drift)
- Gesture-based menu navigation (no mouse needed at all)
- Multiplayer split-screen with two cameras
- Custom bird skins selectable from the menu
- Online leaderboard (would require a backend)
- Screen recording / replay sharing
- Accessibility: voice-activated flap as another alternative input
