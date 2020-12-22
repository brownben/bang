import { Token, TokenType } from '../tokens'
import { Expr } from './Expr'
import { Primitive } from '../primitives'
import { Enviroment } from '../Enviroment'
import BangError from '../BangError'

export class ExprBinary extends Expr {
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
    const leftEvaluated = this.left.evaluate(enviroment)
    const rightEvaluated = this.right.evaluate(enviroment)

    const getOperator = (operator: TokenType) => {
      if (operator === TokenType.EQUAL_EQUAL) return 'equals'
      else if (operator === TokenType.BANG_EQUAL) return 'notEquals'
      else if (operator === TokenType.PLUS) return 'plus'
      else if (operator === TokenType.MINUS) return 'minus'
      else if (operator === TokenType.STAR) return 'multiply'
      else if (operator === TokenType.SLASH) return 'divide'
      else if (operator === TokenType.STAR_STAR) return 'power'
      else if (operator === TokenType.LESS) return 'lessThan'
      else if (operator === TokenType.GREATER) return 'greaterThan'
      else if (operator === TokenType.LESS_EQUAL) return 'lessThanOrEqual'
      else if (operator === TokenType.GREATER_EQUAL) return 'greaterThanOrEqual'
      else throw new BangError(`Unknown Operator ${this.operator.value}`)
    }

    const operator = getOperator(this.operator.type)

    return leftEvaluated[operator](rightEvaluated)
  }
}
