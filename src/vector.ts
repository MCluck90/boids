import { Point } from './types'

export class Vector implements Point {
  x: number
  y: number

  constructor(x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
  }

  get length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }

  toUnit() {
    return new Vector(this.x / this.length, this.y / this.length)
  }

  distanceTo(other: Vector) {
    return Math.sqrt(
      Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2)
    )
  }

  subtract(other: Vector) {
    return new Vector(this.x - other.x, this.y - other.y)
  }

  add(other: Vector) {
    return new Vector(this.x + other.x, this.y + other.y)
  }

  mult(n: number) {
    return new Vector(this.x * n, this.y * n)
  }

  div(n: number) {
    return new Vector(this.x / n, this.y / n)
  }

  clone() {
    return new Vector(this.x, this.y)
  }
}
