import { expectError, expectOutput } from './helpers'

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

  it('should not subtract number and any other type', () => {
    expectError(`1 - "2"`)
    expectError(`"73" - 121`)
    expectError(`1 - null`)
    expectError(`null - 121`)
    expectError(`1 - true`)
    expectError(`false - 121`)
  })

  it('should not multiply number and any other type', () => {
    expectError(`1 * "2"`)
    expectError(`"73" * 121`)
    expectError(`1 * null`)
    expectError(`null * 121`)
    expectError(`1 * true`)
    expectError(`false * 121`)
  })

  it('should not divide number and any other type', () => {
    expectError(`1 / "2"`)
    expectError(`"73" / 121`)
    expectError(`1 / null`)
    expectError(`null / 121`)
    expectError(`1 / true`)
    expectError(`false / 121`)
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

  it('should raise numbers to a power', () => {
    expectOutput(`100 ** 0`).toEqual(1)
    expectOutput(`1 ** 55`).toEqual(1)
    expectOutput('2 ** 2').toEqual(4)
    expectOutput(' 16 ** 0.5').toEqual(4)
  })

  it('should not raise other types to a power', () => {
    expectError(`false ** 55`)
    expectError('2 ** null')
    expectError('"good" ** 0.5')
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
    expectError(`'1' <= 1`)
    expectError(`null <= "121"`)
    expectError(`'abcd' > true`)
    expectError(`false < 'efgr'`)
  })

  it('should not compare  any other type', () => {
    expectError(`false > true`)
    expectError(`false < null`)
  })

  it('should compute calulations across multiple lines', () => {
    expectOutput(`1 +
    2`).toEqual(3)
    expectOutput(`(1 + 1
     +2)`).toEqual(4)
    expectOutput(`7 + 3 *
    21 +
      2`).toEqual(72)
    expectOutput(`(7 + 3
        *
      21 +
        2)`).toEqual(72)
  })
})

describe('assigment operators compute correct value', () => {
  it('should increment numbers', () => {
    expectOutput(`
let a = 1
a += 2
a`).toBe(3)
  })

  it('should subtract numbers', () => {
    expectOutput(`
let a = 1
a -= 2
a`).toBe(-1)
  })

  it('should multiply numbers', () => {
    expectOutput(`
let a = 3
a *= 2
a`).toBe(6)
  })

  it('should divide numbers', () => {
    expectOutput(`
let a = 3
a /= 2
a`).toBe(1.5)
  })

  it('should concatenate strings', () => {
    expectOutput(`
let a = 'hello '
a += 'world'
a`).toBe('hello world')
  })

  it('should error on other types', () => {
    expectError(`
let a = true
a += false
a`)

    expectError(`
let a = null
a += 3
a`)
  })

  it('should error on mix of types', () => {
    expectError(`
let a = true
a += 'hello'
a`)

    expectError(`
let a = 'hello'
a /= 3
a`)

    expectError(`
let a = null
a *= 3
a`)
  })
})

describe('logical operators can be used', () => {
  it('should return second value of an AND statement if truthy', () => {
    expectOutput('true and 2').toBe(2)
    expectOutput('1 and true').toBe(true)
    expectOutput('"hello" and 77').toBe(77)
    expectOutput('0 and 77').toBe(77)
    expectOutput('2 and "hello"').toBe('hello')
    expectOutput('true && 2').toBe(2)
    expectOutput('1 && true').toBe(true)
    expectOutput('"hello" && 77').toBe(77)
    expectOutput('0 && 77').toBe(77)
    expectOutput('2 && "hello"').toBe('hello')
  })

  it('should return first value of an AND statement if falsy', () => {
    expectOutput('false and false').toBe(false)
    expectOutput('false and true').toBe(false)
    expectOutput('false and 77').toBe(false)
    expectOutput('null and "hello"').toBe(null)
    expectOutput('false && false').toBe(false)
    expectOutput('false && true').toBe(false)
    expectOutput('false && 77').toBe(false)
    expectOutput('null && "hello"').toBe(null)
  })

  it('should return first value of an OR statement if truthy', () => {
    expectOutput('true or 2').toBe(true)
    expectOutput('1 or true').toBe(1)
    expectOutput('"hello" or 77').toBe('hello')
    expectOutput('0 or 77').toBe(0)
    expectOutput('true || 2').toBe(true)
    expectOutput('1 || true').toBe(1)
    expectOutput('"hello" || 77').toBe('hello')
    expectOutput('0 || 77').toBe(0)
  })

  it('should return second value of an OR statement if falsy', () => {
    expectOutput('false or false').toBe(false)
    expectOutput('false or true').toBe(true)
    expectOutput('false or 77').toBe(77)
    expectOutput('null or "hello"').toBe('hello')
    expectOutput('false || false').toBe(false)
    expectOutput('false || true').toBe(true)
    expectOutput('false || 77').toBe(77)
    expectOutput('null || "hello"').toBe('hello')
  })
})
