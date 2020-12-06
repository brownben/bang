import { Expr } from '../Expr'
import { Stmt } from './Stmt'
import { evaluateExpression } from './evaluateExpression'
import { Enviroment } from '../Enviroment'

export class StmtPrint extends Stmt {
  expression: Expr

  constructor(expression: Expr) {
    super()
    this.expression = expression
  }

  execute(enviroment: Enviroment) {
    const value = evaluateExpression(this.expression, enviroment)
    console.log(value.getValue())
    return null
  }
}
