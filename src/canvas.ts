import { Boid, Point } from './types'

export const canvas = document.querySelector('canvas')!

document.addEventListener('resize', () => {})

canvas.width = canvas.getBoundingClientRect().width
canvas.height = canvas.getBoundingClientRect().height

export const ctx = canvas.getContext('2d')!

function rotatePoint(point: Point, center: Point, angle: number) {
  const sin = Math.sin(angle)
  const cos = Math.cos(angle)

  point.x -= center.x
  point.y -= center.y

  const xNew = point.x * cos - point.y * sin
  const yNew = point.x * sin + point.y * cos

  point.x = xNew + center.x
  point.y = yNew + center.y
}

const lerp = (n1: number, n2: number, amount: number) => {
  amount = Math.max(amount, 0)
  amount = Math.min(amount, 1)
  return n1 + (n2 - n1) * amount
}

const previousPositions: Record<string, Point> = {}
const previousVelocities: Record<string, Point> = {}

export const drawBoid = (
  boid: Boid,
  size: number,
  color: string,
  allowWrapping: boolean
) => {
  const previousPosition = previousPositions[boid.id] || {
    x: boid.velocity.x,
    y: boid.velocity.y,
  }
  previousPositions[boid.id] = previousPosition

  const previousVelocity = previousVelocities[boid.id] || {
    x: boid.velocity.x,
    y: boid.velocity.y,
  }
  previousVelocities[boid.id] = previousVelocity

  previousPosition.x = lerp(previousPosition.x, boid.position.x, 0.1)
  previousPosition.y = lerp(previousPosition.y, boid.position.y, 0.1)
  // Animating gets weird when you can wrap around the screen
  const position = allowWrapping ? boid.position : previousPosition

  previousVelocity.x = lerp(previousVelocity.x, boid.velocity.x, 0.1)
  previousVelocity.y = lerp(previousVelocity.y, boid.velocity.y, 0.1)

  const direction = Math.atan2(previousVelocity.y, previousVelocity.x)
  const tip = {
    x: position.x + size,
    y: position.y,
  }
  const leftTail = {
    x: position.x - size / 2,
    y: position.y - size / 2,
  }
  const rightTail = {
    x: position.x - size / 2,
    y: position.y + size / 2,
  }
  rotatePoint(tip, position, direction)
  rotatePoint(leftTail, position, direction)
  rotatePoint(rightTail, position, direction)

  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(tip.x, tip.y)
  ctx.lineTo(leftTail.x, leftTail.y)
  ctx.lineTo(rightTail.x, rightTail.y)
  ctx.lineTo(tip.x, tip.y)
  ctx.closePath()
  ctx.stroke()
  ctx.fill()
}
