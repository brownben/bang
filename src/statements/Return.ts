import { Token } from '../Tokens'
import { Expr } from '../expressions'
import { Stmt } from './Stmt'
import { Literal, LiteralNull } from '../literals'
import { ReturnValue } from '../ReturnValue'
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
    let value: Literal = new LiteralNull()
    if (this.value !== null) value = this.value.evaluate(enviroment)
    throw new ReturnValue(value)
  }
}
