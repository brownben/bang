import { getTokens, Token, TokenType } from '../src/tokens'
import BangError from '../src/BangError'

const expectTokens = (code: string, tokens: Partial<Token>[]) =>
  expect(getTokens(code)).toEqual(
    [
      ...tokens,
      { type: TokenType.NEW_LINE, line: code.split('\n').length },
      { type: TokenType.EOF, line: code.split('\n').length },
    ].map((token) => ({
      ...token,
      value: token?.value?.toString() ?? expect.any(String),
      line: token?.line ?? 1,
    }))
  )
const tokeniserResultError = (code: string, message: string) => {
  try {
    expect(getTokens(code)).toThrow(expect.anything())
    getTokens(code)
  } catch (error) {
    expect(error).toBeInstanceOf(BangError)
    expect(error.message).toBe(message)
  }
}

describe('identifies tokens', () => {
  it('should just have end of line in a blank code', () => {
    expectTokens('', [])
  })

  it('should just have end of line for a comment', () => {
    expectTokens('// ignore this', [])
  })

  it('should add block on just indentation', () => {
    expectTokens('   ', [
      { type: TokenType.BLOCK_START },
      { type: TokenType.BLOCK_END },
    ])
  })

  it('should identify brackets', () => {
    expectTokens(`{`, [{ type: TokenType.LEFT_BRACE }])
    expectTokens(`}`, [{ type: TokenType.RIGHT_BRACE }])
    expectTokens(`(`, [{ type: TokenType.LEFT_PAREN }])
    expectTokens(`)`, [{ type: TokenType.RIGHT_PAREN }])
  })

  it('should identify strings', () => {
    expectTokens(`'this is a string'`, [
      { type: TokenType.STRING, value: 'this is a string' },
    ])
    expectTokens(` 'this is a string'`, [
      { type: TokenType.STRING, value: 'this is a string' },
    ])
    expectTokens(`'this is a string'  `, [
      { type: TokenType.STRING, value: 'this is a string' },
    ])
    expectTokens(` 'this is a string'  `, [
      { type: TokenType.STRING, value: 'this is a string' },
    ])
    expectTokens(`"this is a string"`, [
      { type: TokenType.STRING, value: 'this is a string' },
    ])
    expectTokens(`\`this is a string\``, [
      { type: TokenType.STRING, value: 'this is a string' },
    ])
    expectTokens(
      `\`this is a
    multiline
      string\``,
      [
        {
          type: TokenType.STRING,
          value: `this is a\n    multiline\n      string`,
        },
      ]
    )
  })

  it('should identify numbers', () => {
    expectTokens(`1`, [{ type: TokenType.NUMBER, value: '1' }])
    expectTokens(` 2   `, [{ type: TokenType.NUMBER, value: '2' }])
    expectTokens(`.5`, [{ type: TokenType.NUMBER, value: '0.5' }])
    expectTokens(`7.56`, [{ type: TokenType.NUMBER, value: '7.56' }])
    expectTokens(`9.0`, [{ type: TokenType.NUMBER, value: '9.0' }])
  })

  it('should identify dots and commas', () => {
    expectTokens(`.`, [{ type: TokenType.DOT }])
    expectTokens(`,`, [{ type: TokenType.COMMA }])
  })

  it('should identify equalities', () => {
    expectTokens(`==`, [{ type: TokenType.EQUAL_EQUAL }])
    expectTokens(`!=`, [{ type: TokenType.BANG_EQUAL }])
    expectTokens(`<=`, [{ type: TokenType.LESS_EQUAL }])
    expectTokens(`>=`, [{ type: TokenType.GREATER_EQUAL }])
    expectTokens(`<`, [{ type: TokenType.LESS }])
    expectTokens(`>`, [{ type: TokenType.GREATER }])
  })

  it('should identify mathematical operators', () => {
    expectTokens(`+`, [{ type: TokenType.PLUS }])
    expectTokens(`-`, [{ type: TokenType.MINUS }])
    expectTokens(`/`, [{ type: TokenType.SLASH }])
    expectTokens(`*`, [{ type: TokenType.STAR }])
  })

  it('should identify keywords', () => {
    expectTokens(`and`, [{ type: TokenType.AND }])
    expectTokens(`or`, [{ type: TokenType.OR }])
    expectTokens(`if`, [{ type: TokenType.IF }])
    expectTokens(`else`, [{ type: TokenType.ELSE }])
    expectTokens(`while`, [{ type: TokenType.WHILE }])
    expectTokens(`null`, [{ type: TokenType.NULL }])
    expectTokens(`true`, [{ type: TokenType.TRUE }])
    expectTokens(`false`, [{ type: TokenType.FALSE }])
    expectTokens(`let`, [{ type: TokenType.LET }])
    expectTokens(`const`, [{ type: TokenType.CONST }])
    expectTokens(`return`, [{ type: TokenType.RETURN }])
  })

  it('should identify identifiers', () => {
    expectTokens(`doesthiswork`, [
      { type: TokenType.IDENTIFIER, value: 'doesthiswork' },
    ])
    expectTokens(`dOEsTh1SWork`, [
      { type: TokenType.IDENTIFIER, value: 'dOEsTh1SWork' },
    ])
    expectTokens(`_doesThisWork`, [
      { type: TokenType.IDENTIFIER, value: '_doesThisWork' },
    ])
    expectTokens(`doesThisWork`, [
      { type: TokenType.IDENTIFIER, value: 'doesThisWork' },
    ])
    expectTokens(`DoesThisWork`, [
      { type: TokenType.IDENTIFIER, value: 'DoesThisWork' },
    ])
    expectTokens(`DOESTHISWORK`, [
      { type: TokenType.IDENTIFIER, value: 'DOESTHISWORK' },
    ])
    expectTokens(`DOES_THIS_WORK`, [
      { type: TokenType.IDENTIFIER, value: 'DOES_THIS_WORK' },
    ])
  })
})

