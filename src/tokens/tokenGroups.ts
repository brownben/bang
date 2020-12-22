import { Token } from './Token'
import { TokenType } from './TokenType'
import BangError from '../BangError'

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

export const getAssignmentOperator = (operator: Token): Token => {
  if (operator.type === TokenType.PLUS_EQUAL)
    return new Token(TokenType.PLUS, operator.line)
  else if (operator.type === TokenType.MINUS_EQUAL)
    return new Token(TokenType.MINUS, operator.line)
  else if (operator.type === TokenType.STAR_EQUAL)
    return new Token(TokenType.STAR, operator.line)
  else if (operator.type === TokenType.SLASH_EQUAL)
    return new Token(TokenType.SLASH, operator.line)
  else throw new BangError(`Unknown Token`)
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

export const comparisonTokens = [
  TokenType.LESS,
  TokenType.LESS_EQUAL,
  TokenType.GREATER,
  TokenType.GREATER_EQUAL
]

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

export const assumeNewLineTokens = [
  TokenType.RIGHT_PAREN,
  TokenType.IDENTIFIER,
  TokenType.STRING,
  TokenType.NUMBER,
  TokenType.TRUE,
  TokenType.FALSE,
  TokenType.NULL,
  TokenType.FAT_ARROW,
  TokenType.RETURN,
  TokenType.NEW_LINE,
  TokenType.BLOCK_END
]

export const unacceptableLineStartCharacters = [')', '.', ',', '*', '/', '+']
