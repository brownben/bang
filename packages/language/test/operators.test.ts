import { expectError, expectOutput } from './helpers'

describe('mathematical operations can be calculated', () => {
  it('should add numbers', async () => {
    await expectOutput(`1 + 2`).toEqual(3)
    await expectOutput('7 + 3').toEqual(10)
    await expectOutput('2000 + 20').toEqual(2020)
  })

  it('should subtract numbers', async () => {
    await expectOutput(`1 - 2`).toEqual(-1)
    await expectOutput('7 - 3').toEqual(4)
    await expectOutput('2000 - 20').toEqual(1980)
  })

  it('should multiply numbers', async () => {
    await expectOutput(`1 * 2`).toEqual(2)
    await expectOutput('7 * 3').toEqual(21)
    await expectOutput('2000 * 20').toEqual(40000)
  })

  it('should divide numbers', async () => {
    await expectOutput(`1 / 2`).toEqual(0.5)
    await expectOutput('7 / 3').toEqual(7 / 3)
    await expectOutput('2000 / 20').toEqual(100)
  })

  it('should modulo numbers', async () => {
    await expectOutput(`1 % 2`).toEqual(1)
    await expectOutput('7 % 3').toEqual(1)
    await expectOutput('-7 % 3').toEqual(2)
    await expectOutput('2000 % 20').toEqual(0)
  })

  it('should add negative numbers', async () => {
    await expectOutput(`-1 + -2`).toEqual(-3)
    await expectOutput('-7 + -3').toEqual(-10)
    await expectOutput('-2000 + -20').toEqual(-2020)
  })

  it('should add multiple numbers', async () => {
    await expectOutput(`1 + 2 + 7`).toEqual(10)
    await expectOutput('7 + 3 + 121').toEqual(131)
    await expectOutput('222 + 111 + 333').toEqual(666)
  })

  it('should follow order of operations', async () => {
    await expectOutput('4+2*3').toBe(10)
    await expectOutput('4-2*3').toBe(-2)
    await expectOutput('(4+5)*5').toBe(45)
    await expectOutput('12/4 - 3').toBe(0)
  })

  it('should not add number and any other type', async () => {
    await expectError(`1 + "2"`)
    await expectError(`"73" + 121`)
    await expectError(`1 + null`)
    await expectError(`null + 121`)
    await expectError(`1 + true`)
    await expectError(`false + 121`)
  })

  it('should not subtract number and any other type', async () => {
    await expectError(`1 - "2"`)
    await expectError(`"73" - 121`)
    await expectError(`1 - null`)
    await expectError(`null - 121`)
    await expectError(`1 - true`)
    await expectError(`false - 121`)
  })

  it('should not modulo number and any other type', async () => {
    await expectError(`1 % "2"`)
    await expectError(`"73" % 121`)
    await expectError(`1 % null`)
    await expectError(`null % 121`)
    await expectError(`1 % true`)
    await expectError(`false % 121`)
  })

  it('should not multiply number and any other type', async () => {
    await expectError(`1 * "2"`)
    await expectError(`"73" * 121`)
    await expectError(`1 * null`)
    await expectError(`null * 121`)
    await expectError(`1 * true`)
    await expectError(`false * 121`)
  })

  it('should not divide number and any other type', async () => {
    await expectError(`1 / "2"`)
    await expectError(`"73" / 121`)
    await expectError(`1 / null`)
    await expectError(`null / 121`)
    await expectError(`1 / true`)
    await expectError(`false / 121`)
  })

  it('should throw error on divide by 0', async () => {
    await expectError('1 / 0')
    await expectError('0 / 0')
    await expectError('2.2 / 0')
  })

  it('should calculate numbers with lots of minus', async () => {
    await expectOutput('4---4').toBe(0)
    await expectOutput('4--------------------------------4').toBe(8)
  })

  it('should raise numbers to a power', async () => {
    await expectOutput(`100 ** 0`).toEqual(1)
    await expectOutput(`1 ** 55`).toEqual(1)
    await expectOutput('2 ** 2').toEqual(4)
    await expectOutput(' 16 ** 0.5').toEqual(4)
  })

  it('should not raise other types to a power', async () => {
    await expectError(`false ** 55`)
    await expectError('2 ** null')
    await expectError('"good" ** 0.5')
  })
})

