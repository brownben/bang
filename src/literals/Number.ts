import { Token } from '../Tokens'
import { Literal } from './Literal'
import { LiteralBoolean } from './Boolean'
import BangError from '../BangError'

export class LiteralNumber extends Literal {
  token: Token | undefined
  value: string
  type = 'number'

  constructor(value?: number | string, token?: Token) {
    super()
    this.value = token?.value ?? value?.toString() ?? ''
    this.token = token
  }

  getValue() {
    return Number(this.value)
  }

  equals(value: Literal): LiteralBoolean {
    return new LiteralBoolean(
      this.value === value.value && this.type === value.type
    )
  }
  notEquals(value: Literal): LiteralBoolean {
    return new LiteralBoolean(
      this.value !== value.value || this.type !== value.type
    )
  }

  greaterThan(value: Literal): LiteralBoolean {
    if (value instanceof LiteralNumber)
      return new LiteralBoolean(this.getValue() > value.getValue())
    else
      throw new BangError(
        `No Operation ">" on type "${this.type}" and type "${value.type}`
      )
  }
  lessThan(value: Literal): LiteralBoolean {
    if (value instanceof LiteralNumber)
      return new LiteralBoolean(this.getValue() < value.getValue())
    else
      throw new BangError(
        `No Operation "<" on type "${this.type}" and type "${value.type}`
      )
  }
  greaterThanOrEqual(value: Literal): LiteralBoolean {
    if (value instanceof LiteralNumber)
      return new LiteralBoolean(this.getValue() >= value.getValue())
    else
      throw new BangError(
        `No Operation ">=" on type "${this.type}" and type "${value.type}`
      )
  }
  lessThanOrEqual(value: Literal): LiteralBoolean {
    if (value instanceof LiteralNumber)
      return new LiteralBoolean(this.getValue() <= value.getValue())
    else
      throw new BangError(
        `No Operation "<=" on type "${this.type}" and type "${value.type}`
      )
  }

  plus(value: Literal): LiteralNumber {
    if (value instanceof LiteralNumber)
      return new LiteralNumber(this.getValue() + value.getValue())
    else
      throw new BangError(
        `No Operation "+" on type "${this.type}" and type "${value.type}`
      )
  }
  minus(value: Literal): LiteralNumber {
    if (value instanceof LiteralNumber)
      return new LiteralNumber(this.getValue() - value.getValue())
    else
      throw new BangError(
        `No Operation "-" on type "${this.type}" and type "${value.type}`
      )
  }
  multiply(value: Literal): LiteralNumber {
    if (value instanceof LiteralNumber)
      return new LiteralNumber(this.getValue() * value.getValue())
    else
      throw new BangError(
        `No Operation "*" on type "${this.type}" and type "${value.type}`
      )
  }
  divide(value: Literal): LiteralNumber {
    if (value instanceof LiteralNumber && value.getValue() === 0)
      throw new BangError("Maths Error - Can't Divide by 0")
    else if (value instanceof LiteralNumber)
      return new LiteralNumber(this.getValue() / value.getValue())
    else
      throw new BangError(
        `No Operation "+" on type "${this.type}" and type "${value.type}`
      )
  }

  unaryMinus(): LiteralNumber {
    return new LiteralNumber(-this.getValue())
  }
}
