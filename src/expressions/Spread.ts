import { Token } from '../tokens'
import { Expr } from './Expr'
import { PrimitiveList } from '../primitives'
import { Enviroment } from '../Enviroment'
import BangError from '../BangError'

export class ExprSpread extends Expr {
  operator: Token
  right: Expr

  constructor(operator: Token, right: Expr) {
    super()
    this.operator = operator
    this.right = right
  }

  evaluate(enviroment: Enviroment): PrimitiveList {
    const rightEvaluated = this.right.evaluate(enviroment)

    if (rightEvaluated instanceof PrimitiveList) return rightEvaluated
    else
      throw new BangError(
        `Can only spread lists`,
        undefined,
        this.operator.line
      )
  }
}