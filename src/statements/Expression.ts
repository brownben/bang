import { Expr } from '../Expr'
import { Stmt } from './Stmt'
import { Enviroment } from '../Enviroment'
import { evaluateExpression } from './evaluateExpression'

export class StmtExpression extends Stmt {
  expression: Expr

  constructor(expression: Expr) {
    super()
    this.expression = expression
  }

  execute(enviroment: Enviroment) {
    return evaluateExpression(this.expression, enviroment)
  }
}
