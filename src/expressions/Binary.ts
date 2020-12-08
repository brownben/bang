import { Token, TokenType } from '../Tokens'
import { Expr } from './Expr'
import {
  Literal,
  LiteralBoolean,
  LiteralNumber,
  LiteralString
} from '../Literal'
import { Enviroment } from '../Enviroment'
import BangError from '../BangError'

const evaluateNumber = (
  operator: Token,
  left: LiteralNumber,
  right: LiteralNumber
): Literal => {
  let value = undefined

  if (operator.type === TokenType.PLUS)
    value = left.getValue() + right.getValue()
  else if (operator.type === TokenType.MINUS)
    value = left.getValue() - right.getValue()
  else if (operator.type === TokenType.STAR)
    value = left.getValue() * right.getValue()
  else if (operator.type === TokenType.SLASH)
    value = left.getValue() / right.getValue()

  if (value !== undefined) return new LiteralNumber(undefined, value)

  switch (operator.type) {
    case TokenType.LESS:
      value = left.getValue() < right.getValue()
      break
    case TokenType.GREATER:
      value = left.getValue() > right.getValue()
      break
    case TokenType.LESS_EQUAL:
      value = left.getValue() <= right.getValue()
      break
    case TokenType.GREATER_EQUAL:
      value = left.getValue() >= right.getValue()
      break
    default:
      throw new BangError(`Unknown Operator ${operator.value}`)
  }

  return new LiteralBoolean(undefined, value)
}

const evaluateString = (
  operator: Token,
  left: LiteralString,
  right: LiteralString
): Literal => {
  if (operator.type === TokenType.PLUS)
    return new LiteralString(undefined, left.value + right.value)
  let value

  switch (operator.type) {
    case TokenType.LESS:
      value = left.value < right.value
      break
    case TokenType.GREATER:
      value = left.value > right.value
      break
    case TokenType.LESS_EQUAL:
      value = left.value <= right.value
      break
    case TokenType.GREATER_EQUAL:
      value = left.value >= right.value
      break
    default:
      throw new BangError(`Unknown Operator ${operator.value}`)
  }

  return new LiteralBoolean(undefined, value)
}

const evaluateEquality = (
  operator: TokenType,
  left: Literal,
  right: Literal
): Literal => {
  let value

  if (operator === TokenType.EQUAL_EQUAL)
    value = left.value === right.value && left.type === right.type
  else value = left.value !== right.value || left.type !== right.type

  return new LiteralBoolean(undefined, value)
}

export class ExprBinary extends Expr {
  left: Expr
  operator: Token
  right: Expr

  constructor(left: Expr, operator: Token, right: Expr) {
    super()
    this.left = left
    this.operator = operator
    this.right = right
  }
  evaluate(enviroment: Enviroment) {
    const leftEvaluated = this.left.evaluate(enviroment)
    const rightEvaluated = this.right.evaluate(enviroment)

    if (
      [TokenType.EQUAL_EQUAL, TokenType.BANG_EQUAL].includes(this.operator.type)
    )
      return evaluateEquality(this.operator.type, leftEvaluated, rightEvaluated)

    if (typeof leftEvaluated !== typeof rightEvaluated)
      throw new BangError(
        `Cannot use operate on ${
          leftEvaluated.type
        } (${leftEvaluated.getValue()}) and ${
          rightEvaluated.type
        } (${rightEvaluated.getValue()})`
      )

    if (
      leftEvaluated instanceof LiteralNumber &&
      rightEvaluated instanceof LiteralNumber
    )
      return evaluateNumber(this.operator, leftEvaluated, rightEvaluated)
    if (
      leftEvaluated instanceof LiteralString &&
      rightEvaluated instanceof LiteralString
    )
      return evaluateString(this.operator, leftEvaluated, rightEvaluated)
    else throw new BangError(`Unknown Operator ${this.operator.value}`)
  }
}
