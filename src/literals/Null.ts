import { Token } from '../Tokens'
import { Literal } from './Literal'
import { LiteralBoolean } from './Boolean'
import { LiteralFunction } from './Function'
import { LiteralString } from './String'
import { LiteralNumber } from './Number'

export class LiteralNull extends Literal {
  token: Token | undefined
  value: string
  type = 'null'

  constructor(value?: string, token?: Token) {
    super()
    this.value = value ?? ''
    this.token = token
  }

  getValue(): null {
    return null
  }

  isTruthy(): boolean {
    return false
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

  builtInProperties(): { [property: string]: Literal } {
    return {
      toBoolean: new LiteralFunction({
        name: 'toBoolean',
        arity: 0,
        call: () => new LiteralBoolean(false)
      }),

      toNumber: new LiteralFunction({
        name: 'toNumber',
        arity: 0,
        call: () => new LiteralNumber(0)
      }),

      toString: new LiteralFunction({
        name: 'toString',
        arity: 0,
        call: () => new LiteralString('null')
      })
    }
  }
}
