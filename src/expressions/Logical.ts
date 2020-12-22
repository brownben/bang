import { Token, TokenType } from '../tokens'
import { Expr } from './Expr'
import { Primitive } from '../primitives'
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

  evaluate(enviroment: Enviroment): Primitive {
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
