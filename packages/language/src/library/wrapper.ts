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

export const wrapValue = (value: unknown): Primitive => {
  if (value instanceof Primitive) return value
  else if (value === null || value === undefined) return new PrimitiveNull()
  else if (value === '<unique>' || typeof value === 'symbol')
    return new PrimitiveUnique()
  else if (typeof value === 'string') return new PrimitiveString(value)
  else if (typeof value === 'number') return new PrimitiveNumber(value)
  else if (typeof value === 'boolean') return new PrimitiveBoolean(value)
  else if (Array.isArray(value))
    return new PrimitiveList({ values: value.map(wrapValue) })
  else if (typeof value === 'function')
    return new PrimitiveFunction({
      name: value.name,
      arity: value.length,
      spread: true,
      call: (args: Primitive[]) =>
        wrapValue(value(...args.map((arg) => arg.getValue()))),
    })
  else
    return new PrimitiveDictionary({
      keyValues: value as Record<string, Primitive>,
    })
}
