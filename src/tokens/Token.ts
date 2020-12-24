import { TokenType } from './TokenType'

export class Token<T extends TokenType = TokenType> {
  type: T
  line: number
  value?: string

  constructor(type: T, line: number, value?: string) {
    this.type = type
    this.line = line
    this.value = value
  }
}
