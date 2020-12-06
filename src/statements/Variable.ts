import { Expr } from '../Expr'
import { Stmt } from './Stmt'
import { Literal, LiteralNull } from '../Literal'
import { Enviroment } from '../Enviroment'
import { evaluateExpression } from './evaluateExpression'
import { Token } from '../Tokens'

export class StmtVariable extends Stmt {
  name: string
  expression: Expr | undefined
  constant: boolean = false

  constructor(name: Token, constant: boolean, expression?: Expr) {
    super()
    this.name = name.value ?? ''
    this.expression = expression
    this.constant = constant
  }

  execute(enviroment: Enviroment) {
    let value: Literal = new LiteralNull()
    if (this.expression) value = evaluateExpression(this.expression, enviroment)
    enviroment.define(this.name, this.constant, value)
    return null
  }
}
