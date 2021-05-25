import { Token } from '../tokens'
import { Expr } from '../expressions'
import { Stmt } from './Stmt'
import {
  Primitive,
  PrimitiveDictionary,
  PrimitiveList,
  PrimitiveNull,
} from '../primitives'
import { Enviroment } from '../Enviroment'
import BangError from '../BangError'

type DestructuringName = { actual: string; renamed: string }
export class StmtDestructuring extends Stmt {
  names: DestructuringName[]
  expression: Expr
  constant: boolean = false
  type: 'dictionary' | 'list'

  constructor({
    names,
    constant,
    expression,
    type,
  }: {
    names: (Token | DestructuringName)[]
    constant: boolean
    expression: Expr
    type: 'dictionary' | 'list'
  }) {
    super()

    this.names = names.map((name) => {
      if (name instanceof Token)
        return { actual: name.value, renamed: name.value }
      else return name
    })

    this.constant = constant
    this.expression = expression
    this.type = type
  }

  execute(enviroment: Enviroment): null {
    const expression: Primitive = this.expression.evaluate(enviroment)

    if (expression instanceof PrimitiveDictionary && this.type === 'dictionary')
      for (const { actual, renamed } of this.names) {
        const value = expression.getValueForKey(actual) ?? new PrimitiveNull()
        enviroment.define(renamed, this.constant, value)
      }
    else if (expression instanceof PrimitiveList && this.type === 'list')
      for (const [index, { renamed }] of this.names.entries()) {
        const value = expression.getValueAtIndex(index) ?? new PrimitiveNull()
        enviroment.define(renamed, this.constant, value)
      }
    else
      throw new BangError(
        `Cannot desturcture type ${expression.type} into type ${this.type}`
      )

    return null
  }
}
