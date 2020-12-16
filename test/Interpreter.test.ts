import { getTokens } from '../src/Tokenizer'
import { getAbstractSyntaxTree } from '../src/Parser'
import { interpret, interpretFinalEnviroment } from '../src/Interpreter'

const expectOutput = (source: string) => {
  const code = source
  const output = interpret(getAbstractSyntaxTree(getTokens(code), code))
  return expect(output?.[output.length - 1]?.getValue() ?? null)
}

const expectEnviroment = (source: string) => {
  const code = source
  const enviroment = interpretFinalEnviroment(
    getAbstractSyntaxTree(getTokens(code), code)
  )

  return {
    toHaveValue: (name: string, value: any) =>
      expect(enviroment.get(name)?.getValue()).toBe(value),
    not: {
      toHaveValue: (name: string) =>
        expect(enviroment.get(name)?.getValue()).toBe(undefined)
    }
  }
}

const expectError = (source: string) => {
  const code = source
  expect(() =>
    interpret(getAbstractSyntaxTree(getTokens(code), code))
  ).toThrow()
}

const execute = (code: string) =>
  interpret(getAbstractSyntaxTree(getTokens(code), code))

describe('literals should return values', () => {
  it('should handle numbers', () => {
    expectOutput('.1').toBe(0.1)
    expectOutput('1').toBe(1)
    expectOutput('758.23').toBe(758.23)
  })

  it('should handle booleans', () => {
    expectOutput('false').toBe(false)
    expectOutput('true').toBe(true)
  })

  it('should handle strings', () => {
    expectOutput('"false"').toBe('false')
    expectOutput('`true`').toBe('true')
  })

  it('should handle null', () => {
    expectOutput('null').toBe(null)
  })
})

describe('mathematical operations can be calculated', () => {
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

  it('should throw error on divide by 0', () => {
    expectError('1 / 0')
    expectError('0 / 0')
    expectError('2.2 / 0')
  })

  it('should calculate numbers with lots of minus', () => {
    expectOutput('4---4').toBe(0)
    expectOutput('4--------------------------------4').toBe(8)
  })
})

describe('string operations can be calculated', () => {
  it('should concatenate strings', () => {
    expectOutput(`'1' + '2'`).toEqual('12')
    expectOutput('`7` + "3"').toEqual('73')
  })
})

