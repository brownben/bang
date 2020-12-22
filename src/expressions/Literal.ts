import { Token } from '../tokens'
import { Expr } from './Expr'
import {
  Literal,
  LiteralString,
  LiteralNumber,
  LiteralBoolean,
  LiteralNull
} from '../literals'
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

  evaluate(): Literal {
    if (this.type === 'string') return new LiteralString(this.value, this.token)
    if (this.type === 'number') return new LiteralNumber(this.value, this.token)
    if (this.type === 'boolean')
      return new LiteralBoolean(this.value, this.token)
    if (this.type === 'null') return new LiteralNull(this.value, this.token)
    throw new BangError(`Unknown Literal Type "${this.type}"`)
  }
}
