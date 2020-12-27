import { Token } from '../tokens'
import { Primitive, RawPrimitiveValue } from './Primitive'
import { PrimitiveBoolean } from './Boolean'
import { BuiltInPropertyVisitor } from './builtInProperties'
import BangError from '../BangError'

const listsHaveEqualValues = (a: Primitive[], b: Primitive[]) =>
  a
    .map((value, index) => value.getValue() === b?.[index]?.getValue())
    .every(Boolean)

interface PrimitiveListConstructor {
  token?: Token
  values: Primitive[]
}

export class PrimitiveList extends Primitive {
  token?: Token
  value = ''
  type = 'list'
  immutable: boolean = false

  list: Primitive[] = []

  constructor({ token, values }: PrimitiveListConstructor) {
    super()
    if (token) this.token = token
    values.forEach((value) => this.list.push(value))
  }

  getValue(): RawPrimitiveValue[] {
    return this.list.map((value) => value.getValue())
  }

  isTruthy(): boolean {
    return true
  }

  keyExists(key: number): boolean {
    if (key >= 0 && key < this.list.length) return true
    else if (key < 0 && key >= -this.list.length) return true
    else return false
  }

  getValueAtIndex(index: number): Primitive {
    if (index >= 0) return this.list[index]
    else return this.list[this.list.length + index]
  }

  equals(value: Primitive): PrimitiveBoolean {
    return new PrimitiveBoolean(
      value instanceof PrimitiveList &&
        listsHaveEqualValues(this.list, value.list) &&
        this.list.length === value.list.length
    )
  }
  notEquals(value: Primitive): PrimitiveBoolean {
    return new PrimitiveBoolean(
      !(value instanceof PrimitiveList) ||
        !listsHaveEqualValues(this.list, value.list) ||
        this.list.length !== value.list.length
    )
  }

  plus(value: Primitive): Primitive {
    if (this.immutable)
      throw new BangError('List is immutable, it cannot be edited')

    if (value instanceof PrimitiveList) this.list = this.list.concat(value.list)
    else this.list.push(value)

    return this
  }

  builtInProperties(
    visitor: BuiltInPropertyVisitor
  ): Record<string, Primitive> {
    return visitor.visitList(this)
  }
}
