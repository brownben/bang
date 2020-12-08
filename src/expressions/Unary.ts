import { Token, TokenType } from '../Tokens'
import { Expr } from './Expr'
import { LiteralBoolean, LiteralNumber } from '../Literal'
import { Enviroment } from '../Enviroment'
import BangError from '../BangError'

export class ExprUnary extends Expr {
  operator: Token
  right: Expr

  constructor(operator: Token, right: Expr) {
    super()
    this.operator = operator
    this.right = right
  }

  evaluate(enviroment: Enviroment) {
    const rightEvaluated = this.right.evaluate(enviroment)

    if (
      this.operator.type === TokenType.MINUS &&
      rightEvaluated instanceof LiteralNumber
    )
      return new LiteralNumber(undefined, -rightEvaluated.getValue())
    else if (
      this.operator.type === TokenType.BANG &&
      rightEvaluated instanceof LiteralBoolean
    )
      return new LiteralBoolean(undefined, !rightEvaluated.getValue())
    else throw new BangError(`Unknown Operator ${this.operator.value}`)
  }
}
