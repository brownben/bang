import { expectError, expectOutput } from './helpers'

describe('primitives should return values', () => {
  it('should handle numbers', () => {
    expectOutput('.1').toBe(0.1)
    expectOutput('1').toBe(1)
    expectOutput('758.23').toBe(758.23)
  })

  it('should handle numbers (with digit separators)', () => {
    expectOutput('.1').toBe(0.1)
    expectOutput('1_1').toBe(11)
    expectOutput('1__1').toBe(11)
    expectOutput('222_758.232').toBe(222758.232)
    expectOutput('12_222_758').toBe(12222758)
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

describe('built in properties on primitives', () => {
  it('should have length property on strings', () => {
    expectOutput('"a".length').toBe(1)
    expectOutput('`Hello World`.length').toBe(11)
    expectOutput(`'abc'.length`).toBe(3)
  })

  it('should have toString methods', () => {
    expectOutput(`123.toString()`).toBe('123')
    expectOutput(`123.12.toString()`).toBe('123.12')
    expectOutput('true.toString()').toBe('true')
    expectOutput('false.toString()').toBe('false')
    expectOutput('null.toString()').toBe('null')
    expectOutput(`false.toString`).toBe('<function toString>')
    expectOutput('print.toString()').toBe('<function print>')
    expectOutput('34.toString').toBe('<function toString>')
    expectOutput(`'hello'.toString()`).toBe('hello')
  })

  it('should have toNumber methods', () => {
    expectOutput(`'123'.toNumber()`).toBe(123)
    expectOutput(`'123.12'.toNumber()`).toBe(123.12)
    expectOutput('true.toNumber()').toBe(1)
    expectOutput('false.toNumber()').toBe(0)
    expectOutput('null.toNumber()').toBe(0)
    expectError(`'hello'.toNumber()`)
    expectError('print.toNumber()')
  })

  it('should have toBoolean methods', () => {
    expectOutput(`'hello'.toBoolean()`).toBe(true)
    expectOutput(`'false'.toBoolean()`).toBe(true)
    expectOutput(`''.toBoolean()`).toBe(false)
    expectOutput(`123.toBoolean()`).toBe(true)
    expectOutput(`0.toBoolean()`).toBe(false)
    expectOutput('print.toBoolean()').toBe(true)
    expectOutput('null.toBoolean()').toBe(false)
    expectOutput('true.toBoolean()').toBe(true)
    expectOutput('false.toBoolean()').toBe(false)
  })
})
