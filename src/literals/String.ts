import { Token } from '../Tokens'
import { Literal } from './Literal'
import { LiteralBoolean } from './Boolean'
import BangError from '../BangError'

export class LiteralString extends Literal {
  token: Token | undefined
  value: string
  type = 'string'

  constructor(value?: string, token?: Token) {
    super()
    this.value = token?.value ?? value?.toString() ?? ''
    this.token = token
  }

  getValue() {
    return this.value
  }

  plus(value: Literal): LiteralString {
    if (value instanceof LiteralString)
      return new LiteralString(this.getValue() + value.getValue())
    else
      throw new BangError(
        `No Operation "+" on type "${this.type}" and type "${value.type}`
      )
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
    if (value instanceof LiteralString)
      return new LiteralBoolean(this.getValue() > value.getValue())
    else
      throw new BangError(
        `No Operation ">" on type "${this.type}" and type "${value.type}`
      )
  }
  lessThan(value: Literal): LiteralBoolean {
    if (value instanceof LiteralString)
      return new LiteralBoolean(this.getValue() < value.getValue())
    else
      throw new BangError(
        `No Operation "<" on type "${this.type}" and type "${value.type}`
      )
  }
  greaterThanOrEqual(value: Literal): LiteralBoolean {
    if (value instanceof LiteralString)
      return new LiteralBoolean(this.getValue() >= value.getValue())
    else
      throw new BangError(
        `No Operation ">=" on type "${this.type}" and type "${value.type}`
      )
  }
  lessThanOrEqual(value: Literal): LiteralBoolean {
    if (value instanceof LiteralString)
      return new LiteralBoolean(this.getValue() <= value.getValue())
    else
      throw new BangError(
        `No Operation "<=" on type "${this.type}" and type "${value.type}`
      )
  }
}
