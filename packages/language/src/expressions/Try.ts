import { Token } from '../tokens'
import { Expr } from './Expr'
import {
  Primitive,
  PrimitiveError,
  PrimitiveList,
  PrimitiveNull,
} from '../primitives'
import { Enviroment } from '../Enviroment'
import BangError from '../BangError'

export class ExprTry extends Expr {
  keyword: Token
  value: Expr

  constructor(keyword: Token, value: Expr) {
    super()
    this.keyword = keyword
    this.value = value
  }

  async evaluate(enviroment: Enviroment) {
    let value: Primitive = new PrimitiveNull()
    let returnedError: Primitive = new PrimitiveNull()

    try {
      value = await this.value.evaluate(enviroment)
    } catch (error) {
      if (error instanceof BangError) returnedError = new PrimitiveError(error)
      else throw error
    }

    return new PrimitiveList({
      values: [value, returnedError],
      token: this.keyword,
    })
  }
}
