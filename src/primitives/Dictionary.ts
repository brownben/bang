import { Token } from '../tokens'
import { Primitive, RawPrimitiveValue } from './Primitive'
import { PrimitiveBoolean } from './Boolean'
import { BuiltInPropertyVisitor } from './builtInProperties'
import BangError from '../BangError'

const dictionariesHaveEqualValues = (
  a: Record<string, Primitive>,
  b: Record<string, Primitive>
) =>
  Object.entries(a)
    .map(([key, value]) => b[key]?.getValue() === value.getValue())
    .every(Boolean)

interface PrimitiveDictionaryConstructor {
  token?: Token
  keys: string[]
  values: Primitive[]
  keyValues?: Record<string, Primitive>
  immutable?: boolean
}

export class PrimitiveDictionary extends Primitive {
  token?: Token
  value = ''
  type = 'dictionary'
  immutable: boolean

  dictionary: Record<string, Primitive> = {}

  constructor({
    token,
    keys,
    values,
    keyValues,
    immutable = false,
  }: PrimitiveDictionaryConstructor) {
    super()
    this.token = token

    if (keyValues) this.dictionary = keyValues
    this.immutable = immutable

    keys.forEach((key, index) => {
      this.dictionary[key] = values[index]
    })
  }

  get keys() {
    return Object.keys(this.dictionary)
  }
  keyExists(key: string): boolean {
    return this.keys.includes(key)
  }
  set(key: string, value: Primitive) {
    if (this.immutable)
      throw new BangError('Dictionary is Immutable, Property cannot be Set')

    this.dictionary[key] = value
    return value
  }

  getValue(): Record<string, RawPrimitiveValue> {
    return Object.fromEntries(
      Object.entries(this.dictionary).map(([key, value]) => {
        return [key, value.getValue()]
      })
    )
  }

  isTruthy(): boolean {
    return true
  }

  equals(value: Primitive): PrimitiveBoolean {
    return new PrimitiveBoolean(
      value instanceof PrimitiveDictionary &&
        dictionariesHaveEqualValues(this.dictionary, value.dictionary) &&
        this.keys.length === value.keys.length
    )
  }
  notEquals(value: Primitive): PrimitiveBoolean {
    return new PrimitiveBoolean(
      !(value instanceof PrimitiveDictionary) ||
        !dictionariesHaveEqualValues(this.dictionary, value.dictionary) ||
        this.keys.length !== value.keys.length
    )
  }

  builtInProperties(
    visitor: BuiltInPropertyVisitor
  ): Record<string, Primitive> {
    return visitor.visitDictionary(this)
  }
}
