import { Token } from '../tokens'
import { PrimitiveBoolean } from './Boolean'
import { BuiltInPropertyVisitor } from './builtInProperties'
import BangError from '../BangError'

export abstract class Primitive {
  abstract token: Token | undefined
  abstract value: string
  abstract type: string

  abstract getValue(): string | number | boolean | null
  abstract isTruthy(): boolean

  abstract builtInProperties(
    visitor: BuiltInPropertyVisitor
  ): Record<string, Primitive>

  // comparisons
  abstract equals(value: Primitive): PrimitiveBoolean
  abstract notEquals(value: Primitive): PrimitiveBoolean

  greaterThan(value: Primitive): Primitive {
    throw new BangError(
      `No Operation ">" on type "${this.type}" and type "${value.type}"`
    )
  }
  lessThan(value: Primitive): Primitive {
    throw new BangError(
      `No Operation "<" on type "${this.type}" and type "${value.type}"`
    )
  }
  greaterThanOrEqual(value: Primitive): Primitive {
    throw new BangError(
      `No Operation ">=" on type "${this.type}" and type "${value.type}"`
    )
  }
  lessThanOrEqual(value: Primitive): Primitive {
    throw new BangError(
      `No Operation "<=" on type "${this.type}" and type "${value.type}"`
    )
  }

  // unary operations
  not(): Primitive {
    throw new BangError(`No Operation "!" on type "${this.type}"`)
  }
  negative(): Primitive {
    throw new BangError(`No Operation "-" on type "${this.type}"`)
  }

  // binary operations
  plus(value: Primitive): Primitive {
    throw new BangError(
      `No Operation "+" on type "${this.type}" and type "${value.type}"`
    )
  }
  minus(value: Primitive): Primitive {
    throw new BangError(
      `No Operation "-" on type "${this.type}" and type "${value.type}"`
    )
  }
  multiply(value: Primitive): Primitive {
    throw new BangError(
      `No Operation "*" on type "${this.type}" and type "${value.type}"`
    )
  }
  divide(value: Primitive): Primitive {
    throw new BangError(
      `No Operation "/" on type "${this.type}" and type "${value.type}"`
    )
  }
  power(value: Primitive): Primitive {
    throw new BangError(
      `No Operation "**" on type "${this.type}" and type "${value.type}"`
    )
  }
}
