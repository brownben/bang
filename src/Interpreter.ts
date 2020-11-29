import { Expr, ExprBinary, ExprLiteral, ExprGrouping, ExprUnary } from './Expr'
import { Token, TokenType } from './Tokens'
import BangError from './BangError'

export const interpret = (expression: Expr, source: string): ExprLiteral => {
  if (expression instanceof ExprLiteral) return expression
  else if (expression instanceof ExprBinary)
    return evaluateBinary(expression, source)
  else if (expression instanceof ExprGrouping)
    return evaluateGrouping(expression, source)
  else if (expression instanceof ExprUnary)
    return evaluateUnary(expression, source)
  else throw new BangError('Unexpected Structure', source, 1)
}

const evaluateBinary = (
  { left, operator, right }: ExprBinary,
  source: string
): ExprLiteral => {
  const leftEvaluated = interpret(left, source)
  const rightEvaluated = interpret(right, source)

  if ([TokenType.EQUAL_EQUAL, TokenType.BANG_EQUAL].includes(operator.type))
    return evaluateEquality(operator.type, leftEvaluated, rightEvaluated)

  if (leftEvaluated.type != rightEvaluated.type)
    throw new BangError(
      `Cannot use operate on ${
        leftEvaluated.type
      } (${leftEvaluated.getRawValue()}) and ${
        rightEvaluated.type
      } (${rightEvaluated.getRawValue()})`,
      source,
      leftEvaluated?.token?.line ?? 0
    )

  const type = leftEvaluated.type

  if (type == 'number')
    return evaluateNumber(operator, leftEvaluated, rightEvaluated, source)
  if (type == 'string')
    return evaluateString(operator, leftEvaluated, rightEvaluated, source)
  else
    throw new BangError(
      `Unknown Operator ${operator.value}`,
      source,
      leftEvaluated?.token?.line ?? 0
    )
}

const evaluateNumber = (
  operator: Token,
  left: ExprLiteral,
  right: ExprLiteral,
  source: string
): ExprLiteral => {
  let value = undefined

  if (operator.type === TokenType.PLUS)
    value = left.getNumberValue() + right.getNumberValue()
  else if (operator.type === TokenType.MINUS)
    value = left.getNumberValue() - right.getNumberValue()
  else if (operator.type === TokenType.STAR)
    value = left.getNumberValue() * right.getNumberValue()
  else if (operator.type === TokenType.SLASH)
    value = left.getNumberValue() / right.getNumberValue()

  if (value !== undefined) return new ExprLiteral('number', undefined, value)

  switch (operator.type) {
    case TokenType.LESS:
      value = left.getNumberValue() < right.getNumberValue()
      break
    case TokenType.GREATER:
      value = left.getNumberValue() > right.getNumberValue()
      break
    case TokenType.LESS_EQUAL:
      value = left.getNumberValue() <= right.getNumberValue()
      break
    case TokenType.GREATER_EQUAL:
      value = left.getNumberValue() >= right.getNumberValue()
      break
    default:
      console.log(operator)
      throw new BangError(
        `Unknown Operator ${operator.value}`,
        source,
        left?.token?.line ?? 0
      )
  }

  return new ExprLiteral('boolean', undefined, value)
}

const evaluateString = (
  operator: Token,
  left: ExprLiteral,
  right: ExprLiteral,
  source: string
): ExprLiteral => {
  if (operator.type === TokenType.PLUS)
    return new ExprLiteral('string', undefined, left.value + right.value)
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
      throw new BangError(
        `Unknown Operator ${operator.value}`,
        source,
        left?.token?.line ?? 0
      )
  }

  return new ExprLiteral('boolean', undefined, value)
}

const evaluateEquality = (
  operator: TokenType,
  left: ExprLiteral,
  right: ExprLiteral
): ExprLiteral => {
  let value

  if (operator === TokenType.EQUAL_EQUAL)
    value = left.value == right.value && left.type === right.type
  else value = left.value != right.value || left.type !== right.type

  return new ExprLiteral('boolean', undefined, value)
}

const evaluateGrouping = ({ expression }: ExprGrouping, source: string) => {
  return interpret(expression, source)
}

const evaluateUnary = ({ operator, right }: ExprUnary, source: string) => {
  const rightEvaluated = interpret(right, source)

  if (operator.type === TokenType.MINUS && rightEvaluated.type === 'number')
    return new ExprLiteral(
      'number',
      undefined,
      -rightEvaluated.getNumberValue()
    )
  else if (
    operator.type === TokenType.BANG &&
    rightEvaluated.type === 'boolean'
  )
    return new ExprLiteral('boolean', undefined, !rightEvaluated.getRawValue())
  else
    throw new BangError(
      `Unknown Operator ${operator.value}`,
      source,
      rightEvaluated?.token?.line ?? 0
    )
}
