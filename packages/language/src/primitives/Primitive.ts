import { Token } from '../tokens'
import { PrimitiveBoolean } from './Boolean'
import { BuiltInPropertyVisitor } from './builtInProperties'
import BangError from '../BangError'

type RawLiteralValue = string | number | boolean | null
interface RawPrimitiveDictionaryValue {
  [key: string]: RawPrimitiveValue
}
export type RawPrimitiveValue =
  | RawLiteralValue
  | RawPrimitiveDictionaryValue
  | RawPrimitiveValue[]

export abstract class Primitive {
  abstract token?: Token
  abstract value: string
  abstract type: string
  abstract immutable: boolean

  abstract getValue(): RawPrimitiveValue
  abstract isTruthy(): boolean

  abstract builtInProperties(
    visitor: BuiltInPropertyVisitor
  ): Record<string, Primitive>

  // comparisons
  abstract equals(value: Primitive): PrimitiveBoolean
  abstract notEquals(value: Primitive): PrimitiveBoolean

  greaterThan(value: Primitive): Primitive {
    throw new BangError(
      `No Operation ">" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }
  lessThan(value: Primitive): Primitive {
    throw new BangError(
      `No Operation "<" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }
  greaterThanOrEqual(value: Primitive): Primitive {
    throw new BangError(
      `No Operation ">=" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }
  lessThanOrEqual(value: Primitive): Primitive {
    throw new BangError(
      `No Operation "<=" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }

  // unary operations
  not(): Primitive {
    throw new BangError(
      `No Operation "!" on type "${this.type}"`,
      this.token?.line
    )
  }
  negative(): Primitive {
    throw new BangError(
      `No Operation "-" on type "${this.type}"`,
      this.token?.line
    )
  }

  // binary operations
  plus(value: Primitive): Primitive {
    throw new BangError(
      `No Operation "+" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }
  minus(value: Primitive): Primitive {
    throw new BangError(
      `No Operation "-" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }
  multiply(value: Primitive): Primitive {
    throw new BangError(
      `No Operation "*" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }
  divide(value: Primitive): Primitive {
    throw new BangError(
      `No Operation "/" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }
  power(value: Primitive): Primitive {
    throw new BangError(
      `No Operation "**" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }
  modulo(value: Primitive): Primitive {
    throw new BangError(
      `No Operation "%" on type "${this.type}" and type "${value.type}"`,
      this.token?.line
    )
  }
}
