import {
  Token,
  TokenType,
  additionTokens,
  assignmentOperatorTokens,
  blankTokens,
  blockStart,
  comparisonTokens,
  equalityTokens,
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
  ExprSpread,
  ExprTry,
  ExprUnary,
  ExprVariable,
} from './expressions'
import {
  Stmt,
  StmtBlock,
  StmtDestructuring,
  StmtExpression,
  StmtIf,
  StmtImport,
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
    throw new BangError(message, token.line)
  }
  errorHere(message: string) {
    throw new BangError(message, this.getToken().line)
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
    if (Array.isArray(type)) {
      if (this.tokenIsType(...type)) return this.advance()
    } else if (this.tokenIsType(type)) return this.advance()

    throw this.errorHere(message)
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

  getCommaSeparatedValues<ReturnValue>({
    closingBracket,
    processArguments,
  }: {
    closingBracket: TokenType
    processArguments: (list: ReturnValue[]) => ReturnValue
  }): ReturnValue[] {
    const list: ReturnValue[] = []
    if (this.getTokenType() !== closingBracket) {
      do {
        if (this.getTokenType() === closingBracket) break
        if (this.getTokenType() === TokenType.COMMA)
          throw this.errorHere('Unexpected Extra Comma')
        list.push(processArguments(list))
      } while (this.tokenMatches(TokenType.COMMA))
    }
    return list
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
      else statements.push(this.getStatement())
    }

    return statements
  }

  getStatement(): Stmt {
    try {
      return this.statement()
    } catch (error) {
      if (error instanceof BangError) throw error
      else throw this.errorHere('Unexpected problem whilst parsing code')
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
    else if (this.tokenMatches(TokenType.FROM))
      return this.fromImportStatement()
    else if (this.tokenMatches(TokenType.IMPORT)) return this.importStatement()
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

    if (this.tokenIsType(TokenType.IDENTIFIER))
      return this.namedVariableDeclaration(constant)
    else if (this.tokenIsType(TokenType.LEFT_BRACE, TokenType.LEFT_SQUARE))
      return this.destructuringVariableDeclaration(constant)
    else
      throw this.error(
        initializerType,
        `Expected variable name after "${initializerType.value}"`
      )
  }

  namedVariableDeclaration(constant: boolean): Stmt {
    const name = this.assertTokenIs(
      TokenType.IDENTIFIER,
      'Expect variable name'
    )

    let initializer: Expr | undefined = undefined
    if (this.tokenMatches(TokenType.EQUAL)) initializer = this.expression()

    if (!(initializer instanceof ExprFunction))
      this.assertTokenIs(
        newLineTokens,
        'Expect a new line after variable declaration'
      )

    return new StmtVariable(name, constant, initializer)
  }

  destructuringListValues(): [string[], boolean] {
    const getIdentifer = () =>
      this.assertTokenIs(TokenType.IDENTIFIER, 'Expect variable name')
    let spread = false
    const values = this.getCommaSeparatedValues({
      closingBracket: TokenType.RIGHT_SQUARE,
      processArguments: () => {
        if (this.tokenMatches(TokenType.SPREAD)) {
          if (spread) throw this.errorHere(`Cannot have multiple spreads`)
          spread = true
          return getIdentifer().value
        } else if (!spread) return getIdentifer().value
        else throw this.errorHere(`Spread must be last value`)
      },
    })

    return [values, spread]
  }

  destructuringDictionaryValues() {
    return this.getCommaSeparatedValues({
      closingBracket: TokenType.RIGHT_PAREN,
      processArguments: () => {
        let identifier = this.assertTokenIs(
          TokenType.IDENTIFIER,
          'Expected Identifier'
        )
        if (this.tokenMatches(TokenType.COLON))
          return {
            actual: identifier.value,
            renamed: this.assertTokenIs(
              TokenType.IDENTIFIER,
              'Expected identifier to rename to'
            ).value,
          }
        else return identifier
      },
    })
  }

  destructuringVariableDeclaration(constant: boolean): Stmt {
    const bracket = this.advance()
    const type = bracket.type === TokenType.LEFT_BRACE ? 'dictionary' : 'list'
    let names: (Token | { actual: string; renamed: string })[] = []
    let spread = false

    if (bracket.type === TokenType.LEFT_SQUARE) {
      let [values, s] = this.destructuringListValues()
      names = values.map((value) => ({ actual: value, renamed: value }))
      spread = s
    } else names = this.destructuringDictionaryValues()

    this.assertTokenIs(
      [TokenType.RIGHT_SQUARE, TokenType.RIGHT_BRACE],
      'Expect closing bracket'
    )
    this.assertTokenIs(
      TokenType.EQUAL,
      'Expect an initial value when destructuring'
    )
    const expression = this.expression()

    this.assertTokenIs(
      newLineTokens,
      'Expect a new line after variable declaration'
    )

    return new StmtDestructuring({
      names,
      constant,
      expression,
      type,
      spread,
      token: bracket,
    })
  }

  ifStatement(): Stmt {
    this.assertTokenIs(TokenType.LEFT_PAREN, "Expect '(' after 'if'")
    const condition: Expr = this.expression()
    this.assertTokenIs(TokenType.RIGHT_PAREN, "Expect ')' after if condition")

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
    const token = this.getToken()

    this.assertTokenIs(TokenType.LEFT_PAREN, "Expect '(' after 'while'")
    const condition = this.expression()
    this.assertTokenIs(TokenType.RIGHT_PAREN, "Expect ')' after condition")

    this.skipNewLineIfBlockFollows()
    const body = this.statement()

    return new StmtWhile(condition, body, token)
  }

  returnStatement(): Stmt {
    const keyword = this.getPreviousToken()
    let value: Expr | null = null

    if (!this.tokenIsType(TokenType.NEW_LINE, TokenType.BLOCK_END))
      value = this.expression()

    this.assertTokenIs(newLineTokens, 'Expect a new line after return')

    return new StmtReturn(keyword, value)
  }

  fromImportStatement(): Stmt {
    const moduleName = this.assertTokenIs(
      TokenType.IDENTIFIER,
      'Expect import name'
    )

    this.assertTokenIs(
      TokenType.IMPORT,
      'Expect import after module identifier'
    )

    this.assertTokenIs(TokenType.LEFT_BRACE, 'Expect brace after import')
    const imports = this.destructuringDictionaryValues().map((param) => {
      if (param instanceof Token)
        return { actual: param.value, renamed: param.value }
      return param
    })
    this.assertTokenIs(TokenType.RIGHT_BRACE, 'Expect closing brace')

    return new StmtImport(moduleName.value, {
      token: moduleName,
      destructured: imports,
    })
  }

  importStatement(): Stmt {
    const name = this.assertTokenIs(
      TokenType.IDENTIFIER,
      'Expect import module name'
    )

    let newName: Token | undefined = undefined
    if (this.tokenMatches(TokenType.AS))
      newName = this.assertTokenIs(
        TokenType.IDENTIFIER,
        'Expect identifier name'
      )

    this.assertTokenIs(
      newLineTokens,
      'Expect a new line after import statement'
    )

    return new StmtImport(name.value, { token: name, as: newName?.value })
  }

  expressionStatement(): StmtExpression {
    const expr = this.expression()

    this.assertTokenIs(newLineTokens, 'Expect a new line after expression')
    return new StmtExpression(expr)
  }

  expression(): Expr {
    return this.try()
  }

  try(): Expr {
    if (this.tokenMatches(TokenType.TRY)) {
      const operator: Token = this.getPreviousToken()
      const right: Expr = this.expression()
      return new ExprTry(operator, right)
    } else return this.assignment()
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
      return new ExprSet(expr.object, expr.lookup, value, equals)

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
      return new ExprSet(expr.object, expr.lookup, value, equals)

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
    } else if (this.tokenMatches(TokenType.SPREAD)) {
      const operator: Token = this.getPreviousToken()
      const right: Expr = this.unary()
      return new ExprSpread(operator, right)
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
        return new ExprSlice(beforeColon, this.expression(), this.getToken())
      else return new ExprSlice(beforeColon, null, this.getToken())
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
    return new ExprGet(this.getToken(), expr, identifier)
  }

  finishCall(callee: Expr) {
    const parameters: Expr[] = this.getCommaSeparatedValues({
      closingBracket: TokenType.RIGHT_PAREN,
      processArguments: (parameters) => {
        if (parameters.length >= 255)
          this.errorHere("Can't have more than 255 arguments")

        return this.expression()
      },
    })

    const paren = this.assertTokenIs(
      TokenType.RIGHT_PAREN,
      'Expect ")" after arguments'
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

    const getIdentifer = () =>
      this.assertTokenIs(TokenType.IDENTIFIER, 'Expect parameter name')

    let spread = false
    let parameters
    if (this.tokenMatches(TokenType.LEFT_BRACE)) {
      parameters = this.destructuringDictionaryValues().map((param) => {
        if (param instanceof Token)
          return { actual: param.value, renamed: param.value }
        return param
      }) as string[] | { actual: string; renamed: string }[]
      this.assertTokenIs(TokenType.RIGHT_BRACE, "Expect '}' after dictionary")
    } else
      parameters = this.getCommaSeparatedValues<string>({
        closingBracket: TokenType.RIGHT_PAREN,
        processArguments: (parameters) => {
          if (parameters.length >= 255)
            this.errorHere("Can't have more than 255 parameters")

          if (this.tokenMatches(TokenType.SPREAD)) {
            if (spread)
              throw this.errorHere(`Cannot have multiple spreads in arguments`)
            spread = true
            return getIdentifer().value
          } else if (!spread) return getIdentifer().value
          else throw this.errorHere(`Spread must be last argument of function`)
        },
      })

    this.assertTokenIs(TokenType.RIGHT_PAREN, "Expect ')' after parameters")
    this.assertTokenIs(TokenType.FAT_ARROW, "Expect '=>' after parameters")
    this.skipNewLineIfBlockFollows()

    if (this.tokenMatches(TokenType.BLOCK_START))
      return new ExprFunction(parameters, this.block(), spread)
    else
      return new ExprFunction(
        parameters,
        [new StmtReturn(this.getToken(), this.expression())],
        spread
      )
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
    this.assertTokenIs(TokenType.RIGHT_PAREN, "Expect ')' after expression")
    return new ExprGrouping(expr)
  }

  dictionary(): Expr {
    const token = this.getPreviousToken()
    const keyValues: ([ExprVariable, null] | [Expr, Expr] | ExprSpread)[] =
      this.getCommaSeparatedValues({
        closingBracket: TokenType.RIGHT_BRACE,
        processArguments: () => {
          const identifier = this.expression()

          if (identifier instanceof ExprSpread) return identifier
          else if (this.tokenMatches(TokenType.COLON))
            return [identifier, this.expression()]
          else if (identifier instanceof ExprVariable) return [identifier, null]
          else throw this.errorHere('Expect Colon After Key')
        },
      })

    this.assertTokenIs(TokenType.RIGHT_BRACE, "Expect '}' after dictionary")
    return new ExprDictionary(token, keyValues)
  }

  list(): Expr {
    const token = this.getPreviousToken()
    const values: Expr[] = this.getCommaSeparatedValues({
      closingBracket: TokenType.RIGHT_SQUARE,
      processArguments: () => this.expression(),
    })

    this.assertTokenIs(TokenType.RIGHT_SQUARE, "Expect ']' after dictionary")
    return new ExprList(token, values)
  }
}

export const getAbstractSyntaxTree = (tokens: Token[], source: string) =>
  new Parser(tokens, source).parse()
