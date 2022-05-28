import { Ball } from './Ball'

// Game Constants
const width = 1280
const height = 720
const borderOffset = 20
const paddleWidth = 10
const paddleHeight = 300
const moveSpeed = 5
const ballSize = 8
const livesXOffset = 50
const livesYOffset = 40
const livesSpacing = 15
const livesSize = 20

// Setup
const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas?.getContext('2d')

const player = {
  x: borderOffset,
  y: height / 2 - paddleHeight / 2,
  lives: 3,
}
const enemy = {
  x: width - borderOffset - paddleWidth,
  y: height / 2 - paddleHeight / 2,
  lives: 3,
}
let ball: Ball | null = null

let playerInput = ''

function handlePlayerInput() {
  if (playerInput === 'up' && player.y > 0) {
    player.y -= moveSpeed
  } else if (playerInput === 'down' && player.y + paddleHeight < height) {
    player.y += moveSpeed
  } else if (playerInput === 'shoot' && !ball) {
    ball = {
      x: player.x + paddleWidth,
      y: player.y + paddleHeight / 2,
      xSpeed: moveSpeed * 1.5,
      ySpeed: moveSpeed * 1.5,
    }
  }
}

function handleEnemyLogic() {
  // No Ball or ball near player -> Reset
  if (!ball || ball.x < width * 0.4) {
    if (enemy.y + paddleHeight / 2 < height / 2 - 20 ) {
      enemy.y += moveSpeed
    } else if (enemy.y + paddleHeight / 2 > height / 2 + 20) {
      enemy.y -= moveSpeed
    }
    return
  }

  // Move towards ball
  if (enemy.y + (paddleHeight / 2) > ball.y && enemy.y > 0) {
    enemy.y -= moveSpeed
  } else if (enemy.y + paddleHeight < height) {
    enemy.y += moveSpeed
  }
}

function handleBallMovement() {
  if (!ball) return

  // Check for score
  if (ball.xSpeed < 0 && ball.x < ballSize) {
    ball = null
    player.lives -= 1
    return
  } else if (ball.xSpeed > 0 && ball.x > width - ballSize) {
    ball = null
    enemy.lives -= 1
    return
  }

  // Check for collisions

  // Top
  if (ball.ySpeed < 0 && ball.y < ballSize) {
    ball.ySpeed = 0 - ball.ySpeed
  }
  // Bottom
  if (ball.ySpeed > 0 && ball.y > height - ballSize) {
    ball.ySpeed = 0 - ball.ySpeed
  }

  // Player
  if (
    ball.xSpeed < 0 &&
    ball.x + ballSize > player.x &&
    ball.x < player.x + paddleWidth &&
    ball.y > player.y &&
    ball.y < player.y + paddleHeight
  ) {
    ball.xSpeed *= -1.1
    ball.ySpeed *= 1.1
  }

  // Enemy
  if (
    ball.xSpeed > 0 &&
    ball.x + ballSize > enemy.x &&
    ball.x < enemy.x + paddleWidth &&
    ball.y > enemy.y &&
    ball.y < enemy.y + paddleHeight
  ) {
    ball.xSpeed *= -1.1
    ball.ySpeed *= 1.1
  }

  // Move ball
  ball.x += ball.xSpeed
  ball.y += ball.ySpeed
}

function endGame() {
  window.removeEventListener('keydown', keyListener)

  let message = ''

  if (player.lives === 0) {
    message = 'You lose!'
  } else {
    message = 'You win!'
  }

  if (!ctx) return
  ctx.textAlign = 'center'
  ctx.font = '60px sans-serif'
  ctx.fillText(message, width / 2, height / 2)
}

// Main Loop
function loop() {
  if (!ctx) return

  /*
    Gameplay Logic
  */

  if (player.lives === 0 || enemy.lives === 0) {
    endGame()
    return
  }

  handlePlayerInput()
  handleEnemyLogic()
  handleBallMovement()

  /* 
    Drawing Logic 
  */

  // Clear old screen
  ctx.clearRect(0, 0, width, height)

  // Draw current state
  // Player
  ctx.fillStyle = 'black'
  ctx.fillRect(player.x, player.y, paddleWidth, paddleHeight)

  ctx.fillStyle = 'green'
  for (let i = 0; i < player.lives; i++) {
    ctx.fillRect(
      livesXOffset + i * (livesSpacing + livesSize),
      livesYOffset,
      livesSize,
      livesSize
    )
  }

  // Enemy
  ctx.fillStyle = 'black'
  ctx.fillRect(enemy.x, enemy.y, paddleWidth, paddleHeight)

  ctx.fillStyle = 'red'
  for (let i = 0; i < enemy.lives; i++) {
    ctx.fillRect(
      width - (livesXOffset + livesSize) - i * (livesSpacing + livesSize),
      livesYOffset,
      livesSize,
      livesSize
    )
  }

  // Ball
  ctx.fillStyle = 'black'
  if (ball) ctx.fillRect(ball.x, ball.y, ballSize, ballSize)
}

// Key Inputs
function keyListener(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowUp':
      playerInput = 'up'
      break
    case 'ArrowDown':
      playerInput = 'down'
      break
    case ' ':
      playerInput = 'shoot'
      break
  }
}
window.addEventListener('keydown', keyListener)
window.addEventListener('keyup', () => {
  playerInput = ''
})

// Start game
setInterval(loop, 1000 / 60)

export {}
