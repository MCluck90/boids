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

export const drawBoid = (boid: Boid) => {
  const direction = Math.atan2(boid.velocity.y, boid.velocity.x)
  const length = 10
  const tip = {
    x: boid.position.x + length,
    y: boid.position.y,
  }
  const leftTail = {
    x: boid.position.x - length / 2,
    y: boid.position.y - length / 2,
  }
  const rightTail = {
    x: boid.position.x - length / 2,
    y: boid.position.y + length / 2,
  }
  rotatePoint(tip, boid.position, direction)
  rotatePoint(leftTail, boid.position, direction)
  rotatePoint(rightTail, boid.position, direction)

  ctx.beginPath()
  ctx.moveTo(tip.x, tip.y)
  ctx.lineTo(leftTail.x, leftTail.y)
  ctx.lineTo(rightTail.x, rightTail.y)
  ctx.lineTo(tip.x, tip.y)
  ctx.closePath()
  ctx.stroke()
}
