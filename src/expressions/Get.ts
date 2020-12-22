import { Token } from '../tokens'
import { Expr } from './Expr'
import { Primitive } from '../primitives'
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
    const instance: Primitive = this.object.evaluate(enviroment)

    return instance.getBuiltInProperty(this.name)
  }
}
