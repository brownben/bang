import { Token } from '../tokens'
import { Primitive, RawPrimitiveValue } from './Primitive'
import { PrimitiveBoolean } from './Boolean'
import { BuiltInPropertyVisitor } from './builtInProperties'

const listsHaveEqualValues = (a: Primitive[], b: Primitive[]) =>
  a
    .map((value, index) => value.getValue() === b?.[index]?.getValue())
    .every(Boolean)

interface PrimitiveListConstructor {
  token?: Token
  values: Primitive[]
}

export class PrimitiveList extends Primitive {
  token: Token
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

  builtInProperties(
    visitor: BuiltInPropertyVisitor
  ): Record<string, Primitive> {
    return visitor.visitList(this)
  }
}
