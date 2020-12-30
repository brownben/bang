import { expectEnviroment, expectOutput, expectError, execute } from './helpers'

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
    expectOutput(`
let a  = 5
  a`).toBe(5)
  })

  it('should be able to reassign variables in higher scope', () => {
    expectEnviroment(`let a  = 5
a = 6`).toHaveValue('a', 6)
    expectEnviroment(`let a  = 5
a = 6`).toHaveValue('a', 6)
  })

  it('should throw error when accessing variable in defined in a lower scope', () => {
    expectError(`
let a = 5
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
      print(b)
b`)
    expect(console.log).toHaveBeenLastCalledWith(6)
  })

  it('should cope with setting a variable to a value in higher scope with the same name', () => {
    execute(`let a = 1
  let a = a + 2
  print(a)`)
    expect(console.log).toHaveBeenLastCalledWith(3)
  })

  it('should not assign to a literal', () => {
    expectError('1 = 2')
  })
})

describe('_ is empty variable', () => {
  it('should be able to be declared multiple times in the same scope', () => {
    expectOutput(`
let _ = 1
let _ = 2`).toBe(null)
  })

  it('should be always be null', () => {
    expectOutput(`
let _ = 1
let _ = 2
_`).toBe(null)

    expectOutput(`
let _ = 1
_ = 2
_`).toBe(null)
  })

  it('should be able to be accessed without declaration', () => {
    expectOutput(`_`).toBe(null)
  })

  it('should error if no new line after variable declaration', () => {
    expectError('let a = 1 let')
  })
})
