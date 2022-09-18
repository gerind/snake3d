import { MathUtils } from 'three'
import { ICellState } from '../systems/types'
import { Cube } from './cube'

export class GameCube extends Cube {
  private _state: ICellState  = 'empty'

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
      this.scale.set(.7, .7, .7)
    }
    else {
      this.scale.set(1, 1, 1)
      this.rotation.set(0, 0, 0)
    }
    this._state = s
  }

  tick(time: number) {
    if (this.state === 'food') {
      this.rotation.x += MathUtils.degToRad(60) * time
      this.rotation.y += MathUtils.degToRad(60) * time
      this.rotation.z += MathUtils.degToRad(60) * time
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