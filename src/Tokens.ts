import BangError from './BangError'

export enum TokenType {
  // Brackets + Separators
  LEFT_PAREN = 1,
  RIGHT_PAREN,
  LEFT_BRACE,
  RIGHT_BRACE,
  COMMA,
  DOT,
  SEMICOLON,
  FAT_ARROW,

  // Operators
  PLUS,
  MINUS,
  STAR,
  SLASH,
  BANG,
  EQUAL,
  STAR_STAR,

  // Assignment Operators
  PLUS_EQUAL,
  MINUS_EQUAL,
  STAR_EQUAL,
  SLASH_EQUAL,

  // Comparison Operators
  BANG_EQUAL,
  EQUAL_EQUAL,
  GREATER,
  GREATER_EQUAL,
  LESS,
  LESS_EQUAL,

  // Literals.
  IDENTIFIER,
  STRING,
  NUMBER,

  // Keywords.
  AND,
  OR,
  IF,
  ELSE,
  WHILE,
  FOR,
  NULL,
  TRUE,
  FALSE,
  LET,
  CONST,
  RETURN,
  CLASS,
  SUPER,
  THIS,

  // Blocks
  BLOCK_START,
  BLOCK_END,

  NEW_LINE,
  EOF
}

export interface Token {
  type: TokenType
  line: number
  value?: string
}

export const comparisonTokens = [
  TokenType.LESS,
  TokenType.LESS_EQUAL,
  TokenType.GREATER,
  TokenType.GREATER_EQUAL
]

export const Keywords = {
  and: TokenType.AND,
  or: TokenType.OR,
  if: TokenType.IF,
  else: TokenType.ELSE,
  while: TokenType.WHILE,
  for: TokenType.FOR,
  null: TokenType.NULL,
  true: TokenType.TRUE,
  false: TokenType.FALSE,
  let: TokenType.LET,
  const: TokenType.CONST,
  return: TokenType.RETURN,
  class: TokenType.CLASS,
  super: TokenType.SUPER,
  this: TokenType.THIS
} as { [key: string]: TokenType }

export const oneCharacterTokens: { [key: string]: TokenType } = {
  '!': TokenType.BANG,
  '=': TokenType.EQUAL,
  '<': TokenType.LESS,
  '>': TokenType.GREATER,
  '(': TokenType.LEFT_PAREN,
  ')': TokenType.RIGHT_PAREN,
  '{': TokenType.LEFT_BRACE,
  '}': TokenType.RIGHT_BRACE,
  '+': TokenType.PLUS,
  '-': TokenType.MINUS,
  '/': TokenType.SLASH,
  '*': TokenType.STAR,
  ',': TokenType.COMMA
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
  '=>': TokenType.FAT_ARROW
}

export const synchronizeTokens = [
  TokenType.CLASS,
  TokenType.LET,
  TokenType.CONST,
  TokenType.FOR,
  TokenType.IF,
  TokenType.WHILE,
  TokenType.RETURN
]

export const variableDeclarationTokens = [TokenType.CONST, TokenType.LET]

export const equalityTokens = [TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL]

export const unaryTokens = [TokenType.BANG, TokenType.MINUS]

export const additionTokens = [TokenType.MINUS, TokenType.PLUS]

export const multiplicationTokens = [TokenType.SLASH, TokenType.STAR]

export const indiceTokens = [TokenType.STAR_STAR]

export const assignmentOperatorTokens = [
  TokenType.PLUS_EQUAL,
  TokenType.MINUS_EQUAL,
  TokenType.STAR_EQUAL,
  TokenType.SLASH_EQUAL
]

export const getAssignmentOperator = (operator: Token): Token => {
  if (operator.type === TokenType.PLUS_EQUAL)
    return { type: TokenType.PLUS, line: operator.line }
  else if (operator.type === TokenType.MINUS_EQUAL)
    return { type: TokenType.MINUS, line: operator.line }
  else if (operator.type === TokenType.STAR_EQUAL)
    return { type: TokenType.STAR, line: operator.line }
  else if (operator.type === TokenType.SLASH_EQUAL)
    return { type: TokenType.SLASH, line: operator.line }
  else throw new BangError(`Unknown Token`)
}
