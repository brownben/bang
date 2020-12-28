import { Expr } from './Expr'
import { PrimitiveList, PrimitiveNull, PrimitiveNumber } from '../primitives'
import { Enviroment } from '../Enviroment'
import BangError from '../BangError'

export class ExprSlice extends Expr {
  start: Expr | null
  end: Expr | null

  constructor(start: Expr | null, end: Expr | null) {
    super()
    this.start = start
    this.end = end
  }

  evaluate(enviroment: Enviroment): PrimitiveList {
    const start = this.start?.evaluate(enviroment) ?? new PrimitiveNull()
    const end = this.end?.evaluate(enviroment) ?? new PrimitiveNull()

    if (!(start instanceof PrimitiveNumber) && !(this.start === null))
      throw new BangError('Slice Start Must Be a Number')
    if (!(end instanceof PrimitiveNumber) && !(this.end === null))
      throw new BangError('Slice End Must Be a Number')

    return new PrimitiveList({
      values: [start, end],
    })
  }
}
