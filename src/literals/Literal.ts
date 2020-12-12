import { Token } from '../Tokens'
import { LiteralBoolean } from './Boolean'
import BangError from '../BangError'

export abstract class Literal {
  abstract token: Token | undefined
  abstract value: string
  abstract type: string

  abstract getValue(): string | number | boolean | null

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
}
