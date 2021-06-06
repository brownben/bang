import { Token } from '../tokens'
import { Primitive } from './Primitive'
import { PrimitiveBoolean } from './Boolean'
import { BuiltInPropertyVisitor } from './builtInProperties'
import BangError from '../BangError'

export class PrimitiveNumber extends Primitive {
  token?: Token
  value: string
  readonly type = 'number'
  readonly immutable: true = true

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
      this.getValue() === value.getValue() && this.type === value.type
    )
  }
  notEquals(value: Primitive): PrimitiveBoolean {
    return new PrimitiveBoolean(
      this.getValue() !== value.getValue() || this.type !== value.type
    )
  }

  greaterThan(value: Primitive): PrimitiveBoolean {
    if (value instanceof PrimitiveNumber)
      return new PrimitiveBoolean(this.getValue() > value.getValue())

    throw new BangError(
      `No Operation ">" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }
  lessThan(value: Primitive): PrimitiveBoolean {
    if (value instanceof PrimitiveNumber)
      return new PrimitiveBoolean(this.getValue() < value.getValue())

    throw new BangError(
      `No Operation "<" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }
  greaterThanOrEqual(value: Primitive): PrimitiveBoolean {
    if (value instanceof PrimitiveNumber)
      return new PrimitiveBoolean(this.getValue() >= value.getValue())

    throw new BangError(
      `No Operation ">=" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }
  lessThanOrEqual(value: Primitive): PrimitiveBoolean {
    if (value instanceof PrimitiveNumber)
      return new PrimitiveBoolean(this.getValue() <= value.getValue())

    throw new BangError(
      `No Operation "<=" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }

  plus(value: Primitive): PrimitiveNumber {
    if (value instanceof PrimitiveNumber)
      return new PrimitiveNumber(this.getValue() + value.getValue())

    throw new BangError(
      `No Operation "+" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }
  minus(value: Primitive): PrimitiveNumber {
    if (value instanceof PrimitiveNumber)
      return new PrimitiveNumber(this.getValue() - value.getValue())

    throw new BangError(
      `No Operation "-" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }
  multiply(value: Primitive): PrimitiveNumber {
    if (value instanceof PrimitiveNumber)
      return new PrimitiveNumber(this.getValue() * value.getValue())

    throw new BangError(
      `No Operation "*" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }
  divide(value: Primitive): PrimitiveNumber {
    if (value instanceof PrimitiveNumber && value.getValue() === 0)
      throw new BangError("Maths Error - Can't Divide by 0")
    else if (value instanceof PrimitiveNumber)
      return new PrimitiveNumber(this.getValue() / value.getValue())

    throw new BangError(
      `No Operation "+" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }
  power(value: Primitive): PrimitiveNumber {
    if (value instanceof PrimitiveNumber)
      return new PrimitiveNumber(this.getValue() ** value.getValue())

    throw new BangError(
      `No Operation "**" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }
  modulo(value: Primitive): PrimitiveNumber {
    if (value instanceof PrimitiveNumber)
      return new PrimitiveNumber(
        ((this.getValue() % value.getValue()) + value.getValue()) %
          value.getValue()
      )

    throw new BangError(
      `No Operation "%" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
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
