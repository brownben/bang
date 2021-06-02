import { Token } from '../tokens'
import { Expr } from './Expr'
import { Enviroment } from '../Enviroment'

export class ExprVariable extends Expr {
  name: string

  constructor(name: Token) {
    super()
    this.name = name.value
  }

  async evaluate(enviroment: Enviroment) {
    return enviroment.get(this.name)
  }
}
