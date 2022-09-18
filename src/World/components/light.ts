import { PointLight } from 'three'

export class SnakeLight extends PointLight {
  private dest!: [number, number, number]

  public setDest(x: number, y: number, z: number) {
    if (!this.dest) {
      this.position.set(x, y, z)
    }
    this.dest = [x, y, z]
  }

  constructor(intensity: number) {
    super('white', intensity)

    this.castShadow = false

    window.addEventListener('keydown', event => {
      if (event.code === 'KeyE')
        this.castShadow = !this.castShadow
    })
  }

  tick(time: number) {
    this.position.x += Math.min(time, 1) * (this.dest[0] - this.position.x)
    this.position.y += Math.min(time, 1) * (this.dest[1] - this.position.y)
    this.position.z += Math.min(time, 1) * (this.dest[2] - this.position.z)
  }
}
