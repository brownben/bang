import { Literal } from './literals'

export interface Callable {
  call(argument: Literal[]): Literal
  arity: number
}
