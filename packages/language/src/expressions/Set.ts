import { Token } from '../tokens'
import { Expr } from './Expr'
import {
  Primitive,
  PrimitiveDictionary,
  PrimitiveList,
  PrimitiveNumber,
  PrimitiveString,
} from '../primitives'
import { Enviroment } from '../Enviroment'
import BangError from '../BangError'

export class ExprSet extends Expr {
  object: Expr
  lookup: string | Expr
  value: Expr
  token: Token

  constructor(object: Expr, lookup: string | Expr, value: Expr, token: Token) {
    super()

    this.object = object
    this.lookup = lookup
    this.value = value
    this.token = token
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

  async getListLookupKey(enviroment: Enviroment): Promise<number | undefined> {
    if (typeof this.lookup === 'string') return undefined

    const expressionEvaluated = await this.lookup.evaluate(enviroment)
    if (expressionEvaluated instanceof PrimitiveNumber)
      return expressionEvaluated.getValue()
    else return undefined
  }

  async setDictionaryProperty(
    enviroment: Enviroment,
    object: PrimitiveDictionary,
    value: Primitive
  ) {
    const name = await this.getDictionaryLookupKey(enviroment)
    object.set(name, value)
    return value
  }

  async setListValue(
    enviroment: Enviroment,
    object: PrimitiveList,
    value: Primitive
  ) {
    const index = await this.getListLookupKey(enviroment)

    if (index === undefined || !object.indexExists(index))
      throw new BangError(
        `Index specified doesn't exist on the list`,
        this.token.line
      )

    object.set(index, value)
    return value
  }

  async evaluate(enviroment: Enviroment) {
    const object = await this.object.evaluate(enviroment)
    const value = await this.value.evaluate(enviroment)

    if (object instanceof PrimitiveDictionary)
      return this.setDictionaryProperty(enviroment, object, value)
    else if (object instanceof PrimitiveList)
      return this.setListValue(enviroment, object, value)
    else
      throw new BangError(
        'You can only set properties/values on dictionaries and lists',
        this.token.line
      )
  }
}
