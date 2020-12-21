import { Token } from '../Tokens'
import { LiteralBoolean } from './Boolean'
import BangError from '../BangError'

export abstract class Literal {
  abstract token: Token | undefined
  abstract value: string
  abstract type: string

  abstract getValue(): string | number | boolean | null
  abstract isTruthy(): boolean

  abstract builtInProperties(): { [property: string]: Literal }
  getBuiltInProperty(property: string): Literal {
    const value = this.builtInProperties()?.[property]
    if (value) return value
    else
      throw new BangError(
        `Property ${property} doesn't exists on type "${this.type}"`
      )
  }

  // comparisons
  abstract equals(value: Literal): LiteralBoolean
  abstract notEquals(value: Literal): LiteralBoolean

  greaterThan(value: Literal): Literal {
    throw new BangError(
      `No Operation ">" on type "${this.type}" and type "${value.type}"`
    )
  }
  lessThan(value: Literal): Literal {
    throw new BangError(
      `No Operation "<" on type "${this.type}" and type "${value.type}"`
    )
  }
  greaterThanOrEqual(value: Literal): Literal {
    throw new BangError(
      `No Operation ">=" on type "${this.type}" and type "${value.type}"`
    )
  }
  lessThanOrEqual(value: Literal): Literal {
    throw new BangError(
      `No Operation "<=" on type "${this.type}" and type "${value.type}"`
    )
  }

  // unary operations
  not(): Literal {
    throw new BangError(`No Operation "!" on type "${this.type}"`)
  }
  negative(): Literal {
    throw new BangError(`No Operation "-" on type "${this.type}"`)
  }

  // binary operations
  plus(value: Literal): Literal {
    throw new BangError(
      `No Operation "+" on type "${this.type}" and type "${value.type}"`
    )
  }
  minus(value: Literal): Literal {
    throw new BangError(
      `No Operation "-" on type "${this.type}" and type "${value.type}"`
    )
  }
  multiply(value: Literal): Literal {
    throw new BangError(
      `No Operation "*" on type "${this.type}" and type "${value.type}"`
    )
  }
  divide(value: Literal): Literal {
    throw new BangError(
      `No Operation "/" on type "${this.type}" and type "${value.type}"`
    )
  }
  power(value: Literal): Literal {
    throw new BangError(
      `No Operation "**" on type "${this.type}" and type "${value.type}"`
    )
  }
}
