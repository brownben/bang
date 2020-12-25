import { Token } from '../tokens'
import { Primitive } from './Primitive'
import { PrimitiveBoolean } from './Boolean'
import { BuiltInPropertyVisitor } from './builtInProperties'
import BangError from '../BangError'

export class PrimitiveNumber extends Primitive {
  token?: Token
  value: string
  type = 'number'

  constructor(value: string | number, token?: Token) {
    super()
    this.value = token?.value ?? value.toString()
    this.token = token
  }

  getValue(): number {
    return Number(this.value)
  }

  isTruthy(): boolean {
    return true
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
    if (value instanceof PrimitiveNumber)
      return new PrimitiveBoolean(this.getValue() > value.getValue())

    throw new BangError(
      `No Operation ">" on type "${this.type}" and type "${value.type}`
    )
  }
  lessThan(value: Primitive): PrimitiveBoolean {
    if (value instanceof PrimitiveNumber)
      return new PrimitiveBoolean(this.getValue() < value.getValue())

    throw new BangError(
      `No Operation "<" on type "${this.type}" and type "${value.type}`
    )
  }
  greaterThanOrEqual(value: Primitive): PrimitiveBoolean {
    if (value instanceof PrimitiveNumber)
      return new PrimitiveBoolean(this.getValue() >= value.getValue())

    throw new BangError(
      `No Operation ">=" on type "${this.type}" and type "${value.type}`
    )
  }
  lessThanOrEqual(value: Primitive): PrimitiveBoolean {
    if (value instanceof PrimitiveNumber)
      return new PrimitiveBoolean(this.getValue() <= value.getValue())

    throw new BangError(
      `No Operation "<=" on type "${this.type}" and type "${value.type}`
    )
  }

  plus(value: Primitive): PrimitiveNumber {
    if (value instanceof PrimitiveNumber)
      return new PrimitiveNumber(this.getValue() + value.getValue())

    throw new BangError(
      `No Operation "+" on type "${this.type}" and type "${value.type}`
    )
  }
  minus(value: Primitive): PrimitiveNumber {
    if (value instanceof PrimitiveNumber)
      return new PrimitiveNumber(this.getValue() - value.getValue())

    throw new BangError(
      `No Operation "-" on type "${this.type}" and type "${value.type}`
    )
  }
  multiply(value: Primitive): PrimitiveNumber {
    if (value instanceof PrimitiveNumber)
      return new PrimitiveNumber(this.getValue() * value.getValue())

    throw new BangError(
      `No Operation "*" on type "${this.type}" and type "${value.type}`
    )
  }
  divide(value: Primitive): PrimitiveNumber {
    if (value instanceof PrimitiveNumber && value.getValue() === 0)
      throw new BangError("Maths Error - Can't Divide by 0")
    else if (value instanceof PrimitiveNumber)
      return new PrimitiveNumber(this.getValue() / value.getValue())

    throw new BangError(
      `No Operation "+" on type "${this.type}" and type "${value.type}`
    )
  }
  power(value: Primitive): PrimitiveNumber {
    if (value instanceof PrimitiveNumber)
      return new PrimitiveNumber(this.getValue() ** value.getValue())

    throw new BangError(
      `No Operation "**" on type "${this.type}" and type "${value.type}`
    )
  }

  negative(): PrimitiveNumber {
    return new PrimitiveNumber(-this.getValue())
  }

  builtInProperties(
    visitor: BuiltInPropertyVisitor
  ): Record<string, Primitive> {
    return visitor.visitNumber(this)
  }
}
