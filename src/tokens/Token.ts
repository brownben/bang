import { TokenType } from './TokenType'

export class Token {
  type: TokenType
  line: number
  value?: string

  constructor(type: TokenType, line: number, value?: string) {
    this.type = type
    this.line = line
    this.value = value
  }

  toString(): string {
    if (this.value)
      return `Token <${this.type}, ${this.value}> (Line: ${this.line})`
    else return `Token <${this.type}> (Line: ${this.line})`
  }
}
