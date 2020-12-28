import { Token } from '../tokens'
import { Expr } from './Expr'
import {
  Primitive,
  PrimitiveDictionary,
  PrimitiveList,
  PrimitiveNull,
  PrimitiveNumber,
  PrimitiveString,
} from '../primitives'
import { BuiltInPropertyVisitor } from '../primitives/builtInProperties'
import { Enviroment } from '../Enviroment'
import BangError from '../BangError'
import { ExprSlice } from './Slice'

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

  getNumberLookupKey(enviroment: Enviroment): number | undefined {
    if (typeof this.lookup === 'string') return undefined

    const expressionEvaluated: Primitive = this.lookup.evaluate(enviroment)
    if (expressionEvaluated instanceof PrimitiveNumber)
      return expressionEvaluated.getValue()
    else return undefined
  }

  getSliceLookup(
    lookup: ExprSlice,
    instance: Primitive,
    enviroment: Enviroment
  ): Primitive {
    type SliceArray = (PrimitiveNumber | PrimitiveNull)[]
    let [start, end] = lookup.evaluate(enviroment).list as SliceArray

    if (instance instanceof PrimitiveList)
      return instance.getSlice(start.getValue(), end.getValue())
    else if (instance instanceof PrimitiveString)
      return instance.getSlice(start.getValue(), end.getValue())
    else throw new BangError('Can only use slice on Strings and Lists')
  }

  evaluate(enviroment: Enviroment) {
    const instance: Primitive = this.object.evaluate(enviroment)

    if (this.lookup instanceof ExprSlice)
      return this.getSliceLookup(this.lookup, instance, enviroment)

    if (instance instanceof PrimitiveDictionary) {
      const dictionaryLookup = this.getDictionaryLookupKey(enviroment)
      if (instance.keyExists(dictionaryLookup))
        return instance.dictionary[dictionaryLookup]
    }

    if (instance instanceof PrimitiveList) {
      const listLookup = this.getNumberLookupKey(enviroment)
      if (listLookup !== undefined && instance.indexExists(listLookup))
        return instance.getValueAtIndex(listLookup)
    }

    if (instance instanceof PrimitiveString) {
      const listLookup = this.getNumberLookupKey(enviroment)
      if (listLookup !== undefined && instance.indexExists(listLookup))
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
