import { Token } from '../tokens'
import { Expr } from './Expr'
import { ExprSpread } from './Spread'
import { Primitive, PrimitiveFunction, ReturnValue } from '../primitives'
import { Enviroment } from '../Enviroment'
import BangError from '../BangError'

const callFunction = (func: PrimitiveFunction, argument: Primitive[]) => {
  try {
    return func.call(argument)
  } catch (error) {
    if (error instanceof ReturnValue) return error.value
    else throw error
  }
}

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
    const argument: Primitive[] = []

    for (const value of this.arguments) {
      if (value instanceof ExprSpread)
        value.evaluate(enviroment).list.forEach((value) => argument.push(value))
      else argument.push(value.evaluate(enviroment))
    }

    if (!(callee instanceof PrimitiveFunction))
      throw new BangError('Can only call functions.')

    if (!callee.spread && argument.length !== callee.arity)
      throw new BangError(
        `Expected ${callee.arity} arguments but got ${argument.length}`
      )
    else if (callee.spread && argument.length < callee.arity)
      throw new BangError(
        `Expected at least ${callee.arity} arguments but got ${argument.length}`
      )

    return callFunction(callee, argument)
  }
}
