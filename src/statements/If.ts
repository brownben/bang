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

  execute(enviroment: Enviroment): null {
    if (this.condition.evaluate(enviroment).isTruthy())
      this.thenBranch.execute(enviroment)
    else if (this.elseBranch) this.elseBranch.execute(enviroment)

    return null
  }
}
