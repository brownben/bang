import { Token, TokenType, LogicalOperator } from '../tokens'
import { Expr } from './Expr'
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

  async evaluate(enviroment: Enviroment) {
    const left = await this.left.evaluate(enviroment)
    const right = await this.right.evaluate(enviroment)

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
