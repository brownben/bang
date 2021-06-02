import { Token } from '../tokens'
import { Primitive, RawPrimitiveValue } from './Primitive'
import { PrimitiveBoolean } from './Boolean'
import { BuiltInPropertyVisitor } from './builtInProperties'
import BangError from '../BangError'

const listsHaveEqualValues = (a: Primitive[], b: Primitive[]) =>
  a
    .map((value, index) => b?.[index] && value?.equals(b[index]))
    .every((value) => value?.getValue())

interface PrimitiveListConstructor {
  token?: Token
  values: (Primitive | Promise<Primitive>)[]
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
    values.forEach(async (value) => this.list.push(await value))
  }

  getValue(): RawPrimitiveValue[] {
    return this.list.map((value) => value.getValue())
  }

  isTruthy(): boolean {
    return true
  }

  indexExists(index: number): boolean {
    if (index >= 0 && index < this.list.length) return true
    else if (index < 0 && index >= -this.list.length) return true
    else return false
  }
  getActualIndex(index: number) {
    if (index < -this.list.length) return 0
    else if (index > this.list.length) return this.list.length

    if (index < 0) return this.list.length + index
    else return index
  }
  getValueAtIndex(index: number): Primitive {
    return this.list[this.getActualIndex(index)]
  }
  getSlice(start: number | null, end: number | null) {
    let actualStart = this.getActualIndex(start ?? 0)
    let actualEnd = this.getActualIndex(end ?? this.list.length)

    return new PrimitiveList({
      values: this.list.slice(actualStart, actualEnd),
    })
  }
  set(key: number, value: Primitive) {
    if (this.immutable)
      throw new BangError(
        'Array is Immutable, Value cannot be Set',
        this.token?.line
      )

    if (key >= 0) this.list[key] = value
    else this.list[this.list.length + key] = value

    return value
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
      throw new BangError(
        'List is immutable, it cannot be edited',
        this.token?.line
      )

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