describe('copes with edge cases', () => {
  it('should be a "dot" if a second decimal point is in a number', () => {
    expectTokens(`7.56.`, [
      { type: TokenType.NUMBER, value: '7.56' },
      { type: TokenType.DOT },
    ])
    expectTokens(`7.56.5`, [
      { type: TokenType.NUMBER, value: '7.56' },
      { type: TokenType.NUMBER, value: '0.5' },
    ])
    expectTokens(`7.56.5.`, [
      { type: TokenType.NUMBER, value: '7.56' },
      { type: TokenType.NUMBER, value: '0.5' },
      { type: TokenType.DOT },
    ])
    expectTokens(`7.56.5.4`, [
      { type: TokenType.NUMBER, value: '7.56' },
      { type: TokenType.NUMBER, value: '0.5' },
      { type: TokenType.NUMBER, value: '0.4' },
    ])
  })

  it('should throw error on unterminated string', () => {
    tokeniserResultError(`'leaving it hanging`, 'Unterminated String')
    tokeniserResultError(`"leaving it hanging`, 'Unterminated String')
    tokeniserResultError(`\`leaving it hanging`, 'Unterminated String')
    tokeniserResultError(
      `'leaving
    it hanging`,
      'Unterminated String'
    )
    tokeniserResultError(
      `'leaving
      it (not)
        hanging`,
      'Unterminated String'
    )
  })

  it('should throw error on unknown character', () => {
    const unknownCharacters = [
      '£',
      '%',
      '$',
      '^',
      '&',
      '¬',
      '|',
      '\\',
      '?',
      '@',
      '~',
      '#',
      '^',
      ';',
    ]

    unknownCharacters.map((character) =>
      tokeniserResultError(character, `Unidentified Character "${character}"`)
    )
  })

  it('should identify spread', () => {
    expectTokens(`[1,2,...[1,2]]`, [
      { type: TokenType.LEFT_SQUARE },
      { type: TokenType.NUMBER, value: '1' },
      { type: TokenType.COMMA },
      { type: TokenType.NUMBER, value: '2' },
      { type: TokenType.COMMA },
      { type: TokenType.SPREAD },
      { type: TokenType.LEFT_SQUARE },
      { type: TokenType.NUMBER, value: '1' },
      { type: TokenType.COMMA },
      { type: TokenType.NUMBER, value: '2' },
      { type: TokenType.RIGHT_SQUARE },
      { type: TokenType.RIGHT_SQUARE },
    ])

    expectTokens(
      `let a = [1, 2, 3]
let b = [...a]
// let c = [0, ...a]
// let d = [...a, 4]
// let e = [0, ...a, 4]`,
      [
        { type: TokenType.LET },
        { type: TokenType.IDENTIFIER, value: 'a' },
        { type: TokenType.EQUAL },
        { type: TokenType.LEFT_SQUARE },
        { type: TokenType.NUMBER, value: '1' },
        { type: TokenType.COMMA },
        { type: TokenType.NUMBER, value: '2' },
        { type: TokenType.COMMA },
        { type: TokenType.NUMBER, value: '3' },
        { type: TokenType.RIGHT_SQUARE },
        { type: TokenType.NEW_LINE },
        { line: 2, type: TokenType.LET },
        { line: 2, type: TokenType.IDENTIFIER, value: 'b' },
        { line: 2, type: TokenType.EQUAL },
        { line: 2, type: TokenType.LEFT_SQUARE },
        { line: 2, type: TokenType.SPREAD },
        { line: 2, type: TokenType.IDENTIFIER, value: 'a' },
        { line: 2, type: TokenType.RIGHT_SQUARE },
      ]
    )
  })
})
