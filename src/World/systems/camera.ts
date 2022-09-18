import { PerspectiveCamera } from 'three'

export function createCamera(fov: number, near: number, far: number) {
  const camera = new PerspectiveCamera(fov, 1, near, far)

  return camera
}
