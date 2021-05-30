import { Token } from '../tokens'
import { Primitive } from './Primitive'
import { PrimitiveBoolean } from './Boolean'
import { BuiltInPropertyVisitor } from './builtInProperties'
import BangError from '../BangError'

export class PrimitiveString extends Primitive {
  token?: Token
  value: string
  readonly type = 'string'
  readonly immutable: true = true

  constructor(value: string, token?: Token) {
    super()
    this.value = token?.value ?? value.toString()
    this.token = token
  }

  getValue(): string {
    return this.value
  }

  isTruthy(): boolean {
    return true
  }

  indexExists(index: number): boolean {
    if (index >= 0 && index < this.value.length) return true
    else if (index < 0 && index >= -this.value.length) return true
    else return false
  }
  getActualIndex(index: number) {
    if (index < -this.value.length) return 0
    else if (index > this.value.length) return this.value.length

    if (index < 0) return this.value.length + index
    else return index
  }
  getValueAtIndex(index: number): PrimitiveString {
    return new PrimitiveString(this.value[this.getActualIndex(index)])
  }
  getSlice(start: number | null, end: number | null) {
    let actualStart = this.getActualIndex(start ?? 0)
    let actualEnd = this.getActualIndex(end ?? this.value.length)

    return new PrimitiveString(this.value.substring(actualStart, actualEnd))
  }

  plus(value: Primitive): PrimitiveString {
    if (value instanceof PrimitiveString)
      return new PrimitiveString(this.getValue() + value.getValue())

    throw new BangError(
      `No Operation "+" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }

  equals(value: Primitive): PrimitiveBoolean {
    return new PrimitiveBoolean(
      this.value === value.value && this.type === value.type
    )
  }
  notEquals(value: Primitive): PrimitiveBoolean {
    return new PrimitiveBoolean(
      this.value !== value.value || this.type !== value.type
    )
  }

  greaterThan(value: Primitive): PrimitiveBoolean {
    if (value instanceof PrimitiveString)
      return new PrimitiveBoolean(this.getValue() > value.getValue())

    throw new BangError(
      `No Operation ">" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }
  lessThan(value: Primitive): PrimitiveBoolean {
    if (value instanceof PrimitiveString)
      return new PrimitiveBoolean(this.getValue() < value.getValue())

    throw new BangError(
      `No Operation "<" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }
  greaterThanOrEqual(value: Primitive): PrimitiveBoolean {
    if (value instanceof PrimitiveString)
      return new PrimitiveBoolean(this.getValue() >= value.getValue())

    throw new BangError(
      `No Operation ">=" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }
  lessThanOrEqual(value: Primitive): PrimitiveBoolean {
    if (value instanceof PrimitiveString)
      return new PrimitiveBoolean(this.getValue() <= value.getValue())

    throw new BangError(
      `No Operation "<=" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }

  builtInProperties(
    visitor: BuiltInPropertyVisitor
  ): Record<string, Primitive> {
    return visitor.visitString(this)
  }
}
