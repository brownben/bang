import { Expr } from './Expr'
import { Literal } from '../literals'
import { Enviroment } from '../Enviroment'

export class ExprAssign extends Expr {
  name: string
  value: Expr

  constructor(name: string, value: Expr) {
    super()
    this.name = name
    this.value = value
  }

  evaluate(enviroment: Enviroment) {
    const evaluatedValue: Literal = this.value.evaluate(enviroment)
    enviroment.assign(this.name, evaluatedValue)
    return evaluatedValue
  }
}
