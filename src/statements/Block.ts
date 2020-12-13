import { Stmt, StmtResult } from './Stmt'
import { Enviroment } from '../Enviroment'

export class StmtBlock extends Stmt {
  statements: Stmt[]

  constructor(statements: Stmt[]) {
    super()
    this.statements = statements
  }

  execute(enviroment: Enviroment): StmtResult[] {
    const newEnviroment: Enviroment = new Enviroment(enviroment)
    return this.statements.flatMap(statement =>
      statement.execute(newEnviroment)
    )
  }
}
