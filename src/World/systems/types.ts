import { Object3D } from 'three'


export interface ITickable {
  tick?: (time: number) => void
}

export type AddableObject = Object3D & ITickable

export type ICellState = 'empty' | 'body' | 'head' | 'food' | 'dead'