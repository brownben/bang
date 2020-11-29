export enum TokenType {
  // Single-character tokens.
  LEFT_PAREN,
  RIGHT_PAREN,
  LEFT_BRACE,
  RIGHT_BRACE,
  COMMA,
  DOT,
  MINUS,
  PLUS,
  SEMICOLON,
  SLASH,
  STAR,

  // One or two character tokens.
  BANG,
  BANG_EQUAL,
  EQUAL,
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

  NEW_LINE,
  EOF
}

export interface Token {
  type: TokenType
  line: number
  value?: string
}

export const comparitorTokens = [
  TokenType.EQUAL,
  TokenType.BANG_EQUAL,
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
