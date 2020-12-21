import { Token } from '../Tokens'
import { Literal } from './Literal'
import { LiteralBoolean } from './Boolean'
import { LiteralFunction } from './Function'
import { LiteralNumber } from './Number'
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

  getValue(): string {
    return this.value
  }

  isTruthy(): boolean {
    return true
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

  builtInProperties(): { [property: string]: Literal } {
    return {
      length: new LiteralNumber(this.value.length),

      toBoolean: new LiteralFunction({
        name: 'toBoolean',
        arity: 0,
        call: () => new LiteralBoolean(this.value !== '')
      }),

      toNumber: new LiteralFunction({
        name: 'toNumber',
        arity: 0,
        call: () => {
          const asNumber = Number(this.value.replace(/_/g, ''))
          if (!Number.isNaN(asNumber)) return new LiteralNumber(asNumber)
          else throw new BangError(`Can't convert "${this.value}" to a number`)
        }
      }),

      toString: new LiteralFunction({
        name: 'toString',
        arity: 0,
        call: () => new LiteralString(this.value)
      })
    }
  }
}
