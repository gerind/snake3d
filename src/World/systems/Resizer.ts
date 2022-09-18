import { PerspectiveCamera, WebGLRenderer } from 'three'



export class Resizer {
  private readonly setSize = () => {
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)

    this.camera.aspect = this.container.clientWidth / this.container.clientHeight
    this.camera.updateProjectionMatrix()
  }
  
  constructor(
    private readonly container: HTMLElement,
    private readonly camera: PerspectiveCamera,
    private readonly renderer: WebGLRenderer
  ) {
    this.setSize()

    window.addEventListener('resize', this.setSize)
  }

  stop() {
    window.removeEventListener('resize', this.setSize)
  }
}
