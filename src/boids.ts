import { canvas } from './canvas'
import { Boid } from './types'
import { Vector } from './vector'

export const createBoid = (x: number, y: number): Boid => {
  const degrees = Math.random() * 360
  const radians = degrees * (Math.PI / 180)
  return {
    position: new Vector(x, y),
    velocity: new Vector(Math.cos(radians), Math.sin(radians)),
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

    // Rule 2: Boids try to keep a small distance away from other objects (including other boids)
    let v2 = new Vector()
    for (const other of boids) {
      if (other === boid) {
        continue
      }

      if (boid.position.distanceTo(other.position) < separation) {
        v2 = v2.subtract(other.position.subtract(boid.position))
      }

      if (allowWrapping) {
        continue
      }

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
    let v3 = new Vector()
    for (const other of boids) {
      if (other === boid) {
        continue
      }

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
