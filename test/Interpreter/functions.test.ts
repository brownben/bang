import { expectOutput, expectEnviroment, execute, expectError } from './helpers'

describe('functions work', () => {
  const originalConsoleLog = console.log

  beforeEach(() => {
    console.log = jest.fn()
  })
  afterEach(() => {
    console.log = originalConsoleLog
  })

  it('should declare and run function of 2 variables', () => {
    expectOutput(
      `
fun add(a, b, c)
  return a + b + c

add(1, 2, 3)
`
    ).toBe(6)
  })

  it('should declare and run functions of 3 variables', () => {
    expectOutput(`
fun sayHi(first, last)
  return "Hi, " + first + " " + last + "!"

sayHi("Dear", "Reader")
    `).toBe('Hi, Dear Reader!')
  })

  it('should class functions as values', () => {
    expectOutput(`
let a = print
a`).toBe('<function print>')
  })

  it('should not execute statements after return', () => {
    expectOutput(`
fun function()
  return 1
  let a = 2
  return 2

function()`).toBe(1)
  })

  it('should return null if no return', () => {
    expectOutput(`
fun function()
  let a = 7

function()`).toBe(null)
    expectOutput(`
fun function()
  let a = 7

type(function())`).toBe('null')
  })

  it('should cope with inline functions', () => {
    expectOutput(`
fun add(a,b) a + b

add(2,3)`).toBe(5)
  })

  it('should work with closures', () => {
    const enviroment = expectEnviroment(`
fun makeCounter()
  let i = 0
  fun count()
    i += 1
    return i

  return count


let counter = makeCounter()
let a = counter()
let b = counter()`)
    enviroment.toHaveValue('a', 1)
    enviroment.toHaveValue('b', 2)
    enviroment.toHaveValue('counter', '<function count>')
  })

  it('should execute a simple recursive loop', () => {
    execute(`
fun count(n)
  if (n > 1) count(n - 1)
  print(n)


count(3)`)
    expect(console.log).toBeCalledTimes(3)
    expect(console.log).toHaveBeenCalledWith(1)
    expect(console.log).toHaveBeenCalledWith(2)
    expect(console.log).toHaveBeenCalledWith(3)
  })

  it('should calculate recursive fibonnaci', () => {
    expectOutput(`
fun fib(n)
  if (n <= 1) return 1
  return fib(n - 2) + fib(n - 1)

fib(1)`).toBe(1)
    expectOutput(`
fun fib(n)
  if (n <= 1) return 1
  return fib(n - 2) + fib(n - 1)

fib(2)`).toBe(2)
    expectOutput(`
fun fib(n)
  if (n <= 1) return 1
  return fib(n - 2) + fib(n - 1)

fib(3)`).toBe(3)
    expectOutput(`
fun fib(n)
  if (n <= 1) return 1
  return fib(n - 2) + fib(n - 1)

fib(4)`).toBe(5)
    expectOutput(`
fun fib(n)
  if (n <= 1) return 1
  return fib(n - 2) + fib(n - 1)

fib(5)`).toBe(8)
    expectOutput(`
fun fib(n)
  if (n <= 1) return 1
  return fib(n - 2) + fib(n - 1)

fib(6)`).toBe(13)
  })

  it('functions close over scope', () => {
    execute(`
let a = "global"

  fun showA()
    print(a)

  showA()
  a = "block"
  showA()
`)
    expect(console.log).toHaveBeenCalledTimes(2)
    expect(console.log).toHaveBeenNthCalledWith(1, 'global')
    expect(console.log).toHaveBeenLastCalledWith('global')
  })

  it('functions close over scope (with variable declaration)', () => {
    execute(`
let a = "global"

  fun showA()
    print(a)
  showA()
  let a = "block"
  showA()`)
    expect(console.log).toHaveBeenCalledTimes(2)
    expect(console.log).toHaveBeenNthCalledWith(1, 'global')
    expect(console.log).toHaveBeenLastCalledWith('global')
  })
})

describe('built-in functions work', () => {
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
})
