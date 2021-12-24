import { Vector } from './vector'

export interface Point {
  x: number
  y: number
}

export interface Boid {
  position: Vector
  velocity: Vector
}
