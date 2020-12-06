import { getTokens } from '../src/Tokenizer'
import { getAbstractSyntaxTree } from '../src/Parser'
import { interpret } from '../src/Interpreter'

const expectOutput = (code: string) =>
  expect(
    interpret(getAbstractSyntaxTree(getTokens(code), code))?.[0]?.getValue()
  )

const expectError = (code: string) =>
  expect(() =>
    interpret(getAbstractSyntaxTree(getTokens(code), code))?.[0]?.getValue()
  ).toThrow()

const execute = (code: string) =>
  interpret(getAbstractSyntaxTree(getTokens(code), code))

describe('calculates mathematical operations', () => {
  it('should add numbers', () => {
    expectOutput(`1 + 2`).toEqual(3)
    expectOutput('7 + 3').toEqual(10)
    expectOutput('2000 + 20').toEqual(2020)
  })

  it('should subtract numbers', () => {
    expectOutput(`1 - 2`).toEqual(-1)
    expectOutput('7 - 3').toEqual(4)
    expectOutput('2000 - 20').toEqual(1980)
  })

  it('should multiply numbers', () => {
    expectOutput(`1 * 2`).toEqual(2)
    expectOutput('7 * 3').toEqual(21)
    expectOutput('2000 * 20').toEqual(40000)
  })

  it('should divide numbers', () => {
    expectOutput(`1 / 2`).toEqual(0.5)
    expectOutput('7 / 3').toEqual(7 / 3)
    expectOutput('2000 / 20').toEqual(100)
  })

  it('should add negative numbers', () => {
    expectOutput(`-1 + -2`).toEqual(-3)
    expectOutput('-7 + -3').toEqual(-10)
    expectOutput('-2000 + -20').toEqual(-2020)
  })

  it('should add multiple numbers', () => {
    expectOutput(`1 + 2 + 7`).toEqual(10)
    expectOutput('7 + 3 + 121').toEqual(131)
    expectOutput('222 + 111 + 333').toEqual(666)
  })

  it('should follow order of operations', () => {
    expectOutput('4+2*3').toBe(10)
    expectOutput('4-2*3').toBe(-2)
    expectOutput('(4+5)*5').toBe(45)
    expectOutput('12/4 - 3').toBe(0)
  })

  it('should not add number and any other type', () => {
    expectError(`1 + "2"`)
    expectError(`"73" + 121`)
    expectError(`1 + null`)
    expectError(`null + 121`)
    expectError(`1 + true`)
    expectError(`false + 121`)
  })
})

describe('calculates operations on strings', () => {
  it('should concatenate strings', () => {
    expectOutput(`'1' + '2'`).toEqual('12')
    expectOutput('`7` + "3"').toEqual('73')
  })
})

describe('calulates equalities', () => {
  it('should be equal for the same literal', () => {
    expectOutput('5 == 5').toBe(true)
    expectOutput('`tree` == `tree`').toBe(true)
    expectOutput('false == false').toBe(true)
    expectOutput('true == true').toBe(true)
    expectOutput('null == null').toBe(true)
  })

  it('should be not equal for the different literals', () => {
    expectOutput('5 == 7').toBe(false)
    expectOutput('`tree` == `trees`').toBe(false)
    expectOutput('false == true').toBe(false)
    expectOutput('true == false').toBe(false)
  })

  it('should not be not equal for the same literal', () => {
    expectOutput('5 != 5').toBe(false)
    expectOutput('`tree` != `tree`').toBe(false)
    expectOutput('false != false').toBe(false)
    expectOutput('true != true').toBe(false)
    expectOutput('null != null').toBe(false)
  })

  it('should compare different types correctly', () => {
    expectOutput('5 == "5"').toBe(false)
    expectOutput('`tree` == `5`').toBe(false)
    expectOutput('false == 0').toBe(false)
    expectOutput('true == 1').toBe(false)
    expectOutput('null == false').toBe(false)
  })

  it('should compare sums correctly', () => {
    expectOutput('5 + 5 == 10').toBe(true)
    expectOutput('15 == 5*3').toBe(true)
    expectOutput('(2*3)+4 == 5+6-1').toBe(true)
    expectOutput('12/4 == 18/6').toBe(true)
    expectOutput('`hello ` + "world" == `hello world`').toBe(true)
  })

  it('should compare comparisons correctly', () => {
    expectOutput('5 == 5 == true').toBe(true)
    expectOutput('true == 5 == 5').toBe(false)
    expectOutput('(5 != 5) == false').toBe(true)
    expectOutput('(4 > 6) != 7 < 21').toBe(true)
  })
})

describe('calulates inequalities ', () => {
  it('should compare 2 numbers correctly', () => {
    expectOutput('1 > 4').toBe(false)
    expectOutput('1 < 4').toBe(true)
    expectOutput('4 < 1').toBe(false)
    expectOutput('4 > 1').toBe(true)
    expectOutput('1 > 1').toBe(false)
    expectOutput('1 >= 1').toBe(true)
    expectOutput('1 < 1').toBe(false)
    expectOutput('1 <= 1').toBe(true)
  })

  it('should compare 2 strings correctly', () => {
    expectOutput('"b" > "a"').toBe(true)
    expectOutput('"A" < "a"').toBe(true)
    expectOutput('"b" < "a"').toBe(false)
    expectOutput('"df" < "af"').toBe(false)
    expectOutput('"job" > "Rest"').toBe(true)
    expectOutput('"fred" >= "fred"').toBe(true)
    expectOutput('"scooby" < "scooby"').toBe(false)
    expectOutput('"hidden" <="words"').toBe(true)
  })

  it('should not compare number to any other type', () => {
    expectError(`1 > "2"`)
    expectError(`"73" < 121`)
    expectError(`1 >= null`)
    expectError(`null <= 121`)
    expectError(`1 > true`)
    expectError(`false < 121`)
  })

  it('should not compare string to any other type', () => {
    expectError(`1 > "2"`)
    expectError(`"73" < 121`)
    expectError(`'1' >= null`)
    expectError(`null <= "121"`)
    expectError(`'abcd' > true`)
    expectError(`false < 'efgr'`)
  })

  it('should not compare  any other type', () => {
    expectError(`false > true`)
    expectError(`false < null`)
  })
})

describe('display contents of print statement', () => {
  const originalConsoleLog = console.log

  beforeAll(() => {
    console.log = jest.fn()
  })
  afterAll(() => {
    console.log = originalConsoleLog
  })

  it('should display literal values', () => {
    execute('print 5')
    expect(console.log).toHaveBeenLastCalledWith(5)
    execute('print "hello world"')
    expect(console.log).toHaveBeenLastCalledWith('hello world')
    execute('print false')
    expect(console.log).toHaveBeenLastCalledWith(false)
    execute('print null')
    expect(console.log).toHaveBeenLastCalledWith(null)
  })

  it('should display value of expressions', () => {
    execute('print 5 + 5')
    expect(console.log).toHaveBeenLastCalledWith(10)
    execute('print 22 / 2')
    expect(console.log).toHaveBeenLastCalledWith(11)
    execute('print "hello " + "world"')
    expect(console.log).toHaveBeenLastCalledWith('hello world')
    execute('print false == 5 > 9')
    expect(console.log).toHaveBeenLastCalledWith(true)
    execute('print 5 * 5 - 9 == 8 * 2')
    expect(console.log).toHaveBeenLastCalledWith(true)
  })
})
