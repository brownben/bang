import { Token } from './Tokens'

export abstract class Literal {
  abstract token: Token | undefined
  abstract value: string
  abstract type: string

  abstract toString(): string
  abstract getValue(): string | number | boolean | null
}

export class LiteralString extends Literal {
  token: Token | undefined
  value: string
  type = 'string'

  constructor(token?: Token, value?: any) {
    super()
    this.value = token?.value ?? value?.toString() ?? ''
    this.token = token
  }

  toString() {
    return `["${this.value}" - string]`
  }

  getValue() {
    return this.value
  }
}

export class LiteralNumber extends Literal {
  token: Token | undefined
  value: string
  type = 'number'

  constructor(token?: Token, value?: any) {
    super()
    this.value = token?.value ?? value?.toString() ?? ''
    this.token = token
  }

  toString() {
    return `[${this.value} - number]`
  }

  getValue() {
    return Number(this.value)
  }
}

export class LiteralBoolean extends Literal {
  token: Token | undefined
  value: string
  type = 'boolean'

  constructor(token?: Token, value?: any) {
    super()
    this.value = token?.value ?? value?.toString() ?? ''
    this.token = token
  }

  toString() {
    return `[${this.value} - boolean]`
  }

  getValue() {
    return this.value === 'true'
  }
}

export class LiteralNull extends Literal {
  token: Token | undefined
  value: string
  type = 'null'

  constructor(token?: Token, value?: any) {
    super()
    this.value = token?.value ?? value?.toString() ?? ''
    this.token = token
  }

  toString() {
    return '[null]'
  }

  getValue() {
    return null
  }
}
