import { Token } from '../Tokens'
import { LiteralBoolean } from './Boolean'
import { Literal } from './Literal'

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
}
