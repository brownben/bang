import { Primitive, PrimitiveFunction, PrimitiveNull } from '../primitives'

export const print = new PrimitiveFunction({
  name: 'print',
  arity: 1,
  call: (argument: Primitive[]) => {
    console.log(argument[0].getValue())
    return new PrimitiveNull()
  },
})
