import { Expr } from './Expr'
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
    let evaluatedValue: Primitive = this.value.evaluate(enviroment, this.name)

    enviroment.assign(this.name, evaluatedValue)
    return evaluatedValue
  }
}
