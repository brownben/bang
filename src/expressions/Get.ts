import { Token } from '../tokens'
import { Expr } from './Expr'
import { Primitive, PrimitiveDictionary, PrimitiveString } from '../primitives'
import { Enviroment } from '../Enviroment'
import { BuiltInPropertyVisitor } from '../primitives/builtInProperties'
import BangError from '../BangError'

export class ExprGet extends Expr {
  lookup: string | Expr
  object: Expr

  constructor(lookup: Token | Expr, object: Expr) {
    super()
    if (lookup instanceof Token) this.lookup = lookup.value
    else this.lookup = lookup
    this.object = object
  }

  getLookupKey(enviroment: Enviroment) {
    if (typeof this.lookup === 'string') return this.lookup

    const expressionEvaluated: Primitive = this.lookup.evaluate(enviroment)
    if (expressionEvaluated instanceof PrimitiveString)
      return expressionEvaluated.value
    else throw new BangError('Only Strings Can Be Used to Index Dictionaries')
  }

  evaluate(enviroment: Enviroment) {
    const lookup: string = this.getLookupKey(enviroment)
    const instance: Primitive = this.object.evaluate(enviroment)

    if (instance instanceof PrimitiveDictionary && instance.keyExists(lookup))
      return instance.dictionary[lookup]

    const visitor = new BuiltInPropertyVisitor()
    const builtInProperties = instance.builtInProperties(visitor)
    const value = builtInProperties[lookup]

    if (value) return value

    throw new BangError(
      `Property ${this.lookup} doesn't exists on type "${instance.type}"`
    )
  }
}
