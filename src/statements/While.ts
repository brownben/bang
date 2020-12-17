import { Expr } from '../expressions'
import { Stmt } from './Stmt'
import { Enviroment } from '../Enviroment'

export class StmtWhile extends Stmt {
  condition: Expr
  body: Stmt

  constructor(condition: Expr, body: Stmt) {
    super()
    this.condition = condition
    this.body = body
  }

  execute(enviroment: Enviroment): null {
    while (this.condition.evaluate(enviroment).isTruthy()) {
      this.body.execute(enviroment)
    }
    return null
  }
}
