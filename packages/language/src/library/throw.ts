import { Primitive, PrimitiveFunction } from '../primitives'
import BangError from '../BangError'

export const throwFunc = new PrimitiveFunction({
  name: 'throw',
  arity: 1,
  call: ([message]: Primitive[]) => {
    throw new BangError(String(message.getValue()), message?.token?.line)
  },
})
