import { TokenType } from './TokenType'

export class Token<Type extends TokenType = TokenType> {
  type: Type
  line: number
  value: string

  constructor(type: Type, line: number, value: string) {
    this.type = type
    this.line = line
    this.value = value
  }
}
