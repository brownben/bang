import { Expr, ExprBinary, ExprLiteral, ExprGrouping, ExprUnary } from '../Expr'
import { Token, TokenType } from '../Tokens'
import BangError from '../BangError'

export const evaluateExpression = (expression: Expr): ExprLiteral => {
  if (expression instanceof ExprLiteral) return expression
  else if (expression instanceof ExprBinary) return evaluateBinary(expression)
  else if (expression instanceof ExprGrouping)
    return evaluateGrouping(expression)
  else if (expression instanceof ExprUnary) return evaluateUnary(expression)
  else throw new BangError('Unexpected Structure')
}

const evaluateBinary = ({ left, operator, right }: ExprBinary): ExprLiteral => {
  const leftEvaluated = evaluateExpression(left)
  const rightEvaluated = evaluateExpression(right)

  if ([TokenType.EQUAL_EQUAL, TokenType.BANG_EQUAL].includes(operator.type))
    return evaluateEquality(operator.type, leftEvaluated, rightEvaluated)

  if (leftEvaluated.type != rightEvaluated.type)
    throw new BangError(
      `Cannot use operate on ${
        leftEvaluated.type
      } (${leftEvaluated.getRawValue()}) and ${
        rightEvaluated.type
      } (${rightEvaluated.getRawValue()})`
    )

  const type = leftEvaluated.type

  if (type == 'number')
    return evaluateNumber(operator, leftEvaluated, rightEvaluated)
  if (type == 'string')
    return evaluateString(operator, leftEvaluated, rightEvaluated)
  else throw new BangError(`Unknown Operator ${operator.value}`)
}

const evaluateNumber = (
  operator: Token,
  left: ExprLiteral,
  right: ExprLiteral
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
      throw new BangError(`Unknown Operator ${operator.value}`)
  }

  return new ExprLiteral('boolean', undefined, value)
}

const evaluateString = (
  operator: Token,
  left: ExprLiteral,
  right: ExprLiteral
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
      throw new BangError(`Unknown Operator ${operator.value}`)
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

const evaluateGrouping = ({ expression }: ExprGrouping) => {
  return evaluateExpression(expression)
}

const evaluateUnary = ({ operator, right }: ExprUnary) => {
  const rightEvaluated = evaluateExpression(right)

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
  else throw new BangError(`Unknown Operator ${operator.value}`)
}
