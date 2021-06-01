import { Stmt, StmtResult } from './statements'
import { ReturnValue } from './primitives'
import { Enviroment } from './Enviroment'
import { defineBuiltInFunctions, ExternalIO } from './library'
import { wrapValue } from './library/wrapper'
import BangError from './BangError'

export class Interpreter {
  private enviroment: Enviroment

  constructor(externalIO: ExternalIO, foreignValues?: Record<string, unknown>) {
    this.enviroment = defineBuiltInFunctions(externalIO)

    for (const key in foreignValues)
      this.enviroment.define(key, true, wrapValue(foreignValues[key]))
  }

  run(statements: Stmt[]): StmtResult[] {
    return statements.flatMap((statement) => this.executeStatement(statement))
  }

  executeStatement(statement: Stmt) {
    try {
      return statement.execute(this.enviroment)
    } catch (error) {
      if (error instanceof ReturnValue)
        throw new BangError('Cannot return outside a function')
      else throw error
    }
  }

  getEnviroment(): Enviroment {
    return this.enviroment
  }
}
