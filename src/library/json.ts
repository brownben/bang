import {
  PrimitiveNumber,
  PrimitiveDictionary,
  PrimitiveFunction,
  Primitive,
  PrimitiveNull,
  PrimitiveString,
  PrimitiveUnique,
  PrimitiveBoolean,
  PrimitiveList,
} from '../primitives'
import BangError from '../BangError'

const wrap = (_key: string, value: unknown) => wrapValue(value)
const wrapValue = (value: unknown): Primitive => {
  if (value instanceof Primitive) return value
  else if (value === null) return new PrimitiveNull()
  else if (value === '<unique>') return new PrimitiveUnique()
  else if (typeof value === 'string') return new PrimitiveString(value)
  else if (typeof value === 'number') return new PrimitiveNumber(value)
  else if (typeof value === 'boolean') return new PrimitiveBoolean(value)
  else if (Array.isArray(value))
    return new PrimitiveList({ values: value.map(wrapValue) })
  else
    return new PrimitiveDictionary({
      keyValues: value as Record<string, Primitive>,
    })
}

export const json = new PrimitiveDictionary({
  immutable: true,

  keyValues: {
    parse: new PrimitiveFunction({
      name: 'json.parse',
      arity: 1,
      call: (argument: Primitive[]) => {
        const [arg] = argument
        if (!(arg instanceof PrimitiveString))
          throw new BangError('Expected a string')

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
      call: (argument: Primitive[]) => {
        const [arg, whitespace] = argument

        let amount: number =
          (whitespace instanceof PrimitiveNumber && whitespace.getValue()) || 0

        return new PrimitiveString(JSON.stringify(arg.getValue(), null, amount))
      },
    }),
  },
})
