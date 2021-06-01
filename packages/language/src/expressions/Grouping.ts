import { Expr } from './Expr'
import { Primitive } from '../primitives'
import { Enviroment } from '../Enviroment'

export class ExprGrouping extends Expr {
  expression: Expr

  constructor(expression: Expr) {
    super()
    this.expression = expression
  }

  evaluate(enviroment: Enviroment): Primitive {
    return this.expression.evaluate(enviroment)
  }
}
