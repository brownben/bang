import { Token } from '../tokens'
import { Expr } from './Expr'
import { ExprVariable } from './Variable'
import { Primitive, PrimitiveDictionary, PrimitiveString } from '../primitives'
import { Enviroment } from '../Enviroment'
import BangError from '../BangError'

type KeyValue = [ExprVariable, null] | [Expr, Expr]

const isIdentifierKey = (
  keyValue: KeyValue
): keyValue is [ExprVariable, null] => {
  return keyValue[0] instanceof ExprVariable
}

export class ExprDictionary extends Expr {
  token: Token
  keys: (string | Expr)[] = []
  values: Expr[] = []

  constructor(token: Token, keyValues: KeyValue[]) {
    super()
    this.token = token

    for (const keyValue of keyValues) {
      if (isIdentifierKey(keyValue)) {
        this.keys.push(keyValue[0].name)

        if (keyValue[1] === null) this.values.push(keyValue[0])
        else this.values.push(keyValue[1])
      } else {
        this.keys.push(keyValue[0])
        this.values.push(keyValue[1])
      }
    }
  }

  evaluate(enviroment: Enviroment): PrimitiveDictionary {
    return new PrimitiveDictionary({
      token: this.token,
      keys: this.keys.map((key) => {
        if (typeof key === 'string') return key

        const evaluated: Primitive = key.evaluate(enviroment)
        if (evaluated instanceof PrimitiveString) return evaluated.value
        else throw new BangError('Only Strings Can Be Used as Dictionary Keys')
      }),
      values: this.values.map((value) => value.evaluate(enviroment)),
    })
  }
}
