import { execute, expectError, expectOutput } from './helpers'

describe('print functions', () => {
  const originalConsoleLog = console.log

  beforeEach(() => {
    console.log = jest.fn()
  })
  afterEach(() => {
    console.log = originalConsoleLog
  })

  it('should throw error if no arguments are passed', () => {
    expectError('print(1, 2)')
  })

  it('should throw error if 2 arguments are passed', () => {
    expectError('print()')
  })

  it('should display literal values', () => {
    execute('print(5)')
    expect(console.log).toHaveBeenLastCalledWith(5)
    execute('print("hello world")')
    expect(console.log).toHaveBeenLastCalledWith('hello world')
    execute('print(false)')
    expect(console.log).toHaveBeenLastCalledWith(false)
    execute('print(null)')
    expect(console.log).toHaveBeenLastCalledWith(null)
  })

  it('should display value of expressions', () => {
    execute('print(5 + 5)')
    expect(console.log).toHaveBeenLastCalledWith(10)
    execute('print(22 / 2)')
    expect(console.log).toHaveBeenLastCalledWith(11)
    execute('print("hello " + "world")')
    expect(console.log).toHaveBeenLastCalledWith('hello world')
    execute('print(false == 5 > 9)')
    expect(console.log).toHaveBeenLastCalledWith(true)
    execute('print(5 * 5 - 9 == 8 * 2)')
    expect(console.log).toHaveBeenLastCalledWith(true)
  })

  it('should have correct string representation value', () => {
    execute('print(print)')
    expect(console.log).toHaveBeenLastCalledWith('<function print>')
  })
})

describe('type function', () => {
  it('should throw error if no arguments are passed', () => {
    expectError('type(1, 2)')
  })

  it('should throw error if 2 arguments are passed', () => {
    expectError('type()')
  })

  it('should have correct string representation value', () => {
    expectOutput('type').toBe('<function type>')
  })

  it('should return the correct type of values', () => {
    expectOutput('type(`a`)').toBe('string')
    expectOutput('type("hello world")').toBe('string')
    expectOutput('type(1)').toBe('number')
    expectOutput('type(0.21)').toBe('number')
    expectOutput('type(785.26)').toBe('number')
    expectOutput('type(true)').toBe('boolean')
    expectOutput('type(false)').toBe('boolean')
    expectOutput('type(null)').toBe('null')
    expectOutput('type(print)').toBe('function')
  })
})
