import { Primitive, PrimitiveFunction, PrimitiveString } from '../primitives'

export const type = new PrimitiveFunction({
  name: 'type',
  arity: 1,
  call: (argument: Primitive[]) => {
    return new PrimitiveString(argument[0].type)
  },
})
