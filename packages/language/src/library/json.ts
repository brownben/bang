import {
  Primitive,
  PrimitiveDictionary,
  PrimitiveFunction,
  PrimitiveNumber,
  PrimitiveString,
} from '../primitives'
import BangError from '../BangError'
import { wrapValue } from './wrapper'

const wrap = (_key: string, value: unknown) => wrapValue(value)

export const json = new PrimitiveDictionary({
  immutable: true,

  keyValues: {
    parse: new PrimitiveFunction({
      name: 'json.parse',
      arity: 1,
      call: ([arg]: Primitive[]) => {
        if (!(arg instanceof PrimitiveString))
          throw new BangError('Expected input to be a string')

        try {
          return wrapValue(JSON.parse(arg.getValue(), wrap))
        } catch {
          throw new BangError('Problem parsing JSON')
        }
      },
    }),

    stringify: new PrimitiveFunction({
      name: 'json.stringify',
      arity: 1,
      spread: true,
      call: ([arg, whitespace]: Primitive[]) => {
        let amount: number =
          (whitespace instanceof PrimitiveNumber && whitespace.getValue()) || 0

        return new PrimitiveString(JSON.stringify(arg.getValue(), null, amount))
      },
    }),
  },
})
