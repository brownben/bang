import { Token } from './Token'
import { TokenType } from './TokenType'

export type AssignmentOperator =
  | TokenType.PLUS_EQUAL
  | TokenType.MINUS_EQUAL
  | TokenType.STAR_EQUAL
  | TokenType.SLASH_EQUAL
export type BinaryOperator =
  | TokenType.EQUAL_EQUAL
  | TokenType.BANG_EQUAL
  | TokenType.PLUS
  | TokenType.MINUS
  | TokenType.STAR
  | TokenType.SLASH
  | TokenType.STAR_STAR
  | TokenType.LESS
  | TokenType.GREATER
  | TokenType.LESS_EQUAL
  | TokenType.GREATER_EQUAL
  | TokenType.PERCENT
export type LogicalOperator =
  | TokenType.AND
  | TokenType.OR
  | TokenType.QUESTION_QUESTION
export type UnaryOperator = TokenType.MINUS | TokenType.BANG

export const oneCharacterTokens: { [key: string]: TokenType } = {
  '!': TokenType.BANG,
  '=': TokenType.EQUAL,
  '<': TokenType.LESS,
  '>': TokenType.GREATER,
  '(': TokenType.LEFT_PAREN,
  ')': TokenType.RIGHT_PAREN,
  '{': TokenType.LEFT_BRACE,
  '}': TokenType.RIGHT_BRACE,
  '[': TokenType.LEFT_SQUARE,
  ']': TokenType.RIGHT_SQUARE,
  '+': TokenType.PLUS,
  '-': TokenType.MINUS,
  '/': TokenType.SLASH,
  '*': TokenType.STAR,
  ',': TokenType.COMMA,
  ':': TokenType.COLON,
  '%': TokenType.PERCENT,
}

export const twoCharacterTokens: { [key: string]: TokenType } = {
  '!=': TokenType.BANG_EQUAL,
  '==': TokenType.EQUAL_EQUAL,
  '<=': TokenType.LESS_EQUAL,
  '>=': TokenType.GREATER_EQUAL,
  '+=': TokenType.PLUS_EQUAL,
  '-=': TokenType.MINUS_EQUAL,
  '*=': TokenType.STAR_EQUAL,
  '/=': TokenType.SLASH_EQUAL,
  '**': TokenType.STAR_STAR,
  '&&': TokenType.AND,
  '||': TokenType.OR,
  '=>': TokenType.FAT_ARROW,
  '??': TokenType.QUESTION_QUESTION,
}

export const threeCharacterTokens: { [key: string]: TokenType } = {
  '...': TokenType.SPREAD,
}

export const unacceptableLineStartCharacters = [
  ')',
  '}',
  ']',
  '.',
  ',',
  '*',
  '/',
  '+',
  '!=',
  '==',
  '<=',
  '>=',
  '+=',
  '-=',
  '*=',
  '/=',
  '**',
  '&&',
  '||',
  '=>',
  ':',
  '<',
  '>',
]

export const blankTokens = [
  TokenType.NEW_LINE,
  TokenType.BLOCK_START,
  TokenType.BLOCK_END,
  TokenType.EOF,
]

export const blockStart = [TokenType.NEW_LINE, TokenType.BLOCK_START]

export const newLineTokens = [
  TokenType.NEW_LINE,
  TokenType.BLOCK_END,
  TokenType.EOF,
]

export const synchronizeTokens = [
  TokenType.LET,
  TokenType.CONST,
  TokenType.IF,
  TokenType.WHILE,
  TokenType.RETURN,
  TokenType.IMPORT,
  TokenType.FROM,
]

export const newLineAllowedAfterTokens = [
  TokenType.RIGHT_PAREN,
  TokenType.RIGHT_BRACE,
  TokenType.RIGHT_SQUARE,
  TokenType.IDENTIFIER,
  TokenType.STRING,
  TokenType.NUMBER,
  TokenType.TRUE,
  TokenType.FALSE,
  TokenType.NULL,
  TokenType.FAT_ARROW,
  TokenType.RETURN,
  TokenType.NEW_LINE,
  TokenType.BLOCK_END,
  TokenType.IMPORT,
  TokenType.FROM,
]

export const variableDeclarationTokens = [TokenType.CONST, TokenType.LET]

export const equalityTokens = [TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL]

export const comparisonTokens = [
  TokenType.LESS,
  TokenType.LESS_EQUAL,
  TokenType.GREATER,
  TokenType.GREATER_EQUAL,
]

export const unaryTokens = [TokenType.BANG, TokenType.MINUS]

export const additionTokens = [TokenType.MINUS, TokenType.PLUS]

export const multiplicationTokens = [
  TokenType.SLASH,
  TokenType.STAR,
  TokenType.PERCENT,
]

export const indiceTokens = [TokenType.STAR_STAR]

export const assignmentOperatorTokens = [
  TokenType.PLUS_EQUAL,
  TokenType.MINUS_EQUAL,
  TokenType.STAR_EQUAL,
  TokenType.SLASH_EQUAL,
]

type BinaryOperatorNames =
  | 'equals'
  | 'notEquals'
  | 'plus'
  | 'minus'
  | 'multiply'
  | 'divide'
  | 'power'
  | 'lessThan'
  | 'greaterThan'
  | 'lessThanOrEqual'
  | 'greaterThanOrEqual'
  | 'modulo'

export const getBinaryOperator = (
  operator: Token<BinaryOperator>
): BinaryOperatorNames => {
  const mapping: Record<BinaryOperator, BinaryOperatorNames> = {
    [TokenType.EQUAL_EQUAL]: 'equals',
    [TokenType.BANG_EQUAL]: 'notEquals',
    [TokenType.PLUS]: 'plus',
    [TokenType.MINUS]: 'minus',
    [TokenType.STAR]: 'multiply',
    [TokenType.SLASH]: 'divide',
    [TokenType.STAR_STAR]: 'power',
    [TokenType.LESS]: 'lessThan',
    [TokenType.GREATER]: 'greaterThan',
    [TokenType.LESS_EQUAL]: 'lessThanOrEqual',
    [TokenType.GREATER_EQUAL]: 'greaterThanOrEqual',
    [TokenType.PERCENT]: 'modulo',
  }
  return mapping[operator.type]
}

export const getAssignmentOperator = (
  operator: Token<AssignmentOperator>
): Token => {
  switch (operator.type) {
    case TokenType.PLUS_EQUAL:
      return new Token(TokenType.PLUS, operator.line, '+')
    case TokenType.MINUS_EQUAL:
      return new Token(TokenType.MINUS, operator.line, '-')
    case TokenType.STAR_EQUAL:
      return new Token(TokenType.STAR, operator.line, '*')
    case TokenType.SLASH_EQUAL:
      return new Token(TokenType.SLASH, operator.line, '/')
  }
}
