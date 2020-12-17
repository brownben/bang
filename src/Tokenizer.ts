import { Token, TokenType, Keywords } from './Tokens'
import BangError from './BangError'

const oneCharacterTokens: { [key: string]: TokenType } = {
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

const twoCharacterTokens: { [key: string]: TokenType } = {
  '!=': TokenType.BANG_EQUAL,
  '==': TokenType.EQUAL_EQUAL,
  '<=': TokenType.LESS_EQUAL,
  '>=': TokenType.GREATER_EQUAL,
  '+=': TokenType.PLUS_EQUAL,
  '-=': TokenType.MINUS_EQUAL,
  '*=': TokenType.STAR_EQUAL,
  '/=': TokenType.SLASH_EQUAL,
  '**': TokenType.STAR_STAR
}

const isDigit = (char: string): boolean => char >= '0' && char <= '9'
const isAlpha = (char: string): boolean =>
  (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '_'
const isAlphaNumeric = (char: string): boolean => isAlpha(char) || isDigit(char)
const isBlank = (char: string): boolean => [' ', '\t', '\r'].includes(char)

class Tokenizer {
  source: string = ''
  tokens: Token[] = []

  blockLevel: number = 0
  currentPosition: number = 0
  currentLine: number = 1
  currentPositionInLine: number = 0

  addToken = (type: TokenType, value?: string) =>
    this.tokens.push({ type, value, line: this.currentLine })

  getCurrentCharacter = (): string => this.source[this.currentPosition]
  getNextCharacter = (): string => this.source[this.currentPosition + 1]
  moveToNextCharacter = (): string => {
    const current = this.getCurrentCharacter()
    this.currentPosition += 1
    return current
  }
  goToNextLine() {
    while (this.getNextCharacter() !== '\n') this.currentPosition += 1
  }

  isEnd = (): boolean => this.currentPosition >= this.source.length
  isEndOfString = (multiline: boolean, openingChar: string) =>
    (!multiline && this.getCurrentCharacter() === '\n') ||
    this.getCurrentCharacter() === openingChar ||
    this.isEnd()
  isEndOfNumber = (numberContents: string) =>
    this.getCurrentCharacter() === '\n' ||
    (this.getCurrentCharacter() === '.' && numberContents.includes('.')) ||
    (!isDigit(this.getCurrentCharacter()) &&
      this.getCurrentCharacter() !== '.') ||
    this.isEnd()

  getString() {
    const openingChar = this.getCurrentCharacter()
    const multiline = openingChar === '`'

    this.currentPosition += 1

    let stringContents = ''
    while (!this.isEndOfString(multiline, openingChar))
      stringContents += this.moveToNextCharacter()

    if (this.isEnd() || this.getCurrentCharacter() === '\n')
      throw this.constructError('Unterminated String')

    this.addToken(TokenType.STRING, stringContents)
    this.currentLine += stringContents.split('\n').length - 1
  }
  getNumber() {
    const currentChar = this.getCurrentCharacter()
    if (currentChar === '.' && !isDigit(this.getNextCharacter()))
      this.addToken(TokenType.DOT)
    else {
      let numberContents = currentChar === '.' ? '0.' : currentChar
      this.currentPosition += 1

      while (!this.isEndOfNumber(numberContents))
        numberContents += this.moveToNextCharacter()

      if (numberContents[numberContents.length - 1] === '.')
        numberContents += '0'

      this.currentPosition -= 1
      this.addToken(TokenType.NUMBER, numberContents)
    }
  }
  getIdentifier() {
    let identifierString = this.getCurrentCharacter()

    this.currentPosition += 1
    while (isAlphaNumeric(this.getCurrentCharacter()))
      identifierString += this.moveToNextCharacter()

    this.currentPosition -= 1
    if (Keywords[identifierString]) this.addToken(Keywords[identifierString])
    else this.addToken(TokenType.IDENTIFIER, identifierString)
  }

  addNewLine() {
    this.addToken(TokenType.NEW_LINE)
    this.currentLine += 1
    this.currentPositionInLine = 0
  }

  constructError = (message: string) =>
    new BangError(message, this.source, this.currentLine)

  getIndentationLevel() {
    let spaces = 0
    while (this.getCurrentCharacter() == ' ') {
      spaces += 1
      this.currentPosition += 1
      this.currentPositionInLine += 1
    }
    return Math.floor(spaces / 2)
  }

  changeBlockLevel() {
    let indentationLevel = this.getIndentationLevel()
    while (this.blockLevel > indentationLevel) {
      this.blockLevel -= 1
      this.addToken(TokenType.BLOCK_END)
    }
    while (this.blockLevel < indentationLevel) {
      this.blockLevel += 1
      this.addToken(TokenType.BLOCK_START)
    }
  }

  closeAllBlocks() {
    while (this.blockLevel > 0) {
      this.blockLevel -= 1
      this.addToken(TokenType.BLOCK_END)
    }
  }

  scanSource() {
    if (this.currentPositionInLine === 0) this.changeBlockLevel()

    const char = this.getCurrentCharacter()
    const twoChar = char + this.getNextCharacter()

    if (twoCharacterTokens?.[twoChar])
      this.addToken(twoCharacterTokens?.[twoChar])
    else if (twoChar === '//') this.goToNextLine()
    else if (oneCharacterTokens?.[char])
      this.addToken(oneCharacterTokens?.[char])
    else if (char === `'` || char === '"' || char === '`') this.getString()
    else if (isDigit(char) || char === '.') this.getNumber()
    else if (isAlpha(char)) this.getIdentifier()
    else if (char === '\n') this.addNewLine()
    else if (!isBlank(char) && !this.isEnd())
      throw this.constructError(`Unidentified Character`)

    if (Object.keys(twoCharacterTokens).includes(twoChar)) {
      this.currentPositionInLine += 2
      this.currentPosition += 2
    } else if (char !== '\n') {
      this.currentPositionInLine += 1
      this.currentPosition += 1
    } else {
      this.currentPosition += 1
    }
  }

  constructor(source: string) {
    this.source = source
    while (!this.isEnd()) this.scanSource()

    this.closeAllBlocks()
    if (this.tokens[this.tokens.length - 1]?.type !== TokenType.NEW_LINE)
      this.addToken(TokenType.NEW_LINE)

    this.addToken(TokenType.EOF)
  }

  getTokens(): Token[] {
    return this.tokens
  }
}

export const getTokens = (code: string) => new Tokenizer(code).getTokens()
