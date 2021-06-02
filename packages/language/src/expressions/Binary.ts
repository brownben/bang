import { Token, BinaryOperator, getBinaryOperator } from '../tokens'
import { Expr } from './Expr'
import { Primitive } from '../primitives'
import { Enviroment } from '../Enviroment'

export class ExprBinary extends Expr {
  left: Expr
  operator: Token<BinaryOperator>
  right: Expr

  constructor(left: Expr, operator: Token, right: Expr) {
    super()
    this.left = left
    this.operator = operator as Token<BinaryOperator>
    this.right = right
  }

  async evaluate(enviroment: Enviroment): Promise<Primitive> {
    const leftEvaluated = await this.left.evaluate(enviroment)
    const rightEvaluated = await this.right.evaluate(enviroment)
    const operator = getBinaryOperator(this.operator)

    return leftEvaluated[operator](rightEvaluated)
  }
}
