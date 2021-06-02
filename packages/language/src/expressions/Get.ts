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
  token: Token
  lookup: string | Expr
  object: Expr

  constructor(token: Token, object: Expr, expression?: Expr) {
    super()
    this.token = token
    this.object = object
    if (expression) this.lookup = expression
    else this.lookup = token.value
  }

  async getBuiltinLookupKey(enviroment: Enviroment): Promise<string> {
    if (typeof this.lookup === 'string') return this.lookup

    const expressionEvaluated: Primitive = await this.lookup.evaluate(
      enviroment
    )
    if (expressionEvaluated instanceof PrimitiveString)
      return expressionEvaluated.getValue()
    else
      throw new BangError(
        'Only Strings Can Be Used to Index Built-in Properties',
        this.token.line
      )
  }

  async getDictionaryLookupKey(enviroment: Enviroment): Promise<string> {
    if (typeof this.lookup === 'string') return this.lookup

    const expressionEvaluated = await this.lookup.evaluate(enviroment)
    if (expressionEvaluated instanceof PrimitiveString)
      return expressionEvaluated.getValue()
    else
      throw new BangError(
        'Only Strings Can Be Used to Index Dictionaries',
        this.token.line
      )
  }

  async getNumberLookupKey(
    enviroment: Enviroment
  ): Promise<number | undefined> {
    if (typeof this.lookup === 'string') return undefined

    const expressionEvaluated = await this.lookup.evaluate(enviroment)
    if (expressionEvaluated instanceof PrimitiveNumber)
      return expressionEvaluated.getValue()
    else return undefined
  }

  async getSliceLookup(
    lookup: ExprSlice,
    instance: Primitive,
    enviroment: Enviroment
  ) {
    type SliceArray = (PrimitiveNumber | PrimitiveNull)[]
    let [start, end] = (await lookup.evaluate(enviroment)).list as SliceArray

    if (instance instanceof PrimitiveList)
      return instance.getSlice(start.getValue(), end.getValue())
    else if (instance instanceof PrimitiveString)
      return instance.getSlice(start.getValue(), end.getValue())
    else
      throw new BangError(
        'Can only use slice on Strings and Lists',
        this.token.line
      )
  }

  async evaluate(enviroment: Enviroment) {
    const instance = await this.object.evaluate(enviroment)

    if (this.lookup instanceof ExprSlice)
      return this.getSliceLookup(this.lookup, instance, enviroment)

    if (instance instanceof PrimitiveDictionary) {
      const dictionaryLookup = await this.getDictionaryLookupKey(enviroment)
      if (instance.keyExists(dictionaryLookup))
        return instance.dictionary[dictionaryLookup]
    }

    if (instance instanceof PrimitiveList) {
      const listLookup = await this.getNumberLookupKey(enviroment)
      if (listLookup !== undefined && instance.indexExists(listLookup))
        return instance.getValueAtIndex(listLookup)
    }

    if (instance instanceof PrimitiveString) {
      const listLookup = await this.getNumberLookupKey(enviroment)
      if (listLookup !== undefined && instance.indexExists(listLookup))
        return instance.getValueAtIndex(listLookup)
    }

    const visitor = new BuiltInPropertyVisitor()
    const builtInProperties = instance.builtInProperties(visitor)
    const lookup = await this.getBuiltinLookupKey(enviroment)
    const value = builtInProperties[lookup]

    if (value) return value

    throw new BangError(
      `Property ${this.lookup} doesn't exists on type "${instance.type}"`,
      this.token.line
    )
  }
}