describe('string operations can be calculated', () => {
  it('should concatenate strings', async () => {
    await expectOutput(`'1' + '2'`).toEqual('12')
    await expectOutput('`7` + "3"').toEqual('73')
  })
})

describe('equalities can be calculated', () => {
  it('should be equal for 0 and -0', async () => {
    await expectOutput('0 == -0').toBe(true)
  })

  it('should be equal for the same literal', async () => {
    await expectOutput('5 == 5').toBe(true)
    await expectOutput('`tree` == `tree`').toBe(true)
    await expectOutput('false == false').toBe(true)
    await expectOutput('true == true').toBe(true)
    await expectOutput('null == null').toBe(true)
  })

  it('should be not equal for the different primitives', async () => {
    await expectOutput('5 == 7').toBe(false)
    await expectOutput('`tree` == `trees`').toBe(false)
    await expectOutput('false == true').toBe(false)
    await expectOutput('true == false').toBe(false)
  })

  it('should not be not equal for the same literal', async () => {
    await expectOutput('5 != 5').toBe(false)
    await expectOutput('`tree` != `tree`').toBe(false)
    await expectOutput('false != false').toBe(false)
    await expectOutput('true != true').toBe(false)
    await expectOutput('null != null').toBe(false)
  })

  it('should compare different types correctly', async () => {
    await expectOutput('5 == "5"').toBe(false)
    await expectOutput('`tree` == `5`').toBe(false)
    await expectOutput('false == 0').toBe(false)
    await expectOutput('true == 1').toBe(false)
    await expectOutput('null == false').toBe(false)
  })

  it('should compare sums correctly', async () => {
    await expectOutput('5 + 5 == 10').toBe(true)
    await expectOutput('15 == 5*3').toBe(true)
    await expectOutput('(2*3)+4 == 5+6-1').toBe(true)
    await expectOutput('12/4 == 18/6').toBe(true)
    await expectOutput('`hello ` + "world" == `hello world`').toBe(true)
  })

  it('should compare comparisons correctly', async () => {
    await expectOutput('5 == 5 == true').toBe(true)
    await expectOutput('true == 5 == 5').toBe(false)
    await expectOutput('(5 != 5) == false').toBe(true)
    await expectOutput('(4 > 6) != 7 < 21').toBe(true)
  })
})

describe('inequalities can be calculated', () => {
  it('should compare 2 numbers correctly', async () => {
    await expectOutput('1 > 4').toBe(false)
    await expectOutput('1 < 4').toBe(true)
    await expectOutput('4 < 1').toBe(false)
    await expectOutput('4 > 1').toBe(true)
    await expectOutput('1 > 1').toBe(false)
    await expectOutput('1 >= 1').toBe(true)
    await expectOutput('1 < 1').toBe(false)
    await expectOutput('1 <= 1').toBe(true)
  })

  it('should compare 2 strings correctly', async () => {
    await expectOutput('"b" > "a"').toBe(true)
    await expectOutput('"A" < "a"').toBe(true)
    await expectOutput('"b" < "a"').toBe(false)
    await expectOutput('"df" < "af"').toBe(false)
    await expectOutput('"job" > "Rest"').toBe(true)
    await expectOutput('"fred" >= "fred"').toBe(true)
    await expectOutput('"scooby" < "scooby"').toBe(false)
    await expectOutput('"hidden" <="words"').toBe(true)
  })

  it('should not compare number to any other type', async () => {
    await expectError(`1 > "2"`)
    await expectError(`"73" < 121`)
    await expectError(`1 >= null`)
    await expectError(`null <= 121`)
    await expectError(`1 > true`)
    await expectError(`false < 121`)
  })

  it('should not compare string to any other type', async () => {
    await expectError(`1 > "2"`)
    await expectError(`1 < "2"`)
    await expectError(`1 <= "2"`)
    await expectError(`"73" < 121`)
    await expectError(`'1' >= null`)
    await expectError(`null >= '1'`)
    await expectError(`'1' <= 1`)
    await expectError(`null <= "121"`)
    await expectError(`'abcd' > true`)
    await expectError(`false < 'efgr'`)
  })

  it('should not compare any other type', async () => {
    await expectError(`false > true`)
    await expectError(`false < null`)
  })

  it('should have unary minus on boolean', async () => {
    await expectOutput(`-123`).toBe(-123)
    await expectOutput(`--23`).toBe(23)
  })

  it('should not have unary minus on any other type', async () => {
    await expectError(`-false `)
    await expectError(`-null`)
    await expectError(`-'hello'`)
  })

  it('should have unary not on boolean', async () => {
    await expectOutput(`!false`).toBe(true)
    await expectOutput(`!true`).toBe(false)
  })

  it('should not have unary not on any other type', async () => {
    await expectError(`!"false"`)
    await expectError(`!null`)
    await expectError(`!'hello'`)
    await expectError('!123')
  })

  it('should compute calulations across multiple lines', async () => {
    await expectOutput(`1 +
    2`).toEqual(3)
    await expectOutput(`(1 + 1
     +2)`).toEqual(4)
    await expectOutput(`7 + 3 *
    21 +
      2`).toEqual(72)
    await expectOutput(`(7 + 3
        *
      21 +
        2)`).toEqual(72)
  })
})

