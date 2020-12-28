import {
  Token,
  TokenType,
  additionTokens,
  assignmentOperatorTokens,
  blankTokens,
  blockStart,
  comparisonTokens,
  equalityTokens,
  getTokens,
  indiceTokens,
  multiplicationTokens,
  synchronizeTokens,
  unaryTokens,
  variableDeclarationTokens,
  getAssignmentOperator,
  AssignmentOperator,
  LogicalOperator,
  newLineTokens,
} from './tokens'
import {
  Expr,
  ExprAssign,
  ExprBinary,
  ExprCall,
  ExprDictionary,
  ExprFunction,
  ExprGet,
  ExprGrouping,
  ExprList,
  ExprLiteral,
  ExprLogical,
  ExprSet,
  ExprSlice,
  ExprUnary,
  ExprVariable,
} from './expressions'
import {
  Stmt,
  StmtBlock,
  StmtExpression,
  StmtIf,
  StmtReturn,
  StmtVariable,
  StmtWhile,
} from './statements'
import BangError from './BangError'

class BaseParser {
  current: number = 0
  tokens: Token[] = []
  source: string = ''

  getTokenAt(position: number): Token {
    return this.tokens?.[position]
  }

  getTokenTypeAt(position: number): TokenType {
    return this.getTokenAt(position).type
  }

  getToken(): Token {
    return this.tokens[this.current]
  }

  getTokenType(): TokenType {
    return this.getToken().type
  }

  getPreviousToken(): Token {
    return this.tokens[this.current - 1]
  }

  isAtEnd(): boolean {
    return this.getTokenType() === TokenType.EOF
  }

  advance(by: number = 1): Token {
    if (!this.isAtEnd()) this.current += by
    return this.getPreviousToken()
  }

  error(token: Token, message: string) {
    throw new BangError(message, this.source, token.line)
  }

  tokenIsType(...type: TokenType[]): boolean {
    if (this.isAtEnd()) return false
    return type.includes(this.getTokenType())
  }

  matchTokensAtPoint(position: number, tokens: TokenType[]): boolean {
    return tokens
      .map((token, i) => this.getTokenAt(position + i).type === token)
      .every(Boolean)
  }

  assertTokenIs(type: TokenType | TokenType[], message: string) {
    if (typeof type === 'object') {
      if (this.tokenIsType(...type)) return this.advance()
    } else if (this.tokenIsType(type)) return this.advance()

    throw this.error(this.getToken(), message)
  }

  nextTokensAreType(...tokens: TokenType[]): boolean {
    return this.matchTokensAtPoint(this.current, tokens)
  }

  tokenMatches(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.tokenIsType(type)) {
        this.advance()
        return true
      }
    }

    return false
  }

  isTokenStartOfStatement(position: number) {
    return [TokenType.EOF, ...synchronizeTokens].includes(
      this.getTokenAt(position).type
    )
  }

  doesSequenceOccur(tokens: TokenType[], not?: TokenType): boolean {
    let position = this.current + 1

    while (!this.isTokenStartOfStatement(position)) {
      if (this.getTokenAt(position).type === not) return false
      if (this.matchTokensAtPoint(position, tokens)) return true
      else position += 1
    }

    return false
  }

  skipNewLineIfBlockFollows() {
    if (this.nextTokensAreType(...blockStart)) this.advance()
  }

  onlyBlankTokensRemaining() {
    let position = this.current
    while (position < this.tokens.length) {
      if (!blankTokens.includes(this.getTokenTypeAt(position))) return false
      position += 1
    }
    return true
  }
}

class Parser extends BaseParser {
  constructor(tokens: Token[], source: string) {
    super()
    this.tokens = tokens
    this.source = source
  }

  parse(): Stmt[] {
    const statements: Stmt[] = []
    while (!this.onlyBlankTokensRemaining()) {
      if (this.getTokenType() === TokenType.NEW_LINE) this.advance()
      else statements.push(this.statement())
    }

    return statements
  }

  getCommaSeparatedValues({
    closingBracket,
    processArguments,
  }: {
    closingBracket: TokenType
    processArguments: () => void
  }) {
    if (this.getTokenType() !== closingBracket) {
      do {
        if (this.getTokenType() === closingBracket) break
        if (this.getTokenType() === TokenType.COMMA)
          throw this.error(this.getToken(), 'Unexpected Extra Comma')
        processArguments()
      } while (this.tokenMatches(TokenType.COMMA))
    }
  }

