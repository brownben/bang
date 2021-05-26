import { Expr } from './Expr'
import { Stmt } from '../statements/Stmt'
import { StmtBlock } from '../statements/Block'
import {
  Primitive,
  PrimitiveNull,
  PrimitiveFunction,
  PrimitiveList,
} from '../primitives'
import { Enviroment } from '../Enviroment'

export class ExprFunction extends Expr {
  arity: number
  parameters: string[]
  body: Stmt[]
  spread: boolean

  constructor(params: string[], body: Stmt[], lastParameterIsSpread: boolean) {
    super()
    this.parameters = params
    this.spread = lastParameterIsSpread
    this.arity = params.length - Number(this.spread)
    this.body = body
  }

  evaluate(enviroment: Enviroment, name?: string): PrimitiveFunction {
    const arity = this.arity
    const enviromentCopy = enviroment

    const call = (argument: Primitive[]): Primitive => {
      const functionEnviroment = new Enviroment(enviromentCopy)

      this.parameters.forEach((parameter, index) => {
        if ((this.spread && index !== this.arity) || !this.spread)
          functionEnviroment.define(parameter, true, argument[index])
      })

      if (this.spread)
        functionEnviroment.define(
          this.parameters[this.arity],
          true,
          new PrimitiveList({ values: argument.slice(this.arity) })
        )

      const block = new StmtBlock(this.body)
      block.execute(functionEnviroment)
      return new PrimitiveNull()
    }

    return new PrimitiveFunction({ name, call, arity, spread: this.spread })
  }
}
