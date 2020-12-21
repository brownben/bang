import { Token } from '../Tokens'
import { Expr, ExprFunction } from '../expressions'
import { Stmt } from './Stmt'
import { Literal, LiteralNull } from '../literals'
import { Enviroment } from '../Enviroment'

export class StmtVariable extends Stmt {
  name: string
  expression: Expr | undefined
  constant: boolean = false

  constructor(name: Token, constant: boolean, expression?: Expr) {
    super()
    this.name = name.value ?? '_'
    this.expression = expression
    this.constant = constant
  }

  execute(enviroment: Enviroment): null {
    let value: Literal = new LiteralNull()
    if (this.expression instanceof ExprFunction)
      value = this.expression.evaluate(enviroment, this.name)
    else if (this.expression) value = this.expression.evaluate(enviroment)

    enviroment.define(this.name, this.constant, value)
    return null
  }
}
