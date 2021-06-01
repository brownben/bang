import { RawPrimitiveValue } from '../primitives/Primitive'
import { Primitive, PrimitiveFunction, PrimitiveNull } from '../primitives'

export type PrintFunction = (value: RawPrimitiveValue) => void

export const print = (printFunction: PrintFunction = console.log) =>
  new PrimitiveFunction({
    name: 'print',
    arity: 1,
    call: (argument: Primitive[]) => {
      printFunction(argument[0].getValue())
      return new PrimitiveNull()
    },
  })
