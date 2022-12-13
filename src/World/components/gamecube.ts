import { MathUtils } from 'three'
import { ICellState } from '../systems/types'
import { Cube } from './cube'

export class GameCube extends Cube {
  private _state: ICellState = 'empty'
  private positionAcc: number = 0

  constructor(width: number, height: number, depth: number) {
    super(width, height, depth)

    this.color = 'white'

    this.castShadow = true
    this.receiveShadow = true
  }

  public get state() {
    return this._state
  }
  public set state(s: typeof this._state) {
    if (s === 'food') {
      this.scale.set(0.7, 0.7, 0.7)
      this.rotation.set(
        MathUtils.degToRad(Math.floor(Math.random() * 90)),
        MathUtils.degToRad(Math.floor(Math.random() * 90)),
        MathUtils.degToRad(Math.floor(Math.random() * 90))
      )
    } else {
      this.scale.set(1, 1, 1)
      this.rotation.set(0, 0, 0)
    }
    if (s !== 'body' && s !== 'head' && s !== 'dead') {
      this.position.y = 0
      this.positionAcc = 0
    }
    this._state = s
  }

  tick(time: number) {
    if (this.state === 'food') {
      this.rotation.x += MathUtils.degToRad(60) * time
      this.rotation.y += MathUtils.degToRad(60) * time
      this.rotation.z += MathUtils.degToRad(60) * time
    }
    if (this.state === 'body' || this.state === 'head') {
      this.positionAcc += time
      this.positionAcc %= 4
      if (this.positionAcc >= 2) this.position.y = (4 - this.positionAcc) / 30
      else this.position.y = this.positionAcc / 30
    }
    if (this.state === 'dead') {
      if (this.positionAcc < 2) this.positionAcc = 4 - this.positionAcc
      this.positionAcc += time
      this.positionAcc = Math.min(this.positionAcc, 4)
      this.position.y = (4 - this.positionAcc) / 30
    }
  }

  setEmpty() {
    this.state = 'empty'
    this.color = 'white'
  }

  setHead() {
    this.state = 'head'
    this.color = 'blueviolet'
  }

  setBody() {
    this.state = 'body'
    this.color = 'aqua'
  }

  setDead() {
    this.state = 'dead'
    this.color = '#ff0000'
  }

  setFood() {
    this.state = 'food'
    this.color = 'orange'
  }
}
