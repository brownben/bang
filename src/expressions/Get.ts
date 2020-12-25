import { Token } from '../tokens'
import { Expr } from './Expr'
import { Primitive, PrimitiveDictionary } from '../primitives'
import { Enviroment } from '../Enviroment'
import { BuiltInPropertyVisitor } from '../primitives/builtInProperties'
import BangError from '../BangError'

export class ExprGet extends Expr {
  name: string
  object: Expr

  constructor(name: Token, object: Expr) {
    super()
    this.name = name.value
    this.object = object
  }

  evaluate(enviroment: Enviroment) {
    const instance: Primitive = this.object.evaluate(enviroment)

    if (
      instance instanceof PrimitiveDictionary &&
      instance.keyExists(this.name)
    )
      return instance.dictionary[this.name]

    const visitor = new BuiltInPropertyVisitor()
    const builtInProperties = instance.builtInProperties(visitor)
    const value = builtInProperties[this.name]

    if (value) return value

    throw new BangError(
      `Property ${this.name} doesn't exists on type "${instance.type}"`
    )
  }
}
