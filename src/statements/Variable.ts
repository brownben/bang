import { Token } from '../Tokens'
import { Expr } from '../expressions'
import { Stmt } from './Stmt'
import { Literal, LiteralNull } from '../literals'
import { Enviroment } from '../Enviroment'

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
    if (this.expression) value = this.expression.evaluate(enviroment)
    enviroment.define(this.name, this.constant, value)
    return null
  }
}
