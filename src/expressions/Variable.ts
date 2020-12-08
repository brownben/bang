import { Token } from '../Tokens'
import { Expr } from './Expr'
import { Enviroment } from '../Enviroment'
import BangError from '../BangError'

export class ExprVariable extends Expr {
  name: string

  constructor(name: Token) {
    super()
    this.name = name.value ?? ''
  }

  evaluate(enviroment: Enviroment) {
    if (enviroment) return enviroment.get(this.name)
    else throw new BangError('No Enviroment Defined')
  }
}
