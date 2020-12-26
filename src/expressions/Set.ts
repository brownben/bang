import { Expr } from './Expr'
import { Primitive, PrimitiveDictionary, PrimitiveString } from '../primitives'
import { Enviroment } from '../Enviroment'
import BangError from '../BangError'

export class ExprSet extends Expr {
  object: Expr
  lookup: string | Expr
  value: Expr

  constructor(object: Expr, lookup: string | Expr, value: Expr) {
    super()

    this.object = object
    this.lookup = lookup
    this.value = value
  }

  getLookupKey(enviroment: Enviroment) {
    if (typeof this.lookup === 'string') return this.lookup

    const expressionEvaluated: Primitive = this.lookup.evaluate(enviroment)
    if (expressionEvaluated instanceof PrimitiveString)
      return expressionEvaluated.value
    else throw new BangError('Only Strings Can Be Used to Index Dictionaries')
  }

  evaluate(enviroment: Enviroment) {
    const name = this.getLookupKey(enviroment)
    const object = this.object.evaluate(enviroment)

    if (!(object instanceof PrimitiveDictionary))
      throw new BangError('You can only set properties on dictionaries')

    const value = this.value.evaluate(enviroment)

    object.set(name, value)
    return value
  }
}
