import { Expr } from './Expr'
import { Stmt, StmtBlock } from '../statements'
import { Literal, LiteralNull, LiteralFunction } from '../literals'
import { Enviroment } from '../Enviroment'

export class ExprFunction extends Expr {
  arity: number
  parameters: string[]
  body: Stmt[]

  constructor(params: string[], body: Stmt[]) {
    super()
    this.parameters = params
    this.arity = params.length
    this.body = body
  }

  evaluate(enviroment: Enviroment, name?: string) {
    const arity = this.arity
    const enviromentCopy = enviroment.clone()

    const call = (argument: Literal[]): Literal => {
      const functionEnviroment = new Enviroment(enviromentCopy)

      this.parameters.forEach((parameter, index) =>
        functionEnviroment.define(parameter, true, argument[index])
      )
      const block = new StmtBlock(this.body)
      block.execute(functionEnviroment)
      return new LiteralNull()
    }

    const functionLiteral = new LiteralFunction({ name, call, arity })
    if (name) enviromentCopy.define(name, true, functionLiteral)
    return functionLiteral
  }
}
