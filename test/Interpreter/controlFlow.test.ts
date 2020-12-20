import { expectEnviroment, execute } from './helpers'

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

describe('while statements execute correctly', () => {
  const originalConsoleLog = console.log

  beforeEach(() => {
    console.log = jest.fn()
  })
  afterEach(() => {
    console.log = originalConsoleLog
  })

  it('should loop 5 times', () => {
    execute(`
let a = 5
while (a > 0)
  print(a)
  a = a - 1
`)
    expect(console.log).toHaveBeenCalledTimes(5)
    expect(console.log).toHaveBeenLastCalledWith(1)
    expect(console.log).toHaveBeenCalledWith(5)
    expect(console.log).toHaveBeenCalledWith(4)
    expect(console.log).toHaveBeenCalledWith(3)
    expect(console.log).toHaveBeenCalledWith(2)
  })

  it('should not run if condition false', () => {
    execute(`
let a = 5
while (false)
  print(a)
  a = a - 1
`)
    expect(console.log).not.toHaveBeenCalled()
  })
})
