import { Token } from '../tokens'
import { Expr } from './Expr'
import {
  Primitive,
  PrimitiveDictionary,
  PrimitiveList,
  PrimitiveNumber,
  PrimitiveString,
} from '../primitives'
import { BuiltInPropertyVisitor } from '../primitives/builtInProperties'
import { Enviroment } from '../Enviroment'
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

  getBuiltinLookupKey(enviroment: Enviroment): string {
    if (typeof this.lookup === 'string') return this.lookup

    const expressionEvaluated: Primitive = this.lookup.evaluate(enviroment)
    if (expressionEvaluated instanceof PrimitiveString)
      return expressionEvaluated.getValue()
    else
      throw new BangError(
        'Only Strings Can Be Used to Index Built-in Properties'
      )
  }

  getDictionaryLookupKey(enviroment: Enviroment): string {
    if (typeof this.lookup === 'string') return this.lookup

    const expressionEvaluated: Primitive = this.lookup.evaluate(enviroment)
    if (expressionEvaluated instanceof PrimitiveString)
      return expressionEvaluated.getValue()
    else throw new BangError('Only Strings Can Be Used to Index Dictionaries')
  }

  getListLookupKey(enviroment: Enviroment): number | undefined {
    if (typeof this.lookup === 'string') return undefined

    const expressionEvaluated: Primitive = this.lookup.evaluate(enviroment)
    if (expressionEvaluated instanceof PrimitiveNumber)
      return expressionEvaluated.getValue()
    else return undefined
  }

  evaluate(enviroment: Enviroment) {
    const instance: Primitive = this.object.evaluate(enviroment)

    if (instance instanceof PrimitiveDictionary) {
      const dictionaryLookup = this.getDictionaryLookupKey(enviroment)
      if (instance.keyExists(dictionaryLookup))
        return instance.dictionary[dictionaryLookup]
    }

    if (instance instanceof PrimitiveList) {
      const listLookup = this.getListLookupKey(enviroment)
      if (listLookup !== undefined && instance.keyExists(listLookup))
        return instance.getValueAtIndex(listLookup)
    }

    const visitor = new BuiltInPropertyVisitor()
    const builtInProperties = instance.builtInProperties(visitor)
    const lookup = this.getBuiltinLookupKey(enviroment)
    const value = builtInProperties[lookup]

    if (value) return value

    throw new BangError(
      `Property ${this.lookup} doesn't exists on type "${instance.type}"`
    )
  }
}
