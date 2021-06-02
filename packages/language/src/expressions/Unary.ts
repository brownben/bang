import { Token, TokenType, UnaryOperator } from '../tokens'
import { Expr } from './Expr'
import { Enviroment } from '../Enviroment'

export class ExprUnary extends Expr {
  operator: Token
  right: Expr

  constructor(operator: Token, right: Expr) {
    super()
    this.operator = operator
    this.right = right
  }

  async evaluate(enviroment: Enviroment) {
    const rightEvaluated = await this.right.evaluate(enviroment)

    const getOperator = (operator: UnaryOperator) => {
      switch (operator) {
        case TokenType.MINUS:
          return 'negative'
        case TokenType.BANG:
          return 'not'
      }
    }

    const operator = getOperator(this.operator.type as UnaryOperator)

    return rightEvaluated[operator]()
  }
}
