import { Token, TokenType } from '../Tokens'
import {
  Expr,
  ExprBinary,
  ExprLiteral,
  ExprGrouping,
  ExprUnary,
  ExprVariable,
  ExprAssign
} from '../Expr'
import {
  Literal,
  LiteralString,
  LiteralNumber,
  LiteralBoolean,
  LiteralNull
} from '../Literal'
import BangError from '../BangError'
import { Enviroment } from '../Enviroment'

class EvaluateExpression {
  enviroment: Enviroment

  constructor(enviroment: Enviroment) {
    this.enviroment = enviroment
  }

  evaluate(expression: Expr): Literal {
    if (expression instanceof ExprLiteral)
      return this.evaluateLiteral(expression)
    else if (expression instanceof ExprBinary)
      return this.evaluateBinary(expression)
    else if (expression instanceof ExprGrouping)
      return this.evaluateGrouping(expression)
    else if (expression instanceof ExprUnary)
      return this.evaluateUnary(expression)
    else if (expression instanceof ExprVariable)
      return this.evaluateVariable(expression)
    else if (expression instanceof ExprAssign)
      return this.evaluateAssignment(expression)
    else throw new BangError('Unexpected Structure')
  }

  evaluateLiteral(literal: ExprLiteral): Literal {
    if (literal.type === 'string')
      return new LiteralString(literal.token, literal.value)
    if (literal.type === 'number')
      return new LiteralNumber(literal.token, literal.value)
    if (literal.type === 'boolean')
      return new LiteralBoolean(literal.token, literal.value)
    if (literal.type === 'null')
      return new LiteralNull(literal.token, literal.value)
    throw new BangError(`Unknown Literal Type "${literal.type}"`)
  }

  evaluateBinary({ left, operator, right }: ExprBinary): Literal {
    const leftEvaluated = this.evaluate(left)
    const rightEvaluated = this.evaluate(right)

    if ([TokenType.EQUAL_EQUAL, TokenType.BANG_EQUAL].includes(operator.type))
      return this.evaluateEquality(operator.type, leftEvaluated, rightEvaluated)

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
      return this.evaluateNumber(operator, leftEvaluated, rightEvaluated)
    if (
      leftEvaluated instanceof LiteralString &&
      rightEvaluated instanceof LiteralString
    )
      return this.evaluateString(operator, leftEvaluated, rightEvaluated)
    else throw new BangError(`Unknown Operator ${operator.value}`)
  }

  evaluateNumber(
    operator: Token,
    left: LiteralNumber,
    right: LiteralNumber
  ): Literal {
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

  evaluateString(
    operator: Token,
    left: LiteralString,
    right: LiteralString
  ): Literal {
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

  evaluateEquality(
    operator: TokenType,
    left: Literal,
    right: Literal
  ): LiteralBoolean {
    let value

    if (operator === TokenType.EQUAL_EQUAL)
      value = left.value == right.value && left.type === right.type
    else value = left.value != right.value || left.type !== right.type

    return new LiteralBoolean(undefined, value)
  }

  evaluateGrouping({ expression }: ExprGrouping) {
    return this.evaluate(expression)
  }

  evaluateUnary({ operator, right }: ExprUnary) {
    const rightEvaluated = this.evaluate(right)

    if (
      operator.type === TokenType.MINUS &&
      rightEvaluated instanceof LiteralNumber
    )
      return new LiteralNumber(undefined, -rightEvaluated.getValue())
    else if (
      operator.type === TokenType.BANG &&
      rightEvaluated instanceof LiteralBoolean
    )
      return new LiteralBoolean(undefined, !rightEvaluated.getValue())
    else throw new BangError(`Unknown Operator ${operator.value}`)
  }

  evaluateVariable({ name }: ExprVariable) {
    if (this.enviroment) return this.enviroment.get(name)
    else throw new BangError('No Enviroment Defined')
  }

  evaluateAssignment({ name, value }: ExprAssign): Literal {
    const evaluatedValue: Literal = this.evaluate(value)
    this.enviroment.assign(name, evaluatedValue)
    return evaluatedValue
  }
}

export const evaluateExpression = (
  expression: Expr,
  enviroment: Enviroment
): Literal => new EvaluateExpression(enviroment).evaluate(expression)
