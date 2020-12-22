import { Primitive } from './Primitive'

export interface Callable {
  call(argument: Primitive[]): Primitive
  arity: number
}
