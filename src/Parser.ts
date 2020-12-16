import {
  Token,
  TokenType,
  additionTokens,
  comparisonTokens,
  equalityTokens,
  synchronizeTokens,
  multiplicationTokens,
  unaryTokens,
  variableDeclarationTokens
} from './Tokens'
import {
  Expr,
  ExprAssign,
  ExprBinary,
  ExprGrouping,
  ExprLiteral,
  ExprLogical,
  ExprUnary,
  ExprVariable
} from './expressions'
import {
  Stmt,
  StmtBlock,
  StmtPrint,
  StmtExpression,
  StmtVariable,
  StmtIf
} from './statements'
import BangError from './BangError'

class BaseParser {
  current: number = 0
  tokens: Token[] = []
  source: string = ''

  peek(): Token {
    return this.tokens[this.current]
  }

  previous(): Token {
    return this.tokens[this.current - 1]
  }

  isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF
  }

  check(type: TokenType) {
    if (this.isAtEnd()) return false
    return this.peek().type === type
  }

  advance(): Token {
    if (!this.isAtEnd()) this.current += 1
    return this.previous()
  }

  assertToken(type: TokenType, message: string) {
    if (this.check(type)) return this.advance()

    throw this.error(this.peek(), message)
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

  error(token: Token, message: string) {
    throw new BangError(message, this.source, token.line)
  }
}

class Parser extends BaseParser {
  constructor(tokens: Token[], source: string) {
    super()
    this.tokens = tokens
    this.source = source
  }

  parse(): Stmt[] {
    const statements: (Stmt | null)[] = []
    while (!this.isAtEnd()) statements.push(this.declaration())
    return statements.filter(stmt => !!stmt) as Stmt[]
  }

  synchronize() {
    this.advance()

    while (!this.isAtEnd()) {
      if (
        this.previous().type === TokenType.NEW_LINE ||
        synchronizeTokens.includes(this.peek().type)
      )
        return

      this.advance()
    }
  }

  statement(): Stmt {
    if (this.match(TokenType.IF)) return this.ifStatement()
    if (this.match(TokenType.PRINT)) return this.printStatement()
    if (this.match(TokenType.BLOCK_START)) return new StmtBlock(this.block())

    return this.expressionStatement()
  }

  block(): Stmt[] {
    const statements: (Stmt | null)[] = []

    while (!this.check(TokenType.BLOCK_END) && !this.isAtEnd()) {
      statements.push(this.declaration())
    }
    this.advance()

    return statements.filter(Boolean) as Stmt[]
  }

  declaration(): Stmt | null {
    try {
      if (this.match(...variableDeclarationTokens))
        return this.variableDeclaration(this.previous())
      else return this.statement()
    } catch {
      this.synchronize()
      return null
    }
  }

  variableDeclaration(initializerType: Token): Stmt {
    const constant = initializerType.type === TokenType.CONST
    const name: Token = this.assertToken(
      TokenType.IDENTIFIER,
      'Expect variable name.'
    )

    let initializer: Expr | undefined = undefined
    if (this.match(TokenType.EQUAL)) {
      initializer = this.expression()
    }

    this.assertToken(
      TokenType.NEW_LINE,
      'Expect a new line after variable declaration.'
    )
    return new StmtVariable(name, constant, initializer)
  }

  ifStatement(): Stmt {
    this.assertToken(TokenType.LEFT_PAREN, "Expect '(' after 'if'.")
    const condition: Expr = this.expression()
    this.assertToken(TokenType.RIGHT_PAREN, "Expect ')' after if condition.")

    if (
      this.peek()?.type === TokenType.NEW_LINE &&
      this.tokens[this.current + 1].type === TokenType.BLOCK_START
    )
      this.advance()

    const thenBranch = this.statement()

    let elseBranch = null
    if (this.match(TokenType.ELSE)) {
      if (
        this.peek()?.type === TokenType.NEW_LINE &&
        this.tokens[this.current + 1].type === TokenType.BLOCK_START
      )
        this.advance()

      elseBranch = this.statement()
    }

    return new StmtIf(condition, thenBranch, elseBranch)
  }

  printStatement(): Stmt {
    const value = this.expression()
    this.assertToken(TokenType.NEW_LINE, 'Expect new line after value.')
    return new StmtPrint(value)
  }

  expressionStatement(): Stmt {
    const expr = this.expression()
    this.assertToken(TokenType.NEW_LINE, 'Expect new line after expression.')
    return new StmtExpression(expr)
  }

  expression(): Expr {
    return this.assignment()
  }

  assignment(): Expr {
    const expr: Expr = this.or()

    if (this.match(TokenType.EQUAL)) {
      const equals: Token = this.previous()
      const value: Expr = this.expression()

      if (expr instanceof ExprVariable) {
        const name = expr.name
        return new ExprAssign(name, value)
      }

      this.error(equals, 'Invalid Assignment Target')
    }

    return expr
  }

  or(): Expr {
    let expr = this.and()

    while (this.match(TokenType.OR)) {
      const operator = this.previous()
      const right = this.and()
      expr = new ExprLogical(expr, operator, right)
    }

    return expr
  }

  and(): Expr {
    let expr = this.equality()

    while (this.match(TokenType.AND)) {
      const operator = this.previous()
      const right = this.and()
      expr = new ExprLogical(expr, operator, right)
    }

    return expr
  }

  equality(): Expr {
    let expr: Expr = this.comparison()

    while (this.match(...equalityTokens)) {
      const operator: Token = this.previous()
      const right: Expr = this.comparison()
      expr = new ExprBinary(expr, operator, right)
    }

    return expr
  }

  comparison(): Expr {
    let expr: Expr = this.addition()

    while (this.match(...comparisonTokens)) {
      const operator: Token = this.previous()
      const right: Expr = this.addition()
      expr = new ExprBinary(expr, operator, right)
    }

    return expr
  }

  addition(): Expr {
    let expr: Expr = this.multiplication()

    while (this.match(...additionTokens)) {
      const operator: Token = this.previous()
      const right: Expr = this.multiplication()
      expr = new ExprBinary(expr, operator, right)
    }

    return expr
  }

  multiplication(): Expr {
    let expr: Expr = this.unary()

    while (this.match(...multiplicationTokens)) {
      const operator: Token = this.previous()
      const right: Expr = this.unary()
      expr = new ExprBinary(expr, operator, right)
    }

    return expr
  }

  unary(): Expr {
    if (this.match(...unaryTokens)) {
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
    else if (this.match(TokenType.IDENTIFIER))
      return new ExprVariable(this.previous())
    else if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression()
      this.assertToken(TokenType.RIGHT_PAREN, "Expect ')' after expression.")
      return new ExprGrouping(expr)
    }

    const expr = this.expression()
    return new ExprGrouping(expr)
  }
}

export const getAbstractSyntaxTree = (tokens: Token[], source: string) =>
  new Parser(tokens, source).parse()
