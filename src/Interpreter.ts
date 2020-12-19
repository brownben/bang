import { Stmt, StmtResult } from './statements'
import { Enviroment } from './Enviroment'
import { defineBuiltInFunctions } from './library'

export class Interpreter {
  private enviroment: Enviroment
  private statements: Stmt[]
  readonly globals: Enviroment = defineBuiltInFunctions()

  constructor(statements: Stmt[]) {
    this.enviroment = this.globals
    this.statements = statements
  }

  run(): StmtResult[] {
    return this.statements.flatMap(statement =>
      statement.execute(this.enviroment)
    )
  }

  getEnviroment(): Enviroment {
    return this.enviroment
  }
}

export const interpret = (statements: Stmt[]) =>
  new Interpreter(statements).run()

export const interpretFinalEnviroment = (statements: Stmt[]): Enviroment => {
  const interpreter = new Interpreter(statements)
  interpreter.run()
  return interpreter.getEnviroment()
}
