import { Token } from '../tokens'
import { Expr } from '../expressions'
import { Stmt } from './Stmt'
import { Enviroment } from '../Enviroment'
import BangError from '../BangError'

export class StmtWhile extends Stmt {
  token: Token
  condition: Expr
  body: Stmt

  constructor(condition: Expr, body: Stmt, token: Token) {
    super()
    this.condition = condition
    this.body = body
    this.token = token
  }

  async execute(enviroment: Enviroment) {
    let iterationsWithoutChange = 0

    enviroment.track()
    let condition = await this.condition.evaluate(enviroment)
    while (condition.isTruthy() && iterationsWithoutChange < 1000) {
      enviroment.stopTrack()
      await this.body.execute(enviroment)

      if (!enviroment.hasTrackedVariablesChanged()) iterationsWithoutChange += 1
      else {
        iterationsWithoutChange = 0
        enviroment.resetChanged()
      }

      condition = await this.condition.evaluate(enviroment)
    }

    if (iterationsWithoutChange >= 1000)
      throw new BangError(`Infinite Loop Detected`, this.token.line)

    return null
  }
}
