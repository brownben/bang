import { Token } from '../tokens'
import { Expr, ExprFunction } from '../expressions'
import { Stmt } from './Stmt'
import { Primitive, PrimitiveNull } from '../primitives'
import { Enviroment } from '../Enviroment'

export class StmtVariable extends Stmt {
  name: string
  expression?: Expr
  constant: boolean = false

  constructor(name: Token, constant: boolean, expression?: Expr) {
    super()
    this.name = name.value
    this.constant = constant
    this.expression = expression
  }

  async execute(enviroment: Enviroment) {
    let value: Primitive = new PrimitiveNull()
    if (this.expression instanceof ExprFunction)
      value = await this.expression.evaluate(enviroment, this.name)
    else if (this.expression) value = await this.expression.evaluate(enviroment)

    enviroment.define(this.name, this.constant, value)
    return null
  }
}
