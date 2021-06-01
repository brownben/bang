import { Token } from '../tokens'
import { Expr } from './Expr'
import { ExprSpread } from './Spread'
import { PrimitiveList } from '../primitives'
import { Enviroment } from '../Enviroment'
import BangError from '../BangError'

export class ExprList extends Expr {
  token: Token
  values: Expr[] = []

  constructor(token: Token, values: Expr[]) {
    super()
    this.token = token
    this.values = values
  }

  evaluate(enviroment: Enviroment): PrimitiveList {
    let values = []

    for (const value of this.values) {
      if (value instanceof ExprSpread) {
        const evaluated = value.evaluate(enviroment)
        if (evaluated instanceof PrimitiveList)
          evaluated.list.forEach((value) => values.push(value))
        else
          throw new BangError(
            `Can only spread lists into lists`,
            this.token.line
          )
      } else values.push(value.evaluate(enviroment))
    }

    return new PrimitiveList({ token: this.token, values })
  }
}
