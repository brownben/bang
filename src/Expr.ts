import { Token } from './Tokens'
import BangError from './BangError'

export abstract class Expr {}

export class ExprBinary extends Expr {
  left: Expr
  operator: Token
  right: Expr

  constructor(left: Expr, operator: Token, right: Expr) {
    super()
    this.left = left
    this.operator = operator
    this.right = right
  }

  toString() {
    return `(${this.left.toString()}) {${
      this.operator.type
    }} (${this.right.toString()})`
  }
}

export class ExprUnary extends Expr {
  operator: Token
  right: Expr

  constructor(operator: Token, right: Expr) {
    super()
    this.operator = operator
    this.right = right
  }

  toString() {
    return `{${this.operator.type}} (${this.right.toString()})`
  }
}

export class ExprGrouping extends Expr {
  expression: Expr

  constructor(expression: Expr) {
    super()
    this.expression = expression
  }

  toString() {
    return `(${this.expression.toString()})`
  }
}

export class ExprLiteral extends Expr {
  type: string
  value: string
  token: Token | undefined

  constructor(type: string, token?: Token, value?: any) {
    super()
    this.type = type
    this.value = token?.value ?? value?.toString() ?? ''
    this.token = token
  }

  toString() {
    return `(${this.value} | ${this.type})`
  }

  getRawValue() {
    if (this.type === 'number') return Number(this.value)
    else if (this.type === 'string') return this.value
    else if (this.type === 'boolean') return this.value == 'true'
    else return null
  }

  getNumberValue() {
    if (this.type === 'number') return Number(this.value)
    throw new BangError(`Invalid Operation - Not a Number`)
  }
}

export class ExprVariable extends Expr {
  name: string

  constructor(name: Token) {
    super()
    this.name = name.value ?? ''
  }

  toString() {
    return `(${this.name} - variable)`
  }
}

export class ExprAssign extends Expr {
  name: string
  value: Expr

  constructor(name: string, value: Expr) {
    super()
    this.name = name
    this.value = value
  }

  toString() {
    return `(${this.name} - ${this.value.toString()})`
  }
}
