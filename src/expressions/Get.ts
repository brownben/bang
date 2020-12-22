import { Token } from '../tokens'
import { Expr } from './Expr'
import { Literal } from '../literals'
import { Enviroment } from '../Enviroment'

export class ExprGet extends Expr {
  name: string
  object: Expr

  constructor(name: Token, object: Expr) {
    super()
    this.name = name?.value ?? ''
    this.object = object
  }

  evaluate(enviroment: Enviroment) {
    const instance: Literal = this.object.evaluate(enviroment)

    return instance.getBuiltInProperty(this.name)
  }
}
