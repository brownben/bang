import { Token } from '../tokens'
import { Expr } from './Expr'
import { Primitive, PrimitiveFunction, ReturnValue } from '../primitives'
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
    const callee: Primitive = this.callee.evaluate(enviroment)
    const argument: Primitive[] = this.arguments.map((argument) =>
      argument.evaluate(enviroment)
    )

    if (callee instanceof PrimitiveFunction) {
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
