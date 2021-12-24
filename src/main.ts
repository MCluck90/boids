import { createBoid, moveBoids } from './boids'
import { ctx, drawBoid, canvas } from './canvas'
import { Boid } from './types'

const speedEl = document.getElementById('speed')! as HTMLInputElement

const boids: Boid[] = [
  createBoid(80, 80),
  createBoid(80, 100),
  createBoid(100, 100),
  createBoid(120, 100),
  createBoid(120, 120),
]

function update(delta: number) {
  const speed = Number(speedEl.value)

  moveBoids(boids, speed * delta)

  // Wrap around the screen
  for (const boid of boids) {
    if (boid.position.x <= 0) {
      boid.position.x = canvas.width + boid.position.x
    } else if (boid.position.x >= canvas.width) {
      boid.position.x -= canvas.width
    }

    if (boid.position.y <= 0) {
      boid.position.y = canvas.height + boid.position.y
    } else if (boid.position.y >= canvas.height) {
      boid.position.y -= canvas.height
    }
  }
}

function render() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.strokeStyle = 'white'
  ctx.fillStyle = 'white'

  for (const boid of boids) {
    drawBoid(boid)
  }
}

let prev = +new Date()
function heartbeat() {
  let now = +new Date()
  const delta = (now - prev) / 1000
  update(delta)
  render()
  prev = now
  requestAnimationFrame(heartbeat)
}

heartbeat()