  statement(): Stmt {
    if (this.tokenMatches(...variableDeclarationTokens))
      return this.variableDeclaration(this.getPreviousToken())
    else if (this.tokenMatches(TokenType.BLOCK_START))
      return new StmtBlock(this.block())
    else if (this.tokenMatches(TokenType.IF)) return this.ifStatement()
    else if (this.tokenMatches(TokenType.WHILE)) return this.whileStatement()
    else if (this.tokenMatches(TokenType.RETURN)) return this.returnStatement()
    else return this.expressionStatement()
  }

  block(): Stmt[] {
    const statements: (Stmt | null)[] = []

    while (!this.tokenIsType(TokenType.BLOCK_END) && !this.isAtEnd()) {
      if (this.getTokenType() === TokenType.NEW_LINE) this.advance()
      else statements.push(this.statement())
    }

    this.advance()
    return statements.filter(Boolean) as Stmt[]
  }

  variableDeclaration(initializerType: Token): Stmt {
    const constant = initializerType.type === TokenType.CONST
    const name = this.assertTokenIs(
      TokenType.IDENTIFIER,
      'Expect variable name.'
    )

    let initializer: Expr | undefined = undefined
    if (this.tokenMatches(TokenType.EQUAL)) initializer = this.expression()

    if (!(initializer instanceof ExprFunction))
      this.assertTokenIs(
        newLineTokens,
        'Expect a new line after variable declaration.'
      )

    return new StmtVariable(name, constant, initializer)
  }

  ifStatement(): Stmt {
    this.assertTokenIs(TokenType.LEFT_PAREN, "Expect '(' after 'if'.")
    const condition: Expr = this.expression()
    this.assertTokenIs(TokenType.RIGHT_PAREN, "Expect ')' after if condition.")

    this.skipNewLineIfBlockFollows()

    const thenBranch = this.statement()

    let elseBranch = null
    if (this.tokenMatches(TokenType.ELSE)) {
      this.skipNewLineIfBlockFollows()
      elseBranch = this.statement()
    }

    return new StmtIf(condition, thenBranch, elseBranch)
  }

  whileStatement() {
    this.assertTokenIs(TokenType.LEFT_PAREN, "Expect '(' after 'while'.")
    const condition = this.expression()
    this.assertTokenIs(TokenType.RIGHT_PAREN, "Expect ')' after condition.")

    this.skipNewLineIfBlockFollows()
    const body = this.statement()

    return new StmtWhile(condition, body)
  }

  returnStatement(): Stmt {
    const keyword = this.getPreviousToken()
    let value: Expr | null = null

    if (!this.tokenIsType(TokenType.NEW_LINE, TokenType.BLOCK_END))
      value = this.expression()

    this.assertTokenIs(newLineTokens, 'Expect a new line after return.')

    return new StmtReturn(keyword, value)
  }

  expressionStatement(): StmtExpression {
    const expr = this.expression()

    this.assertTokenIs(newLineTokens, 'Expect a new line after expression.')
    return new StmtExpression(expr)
  }

  expression(): Expr {
    return this.assignment()
  }

  assignment(): Expr {
    const expr: Expr = this.or()

    if (this.tokenMatches(...assignmentOperatorTokens))
      return this.assignmentOperator(expr)
    else if (this.tokenMatches(TokenType.EQUAL))
      return this.assignmentVariable(expr)
    else return expr
  }

  assignmentVariable(expr: Expr): Expr {
    const equals: Token = this.getPreviousToken()
    const value: Expr = this.expression()

    if (expr instanceof ExprVariable) {
      const name = expr.name
      return new ExprAssign(name, value)
    } else if (expr instanceof ExprGet)
      return new ExprSet(expr.object, expr.lookup, value)

    throw this.error(equals, 'Invalid Assignment Target')
  }

