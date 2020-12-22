import { Expr } from './Expr'
import { ExprFunction } from './Function'
import { Primitive } from '../primitives'
import { Enviroment } from '../Enviroment'

export class ExprAssign extends Expr {
  name: string
  value: Expr

  constructor(name: string, value: Expr) {
    super()
    this.name = name
    this.value = value
  }

  evaluate(enviroment: Enviroment): Primitive {
    let evaluatedValue: Primitive
    if (this.value instanceof ExprFunction)
      evaluatedValue = this.value.evaluate(enviroment, this.name)
    else evaluatedValue = this.value.evaluate(enviroment)

    enviroment.assign(this.name, evaluatedValue)
    return evaluatedValue
  }
}
