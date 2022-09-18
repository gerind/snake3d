import { Color, Scene } from 'three'
import { GameCube } from '../components/gamecube'
import { SnakeLight } from '../components/light'
import { backgroundColor, lightHeight, secondsBetweenMoves } from './constants'
import { AddableObject, ITickable } from './types'

const DX = [0, 1, 0, -1]
const DY = [-1, 0, 1, 0]

export class GameScene extends Scene implements ITickable {
  private objects: AddableObject[] = []
  private readonly width: number
  private readonly height: number
  private snake: [number, number][] = []
  private foodX: number = -1
  private foodY: number = -1
  private light!: SnakeLight
  private direction: 0 | 1 | 2 | 3 = 1
  private untilRebirth: number = 0

  private pressedQueue: (0 | 1 | 2 | 3)[] = []

  private secondsAcc: number = 0

  constructor(
    private readonly cubes: GameCube[][]
  ) {
    super()

    this.width = cubes.length
    this.height = cubes[0].length

    this.background = new Color(backgroundColor)

    document.addEventListener('keydown', event => {
      switch (event.code) {
        case 'ArrowLeft': case 'KeyA': this.pressLeft(); break;
        case 'ArrowRight': case 'KeyD': this.pressRight(); break;
        case 'ArrowDown': case 'KeyS': this.pressDown(); break;
        case 'ArrowUp': case 'KeyW': this.pressUp(); break;
      }
    })
  }

  registerLight(light: SnakeLight) {
    this.light = light
  }

  moveLight() {
    const last = this.snake[this.snake.length - 1]
    const x = last[0], y = last[1]
    this.light.setDest(x - 5, lightHeight, y - 5)
  }

  initGrid() {
    for (let x = 0; x < this.width; ++x) {
      for (let y = 0; y < this.height; ++y) {
        this.cubes[x][y].setEmpty()
      }
    }
    this.snake = [[1, 1], [2, 1]]
    this.cubes[1][1].setBody()
    this.cubes[2][1].setHead()
    
    this.placeFood()

    this.moveLight()
  }

  placeFood() {
    let freeCoordinates: [number, number][] = []
    for (let x = 0; x < this.width; ++x) {
      for (let y = 0; y < this.height; ++y) {
        if (this.cubes[x][y].state === 'empty')
          freeCoordinates.push([x, y])
      }
    }
    if (freeCoordinates.length < 1)
      throw new Error('No place for food')
    const p = Math.floor(Math.random() * freeCoordinates.length)
    this.foodX = freeCoordinates[p][0]
    this.foodY = freeCoordinates[p][1]
    this.cubes[this.foodX][this.foodY].setFood()
  }

  dead() {
    for (let [x, y] of this.snake) {
      this.cubes[x][y].setDead()
      this.untilRebirth = 3
    }
  }

  move() {
    const head = this.snake[this.snake.length - 1]
    const xnow = head[0], ynow = head[1]
    this.updateDirection()
    const x = xnow + DX[this.direction]
    const y = ynow + DY[this.direction]
    if ((x < 0 || y < 0 || x >= this.width || y >= this.height) || (this.cubes[x][y].state === 'head') || (this.cubes[x][y].state === 'body' && (x !== this.snake[0][0] || y !== this.snake[0][1]))) {
      this.dead()
      return
    }
    if (this.cubes[x][y].state === 'food') {
      this.cubes[xnow][ynow].setBody()
      this.snake.push([x, y])
      this.cubes[x][y].setHead()
      this.placeFood()
      this.moveLight()
    }
    else {
      this.cubes[this.snake[0][0]][this.snake[0][1]].setEmpty()
      this.cubes[xnow][ynow].setBody()
      this.snake = this.snake.slice(1)
      this.snake.push([x, y])
      this.cubes[x][y].setHead()
      this.moveLight()
    }
  }

  tick(time: number) {
    this.objects.forEach(o => {
      if (o.tick)
        o.tick(time)
    })
    if (this.untilRebirth > 0) {
      this.untilRebirth -= time
      if (this.untilRebirth <= 0) {
        this.untilRebirth = 0
        this.initGrid()
        this.direction = 1
        this.pressedQueue = []
      }
      return
    }
    this.secondsAcc += time
    if (this.secondsAcc >= secondsBetweenMoves) {
      this.secondsAcc %= secondsBetweenMoves
      this.move()
    }
  }

  add(...object: AddableObject[]) {
    super.add(...object)

    this.objects.push(...object)

    return this
  }

  remove(...object: AddableObject[]) {
    super.remove(...object)

    object.forEach(o => this.objects = this.objects.filter(t => t !== o))

    return this
  }

  updateDirection() {
    while (this.pressedQueue.length > 0) {
      const d = this.pressedQueue[0]
      this.pressedQueue = this.pressedQueue.slice(1)
      if (this.direction === d) continue
      if (((this.direction + 2) % 4) === d) continue
      this.direction = d
      break
    }
  }

  pressLeft() {
    this.pressedQueue.push(3)
  }

  pressRight() {
    this.pressedQueue.push(1)
  }

  pressDown() {
    this.pressedQueue.push(2)
  }

  pressUp() {
    this.pressedQueue.push(0)
  }
}

