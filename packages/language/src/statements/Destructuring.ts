import { Token } from '../tokens'
import { Expr } from '../expressions'
import { Stmt } from './Stmt'
import {
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
  spread: boolean
  token: Token

  constructor({
    names,
    constant,
    expression,
    type,
    spread,
    token,
  }: {
    names: (Token | DestructuringName)[]
    constant: boolean
    expression: Expr
    type: 'dictionary' | 'list'
    spread: boolean
    token: Token
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
    this.spread = spread
    this.token = token
  }

  async execute(enviroment: Enviroment): Promise<null> {
    const expression = await this.expression.evaluate(enviroment)

    if (expression instanceof PrimitiveDictionary && this.type === 'dictionary')
      for (const { actual, renamed } of this.names) {
        const value = expression.getValueForKey(actual) ?? new PrimitiveNull()
        enviroment.define(renamed, this.constant, value)
      }
    else if (expression instanceof PrimitiveList && this.type === 'list') {
      this.names.forEach(({ renamed }, index) => {
        if ((this.spread && index !== this.names.length - 1) || !this.spread) {
          const value = expression.getValueAtIndex(index) ?? new PrimitiveNull()
          enviroment.define(renamed, this.constant, value)
        }
      })

      if (this.spread)
        enviroment.define(
          this.names[this.names.length - 1].renamed,
          true,
          new PrimitiveList({
            values: expression.list.slice(this.names.length - 1),
          })
        )
    } else
      throw new BangError(
        `Cannot desturcture type "${expression.type}" into type "${this.type}"`,
        this.token.line
      )

    return null
  }
}
