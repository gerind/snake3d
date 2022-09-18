import { Clock, PerspectiveCamera, WebGLRenderer } from 'three'
import { GameCube } from './components/gamecube'
import { SnakeLight } from './components/light'
import { createCamera } from './systems/camera'
import { cellSize, lightHeight } from './systems/constants'
import { createRenderer } from './systems/renderer'
import { Resizer } from './systems/Resizer'
import { GameScene } from './systems/scene'

export class World {
  private readonly cubes: GameCube[][] = new Array(11).fill(0).map(() => new Array(11).fill(null))

  private readonly camera: PerspectiveCamera
  private readonly renderer: WebGLRenderer
  private readonly scene: GameScene
  private readonly resizer: Resizer
  private readonly clock = new Clock(false)

  private fpsQueue: number[] = []

  public fpsHandler?: (fps: number) => void

  constructor(private readonly container: HTMLElement) {

    const camera = createCamera(40, 0.1, 1000)
    const renderer = createRenderer()
    const scene = new GameScene(this.cubes)

    camera.position.set(0, 9, 11)
    camera.lookAt(0, 0, 1)

    for (let i = -5; i <= 5; ++i) {
      for (let j = -5; j <= 5; ++j) {
        const cube = new GameCube(cellSize, cellSize, cellSize)
        cube.position.set(i, 0, j)
        scene.add(cube)
        this.cubes[i + 5][j + 5] = cube
      }
    }
  
    const light = new SnakeLight(16)
    light.position.set(0, lightHeight, 0)

    scene.add(light)

    scene.registerLight(light)
    scene.initGrid()

    this.camera = camera
    this.scene = scene
    this.renderer = renderer

    this.resizer = new Resizer(container, camera, renderer)

    this.container.append(renderer.domElement)
  }

  tick() {
    this.fpsQueue.push(Date.now())
    while (this.fpsQueue[this.fpsQueue.length - 1] - this.fpsQueue[0] > 1000) {
      this.fpsQueue = this.fpsQueue.slice(1)
    }
    if (this.fpsHandler)
      this.fpsHandler(this.fpsQueue.length)

    const time = this.clock.getDelta()
    this.scene.tick(time)
  }

  start() {
    this.clock.start()

    this.renderer.setAnimationLoop(() => {
      this.tick()
      this.renderer.render(this.scene, this.camera)
    })
  }

  stop() {
    this.clock.stop()
    this.resizer.stop()
    this.renderer.setAnimationLoop(null)
  }
}
