import { TextureLoader } from 'three'

export function createTexture(path: string) {
  const textureLoader = new TextureLoader()

  const texture = textureLoader.load(path)

  return texture
}

export const podzolTexture = createTexture('/podzol_top.png')
