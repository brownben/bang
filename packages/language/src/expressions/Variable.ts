import { Token } from '../tokens'
import { Expr } from './Expr'
import { Primitive } from '../primitives'
import { Enviroment } from '../Enviroment'

export class ExprVariable extends Expr {
  name: string

  constructor(name: Token) {
    super()
    this.name = name.value
  }

  evaluate(enviroment: Enviroment): Primitive {
    return enviroment.get(this.name)
  }
}
