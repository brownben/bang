import { Token, TokenType } from './Tokens'
import { Expr, ExprBinary, ExprGrouping, ExprLiteral, ExprUnary } from './Expr'
import { Stmt, StmtPrint, StmtExpression } from './statements'
import BangError from './BangError'

class Parser {
  current: number = 0
  tokens: Token[] = []
  source: string = ''

  constructor(tokens: Token[], source: string) {
    this.tokens = tokens
    this.source = source
  }

  parse() {
    const statements: Stmt[] = []
    while (!this.isAtEnd()) statements.push(this.statement())
    return statements
  }

  match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance()
        return true
      }
    }

    return false
  }

  check(type: TokenType) {
    if (this.isAtEnd()) return false
    return this.peek().type == type
  }

  advance(): Token {
    if (!this.isAtEnd()) this.current += 1
    return this.previous()
  }

  isAtEnd(): boolean {
    return this.peek().type == TokenType.EOF
  }

  peek(): Token {
    return this.tokens[this.current]
  }

  previous(): Token {
    return this.tokens[this.current - 1]
  }

  consume(type: TokenType, message: string) {
    if (this.check(type)) return this.advance()

    throw this.error(this.peek(), message)
  }

  error(token: Token, message: string) {
    throw new BangError(message, this.source, token.line)
  }

  synchronize() {
    this.advance()

    while (!this.isAtEnd()) {
      if (this.previous().type == TokenType.NEW_LINE) return

      switch (this.peek().type) {
        case TokenType.CLASS:
        case TokenType.LET:
        case TokenType.CONST:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.RETURN:
          return
      }

      this.advance()
    }
  }

  statement(): Stmt {
    if (this.match(TokenType.PRINT)) return this.printStatement()

    return this.expressionStatement()
  }

  printStatement() {
    const value = this.expression()
    this.consume(TokenType.NEW_LINE, 'Expect new line after value.')
    return new StmtPrint(value)
  }

  expressionStatement() {
    const expr = this.expression()
    this.consume(TokenType.NEW_LINE, 'Expect new line after expression.')
    return new StmtExpression(expr)
  }

  expression(): Expr {
    return this.equality()
  }

  equality(): Expr {
    let expr: Expr = this.comparison()

    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator: Token = this.previous()
      const right: Expr = this.comparison()
      expr = new ExprBinary(expr, operator, right)
    }

    return expr
  }

  comparison(): Expr {
    let expr: Expr = this.term()

    while (
      this.match(
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL
      )
    ) {
      const operator: Token = this.previous()
      const right: Expr = this.term()
      expr = new ExprBinary(expr, operator, right)
    }

    return expr
  }

  term(): Expr {
    let expr: Expr = this.factor()

    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator: Token = this.previous()
      const right: Expr = this.factor()
      expr = new ExprBinary(expr, operator, right)
    }

    return expr
  }

  factor(): Expr {
    let expr: Expr = this.unary()

    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      const operator: Token = this.previous()
      const right: Expr = this.unary()
      expr = new ExprBinary(expr, operator, right)
    }

    return expr
  }

  unary(): Expr {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      const operator: Token = this.previous()
      const right: Expr = this.unary()
      return new ExprUnary(operator, right)
    }

    return this.primary()
  }

  primary(): Expr {
    if (this.match(TokenType.FALSE))
      return new ExprLiteral('boolean', this.previous(), 'false')
    else if (this.match(TokenType.TRUE))
      return new ExprLiteral('boolean', this.previous(), 'true')
    else if (this.match(TokenType.NULL)) return new ExprLiteral('null')
    else if (this.match(TokenType.NUMBER))
      return new ExprLiteral('number', this.previous())
    else if (this.match(TokenType.STRING))
      return new ExprLiteral('string', this.previous())
    else if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression()
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.")
      return new ExprGrouping(expr)
    }

    const expr = this.expression()
    return new ExprGrouping(expr)
  }
}

export const getAbstractSyntaxTree = (tokens: Token[], source: string) =>
  new Parser(tokens, source).parse()
