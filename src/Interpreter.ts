import { Stmt, StmtResult } from './statements'
import { ReturnValue } from './primitives'
import { Enviroment } from './Enviroment'
import { defineBuiltInFunctions } from './library'
import BangError from './BangError'

export class Interpreter {
  private enviroment: Enviroment
  private statements: Stmt[]
  readonly globals: Enviroment = defineBuiltInFunctions()

  constructor(statements: Stmt[]) {
    this.enviroment = this.globals
    this.statements = statements
  }

  run(): StmtResult[] {
    return this.statements.flatMap((statement) =>
      this.executeStatement(statement)
    )
  }

  executeStatement(statement: Stmt) {
    try {
      return statement.execute(this.enviroment)
    } catch (error) {
      if (error instanceof ReturnValue)
        throw new BangError('No Top Level Return')
      else throw error
    }
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
