import { Token } from '../tokens'
import { Expr } from './Expr'
import {
  Primitive,
  PrimitiveString,
  PrimitiveNumber,
  PrimitiveBoolean,
  PrimitiveNull
} from '../primitives'
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

  evaluate(): Primitive {
    if (this.type === 'string')
      return new PrimitiveString(this.value, this.token)
    if (this.type === 'number')
      return new PrimitiveNumber(this.value, this.token)
    if (this.type === 'boolean')
      return new PrimitiveBoolean(this.value, this.token)
    if (this.type === 'null') return new PrimitiveNull(this.value, this.token)
    throw new BangError(`Unknown Primitive Type "${this.type}"`)
  }
}
