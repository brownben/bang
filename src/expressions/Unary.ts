import { Token, TokenType } from '../Tokens'
import { Expr } from './Expr'
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

    const getOperator = (operator: TokenType) => {
      if (operator === TokenType.MINUS) return 'unaryMinus'
      else if (operator === TokenType.BANG) return 'not'
      else throw new BangError(`Unknown Operator ${this.operator.value}`)
    }

    const operator = getOperator(this.operator.type)

    return rightEvaluated[operator]()
  }
}
