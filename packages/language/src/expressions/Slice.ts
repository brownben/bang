import { Token } from '../tokens'
import { Expr } from './Expr'
import { PrimitiveList, PrimitiveNull, PrimitiveNumber } from '../primitives'
import { Enviroment } from '../Enviroment'
import BangError from '../BangError'

export class ExprSlice extends Expr {
  token: Token
  start: Expr | null
  end: Expr | null

  constructor(start: Expr | null, end: Expr | null, token: Token) {
    super()
    this.start = start
    this.end = end
    this.token = token
  }

  evaluate(enviroment: Enviroment): PrimitiveList {
    const start = this.start?.evaluate(enviroment) ?? new PrimitiveNull()
    const end = this.end?.evaluate(enviroment) ?? new PrimitiveNull()

    if (!(start instanceof PrimitiveNumber) && !(this.start === null))
      throw new BangError('Slice Start Must Be a Number', this.token.line)
    if (!(end instanceof PrimitiveNumber) && !(this.end === null))
      throw new BangError('Slice End Must Be a Number', this.token.line)

    return new PrimitiveList({
      values: [start, end],
    })
  }
}