describe('equalities can be calculated', () => {
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

describe('inequalities can be calculated', () => {
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

describe('print statments display result of expression', () => {
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

describe('variables can be declared, assigned and read', () => {
  it('should declare values as null', () => {
    expectEnviroment('const a').toHaveValue('a', null)
    expectEnviroment('const b').toHaveValue('b', null)
    expectEnviroment('const c').toHaveValue('c', null)
    expectEnviroment('let a').toHaveValue('a', null)
    expectEnviroment('let b').toHaveValue('b', null)
    expectEnviroment('let c').toHaveValue('c', null)
    expectEnviroment('let _a').toHaveValue('_a', null)
    expectEnviroment('let abc123').toHaveValue('abc123', null)
  })

  it('should set value to declared literal', () => {
    expectEnviroment('const a = 1').toHaveValue('a', 1)
    expectEnviroment('const b = "Hello"').toHaveValue('b', 'Hello')
    expectEnviroment('const c = 5').toHaveValue('c', 5)
    expectEnviroment('const c = true').toHaveValue('c', true)
    expectEnviroment('let a = 1').toHaveValue('a', 1)
    expectEnviroment('let b = "World"').toHaveValue('b', 'World')
    expectEnviroment('let c = 5').toHaveValue('c', 5)
    expectEnviroment('let c = false').toHaveValue('c', false)
  })

  it('should set value to declared calculation result', () => {
    expectEnviroment('const a = 5+5').toHaveValue('a', 10)
    expectEnviroment('const b = "Hello" + "World"').toHaveValue(
      'b',
      'HelloWorld'
    )
    expectEnviroment('const c = 21 / 7 + 2').toHaveValue('c', 5)
    expectEnviroment('let a = 5+5').toHaveValue('a', 10)
    expectEnviroment('let b = "Hello" + "World"').toHaveValue('b', 'HelloWorld')
    expectEnviroment('let c = 21 / 7 + 2').toHaveValue('c', 5)
  })

  it('should read variable values', () => {
    expectOutput(`
      const a = 5
      a
    `).toBe(5)
    expectOutput(`
      const a = 5
      a * 5 + 2
    `).toBe(27)
    expectOutput(`
      let a = 5
      a
    `).toBe(5)
    expectOutput(`
      let a = 5
      a * 5 + 2
    `).toBe(27)
  })

  it('should throw error on redefine of variable', () => {
    expectError(`
      const a = 5
      const a = 10
    `)
    expectError(`
      const a = 5
      let a = 10
    `)
    expectError(`
      let a = 5
      const a = 5
    `)
    expectError(`
      let a = 5
      let a = 10
    `)
  })

  it('should throw error on assignment of constant variable', () => {
    expectError(`
      const a = 5
      a = 10
    `)
    expectError(`
      const a = 'hello'
      a = 'world'
    `)
    expectError(`
      const a = 'hello'
      a = false
    `)
  })

  it('should throw error on assignment of variable without declaration', () => {
    expectError(`a = 10`)
    expectError(`a = 'world'`)
    expectError(`a = false`)
    expectError(`a = true`)
  })

  it('should reassign value on assignment of variable', () => {
    expectEnviroment(`let a = 5
a = 10`).toHaveValue('a', 10)
    expectEnviroment(`let b = 787 + 2
b = false`).toHaveValue('b', false)
    expectEnviroment(`let c = true
c = false`).toHaveValue('c', false)
    expectEnviroment(`let d = 'hello'
d = 'world'`).toHaveValue('d', 'world')
    expectEnviroment(`let e = false
e = 'world'`).toHaveValue('e', 'world')
    expectEnviroment(`let f = true
f = 'world'`).toHaveValue('f', 'world')
  })

  it('should be able to reassign variable based on current value', () => {
    expectOutput(`
      let a = 5
      a = a + 10
      a
    `).toBe(15)
    expectOutput(`
      let a = 'hello'
      a = a + 'world'
      a
    `).toBe('helloworld')
  })

  it('should have assigment expression value as assignment value', () => {
    expectOutput(`let a = 'hello'
a = 5`).toBe(5)
  })

  it('should have declaration expression value as null', () => {
    expectOutput(`let a = 5`).toBeNull()
    expectOutput(`const a = 5`).toBeNull()
  })
})

describe('variables are block scoped', () => {
  const originalConsoleLog = console.log

  beforeEach(() => {
    console.log = jest.fn()
  })
  afterEach(() => {
    console.log = originalConsoleLog
  })

  it('should access variable in higher scope', () => {
    expectOutput(`let a  = 5
a`).toBe(5)
  })

  it('should be able to reassign variables in higher scope', () => {
    expectEnviroment(`let a  = 5
a = 6`).toHaveValue('a', 6)
    expectEnviroment(`let a  = 5
a = 6`).toHaveValue('a', 6)
  })

  it('should throw error when accessing variable in defined in a lower scope', () => {
    expectError(`let a = 5
  let b = 4
a = 6
b`)
  })

  it('should shadow variable if redefining variable in higher scope', () => {
    expectOutput(`let b = 10
      let b = 6
b`).toBe(10)
    execute(`let b = 10
      let b = 6
      print b
b`)
    expect(console.log).toHaveBeenLastCalledWith(6)
  })

  it('should cope with setting a variable to a value in higher scope with the same name', () => {
    execute(`let a = 1
  let a = a + 2
  print a`)
    expect(console.log).toHaveBeenLastCalledWith(3)
  })
})

describe('logical operators can be used', () => {
  it('should return second value of an AND statement if truthy', () => {
    expectOutput('true and 2').toBe(2)
    expectOutput('1 and true').toBe(true)
    expectOutput('"hello" and 77').toBe(77)
    expectOutput('0 and 77').toBe(77)
    expectOutput('2 and "hello"').toBe('hello')
  })

  it('should return first value of an AND statement if falsy', () => {
    expectOutput('false and false').toBe(false)
    expectOutput('false and true').toBe(false)
    expectOutput('false and 77').toBe(false)
    expectOutput('null and "hello"').toBe(null)
  })

  it('should return first value of an OR statement if truthy', () => {
    expectOutput('true or 2').toBe(true)
    expectOutput('1 or true').toBe(1)
    expectOutput('"hello" or 77').toBe('hello')
    expectOutput('0 or 77').toBe(0)
  })

  it('should return second value of an OR statement if falsy', () => {
    expectOutput('false or false').toBe(false)
    expectOutput('false or true').toBe(true)
    expectOutput('false or 77').toBe(77)
    expectOutput('null or "hello"').toBe('hello')
  })
})

describe('if statements execute properly', () => {
  it('should execute expression when condition is truthy', () => {
    expectEnviroment(`let a = 0
if (true) a = 1`).toHaveValue('a', 1)
    expectEnviroment(`let a = 0
if ("hello") a = 1`).toHaveValue('a', 1)
  })

  it('should not execute expression when condition is falsy', () => {
    expectEnviroment(`let a = 0
if (false) let a = 1`).toHaveValue('a', 0)
    expectEnviroment(`let a = 0
if (null) let a = 1`).toHaveValue('a', 0)
  })

  it('should match block to if statement', () => {
    expectEnviroment(`let a = 5
if (true)
  a = 4
else
  a = 5
a
`).toHaveValue('a', 4)
    expectEnviroment(`let a = 5
if (false)
  a = 4
else
  a = 6
a
`).toHaveValue('a', 6)
  })

  it('should execute else statement if condition is falsy', () => {
    expectEnviroment(`let a = 0
if (false) a = 1
else a = 2`).toHaveValue('a', 2)
  })

  it('should not execute else statement if condition is truthy', () => {
    expectEnviroment(`let a = 0
if (true) a = 1
else a = 2`).toHaveValue('a', 1)
  })

  it('should associate else stament to nearest if statement', () => {
    expectEnviroment(`let a = 0
if (true) a = 1
if (false) a = 2
else a = 3`).toHaveValue('a', 3)
    expectEnviroment(`let a = 0
if (false) a = 1
if (true) a = 2
else a = 3`).toHaveValue('a', 2)
    expectEnviroment(`let a = 0
if (true) a = 1
  if (false) a = 4
else a = 3`).toHaveValue('a', 1)
  })

  it('should handle else if', () => {
    expectEnviroment(`let a = 0
if (a > 1) a = 1
else if (a == 0) a = 2
else a = 3`).toHaveValue('a', 2)
  })
})
