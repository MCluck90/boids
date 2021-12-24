import { createBoid } from './boids'
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
  for (const boid of boids) {
    boid.x += boid.velocity.x * delta * speed
    boid.y += boid.velocity.y * delta * speed

    if (boid.x <= 0) {
      boid.x = canvas.width + boid.x
    } else if (boid.x >= canvas.width) {
      boid.x -= canvas.width
    }

    if (boid.y <= 0) {
      boid.y = canvas.height + boid.y
    } else if (boid.y >= canvas.height) {
      boid.y -= canvas.height
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