describe('assigment operators compute correct value', () => {
  it('should increment numbers', async () => {
    await expectOutput(`
let a = 1
a += 2
a`).toBe(3)
  })

  it('should subtract numbers', async () => {
    await expectOutput(`
let a = 1
a -= 2
a`).toBe(-1)
  })

  it('should multiply numbers', async () => {
    await expectOutput(`
let a = 3
a *= 2
a`).toBe(6)
  })

  it('should divide numbers', async () => {
    await expectOutput(`
let a = 3
a /= 2
a`).toBe(1.5)
  })

  it('should concatenate strings', async () => {
    await expectOutput(`
let a = 'hello '
a += 'world'
a`).toBe('hello world')
  })

  it('should error on other types', async () => {
    await expectError(`
let a = true
a += false
a`)
    await expectError(`
let a = null
a += 3
a`)
  })

  it('should error on mix of types', async () => {
    await expectError(`
let a = true
a += 'hello'
a`)
    await expectError(`
let a = 'hello'
a /= 3
a`)
    await expectError(`
let a = null
a *= 3
a`)
    await expectError('12 += 3')
  })
})

describe('logical operators can be used', () => {
  it('should return second value of an AND statement if truthy', async () => {
    await expectOutput('true and 2').toBe(2)
    await expectOutput('1 and true').toBe(true)
    await expectOutput('"hello" and 77').toBe(77)
    await expectOutput('0 and 77').toBe(77)
    await expectOutput('2 and "hello"').toBe('hello')
    await expectOutput('true && 2').toBe(2)
    await expectOutput('1 && true').toBe(true)
    await expectOutput('"hello" && 77').toBe(77)
    await expectOutput('0 && 77').toBe(77)
    await expectOutput('2 && "hello"').toBe('hello')
    await expectOutput('((a) => a + 1) && "hello"').toBe('hello')
    await expectOutput('{} && "hello"').toBe('hello')
    await expectOutput('[] && "hello"').toBe('hello')
  })

  it('should return first value of an AND statement if falsy', async () => {
    await expectOutput('false and false').toBe(false)
    await expectOutput('false and true').toBe(false)
    await expectOutput('false and 77').toBe(false)
    await expectOutput('null and "hello"').toBe(null)
    await expectOutput('false && false').toBe(false)
    await expectOutput('false && true').toBe(false)
    await expectOutput('false && 77').toBe(false)
    await expectOutput('null && "hello"').toBe(null)
  })

  it('should return first value of an OR statement if truthy', async () => {
    await expectOutput('true or 2').toBe(true)
    await expectOutput('1 or true').toBe(1)
    await expectOutput('"hello" or 77').toBe('hello')
    await expectOutput('0 or 77').toBe(0)
    await expectOutput('true || 2').toBe(true)
    await expectOutput('1 || true').toBe(1)
    await expectOutput('"hello" || 77').toBe('hello')
    await expectOutput('0 || 77').toBe(0)
    await expectOutput('((a) => a + 1) || "hello"').toBe('<function>')
    await expectOutput('{} || "hello"').toEqual({})
  })

  it('should return second value of an OR statement if falsy', async () => {
    await expectOutput('false or false').toBe(false)
    await expectOutput('false or true').toBe(true)
    await expectOutput('false or 77').toBe(77)
    await expectOutput('null or "hello"').toBe('hello')
    await expectOutput('false || false').toBe(false)
    await expectOutput('false || true').toBe(true)
    await expectOutput('false || 77').toBe(77)
    await expectOutput('null || "hello"').toBe('hello')
  })
})
