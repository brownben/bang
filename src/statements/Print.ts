import { Expr } from '../expressions'
import { Stmt } from './Stmt'
import { Enviroment } from '../Enviroment'

export class StmtPrint extends Stmt {
  expression: Expr

  constructor(expression: Expr) {
    super()
    this.expression = expression
  }

  execute(enviroment: Enviroment) {
    const value = this.expression.evaluate(enviroment)
    console.log(value.getValue())
    return null
  }
}
