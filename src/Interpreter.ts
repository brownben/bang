import { Stmt } from './statements'
import { Enviroment, EnviromentVariables } from './Enviroment'

export class Interpreter {
  private enviroment: Enviroment
  private statements: Stmt[]

  constructor(statements: Stmt[]) {
    this.enviroment = new Enviroment()
    this.statements = statements
  }

  run() {
    return this.statements.map(statement => statement.execute(this.enviroment))
  }

  getEnviroment() {
    return this.enviroment.getValues()
  }
}

export const interpret = (statements: Stmt[]) =>
  new Interpreter(statements).run()

export const interpretFinalEnviroment = (
  statements: Stmt[]
): EnviromentVariables => {
  const interpreter = new Interpreter(statements)
  interpreter.run()
  return interpreter.getEnviroment()
}
