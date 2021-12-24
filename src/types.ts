import { Vector } from './vector'

export interface Point {
  x: number
  y: number
}

export interface Boid {
  id: string
  position: Vector
  velocity: Vector
}
