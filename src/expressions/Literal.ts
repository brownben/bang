import { Token } from '../Tokens'
import { Expr } from './Expr'
import {
  LiteralString,
  LiteralNumber,
  LiteralBoolean,
  LiteralNull
} from '../Literal'
import BangError from '../BangError'

export class ExprLiteral extends Expr {
  type: string
  value: string
  token: Token | undefined

  constructor(type: string, token?: Token, value?: any) {
    super()
    this.type = type
    this.value = token?.value ?? value?.toString() ?? ''
    this.token = token
  }

  evaluate() {
    if (this.type === 'string') return new LiteralString(this.token, this.value)
    if (this.type === 'number') return new LiteralNumber(this.token, this.value)
    if (this.type === 'boolean')
      return new LiteralBoolean(this.token, this.value)
    if (this.type === 'null') return new LiteralNull(this.token, this.value)
    throw new BangError(`Unknown Literal Type "${this.type}"`)
  }
}
