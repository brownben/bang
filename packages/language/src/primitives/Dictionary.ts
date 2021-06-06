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
    .map(([key, value]) => b[key]?.equals(value))
    .every((value) => value?.getValue())

interface PrimitiveDictionaryConstructor {
  token?: Token
  keyValues: Record<string, Primitive>
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
    keyValues,
    immutable = false,
  }: PrimitiveDictionaryConstructor) {
    super()
    this.token = token

    this.dictionary = keyValues
    this.immutable = immutable
  }

  get keys() {
    return Object.keys(this.dictionary)
  }
  hasKey(key: string): boolean {
    return this.keys.includes(key)
  }
  set(key: string, value: Primitive) {
    if (this.immutable)
      throw new BangError(
        'Dictionary is Immutable, Property cannot be Set',
        this.token?.line
      )

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

  getValueForKey(key: string): Primitive | undefined {
    return this.dictionary[key]
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
