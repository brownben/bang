import { Expr } from './Expr'
import { ExprFunction } from './Function'
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

  evaluate(enviroment: Enviroment): Literal {
    let evaluatedValue: Literal
    if (this.value instanceof ExprFunction)
      evaluatedValue = this.value.evaluate(enviroment, this.name)
    else evaluatedValue = this.value.evaluate(enviroment)

    enviroment.assign(this.name, evaluatedValue)
    return evaluatedValue
  }
}
