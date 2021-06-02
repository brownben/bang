import { Token } from '../tokens'
import { Expr } from './Expr'

import { ExprVariable } from './Variable'
import { Primitive, PrimitiveDictionary, PrimitiveString } from '../primitives'
import { Enviroment } from '../Enviroment'
import BangError from '../BangError'
import { ExprSpread } from './Spread'

type KeyValue = [ExprVariable, null] | [Expr, Expr] | ExprSpread

const isRawIdentifierKey = (
  keyValue: KeyValue
): keyValue is [ExprVariable, null] =>
  Array.isArray(keyValue) &&
  keyValue[0] instanceof ExprVariable &&
  keyValue[1] === null

const isIdentifierKey = (
  keyValue: KeyValue
): keyValue is [ExprVariable, Expr] =>
  Array.isArray(keyValue) && keyValue[0] instanceof ExprVariable

const getKey = async (
  key: Expr | string,
  enviroment: Enviroment,
  line: number
) => {
  if (typeof key === 'string') return key

  const evaluated: Primitive = await key.evaluate(enviroment)
  if (evaluated instanceof PrimitiveString) return evaluated.value
  else throw new BangError('Only Strings Can Be Used as Dictionary Keys', line)
}

export class ExprDictionary extends Expr {
  token: Token
  keys: (string | Expr)[] = []
  values: Expr[] = []
  keyValues: ([string | Expr, Expr] | ExprSpread)[] = []

  constructor(token: Token, keyValues: KeyValue[]) {
    super()
    this.token = token

    for (const pair of keyValues) {
      if (pair instanceof ExprSpread) this.keyValues.push(pair)
      else if (isRawIdentifierKey(pair))
        this.keyValues.push([pair[0].name, pair[0]])
      else if (isIdentifierKey(pair))
        this.keyValues.push([pair[0].name, pair[1]])
      else this.keyValues.push(pair)
    }
  }

  async evaluate(enviroment: Enviroment): Promise<PrimitiveDictionary> {
    const keyValues: Record<string, Primitive> = {}

    for (const keyValue of this.keyValues) {
      if (keyValue instanceof ExprSpread) {
        const evaluated = await keyValue.evaluate(enviroment)
        if (!(evaluated instanceof PrimitiveDictionary))
          throw new BangError(
            'Only Dictionaries Can Be Spread Into Dictionaries',
            this.token.line
          )
        Object.assign(keyValues, evaluated.dictionary)
      } else {
        const key = await getKey(keyValue[0], enviroment, this.token.line)
        const value = await keyValue[1].evaluate(enviroment)
        keyValues[key] = value
      }
    }

    return new PrimitiveDictionary({
      token: this.token,
      keyValues,
    })
  }
}
