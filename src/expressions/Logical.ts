import { Token, TokenType } from '../Tokens'
import { Expr } from './Expr'
import { Literal } from '../literals'
import { Enviroment } from '../Enviroment'
import BangError from '../BangError'

export class ExprLogical extends Expr {
  left: Expr
  operator: Token
  right: Expr

  constructor(left: Expr, operator: Token, right: Expr) {
    super()
    this.left = left
    this.operator = operator
    this.right = right
  }

  evaluate(enviroment: Enviroment): Literal {
    const left = this.left.evaluate(enviroment)
    const right = this.right.evaluate(enviroment)

    if (this.operator.type === TokenType.OR) {
      if (left.isTruthy()) return left
      else return right
    } else if (this.operator.type === TokenType.AND) {
      if (left.isTruthy()) return right
      else return left
    } else
      throw new BangError(`Unknown Logical Operator ${this.operator.value}`)
  }
}
