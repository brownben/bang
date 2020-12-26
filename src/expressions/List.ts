import { Token } from '../tokens'
import { Expr } from './Expr'
import { PrimitiveList } from '../primitives'
import { Enviroment } from '../Enviroment'

export class ExprList extends Expr {
  token: Token
  values: Expr[] = []

  constructor(token: Token, values: Expr[]) {
    super()
    this.token = token
    this.values = values
  }

  evaluate(enviroment: Enviroment): PrimitiveList {
    return new PrimitiveList({
      token: this.token,
      values: this.values.map((value) => value.evaluate(enviroment)),
    })
  }
}
