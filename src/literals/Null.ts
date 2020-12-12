import { Token } from '../Tokens'
import { LiteralBoolean } from './Boolean'
import { Literal } from './Literal'

export class LiteralNull extends Literal {
  token: Token | undefined
  value: string
  type = 'null'

  constructor(value?: any, token?: Token) {
    super()
    this.value = token?.value ?? value?.toString() ?? ''
    this.token = token
  }

  getValue() {
    return null
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
