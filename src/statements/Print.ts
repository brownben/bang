import { Expr } from '../Expr'
import { Stmt } from './Stmt'
import { evaluateExpression } from './evaluateExpression'

export class StmtPrint extends Stmt {
  expression: Expr

  constructor(expression: Expr) {
    super()
    this.expression = expression
  }

  execute() {
    const value = evaluateExpression(this.expression)
    console.log(value.getRawValue())
    return null
  }
}
