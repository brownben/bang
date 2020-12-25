import { Token } from '../tokens'
import { Expr } from './Expr'
import {
  Primitive,
  PrimitiveString,
  PrimitiveNumber,
  PrimitiveBoolean,
  PrimitiveNull,
} from '../primitives'

type LiteralTypes = 'string' | 'number' | 'boolean' | 'null'

export class ExprLiteral extends Expr {
  type: LiteralTypes
  value: string
  token?: Token

  constructor(
    type: LiteralTypes,
    token: Token,
    value?: string | number | boolean | null
  ) {
    super()
    this.type = type
    this.value = value?.toString() ?? ''
    this.token = token
  }

  evaluate(): Primitive {
    switch (this.type) {
      case 'string':
        return new PrimitiveString(this.value, this.token)
      case 'number':
        return new PrimitiveNumber(this.value, this.token)
      case 'boolean':
        return new PrimitiveBoolean(this.value, this.token)
      case 'null':
        return new PrimitiveNull(this.value, this.token)
    }
  }
}
