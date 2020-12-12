import { Token } from '../Tokens'
import { Literal } from './Literal'

export class LiteralBoolean extends Literal {
  token: Token | undefined
  value: string
  type = 'boolean'

  constructor(value?: any, token?: Token) {
    super()
    this.value = token?.value ?? value?.toString() ?? ''
    this.token = token
  }

  getValue() {
    return this.value === 'true'
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
