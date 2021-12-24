import { createBoid, moveBoids } from './boids'
import { ctx, drawBoid, canvas } from './canvas'
import { Boid } from './types'

const speedEl = document.getElementById('speed')! as HTMLInputElement
const sizeEl = document.getElementById('size')! as HTMLInputElement
const populationEl = document.getElementById('population')! as HTMLInputElement
const separationEl = document.getElementById('separation')! as HTMLInputElement
const alignmentEl = document.getElementById('alignment')! as HTMLInputElement
const cohesionEl = document.getElementById('cohesion')! as HTMLInputElement
const jitterEl = document.getElementById('jitter')! as HTMLInputElement
const allowWrappingEl = document.getElementById(
  'allowWrapping'
)! as HTMLInputElement
const colorEl = document.getElementById('color')! as HTMLInputElement

const boids: Boid[] = []

for (let i = 0; i < Number(populationEl.value); i++) {
  boids.push(
    createBoid(Math.random() * canvas.width, Math.random() * canvas.height)
  )
}

function update(delta: number) {
  const speed = Number(speedEl.value)
  const population = Number(populationEl.value)
  const separation = Number(separationEl.value)
  const alignment = Number(alignmentEl.value) / 100
  const cohesion = Number(cohesionEl.value) / 100
  const jitter = Number(jitterEl.value) / 100
  const allowWrapping = !!allowWrappingEl.checked

  while (boids.length > population) {
    boids.pop()
  }
  while (boids.length < population) {
    boids.push(
      createBoid(Math.random() * canvas.width, Math.random() * canvas.height)
    )
  }

  moveBoids(
    boids,
    speed * delta,
    separation,
    alignment,
    cohesion,
    jitter,
    allowWrapping
  )

  if (!allowWrapping) {
    return
  }
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
  const size = Number(sizeEl.value)
  const color = colorEl.value
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  for (const boid of boids) {
    drawBoid(boid, size, color)
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
