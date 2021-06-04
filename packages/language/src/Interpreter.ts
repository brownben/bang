import { Stmt, StmtResult } from './statements'
import { Primitive, ReturnValue } from './primitives'
import { Enviroment } from './Enviroment'
import { defineBuiltInFunctions, ExternalIO } from './library'
import { deepWrap } from './library/wrapper'

export class Interpreter {
  private enviroment: Enviroment
  private exports: Primitive | undefined

  constructor(externalIO: ExternalIO, foreignValues?: Record<string, unknown>) {
    this.enviroment = defineBuiltInFunctions(externalIO)

    for (const key in foreignValues)
      this.enviroment.define(key, true, deepWrap(foreignValues[key]))
  }

  async run(statements: Stmt[]): Promise<StmtResult[]> {
    const result = []

    for (const statement of statements)
      result.push(await this.executeStatement(statement))

    return result.flat()
  }

  async executeStatement(statement: Stmt) {
    try {
      return await statement.execute(this.enviroment)
    } catch (error) {
      if (error instanceof ReturnValue) {
        this.exports = error.value
        return error.value
      } else throw error
    }
  }

  getEnviroment(): Enviroment {
    return this.enviroment
  }

  getExports(): Primitive | undefined {
    return this.exports
  }
}
