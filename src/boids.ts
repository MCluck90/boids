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

export function moveBoids(boids: Boid[], speed: number) {
  const centerSum = boids.reduce((acc, boid) => {
    acc.x += boid.position.x
    acc.y += boid.position.y
    return acc
  }, new Vector())

  for (const boid of boids) {
    // Rule 1: Boids try to fly towards the center of mass of neighboring boids
    // Exclude current boid from supposed center
    const center = new Vector(
      (centerSum.x - boid.position.x) / (boids.length - 1),
      (centerSum.y - boid.position.y) / (boids.length - 1)
    )

    const v1 = new Vector(
      (center.x - boid.position.x) / 100,
      (center.y - boid.position.y) / 100
    )

    // Rule 2: Boids try to keep a small distance away from other objects (including other boids)
    let v2 = new Vector()
    for (const other of boids) {
      if (other === boid) {
        continue
      }

      if (boid.position.distanceTo(other.position) < 100) {
        v2 = v2.subtract(other.position.subtract(boid.position))
      }
    }

    // Rule 3: Boids try to match velocity with near boids
    let v3 = new Vector()
    for (const other of boids) {
      if (other === boid) {
        continue
      }

      v3 = v3.add(other.velocity)
    }
    v3 = v3.div(boids.length - 1)

    boid.velocity = boid.velocity.add(v1).add(v2).add(v3).toUnit()
    boid.position = boid.position.add(boid.velocity.mult(speed))
  }
}
