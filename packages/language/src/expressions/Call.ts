import { Token } from '../tokens'
import { Expr } from './Expr'
import { ExprSpread } from './Spread'
import {
  Primitive,
  PrimitiveFunction,
  PrimitiveList,
  ReturnValue,
} from '../primitives'
import { Enviroment } from '../Enviroment'
import BangError from '../BangError'

const callFunction = async (func: PrimitiveFunction, argument: Primitive[]) => {
  try {
    return await func.call(argument)
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

  async evaluate(enviroment: Enviroment) {
    const callee: Primitive = await this.callee.evaluate(enviroment)
    const argument: Primitive[] = []

    for (const value of this.arguments) {
      if (value instanceof ExprSpread) {
        const evaluated = await value.evaluate(enviroment)
        if (evaluated instanceof PrimitiveList)
          evaluated.list.forEach((value) => argument.push(value))
        else
          throw new BangError(
            `Can only spread lists into parameters`,
            this.paren.line
          )
      } else argument.push(await value.evaluate(enviroment))
    }

    if (!(callee instanceof PrimitiveFunction))
      throw new BangError('Can only call functions.', this.paren.line)

    if (!callee.spread && argument.length !== callee.arity)
      throw new BangError(
        `Expected ${callee.arity} arguments but got ${argument.length}`,
        this.paren.line
      )
    else if (callee.spread && argument.length < callee.arity)
      throw new BangError(
        `Expected at least ${callee.arity} arguments but got ${argument.length}`,
        this.paren.line
      )

    return await callFunction(callee, argument)
  }
}
