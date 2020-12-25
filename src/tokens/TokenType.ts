export enum TokenType {
  // Brackets + Separators
  LEFT_PAREN = '(',
  RIGHT_PAREN = ')',
  LEFT_BRACE = '{',
  RIGHT_BRACE = '}',
  LEFT_SQUARE = '[',
  RIGHT_SQUARE = ']',
  COMMA = ',',
  DOT = '.',
  COLON = ':',
  SEMICOLON = ';',
  FAT_ARROW = '=>',

  // Operators
  PLUS = '+',
  MINUS = '-',
  STAR = '*',
  SLASH = '/',
  BANG = '!',
  EQUAL = '=',
  STAR_STAR = '**',

  // Assignment Operators
  PLUS_EQUAL = '+=',
  MINUS_EQUAL = '-=',
  STAR_EQUAL = '*=',
  SLASH_EQUAL = '/=',

  // Comparison Operators
  BANG_EQUAL = '!=',
  EQUAL_EQUAL = '==',
  GREATER = '>',
  GREATER_EQUAL = '>=',
  LESS = '<',
  LESS_EQUAL = '<=',

  // Primitives.
  IDENTIFIER = 'IDENTIFIER',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  TRUE = 'true',
  FALSE = 'false',
  NULL = 'null',

  // Keywords.
  AND = 'and',
  OR = 'or',
  IF = 'if',
  ELSE = 'else',
  WHILE = 'while',
  FOR = 'for',
  LET = 'let',
  CONST = 'const',
  RETURN = 'return',
  CLASS = 'class',
  SUPER = 'super',
  THIS = 'this',

  // Blocks
  BLOCK_START = 'BLOCK START',
  BLOCK_END = 'BLOCK END',

  NEW_LINE = 'NEW LINE',
  EOF = 'END OF FILE',
}

export const keywordTokens = {
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
  this: TokenType.THIS,
} as { [key: string]: TokenType }
