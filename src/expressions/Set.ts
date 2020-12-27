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

  constructor(object: Expr, lookup: string | Expr, value: Expr) {
    super()

    this.object = object
    this.lookup = lookup
    this.value = value
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

  setDictionaryProperty(
    enviroment: Enviroment,
    object: PrimitiveDictionary,
    value: Primitive
  ): Primitive {
    const name = this.getDictionaryLookupKey(enviroment)
    object.set(name, value)
    return value
  }

  setListValue(
    enviroment: Enviroment,
    object: PrimitiveList,
    value: Primitive
  ): Primitive {
    const index = this.getListLookupKey(enviroment)

    if (index === undefined || !object.keyExists(index))
      throw new BangError(`Index specified doesn't exist on the list`)

    object.set(index, value)
    return value
  }

  evaluate(enviroment: Enviroment) {
    const object = this.object.evaluate(enviroment)
    const value = this.value.evaluate(enviroment)

    if (object instanceof PrimitiveDictionary)
      return this.setDictionaryProperty(enviroment, object, value)
    else if (object instanceof PrimitiveList)
      return this.setListValue(enviroment, object, value)
    else
      throw new BangError(
        'You can only set properties/values on dictionaries and lists'
      )
  }
}
