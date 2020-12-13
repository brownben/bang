import { Expr } from './Expr'
import { Literal } from '../literals'
import { Enviroment } from '../Enviroment'

export class ExprGrouping extends Expr {
  expression: Expr

  constructor(expression: Expr) {
    super()
    this.expression = expression
  }

  evaluate(enviroment: Enviroment): Literal {
    return this.expression.evaluate(enviroment)
  }
}
