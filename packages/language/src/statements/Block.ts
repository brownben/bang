import { Stmt, StmtResult } from './Stmt'
import { Enviroment } from '../Enviroment'

export class StmtBlock extends Stmt {
  statements: Stmt[]

  constructor(statements: Stmt[]) {
    super()
    this.statements = statements
  }

  async execute(enviroment: Enviroment): Promise<StmtResult[]> {
    const newEnviroment: Enviroment = new Enviroment(enviroment)

    const result = []

    for (const statement of this.statements)
      result.push(await statement.execute(newEnviroment))

    return result.flat()
  }
}
