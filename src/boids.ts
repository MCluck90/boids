import { Boid } from './types'

export const createBoid = (x: number, y: number): Boid => {
  const degrees = Math.random() * 360
  const radians = degrees * (Math.PI / 180)
  return {
    x,
    y,
    velocity: {
      x: Math.cos(radians),
      y: Math.sin(radians),
    },
  }
}

export function moveBoids(boids: Boid[]) {
  const centerSum = boids.reduce(
    (acc, boid) => ({ x: acc.x + boid.x, y: acc.y + boid.y }),
    { x: 0, y: 0 }
  )

  for (const boid of boids) {
    // Rule 1: Boids try to fly towards the center of mass of neighboring boids
    // Exclude current boid from supposed center
    const center = {
      x: (centerSum.x - boid.x) / (boids.length - 1),
      y: (centerSum.y - boid.y) / (boids.length - 1),
    }
  }
}
