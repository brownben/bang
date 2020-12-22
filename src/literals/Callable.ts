import { Literal } from './Literal'

export interface Callable {
  call(argument: Literal[]): Literal
  arity: number
}
