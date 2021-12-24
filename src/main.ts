import { createBoid, moveBoids } from './boids'
import { ctx, drawBoid, canvas } from './canvas'
import { Boid } from './types'

const speedEl = document.getElementById('speed')! as HTMLInputElement
const separationEl = document.getElementById('separation')! as HTMLInputElement
const alignmentEl = document.getElementById('alignment')! as HTMLInputElement
const cohesionEl = document.getElementById('cohesion')! as HTMLInputElement

const boids: Boid[] = []

for (let i = 0; i < 50; i++) {
  boids.push(
    createBoid(Math.random() * canvas.width, Math.random() * canvas.height)
  )
}

function update(delta: number) {
  const speed = Number(speedEl.value)
  const separation = Number(separationEl.value)
  const alignment = Number(alignmentEl.value) / 100
  const cohesion = Number(cohesionEl.value) / 100

  moveBoids(boids, speed * delta, separation, alignment, cohesion)

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