  assignmentOperator(expr: Expr): Expr {
    const equals = this.getPreviousToken() as Token<AssignmentOperator>
    const incrementValue: Expr = this.expression()

    const operator = getAssignmentOperator(equals)
    const value = new ExprBinary(expr, operator, incrementValue)

    if (expr instanceof ExprVariable) {
      const name = expr.name
      return new ExprAssign(name, value)
    } else if (expr instanceof ExprGet)
      return new ExprSet(expr.object, expr.lookup, value)

    throw this.error(equals, 'Invalid Assignment Target')
  }

  or(): Expr {
    let expr = this.and()

    while (this.tokenMatches(TokenType.OR)) {
      const operator = this.getPreviousToken() as Token<LogicalOperator>
      const right = this.and()
      expr = new ExprLogical(expr, operator, right)
    }

    return expr
  }

  and(): Expr {
    let expr = this.equality()

    while (this.tokenMatches(TokenType.AND)) {
      const operator = this.getPreviousToken() as Token<LogicalOperator>
      const right = this.and()
      expr = new ExprLogical(expr, operator, right)
    }

    return expr
  }

  equality(): Expr {
    let expr: Expr = this.comparison()

    while (this.tokenMatches(...equalityTokens)) {
      const operator: Token = this.getPreviousToken()
      const right: Expr = this.comparison()
      expr = new ExprBinary(expr, operator, right)
    }

    return expr
  }

  comparison(): Expr {
    let expr: Expr = this.addition()

    while (this.tokenMatches(...comparisonTokens)) {
      const operator: Token = this.getPreviousToken()
      const right: Expr = this.addition()
      expr = new ExprBinary(expr, operator, right)
    }

    return expr
  }

  addition(): Expr {
    let expr: Expr = this.multiplication()

    while (this.tokenMatches(...additionTokens)) {
      const operator: Token = this.getPreviousToken()
      const right: Expr = this.multiplication()
      expr = new ExprBinary(expr, operator, right)
    }

    return expr
  }

  multiplication(): Expr {
    let expr: Expr = this.indices()

    while (this.tokenMatches(...multiplicationTokens)) {
      const operator: Token = this.getPreviousToken()
      const right: Expr = this.unary()
      expr = new ExprBinary(expr, operator, right)
    }

    return expr
  }

  indices(): Expr {
    let expr: Expr = this.unary()

    while (this.tokenMatches(...indiceTokens)) {
      const operator: Token = this.getPreviousToken()
      const right: Expr = this.unary()
      expr = new ExprBinary(expr, operator, right)
    }

    return expr
  }

  unary(): Expr {
    if (this.tokenMatches(...unaryTokens)) {
      const operator: Token = this.getPreviousToken()
      const right: Expr = this.unary()
      return new ExprUnary(operator, right)
    }

    return this.call()
  }

  call(): Expr {
    let expr: Expr = this.functionExpression()

    while (true) {
      if (this.tokenMatches(TokenType.DOT))
        expr = this.getPropertyIdentifier(expr)
      else if (this.tokenMatches(TokenType.LEFT_SQUARE))
        expr = this.getPropertyExpression(expr)
      else if (!this.functionAhead() && this.tokenMatches(TokenType.LEFT_PAREN))
        expr = this.finishCall(expr)
      else break
    }

    return expr
  }

  getPropertyIdentifier(expr: Expr): ExprGet {
    const name = this.assertTokenIs(
      TokenType.IDENTIFIER,
      'Expect property name after "."'
    )
    return new ExprGet(name, expr)
  }

  getPropertyExpression(expr: Expr): ExprGet {
    const afterColon = (beforeColon: Expr | null) => {
      if (!this.tokenIsType(TokenType.RIGHT_SQUARE))
        return new ExprSlice(beforeColon, this.expression())
      else return new ExprSlice(beforeColon, null)
    }

    let identifier = null
    if (this.tokenMatches(TokenType.COLON)) identifier = afterColon(identifier)
    else {
      identifier = this.expression()
      if (this.tokenMatches(TokenType.COLON))
        identifier = afterColon(identifier)
    }

    this.assertTokenIs(
      TokenType.RIGHT_SQUARE,
      'Expected "]" after identifier expression'
    )
    return new ExprGet(identifier, expr)
  }

