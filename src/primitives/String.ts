import { Token } from '../tokens'
import { Primitive } from './Primitive'
import { PrimitiveBoolean } from './Boolean'
import { BuiltInPropertyVisitor } from './builtInProperties'
import BangError from '../BangError'

export class PrimitiveString extends Primitive {
  token: Token | undefined
  value: string
  type = 'string'

  constructor(value?: string, token?: Token) {
    super()
    this.value = token?.value ?? value?.toString() ?? ''
    this.token = token
  }

  getValue(): string {
    return this.value
  }

  isTruthy(): boolean {
    return true
  }

  plus(value: Primitive): PrimitiveString {
    if (value instanceof PrimitiveString)
      return new PrimitiveString(this.getValue() + value.getValue())
    else
      throw new BangError(
        `No Operation "+" on type "${this.type}" and type "${value.type}`
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
    else
      throw new BangError(
        `No Operation ">" on type "${this.type}" and type "${value.type}`
      )
  }
  lessThan(value: Primitive): PrimitiveBoolean {
    if (value instanceof PrimitiveString)
      return new PrimitiveBoolean(this.getValue() < value.getValue())
    else
      throw new BangError(
        `No Operation "<" on type "${this.type}" and type "${value.type}`
      )
  }
  greaterThanOrEqual(value: Primitive): PrimitiveBoolean {
    if (value instanceof PrimitiveString)
      return new PrimitiveBoolean(this.getValue() >= value.getValue())
    else
      throw new BangError(
        `No Operation ">=" on type "${this.type}" and type "${value.type}`
      )
  }
  lessThanOrEqual(value: Primitive): PrimitiveBoolean {
    if (value instanceof PrimitiveString)
      return new PrimitiveBoolean(this.getValue() <= value.getValue())
    else
      throw new BangError(
        `No Operation "<=" on type "${this.type}" and type "${value.type}`
      )
  }

  builtInProperties(
    visitor: BuiltInPropertyVisitor
  ): Record<string, Primitive> {
    return visitor.visitString(this)
  }
}
