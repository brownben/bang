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

export class StmtDestructuring extends Stmt {
  names: string[]
  expression: Expr
  constant: boolean = false
  type: 'dictionary' | 'list'

  constructor({
    names,
    constant,
    expression,
    type,
  }: {
    names: Token[]
    constant: boolean
    expression: Expr
    type: 'dictionary' | 'list'
  }) {
    super()
    this.names = names.map((name) => name.value)
    this.constant = constant
    this.expression = expression
    this.type = type
  }

  execute(enviroment: Enviroment): null {
    const expression: Primitive = this.expression.evaluate(enviroment)

    if (expression instanceof PrimitiveDictionary && this.type === 'dictionary')
      for (const name of this.names) {
        const value = expression.getValueForKey(name) ?? new PrimitiveNull()
        enviroment.define(name, this.constant, value)
      }
    else if (expression instanceof PrimitiveList && this.type === 'list')
      for (const [index, name] of this.names.entries()) {
        const value = expression.getValueAtIndex(index) ?? new PrimitiveNull()
        enviroment.define(name, this.constant, value)
      }
    else
      throw new BangError(
        `Cannot desturcture type ${expression.type} into type ${this.type}`
      )

    return null
  }
}