  finishCall(callee: Expr) {
    const parameters: Expr[] = []

    this.getCommaSeparatedValues({
      closingBracket: TokenType.RIGHT_PAREN,
      processArguments: () => {
        if (parameters.length >= 255)
          this.error(this.getToken(), "Can't have more than 255 arguments.")

        parameters.push(this.expression())
      },
    })

    const paren = this.assertTokenIs(
      TokenType.RIGHT_PAREN,
      'Expect ")" after arguments.'
    )

    return new ExprCall(callee, paren, parameters)
  }

  functionAhead(): boolean {
    return this.doesSequenceOccur(
      [TokenType.RIGHT_PAREN, TokenType.FAT_ARROW],
      TokenType.LEFT_PAREN
    )
  }

  functionExpression(): Expr {
    if (!this.tokenIsType(TokenType.LEFT_PAREN)) return this.primary()
    if (!this.functionAhead()) return this.primary()

    this.advance()

    const parameters: string[] = []
    this.getCommaSeparatedValues({
      closingBracket: TokenType.RIGHT_PAREN,
      processArguments: () => {
        if (parameters.length >= 255)
          this.error(this.getToken(), "Can't have more than 255 parameters.")

        parameters.push(
          this.assertTokenIs(TokenType.IDENTIFIER, 'Expect parameter name.')
            .value
        )
      },
    })

    this.assertTokenIs(TokenType.RIGHT_PAREN, "Expect ')' after parameters.")
    this.assertTokenIs(TokenType.FAT_ARROW, "Expect '=>' after parameters.")
    this.skipNewLineIfBlockFollows()

    if (this.tokenMatches(TokenType.BLOCK_START))
      return new ExprFunction(parameters, this.block())
    else
      return new ExprFunction(parameters, [
        new StmtReturn(this.getToken(), this.expression()),
      ])
  }

  primary(): Expr {
    if (this.tokenMatches(TokenType.FALSE))
      return new ExprLiteral('boolean', this.getPreviousToken(), 'false')
    else if (this.tokenMatches(TokenType.TRUE))
      return new ExprLiteral('boolean', this.getPreviousToken(), 'true')
    else if (this.tokenMatches(TokenType.NULL))
      return new ExprLiteral('null', this.getPreviousToken())
    else if (this.tokenMatches(TokenType.NUMBER))
      return new ExprLiteral('number', this.getPreviousToken())
    else if (this.tokenMatches(TokenType.STRING))
      return new ExprLiteral('string', this.getPreviousToken())
    else if (this.tokenMatches(TokenType.IDENTIFIER))
      return new ExprVariable(this.getPreviousToken())
    else if (this.tokenMatches(TokenType.LEFT_PAREN)) return this.grouping()
    else if (this.tokenMatches(TokenType.LEFT_BRACE)) return this.dictionary()
    else if (this.tokenMatches(TokenType.LEFT_SQUARE)) return this.list()
    else return new ExprGrouping(this.expression())
  }

  grouping(): Expr {
    const expr = this.expression()
    this.assertTokenIs(TokenType.RIGHT_PAREN, "Expect ')' after expression.")
    return new ExprGrouping(expr)
  }

  dictionary(): Expr {
    const token = this.getPreviousToken()
    const keyValues: ([ExprVariable, null] | [Expr, Expr])[] = []

    this.getCommaSeparatedValues({
      closingBracket: TokenType.RIGHT_BRACE,
      processArguments: () => {
        const identifier = this.expression()

        if (this.tokenMatches(TokenType.COLON))
          keyValues.push([identifier, this.expression()])
        else if (identifier instanceof ExprVariable)
          keyValues.push([identifier, null])
        else throw this.error(this.getToken(), 'Expect Colon After Key')
      },
    })

    this.assertTokenIs(TokenType.RIGHT_BRACE, "Expect '}' after dictionary.")
    return new ExprDictionary(token, keyValues)
  }

  list(): Expr {
    const token = this.getPreviousToken()
    const values: Expr[] = []

    this.getCommaSeparatedValues({
      closingBracket: TokenType.RIGHT_SQUARE,
      processArguments: () => {
        values.push(this.expression())
      },
    })

    this.assertTokenIs(TokenType.RIGHT_SQUARE, "Expect ']' after dictionary.")
    return new ExprList(token, values)
  }
}

export const getAbstractSyntaxTree = (source: string) =>
  new Parser(getTokens(source), source).parse()
