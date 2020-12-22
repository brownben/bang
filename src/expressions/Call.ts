import { Token } from '../tokens'
import { Expr } from './Expr'
import { Literal, LiteralFunction } from '../literals'
import { ReturnValue } from '../ReturnValue'
import { Enviroment } from '../Enviroment'
import BangError from '../BangError'

export class ExprCall extends Expr {
  callee: Expr
  paren: Token
  arguments: Expr[]

  constructor(callee: Expr, paren: Token, argument: Expr[]) {
    super()
    this.callee = callee
    this.paren = paren
    this.arguments = argument
  }

  evaluate(enviroment: Enviroment) {
    const callee: Literal = this.callee.evaluate(enviroment)
    const argument: Literal[] = this.arguments.map(argument =>
      argument.evaluate(enviroment)
    )

    if (callee instanceof LiteralFunction) {
      if (argument.length !== callee.arity)
        throw new BangError(
          `Expected ${callee.arity} arguments but got ${argument.length}`
        )
      try {
        return callee.call(argument)
      } catch (error) {
        if (error instanceof ReturnValue) return error.value
        else throw error
      }
    } else throw new BangError('Can only call functions and classes.')
  }
}
