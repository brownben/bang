import { Expr } from './Expr'
import { Stmt, StmtBlock } from '../statements'
import { Primitive, PrimitiveNull, PrimitiveFunction } from '../primitives'
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

    const call = (argument: Primitive[]): Primitive => {
      const functionEnviroment = new Enviroment(enviromentCopy)

      this.parameters.forEach((parameter, index) =>
        functionEnviroment.define(parameter, true, argument[index])
      )
      const block = new StmtBlock(this.body)
      block.execute(functionEnviroment)
      return new PrimitiveNull()
    }

    const functionPrimitive = new PrimitiveFunction({ name, call, arity })
    if (name) enviromentCopy.define(name, true, functionPrimitive)
    return functionPrimitive
  }
}
