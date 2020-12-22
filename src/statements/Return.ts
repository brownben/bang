import { Token } from '../tokens'
import { Expr } from '../expressions'
import { Stmt } from './Stmt'
import { Primitive, PrimitiveNull, ReturnValue } from '../primitives'
import { Enviroment } from '../Enviroment'

export class StmtReturn extends Stmt {
  keyword: Token
  value: Expr | null

  constructor(keyword: Token, value: Expr | null) {
    super()
    this.keyword = keyword
    this.value = value
  }

  execute(enviroment: Enviroment): null {
    let value: Primitive = new PrimitiveNull()
    if (this.value !== null) value = this.value.evaluate(enviroment)
    throw new ReturnValue(value)
  }
}
