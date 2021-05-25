import { Token } from '../tokens'
import { Expr, ExprFunction } from '../expressions'
import { Stmt } from './Stmt'
import { Primitive, PrimitiveNull } from '../primitives'
import { Enviroment } from '../Enviroment'
import { builtInFunctions, isBuiltinIdentfier } from '../library'
import BangError from '../BangError'

export class StmtVariable extends Stmt {
  name: string
  expression?: Expr | Token
  constant: boolean = false

  constructor(name: Token, constant: boolean, expression?: Expr | Token) {
    super()
    this.name = name.value
    this.constant = constant
    this.expression = expression
  }

  execute(enviroment: Enviroment): null {
    let value: Primitive = new PrimitiveNull()
    if (this.expression instanceof ExprFunction)
      value = this.expression.evaluate(enviroment, this.name)
    else if (this.expression instanceof Token) {
      if (isBuiltinIdentfier(this.expression.value))
        value = builtInFunctions[this.expression.value]
      else
        throw new BangError(
          `Unknown library ${this.expression.value}, only builtin libraries can be imported currently`,
          undefined,
          this.expression.line
        )
    } else if (this.expression) value = this.expression.evaluate(enviroment)

    enviroment.define(this.name, this.constant, value)
    return null
  }
}
