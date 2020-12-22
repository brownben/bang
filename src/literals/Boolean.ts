import { Token } from '../tokens'
import { Literal } from './Literal'
import { LiteralFunction } from './Function'
import { LiteralNumber } from './Number'
import { LiteralString } from './String'

export class LiteralBoolean extends Literal {
  token: Token | undefined
  value: string
  type = 'boolean'

  constructor(value?: any, token?: Token) {
    super()
    this.value = token?.value ?? value?.toString() ?? ''
    this.token = token
  }

  getValue(): boolean {
    return this.value === 'true'
  }

  isTruthy(): boolean {
    return this.getValue()
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

  not(): LiteralBoolean {
    return new LiteralBoolean(!this.getValue())
  }

  builtInProperties(): { [property: string]: Literal } {
    return {
      toBoolean: new LiteralFunction({
        name: 'toBoolean',
        arity: 0,
        call: () => new LiteralBoolean(this.value)
      }),

      toNumber: new LiteralFunction({
        name: 'toNumber',
        arity: 0,
        call: () => {
          if (this.getValue()) return new LiteralNumber(1)
          else return new LiteralNumber(0)
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
