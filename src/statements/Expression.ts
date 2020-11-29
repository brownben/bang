import { Expr } from '../Expr'
import { Stmt } from './Stmt'
import { evaluateExpression } from './evaluateExpression'

export class StmtExpression extends Stmt {
  expression: Expr

  constructor(expression: Expr) {
    super()
    this.expression = expression
  }

  execute() {
    return evaluateExpression(this.expression)
  }
}
