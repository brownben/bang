import { Token, TokenType, Keywords } from './Tokens'
import BangError from './BangError'

const isDigit = (char: string): boolean => char >= '0' && char <= '9'
const isAlpha = (char: string): boolean =>
  (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '_'
const isAlphaNumeric = (char: string): boolean => isAlpha(char) || isDigit(char)
const isBlank = (char: string): boolean =>
  char === '\r' || char === '\t' || char === ' '

class Tokenizer {
  source: string = ''
  tokens: Token[] = []

  currentPosition: number = 0
  currentLine: number = 1

  addToken = (type: TokenType, value?: string) =>
    this.tokens.push({ type, value, line: this.currentLine })

  getCurrentCharacter = (): string => this.source[this.currentPosition]
  getNextCharacter = (): string => this.source[this.currentPosition + 1]
  moveToNextCharacter = (): string => {
    const current = this.getCurrentCharacter()
    this.currentPosition += 1
    return current
  }
  goToNextLine = () => {
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
  }

  constructError = (message: string) =>
    new BangError(message, this.source, this.currentLine)

  scanSource() {
    const char = this.getCurrentCharacter()
    const twoChar = char + this.getNextCharacter()
    if (twoChar === '!=') this.addToken(TokenType.BANG_EQUAL)
    else if (twoChar === '==') this.addToken(TokenType.EQUAL_EQUAL)
    else if (twoChar === '<=') this.addToken(TokenType.LESS_EQUAL)
    else if (twoChar === '>=') this.addToken(TokenType.GREATER_EQUAL)
    else if (twoChar === '//') this.goToNextLine()
    else if (char === '!') this.addToken(TokenType.BANG)
    else if (char === '=') this.addToken(TokenType.EQUAL)
    else if (char === '<') this.addToken(TokenType.LESS)
    else if (char === '>') this.addToken(TokenType.GREATER)
    else if (char === '(') this.addToken(TokenType.LEFT_PAREN)
    else if (char === ')') this.addToken(TokenType.RIGHT_PAREN)
    else if (char === '{') this.addToken(TokenType.LEFT_BRACE)
    else if (char === '}') this.addToken(TokenType.RIGHT_BRACE)
    else if (char === '+') this.addToken(TokenType.PLUS)
    else if (char === '-') this.addToken(TokenType.MINUS)
    else if (char === '/') this.addToken(TokenType.SLASH)
    else if (char === '*') this.addToken(TokenType.STAR)
    else if (char === ',') this.addToken(TokenType.COMMA)
    else if (char === `'` || char === '"' || char === '`') this.getString()
    else if (isDigit(char) || char === '.') this.getNumber()
    else if (isAlpha(char)) this.getIdentifier()
    else if (char === '\n') this.addNewLine()
    else if (!isBlank(char)) throw this.constructError('Unidentified Character')

    if (['==', '!=', '<=', '>=', '//'].includes(twoChar))
      this.currentPosition += 2
    else this.currentPosition += 1
  }

  constructor(source: string) {
    this.source = source
    while (!this.isEnd()) this.scanSource()

    if (this.tokens[this.tokens.length - 1]?.type !== TokenType.NEW_LINE)
      this.addToken(TokenType.NEW_LINE)

    this.addToken(TokenType.EOF)
  }

  getTokens(): Token[] {
    return this.tokens
  }
}

export const getTokens = (code: string) => new Tokenizer(code).getTokens()
