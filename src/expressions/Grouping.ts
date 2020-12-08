import { Expr } from './Expr'
import { Enviroment } from '../Enviroment'

export class ExprGrouping extends Expr {
  expression: Expr

  constructor(expression: Expr) {
    super()
    this.expression = expression
  }

  evaluate(enviroment: Enviroment) {
    return this.expression.evaluate(enviroment)
  }
}
