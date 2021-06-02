import { Expr } from '../expressions'
import { Stmt, StmtResult } from './Stmt'
import { Enviroment } from '../Enviroment'

export class StmtExpression extends Stmt {
  expression: Expr

  constructor(expression: Expr) {
    super()
    this.expression = expression
  }

  async execute(enviroment: Enviroment): Promise<StmtResult> {
    return this.expression.evaluate(enviroment)
  }
}
