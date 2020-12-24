import { Token, TokenType, LogicalOperator } from '../tokens'
import { Expr } from './Expr'
import { Primitive } from '../primitives'
import { Enviroment } from '../Enviroment'

export class ExprLogical extends Expr {
  left: Expr
  operator: Token<LogicalOperator>
  right: Expr

  constructor(left: Expr, operator: Token<LogicalOperator>, right: Expr) {
    super()
    this.left = left
    this.operator = operator
    this.right = right
  }

  evaluate(enviroment: Enviroment): Primitive {
    const left = this.left.evaluate(enviroment)
    const right = this.right.evaluate(enviroment)

    switch (this.operator.type) {
      case TokenType.OR:
        if (left.isTruthy()) return left
        else return right
      case TokenType.AND:
        if (left.isTruthy()) return right
        else return left
    }
  }
}
