import { Token } from '../Tokens'
import { Expr } from '../expressions'
import { Stmt } from './Stmt'
import { Enviroment } from '../Enviroment'
import { Literal, LiteralNull } from '../literals'

export class ReturnValue {
  value: Literal
  constructor(value: Literal) {
    this.value = value
  }
}

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
