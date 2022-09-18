import { BoxGeometry, Color, Mesh, MeshStandardMaterial } from 'three'

export class Cube extends Mesh<BoxGeometry, MeshStandardMaterial> {
  constructor(width: number, height: number, depth: number) {
    const geometry = new BoxGeometry(width, height, depth)
    const material = new MeshStandardMaterial()

    super(geometry, material)
  }

  set color(newColor: string) {
    this.material.color = new Color(newColor)
  }
}
