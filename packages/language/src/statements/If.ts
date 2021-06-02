import { Expr } from '../expressions'
import { Stmt } from './Stmt'
import { Enviroment } from '../Enviroment'

export class StmtIf extends Stmt {
  condition: Expr
  thenBranch: Stmt
  elseBranch: Stmt | null

  constructor(condition: Expr, thenBranch: Stmt, elseBranch: Stmt | null) {
    super()
    this.condition = condition
    this.thenBranch = thenBranch
    this.elseBranch = elseBranch
  }

  async execute(enviroment: Enviroment) {
    const conditionResult = await this.condition.evaluate(enviroment)
    if (conditionResult.isTruthy()) await this.thenBranch.execute(enviroment)
    else if (this.elseBranch) await this.elseBranch.execute(enviroment)

    return null
  }
}
