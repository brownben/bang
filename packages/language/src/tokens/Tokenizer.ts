import { Token } from './Token'
import { TokenType, keywordTokens } from './TokenType'
import {
  assumeNewLineTokens,
  oneCharacterTokens,
  twoCharacterTokens,
  threeCharacterTokens,
  unacceptableLineStartCharacters,
} from './tokenGroups'
import BangError from '../BangError'

const isDigit = (char: string): boolean => char >= '0' && char <= '9'
const isAlpha = (char: string): boolean =>
  (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '_'
const isAlphaNumeric = (char: string): boolean => isAlpha(char) || isDigit(char)
const isBlank = (char: string): boolean => [' ', '\t', '\r'].includes(char)

class BaseTokeniser {
  source: string = ''
  tokens: Token[] = []

  blockLevel: number = 0
  expressionLevel: number = 0
  currentPosition: number = 0
  currentLine: number = 1
  currentPositionInLine: number = 0

  addToken(type: TokenType, value: string): void {
    this.tokens.push(new Token(type, this.currentLine, value))
  }

  getLastToken(): Token {
    return this.tokens[this.tokens.length - 1]
  }

  getCurrentCharacter(): string {
    return this.source[this.currentPosition]
  }
  getNextCharacter(): string {
    return this.source[this.currentPosition + 1]
  }
  getNextNonWhitespaceCharacter(): string {
    let position = this.currentPosition + 1
    while (isBlank(this.source[position])) position += 1
    return this.source[position]
  }
  moveToNextCharacter(): string {
    const current = this.getCurrentCharacter()
    this.currentPosition += 1
    return current
  }

  getTwoCharacters(): string {
    return this.source.slice(this.currentPosition, this.currentPosition + 2)
  }
  getThreeCharacters(): string {
    return this.source.slice(this.currentPosition, this.currentPosition + 3)
  }

  goToNextLine() {
    while (this.getCurrentCharacter() !== '\n' && !this.isEnd())
      this.currentPosition += 1
  }

  isEnd(): boolean {
    return this.currentPosition >= this.source.length
  }

  constructError(message: string) {
    return new BangError(message, this.currentLine, this.source)
  }
}

export class Tokenizer extends BaseTokeniser {
  isEndOfString(multiline: boolean, openingChar: string) {
    if (this.isEnd()) return true
    else if (this.getCurrentCharacter() === openingChar) return true
    else if (!multiline && this.getCurrentCharacter() === '\n') return true
    else return false
  }
  isEndOfNumber(numberContents: string) {
    if (this.isEnd()) return true
    else if (this.getCurrentCharacter() === '\n') return true
    else if (this.getCurrentCharacter() === '.' && numberContents.includes('.'))
      return true
    else if (
      this.getCurrentCharacter() === '.' &&
      !isDigit(this.getNextCharacter())
    )
      return true
    else if (
      !isDigit(this.getCurrentCharacter()) &&
      !['.', '_'].includes(this.getCurrentCharacter())
    )
      return true
    else return false
  }

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
      this.addToken(TokenType.DOT, currentChar)
    else {
      let numberContents: string = currentChar === '.' ? '0.' : currentChar
      this.currentPosition += 1

      while (!this.isEndOfNumber(numberContents))
        numberContents += this.moveToNextCharacter()

      numberContents = numberContents.replace(/_/g, '')

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
    if (
      keywordTokens[identifierString.toLowerCase()] &&
      typeof keywordTokens[identifierString.toLowerCase()] !== 'function'
    )
      this.addToken(
        keywordTokens[identifierString.toLowerCase()],
        identifierString
      )
    else this.addToken(TokenType.IDENTIFIER, identifierString)
  }

  addNewLine() {
    const validLineStartCharacter = !unacceptableLineStartCharacters.includes(
      this.getNextNonWhitespaceCharacter()
    )

    if (
      assumeNewLineTokens.includes(this.getLastToken()?.type) &&
      validLineStartCharacter &&
      this.expressionLevel <= 0
    ) {
      this.addToken(TokenType.NEW_LINE, '\n')
      this.currentPositionInLine = 0
    }

    this.currentLine += 1
  }

  getIndentationLevel() {
    let spaces = 0
    while (this.getCurrentCharacter() === ' ') {
      spaces += 1
      this.currentPosition += 1
      this.currentPositionInLine += 1
    }

    if (this.getCurrentCharacter() === '\n') return this.blockLevel
    else return Math.floor(spaces / 2)
  }

  changeBlockLevel() {
    let indentationLevel = this.getIndentationLevel()
    while (this.blockLevel > indentationLevel) {
      this.blockLevel -= 1
      this.addToken(TokenType.BLOCK_END, '')
    }
    while (this.blockLevel < indentationLevel) {
      this.blockLevel += 1
      this.addToken(TokenType.BLOCK_START, '')
    }
  }

  closeAllBlocks() {
    while (this.blockLevel > 0) {
      this.blockLevel -= 1
      this.addToken(TokenType.BLOCK_END, '')
    }
  }

  scanSource() {
    if (this.currentPositionInLine === 0) this.changeBlockLevel()

    const char = this.getCurrentCharacter()
    const twoChar = this.getTwoCharacters()
    const threeChar = this.getThreeCharacters()

    if (threeCharacterTokens?.[threeChar])
      this.addToken(threeCharacterTokens?.[threeChar], threeChar)
    else if (twoCharacterTokens?.[twoChar])
      this.addToken(twoCharacterTokens?.[twoChar], twoChar)
    else if (twoChar === '//') this.goToNextLine()
    else if (oneCharacterTokens?.[char])
      this.addToken(oneCharacterTokens?.[char], char)
    else if (char === `'` || char === '"' || char === '`') this.getString()
    else if (isDigit(char) || char === '.') this.getNumber()
    else if (isAlpha(char)) this.getIdentifier()
    else if (char === '\n') this.addNewLine()
    else if (!isBlank(char) && !this.isEnd())
      throw this.constructError(`Unidentified Character "${char}"`)

    if (['{', '(', '['].includes(char)) this.expressionLevel += 1
    else if (['}', ')', ']'].includes(char)) this.expressionLevel -= 1

    if (threeChar in threeCharacterTokens) {
      this.currentPositionInLine += 3
      this.currentPosition += 3
    } else if (twoChar in twoCharacterTokens) {
      this.currentPositionInLine += 2
      this.currentPosition += 2
    } else if (char !== '\n' && twoChar !== '//') {
      this.currentPositionInLine += 1
      this.currentPosition += 1
    } else if (twoChar !== '//') {
      this.currentPosition += 1
    }
  }

  constructor(source: string) {
    super()
    this.source = source.replace(/\r\n/g, '\n')
    while (!this.isEnd()) this.scanSource()

    this.closeAllBlocks()
    if (this.getLastToken()?.type !== TokenType.NEW_LINE)
      this.addToken(TokenType.NEW_LINE, '\n')

    this.addToken(TokenType.EOF, '')
  }

  getTokens(): Token[] {
    return this.tokens
  }
}
