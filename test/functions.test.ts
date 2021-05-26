import { expectOutput, expectEnviroment, execute, expectError } from './helpers'

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

it('should not give a name to anonomous functions', () => {
  expectOutput('((a,b) => a + b)').toBe('<function>')
})

it('should calculate equality for functions', () => {
  expectOutput('print == print').toBe(true)
  expectOutput('print != print').toBe(false)
  expectOutput('type != (a) => type(a)').toBe(true)
  expectOutput('type == (a) => type(a)').toBe(false)
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

it('should not allow string or numbers to be called', () => {
  expectError('123()')
  expectError('123(1)')
  expectError('"Hello"()')
})

it('should return null on blank return statement', () => {
  expectOutput(`
let a = () =>
  return
a()`).toBe(null)
})

it('should be able to implement a class like behavior', () => {
  expectOutput(`
let aClass = () =>
  let state = 0

  let getState = () =>
    return state
  let setState = (value) =>
    state = value

  return {
    getState,
    setState,
  }

let a = aClass()
a.setState(2)
a.getState()`).toBe(2)
})

it('should error on top level return', () => {
  expectError('return 2')
})

it('should error on more than 255 arguments', () => {
  expectError(
    '(x0,x1,x2,x3,x4,x5,x6,x7,x8,x9,xa,xb,xc,xd,xe,xf,x10,x11,x12,x13,x14,x15,x16,x17,x18,x19,x1a,x1b,x1c,x1d,x1e,x1f,x20,x21,x22,x23,x24,x25,x26,x27,x28,x29,x2a,x2b,x2c,x2d,x2e,x2f,x30,x31,x32,x33,x34,x35,x36,x37,x38,x39,x3a,x3b,x3c,x3d,x3e,x3f,x40,x41,x42,x43,x44,x45,x46,x47,x48,x49,x4a,x4b,x4c,x4d,x4e,x4f,x50,x51,x52,x53,x54,x55,x56,x57,x58,x59,x5a,x5b,x5c,x5d,x5e,x5f,x60,x61,x62,x63,x64,x65,x66,x67,x68,x69,x6a,x6b,x6c,x6d,x6e,x6f,x70,x71,x72,x73,x74,x75,x76,x77,x78,x79,x7a,x7b,x7c,x7d,x7e,x7f,x80,x81,x82,x83,x84,x85,x86,x87,x88,x89,x8a,x8b,x8c,x8d,x8e,x8f,x90,x91,x92,x93,x94,x95,x96,x97,x98,x99,x9a,x9b,x9c,x9d,x9e,x9f,xa0,xa1,xa2,xa3,xa4,xa5,xa6,xa7,xa8,xa9,xaa,xab,xac,xad,xae,xaf,xb0,xb1,xb2,xb3,xb4,xb5,xb6,xb7,xb8,xb9,xba,xbb,xbc,xbd,xbe,xbf,xc0,xc1,xc2,xc3,xc4,xc5,xc6,xc7,xc8,xc9,xca,xcb,xcc,xcd,xce,xcf,xd0,xd1,xd2,xd3,xd4,xd5,xd6,xd7,xd8,xd9,xda,xdb,xdc,xdd,xde,xdf,xe0,xe1,xe2,xe3,xe4,xe5,xe6,xe7,xe8,xe9,xea,xeb,xec,xed,xee,xef,xf0,xf1,xf2,xf3,xf4,xf5,xf6,xf7,xf8,xf9,xfa,xfb,xfc,xfd,xfe,xff,xaa) => 1'
  )

  expectError(
    `
let a  = (x0,x1,x2,x3,x4,x5,x6,x7,x8,x9,xa,xb,xc,xd,xe,xf,x10,x11,x12,x13,x14,x15,x16,x17,x18,x19,x1a,x1b,x1c,x1d,x1e,x1f,x20,x21,x22,x23,x24,x25,x26,x27,x28,x29,x2a,x2b,x2c,x2d,x2e,x2f,x30,x31,x32,x33,x34,x35,x36,x37,x38,x39,x3a,x3b,x3c,x3d,x3e,x3f,x40,x41,x42,x43,x44,x45,x46,x47,x48,x49,x4a,x4b,x4c,x4d,x4e,x4f,x50,x51,x52,x53,x54,x55,x56,x57,x58,x59,x5a,x5b,x5c,x5d,x5e,x5f,x60,x61,x62,x63,x64,x65,x66,x67,x68,x69,x6a,x6b,x6c,x6d,x6e,x6f,x70,x71,x72,x73,x74,x75,x76,x77,x78,x79,x7a,x7b,x7c,x7d,x7e,x7f,x80,x81,x82,x83,x84,x85,x86,x87,x88,x89,x8a,x8b,x8c,x8d,x8e,x8f,x90,x91,x92,x93,x94,x95,x96,x97,x98,x99,x9a,x9b,x9c,x9d,x9e,x9f,xa0,xa1,xa2,xa3,xa4,xa5,xa6,xa7,xa8,xa9,xaa,xab,xac,xad,xae,xaf,xb0,xb1,xb2,xb3,xb4,xb5,xb6,xb7,xb8,xb9,xba,xbb,xbc,xbd,xbe,xbf,xc0,xc1,xc2,xc3,xc4,xc5,xc6,xc7,xc8,xc9,xca,xcb,xcc,xcd,xce,xcf,xd0,xd1,xd2,xd3,xd4,xd5,xd6,xd7,xd8,xd9,xda,xdb,xdc,xdd,xde,xdf,xe0,xe1,xe2,xe3,xe4,xe5,xe6,xe7,xe8,xe9,xea,xeb,xec,xed,xee,xef,xf0,xf1,xf2,xf3,xf4,xf5,xf6,xf7,xf8,xf9,xfa,xfb,xfc,xfd) => 1
a("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff","aa")
`
  )
})

it('should execute immediately invoked functions', () => {
  expectOutput(`((a) => type(a))('hello')`).toBe('string')
})

it('should work with spread arguments', () => {
  expectOutput(`let a = (a, b, c) => a + b + c
a(...[1,3,4])`).toBe(8)
  expectOutput(`let a = (a, b, c) => a + b + c
a(...[1,3], 4)`).toBe(8)
  expectOutput(`let a = (a, b, c) => a + b + c
a(5,...[1, 7])`).toBe(13)
  expectError(`let a = (a, b, c) => a + b + c
a(5,...[1, 7,2])`)
})

describe('with print output', () => {
  const originalConsoleLog = console.log

  beforeEach(() => {
    console.log = jest.fn()
  })
  afterEach(() => {
    console.log = originalConsoleLog
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
    expect(console.log).toHaveBeenLastCalledWith('block')
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
})
