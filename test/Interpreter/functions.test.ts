import { expectOutput, expectEnviroment, execute, expectError } from './helpers'

describe('functions work', () => {
  const originalConsoleLog = console.log

  beforeEach(() => {
    console.log = jest.fn()
  })
  afterEach(() => {
    console.log = originalConsoleLog
  })

  it('should declare and run functions of 2 variables', () => {
    expectOutput(`
let sayHi = (first, last) =>
  return "Hi, " + first + " " + last + "!"

sayHi("Dear", "Reader")
    `).toBe('Hi, Dear Reader!')
  })

  it('should declare and run function of 3 variables', () => {
    expectOutput(
      `
let add = (a, b, c) =>
  return a + b + c

add(1, 2, 3)
`
    ).toBe(6)
  })

  it('should accept paramters and arguments across multiple lines', () => {
    expectOutput(
      `
let add = (
  a,
  b,
  c
) =>
  return a + b + c

add(1, 2, 3)
`
    ).toBe(6)
    expectOutput(
      `
let add = (a, b, c ) =>
  return a + b + c

add(
  1,
  2,
  3
)
`
    ).toBe(6)
    expectOutput(
      `
let add = (
  a,
  b,
  c
) =>
  return a + b + c

add(
  1,
  2,
  3
)
`
    ).toBe(6)
  })

  it('should class functions as values', () => {
    expectOutput(`
let a = print
a`).toBe('<function print>')
  })

  it('should not execute statements after return', () => {
    expectOutput(`
let function = () =>
  return 1
  let a = 2
  return 2

function()`).toBe(1)
  })

  it('should return null if no return', () => {
    expectOutput(`
let function = () =>
  let a = 7

function()`).toBe(null)
    expectOutput(`
let function = () =>
  let a = 7

type(function())`).toBe('null')
  })

  it('should cope with inline functions', () => {
    expectOutput(`
const add = (a,b) => a + b

add(2,3)`).toBe(5)
  })

  it('should work with closures', () => {
    const enviroment = expectEnviroment(`
let makeCounter = () =>
  let i = 0
  let count = () =>
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
let count = (n) =>
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
let fib = (n) =>
  if (n <= 1) return 1
  return fib(n - 2) + fib(n - 1)

fib(1)`).toBe(1)
    expectOutput(`
let fib = (n) =>
  if (n <= 1) return 1
  return fib(n - 2) + fib(n - 1)

fib(2)`).toBe(2)
    expectOutput(`
let fib = (n) =>
  if (n <= 1) return 1
  return fib(n - 2) + fib(n - 1)

fib(3)`).toBe(3)
    expectOutput(`
let fib = (n) =>
  if (n <= 1) return 1
  return fib(n - 2) + fib(n - 1)

fib(4)`).toBe(5)
    expectOutput(`
let fib = (n) =>
  if (n <= 1) return 1
  return fib(n - 2) + fib(n - 1)

fib(5)`).toBe(8)
    expectOutput(`
let fib = (n) =>
  if (n <= 1) return 1
  return fib(n - 2) + fib(n - 1)

fib(6)`).toBe(13)
  })

  it('functions close over scope', () => {
    execute(`
let a = "global"

  let showA = () =>
    print(a)

  showA()
  a = "block"
  showA()
`)
    expect(console.log).toHaveBeenCalledTimes(2)
    expect(console.log).toHaveBeenNthCalledWith(1, 'global')
    expect(console.log).toHaveBeenLastCalledWith('global')
  })

  it('should close scope over functions (with variable declaration)', () => {
    execute(`
let a = "global"

  let showA = () =>
    print(a)
  showA()
  let a = "block"
  showA()`)
    expect(console.log).toHaveBeenCalledTimes(2)
    expect(console.log).toHaveBeenNthCalledWith(1, 'global')
    expect(console.log).toHaveBeenLastCalledWith('global')
  })

  it('should error on top level return', () => {
    expectError('return 2')
  })

  it('should execute immediately invoked functions', () => {
    execute(`((a) => print(a))('hello')`)
    expect(console.log).toHaveBeenLastCalledWith('hello')
  })

  it('should not give a name to anonomous functions', () => {
    execute('print((a,b) => a + b)')
    expect(console.log).toHaveBeenLastCalledWith('<function>')
  })

  it('should calculate equality for functions', () => {
    expectOutput('print == print').toBe(true)
    expectOutput('print != print').toBe(false)
    expectOutput('print != (a) => print(a)').toBe(true)
    expectOutput('print == (a) => print(a)').toBe(false)
    expectOutput('((a) => a * a) == ((a) => a * a)').toBe(false)
  })

  it('should allow callbacks to be used', () => {
    expectOutput(`
let add = (a,b) => a + b
let doOperation = (a,b, operation) => operation(a,b)

doOperation(2,3,add)
`).toBe(5)
  })

  it('should accept trailing commas in function parameters', () => {
    expectOutput(`
let add = (a, b, c,) => a + b + c

add(1,4,5)`).toBe(10)
    expectOutput(`
let add = (
  a,
  b,
  c,
) => a + b + c

add(1,4,10)`).toBe(15)
  })

  it('should accept trailing commas in function arguments', () => {
    expectOutput(`
let add = (a, b, c) => a + b + c

add(1,4,5,)`).toBe(10)
    expectOutput(`
let add = (a, b, c ) => a + b + c

add(
  1,
  4,
  10,
)`).toBe(15)
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
