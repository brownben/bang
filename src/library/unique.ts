import { PrimitiveFunction, PrimitiveUnique } from '../primitives'

export const unique = new PrimitiveFunction({
  name: 'unique',
  arity: 0,
  spread: false,
  call: () => new PrimitiveUnique(),
})
