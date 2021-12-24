import { canvas } from './canvas'
import { Boid } from './types'
import { Vector } from './vector'

function uuidv4() {
  return ([1e7].toString() + -1e3 + -4e3 + -8e3 + -1e11).replace(
    /[018]/g,
    (c) =>
      (
        Number(c) ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
      ).toString(16)
  )
}

export const createBoid = (x: number, y: number): Boid => {
  const degrees = Math.random() * 360
  const radians = degrees * (Math.PI / 180)
  const position = new Vector(x, y)
  const velocity = new Vector(Math.cos(radians), Math.sin(radians))

  return {
    id: uuidv4(),
    position,
    velocity,
  }
}

export function moveBoids(
  boids: Boid[],
  speed: number,
  separation: number,
  alignment: number,
  cohesion: number,
  jitter: number,
  allowWrapping: boolean
) {
  const centerSum = boids.reduce((acc, boid) => {
    acc.x += boid.position.x
    acc.y += boid.position.y
    return acc
  }, new Vector())

  for (const boid of boids) {
    // Rule 1: Boids try to fly towards the center of mass of neighboring boids
    // Exclude current boid from supposed center
    const center = new Vector(
      (centerSum.x - boid.position.x) / Math.max(boids.length - 1, 1),
      (centerSum.y - boid.position.y) / Math.max(boids.length - 1, 1)
    )

    const v1 = new Vector(
      ((center.x - boid.position.x) / 100) * cohesion,
      ((center.y - boid.position.y) / 100) * cohesion
    )

    let v2 = new Vector()
    let v3 = new Vector()
    for (const other of boids) {
      if (other === boid) {
        continue
      }

      // Rule 2: Boids try to keep a small distance away from other objects (including other boids)
      if (boid.position.distanceTo(other.position) < separation) {
        v2 = v2.subtract(other.position.subtract(boid.position))
      }

      if (!allowWrapping) {
        if (boid.position.x < 10) {
          v2 = v2.subtract(new Vector(-10, 0))
        } else if (boid.position.x > canvas.width - 10) {
          v2 = v2.subtract(new Vector(10, 0))
        }
        if (boid.position.y < 10) {
          v2 = v2.subtract(new Vector(0, -10))
        } else if (boid.position.y > canvas.height - 10) {
          v2 = v2.subtract(new Vector(0, 10))
        }
      }

      // Rule 3: Boids try to match velocity with near boids
      v3 = v3.add(other.velocity.mult(alignment))
    }

    v3 = v3.div(Math.max(boids.length - 1, 1))

    const direction = Math.atan2(boid.velocity.y, boid.velocity.x)
    const newDirection =
      direction + Math.PI * (jitter * Math.random() * (Math.random() - 0.5))
    const jitterVector = new Vector(
      Math.cos(newDirection),
      Math.sin(newDirection)
    ).toUnit()

    boid.velocity = boid.velocity
      .add(v1)
      .add(v2)
      .add(v3)
      .add(jitterVector)
      .toUnit()
    boid.position = boid.position.add(boid.velocity.mult(speed))
  }
}
