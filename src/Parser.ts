import {
  Token,
  TokenType,
  additionTokens,
  assignmentOperatorTokens,
  comparisonTokens,
  equalityTokens,
  getTokens,
  indiceTokens,
  multiplicationTokens,
  synchronizeTokens,
  unaryTokens,
  variableDeclarationTokens,
  getAssignmentOperator
} from './tokens'
import {
  Expr,
  ExprAssign,
  ExprBinary,
  ExprCall,
  ExprFunction,
  ExprGet,
  ExprGrouping,
  ExprLiteral,
  ExprLogical,
  ExprUnary,
  ExprVariable
} from './expressions'
import {
  Stmt,
  StmtBlock,
  StmtExpression,
  StmtIf,
  StmtReturn,
  StmtVariable,
  StmtWhile
} from './statements'
import BangError from './BangError'

class BaseParser {
  current: number = 0
  tokens: Token[] = []
  source: string = ''

  getToken(position: number): Token {
    return this.tokens?.[position] ?? this.tokens[this.tokens.length - 1]
  }

  peek(): Token {
    return this.tokens[this.current]
  }

  previous(): Token {
    return this.tokens[this.current - 1]
  }

  isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF
  }

  check(...type: TokenType[]) {
    if (this.isAtEnd()) return false
    return type.includes(this.peek().type)
  }

  checkMultiple(...tokens: TokenType[]): boolean {
    return tokens
      .map((token, index) => this.tokens[this.current + index]?.type === token)
      .every(Boolean)
  }

  advance(by: number = 1): Token {
    if (!this.isAtEnd()) this.current += by
    return this.previous()
  }

  assertToken(type: TokenType | TokenType[], message: string) {
    if (typeof type === 'object') {
      if (this.check(...type)) return this.advance()
    } else if (this.check(type)) return this.advance()

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

  matchAtPoint(position: number, tokens: TokenType[]): boolean {
    return tokens
      .map((token, i) => this.getToken(position + i).type === token)
      .every(Boolean)
  }

  error(token: Token, message: string) {
    throw new BangError(message, this.source, token.line)
  }

  isTokenStartOfBlock(position: number) {
    return [TokenType.EOF, ...synchronizeTokens].includes(
      this.getToken(position).type
    )
  }

  checkAhead(tokens: TokenType[], not?: TokenType): boolean {
    let position = this.current + 1

    while (!this.isTokenStartOfBlock(position)) {
      if (this.getToken(position).type === not) return false
      if (this.matchAtPoint(position, tokens)) return true
      else position += 1
    }

    return false
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
        [
          TokenType.NEW_LINE,
          TokenType.BLOCK_START,
          TokenType.BLOCK_END
        ].includes(this.previous().type) ||
        synchronizeTokens.includes(this.peek().type)
      )
        return

      this.advance()
    }
  }

  declaration(): Stmt | null {
    try {
      if (this.match(...variableDeclarationTokens))
        return this.variableDeclaration(this.previous())
      else return this.statement()
    } catch (error) {
      if (error instanceof BangError) throw error

      this.synchronize()
      return null
    }
  }

  statement(): Stmt {
    if (this.match(TokenType.IF)) return this.ifStatement()
    if (this.match(TokenType.WHILE)) return this.whileStatement()
    if (this.match(TokenType.RETURN)) return this.returnStatement()
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

    if (!(initializer instanceof ExprFunction))
      this.assertToken(
        [TokenType.NEW_LINE, TokenType.BLOCK_END, TokenType.EOF],
        'Expect a new line after variable declaration.'
      )

    return new StmtVariable(name, constant, initializer)
  }

  ifStatement(): Stmt {
    this.assertToken(TokenType.LEFT_PAREN, "Expect '(' after 'if'.")
    const condition: Expr = this.expression()
    this.assertToken(TokenType.RIGHT_PAREN, "Expect ')' after if condition.")

    if (this.checkMultiple(TokenType.NEW_LINE, TokenType.BLOCK_START))
      this.advance()

    const thenBranch = this.statement()

    let elseBranch = null
    if (this.match(TokenType.ELSE)) {
      if (this.checkMultiple(TokenType.NEW_LINE, TokenType.BLOCK_START))
        this.advance()

      elseBranch = this.statement()
    }

    return new StmtIf(condition, thenBranch, elseBranch)
  }

  whileStatement() {
    this.assertToken(TokenType.LEFT_PAREN, "Expect '(' after 'while'.")
    const condition = this.expression()
    this.assertToken(TokenType.RIGHT_PAREN, "Expect ')' after condition.")

    if (this.checkMultiple(TokenType.NEW_LINE, TokenType.BLOCK_START))
      this.advance()
    const body = this.statement()

    return new StmtWhile(condition, body)
  }

  returnStatement(): Stmt {
    const keyword = this.previous()
    let value: Expr | null = null

    if (!this.check(TokenType.NEW_LINE, TokenType.BLOCK_END))
      value = this.expression()

    this.assertToken(
      [TokenType.NEW_LINE, TokenType.BLOCK_END, TokenType.EOF],
      'Expect a new line after return value.'
    )
    return new StmtReturn(keyword, value)
  }

  expressionStatement(): StmtExpression {
    const expr = this.expression()

    this.assertToken(
      [TokenType.NEW_LINE, TokenType.BLOCK_END, TokenType.EOF],
      'Expect a new line after expression.'
    )
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
    } else if (this.match(...assignmentOperatorTokens)) {
      const equals: Token = this.previous()
      const incrementValue: Expr = this.expression()

      const operator = getAssignmentOperator(equals)
      const value = new ExprBinary(expr, operator, incrementValue)

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
    let expr: Expr = this.indices()

    while (this.match(...multiplicationTokens)) {
      const operator: Token = this.previous()
      const right: Expr = this.unary()
      expr = new ExprBinary(expr, operator, right)
    }

    return expr
  }

  indices(): Expr {
    let expr: Expr = this.unary()

    while (this.match(...indiceTokens)) {
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

    return this.call()
  }

  call(): Expr {
    let expr: Expr = this.functionExpression()
    while (true) {
      if (
        this.check(TokenType.LEFT_PAREN) &&
        !this.checkAhead(
          [TokenType.RIGHT_PAREN, TokenType.FAT_ARROW],
          TokenType.LEFT_PAREN
        )
      ) {
        this.advance()
        expr = this.finishCall(expr)
      } else if (this.match(TokenType.DOT)) {
        const name = this.assertToken(
          TokenType.IDENTIFIER,
          'Expect property name after "."'
        )
        expr = new ExprGet(name, expr)
      } else break
    }

    return expr
  }

  finishCall(callee: Expr) {
    const parameters: Expr[] = []
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (parameters.length >= 255)
          this.error(this.peek(), "Can't have more than 255 arguments.")

        if (this.peek().type !== TokenType.RIGHT_PAREN)
          parameters.push(this.expression())
      } while (this.match(TokenType.COMMA))
    }

    const paren: Token = this.assertToken(
      TokenType.RIGHT_PAREN,
      "Expect ')' after arguments."
    )

    return new ExprCall(callee, paren, parameters)
  }

  functionExpression(): Expr {
    if (
      !this.check(TokenType.LEFT_PAREN) ||
      !this.checkAhead(
        [TokenType.RIGHT_PAREN, TokenType.FAT_ARROW],
        TokenType.LEFT_PAREN
      )
    )
      return this.primary()

    this.advance()
    const parameters: string[] = []
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (parameters.length >= 255)
          this.error(this.peek(), "Can't have more than 255 parameters.")

        if (this.peek().type !== TokenType.RIGHT_PAREN)
          parameters.push(
            this.assertToken(TokenType.IDENTIFIER, 'Expect parameter name.')
              ?.value ?? '_'
          )
      } while (this.match(TokenType.COMMA))
    }
    this.assertToken(TokenType.RIGHT_PAREN, "Expect ')' after parameters.")
    this.assertToken(TokenType.FAT_ARROW, "Expect '=>' after parameters.")

    if (this.checkMultiple(TokenType.NEW_LINE, TokenType.BLOCK_START))
      this.advance(2)

    if (this.previous().type === TokenType.BLOCK_START)
      return new ExprFunction(parameters, this.block())
    else {
      return new ExprFunction(parameters, [
        new StmtReturn(this.peek(), this.expression())
      ])
    }
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

export const getAbstractSyntaxTree = (source: string) =>
  new Parser(getTokens(source), source).parse()
