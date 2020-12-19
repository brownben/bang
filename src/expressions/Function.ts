import { Token } from '../Tokens'
import { Expr } from '.'
import { Stmt, StmtBlock } from '../statements'
import { Literal, LiteralNull, LiteralFunction } from '../literals'
import { Enviroment } from '../Enviroment'

export class ExprFunction extends Expr {
  name: string
  arity: number
  parameters: string[]
  body: Stmt[]

  constructor(name: Token, params: string[], body: Stmt[]) {
    super()
    this.name = name?.value ?? '_'
    this.parameters = params
    this.arity = params.length
    this.body = body
  }

  evaluate(enviroment: Enviroment) {
    const call = (argument: Literal[]): Literal => {
      const functionEnviroment = new Enviroment(enviroment)
      this.parameters.forEach((parameter, index) =>
        functionEnviroment.define(parameter, true, argument[index])
      )
      const block = new StmtBlock(this.body)
      block.execute(functionEnviroment)
      return new LiteralNull()
    }
    return new LiteralFunction(this.name, this.arity, call)
  }
}
