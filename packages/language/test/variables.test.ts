import { expectEnviroment, expectOutput, expectError, execute } from './helpers'

describe('variables can be declared, assigned and read', () => {
  it('should declare values as null', async () => {
    await expectEnviroment('const a').toHaveValue('a', null)
    await expectEnviroment('const b').toHaveValue('b', null)
    await expectEnviroment('const c').toHaveValue('c', null)
    await expectEnviroment('let a').toHaveValue('a', null)
    await expectEnviroment('let b').toHaveValue('b', null)
    await expectEnviroment('let c').toHaveValue('c', null)
    await expectEnviroment('let _a').toHaveValue('_a', null)
    await expectEnviroment('let abc123').toHaveValue('abc123', null)
  })

  it('should set value to declared literal', async () => {
    await expectEnviroment('const a = 1').toHaveValue('a', 1)
    await expectEnviroment('const b = "Hello"').toHaveValue('b', 'Hello')
    await expectEnviroment('const c = 5').toHaveValue('c', 5)
    await expectEnviroment('const c = true').toHaveValue('c', true)
    await expectEnviroment('let a = 1').toHaveValue('a', 1)
    await expectEnviroment('let b = "World"').toHaveValue('b', 'World')
    await expectEnviroment('let c = 5').toHaveValue('c', 5)
    await expectEnviroment('let c = false').toHaveValue('c', false)
  })

  it('should set value to declared calculation result', async () => {
    await expectEnviroment('const a = 5+5').toHaveValue('a', 10)
    await expectEnviroment('const b = "Hello" + "World"').toHaveValue(
      'b',
      'HelloWorld'
    )
    await expectEnviroment('const c = 21 / 7 + 2').toHaveValue('c', 5)
    await expectEnviroment('let a = 5+5').toHaveValue('a', 10)
    await expectEnviroment('let b = "Hello" + "World"').toHaveValue(
      'b',
      'HelloWorld'
    )
    await expectEnviroment('let c = 21 / 7 + 2').toHaveValue('c', 5)
  })

  it('should read variable values', async () => {
    await expectOutput(`
      const a = 5
      a
    `).toBe(5)
    await expectOutput(`
      const a = 5
      a * 5 + 2
    `).toBe(27)
    await expectOutput(`
      let a = 5
      a
    `).toBe(5)
    await expectOutput(`
      let a = 5
      a * 5 + 2
    `).toBe(27)
  })

  it('should throw error on redefine of variable', async () => {
    await expectError(`
      const a = 5
      const a = 10
    `)
    await expectError(`
      const a = 5
      let a = 10
    `)
    await expectError(`
      let a = 5
      const a = 5
    `)
    await expectError(`
      let a = 5
      let a = 10
    `)
  })

  it('should throw error on assignment of constant variable', async () => {
    await expectError(`
      const a = 5
      a = 10
    `)
    await expectError(`
      const a = 'hello'
      a = 'world'
    `)
    await expectError(`
      const a = 'hello'
      a = false
    `)
  })

  it('should throw error on assignment of variable without declaration', async () => {
    await expectError(`a = 10`)
    await expectError(`a = 'world'`)
    await expectError(`a = false`)
    await expectError(`a = true`)
  })

  it('should reassign value on assignment of variable', async () => {
    await expectEnviroment(`let a = 5
a = 10`).toHaveValue('a', 10)
    await expectEnviroment(`let b = 787 + 2
b = false`).toHaveValue('b', false)
    await expectEnviroment(`let c = true
c = false`).toHaveValue('c', false)
    await expectEnviroment(`let d = 'hello'
d = 'world'`).toHaveValue('d', 'world')
    await expectEnviroment(`let e = false
e = 'world'`).toHaveValue('e', 'world')
    await expectEnviroment(`let f = true
f = 'world'`).toHaveValue('f', 'world')
  })

  it('should be able to reassign variable based on current value', async () => {
    await expectOutput(`
      let a = 5
      a = a + 10
      a
    `).toBe(15)
    await expectOutput(`
      let a = 'hello'
      a = a + 'world'
      a
    `).toBe('helloworld')
  })

  it('should have assigment expression value as assignment value', async () => {
    await expectOutput(`let a = 'hello'
a = 5`).toBe(5)
  })

  it('should have declaration expression value as null', async () => {
    await expectOutput(`let a = 5`).toBeNull()
    await expectOutput(`const a = 5`).toBeNull()
  })
})

describe('variables are block scoped', () => {
  it('should access variable in higher scope', async () => {
    await expectOutput(`
let a  = 5
  a`).toBe(5)
  })

  it('should be able to reassign variables in higher scope', async () => {
    await expectEnviroment(`let a  = 5
a = 6`).toHaveValue('a', 6)
    await expectEnviroment(`let a  = 5
a = 6`).toHaveValue('a', 6)
  })

  it('should throw error when accessing variable in defined in a lower scope', async () => {
    await expectError(`
let a = 5
  let b = 4
a = 6
b`)
  })

  it('should shadow variable if redefining variable in higher scope', async () => {
    const mock = jest.fn()
    await expectOutput(`let b = 10
      let b = 6
b`).toBe(10)
    await execute(
      `let b = 10
      let b = 6
      print(b)
b`,
      { printFunction: mock }
    )
    await expect(mock).toHaveBeenLastCalledWith(6)
  })

  it('should cope with setting a variable to a value in higher scope with the same name', async () => {
    const mock = jest.fn()
    await execute(
      `let a = 1
  let a = a + 2
  print(a)`,
      { printFunction: mock }
    )
    await expect(mock).toHaveBeenLastCalledWith(3)
  })

  it('should not assign to a literal', async () => {
    await expectError('1 = 2')
  })
})

describe('_ is empty variable', () => {
  it('should be able to be declared multiple times in the same scope', async () => {
    await expectOutput(`
let _ = 1
let _ = 2`).toBe(null)
  })

  it('should be always be null', async () => {
    await expectOutput(`
let _ = 1
let _ = 2
_`).toBe(null)

    await expectOutput(`
let _ = 1
_ = 2
_`).toBe(null)
  })

  it('should be able to be accessed without declaration', async () => {
    await expectOutput(`_`).toBe(null)
  })

  it('should error if no new line after variable declaration', async () => {
    await expectError('let a = 1 let')
  })
})

describe('desturcturing should work', () => {
  it('should destructure dictionary', async () => {
    await expectEnviroment(`let { a, b } = { a: 1, b: "World" }`).toHaveValue(
      'a',
      1
    )
    await expectEnviroment(`let { a, b } = { a: 1, b: "World" }`).toHaveValue(
      'b',
      'World'
    )
    await expectEnviroment(`let { a } = { a: 1, b: "World" }`).toHaveValue(
      'a',
      1
    )
    await expectError(`let { a } = { a: 1, b: "World" } \n b`)
  })

  it('should be able rename dictionary destructuring', async () => {
    await expectEnviroment(`let { a:c, b } = { a: 1, b: "World" }`).toHaveValue(
      'c',
      1
    )
    await expectEnviroment(`let { a, b:c } = { a: 1, b: "World" }`).toHaveValue(
      'c',
      'World'
    )
    await expectEnviroment(
      `let { a:b, b:c } = { a: 1, b: "World" }`
    ).toHaveValue('c', 'World')
    await expectEnviroment(
      `let { a:b, b:c } = { a: 1, b: "World" }`
    ).toHaveValue('b', 1)
  })

  it('should destructure dictionary with missing key', async () => {
    await expectEnviroment(`let { a, b } = { b: 1 }`).toHaveValue('a', null)
    await expectEnviroment(`let { c } = { b: "World" }`).toHaveValue('c', null)
    await expectEnviroment(`let { c } = { }`).toHaveValue('c', null)
  })

  it('should destructure list', async () => {
    await expectEnviroment(`let [a, b] = [ 1, "World"]`).toHaveValue('a', 1)
    await expectEnviroment(`let [a, b] = [ 1, "World"]`).toHaveValue(
      'b',
      'World'
    )
    await expectEnviroment(`let [ a ] = [ 1, "World" ]`).toHaveValue('a', 1)
    await expectError(`let [ a ] = [ 1, "World" ] \n b`)
  })

  it('should destructure list with missing values', async () => {
    await expectEnviroment(`let [a, b] = []`).toHaveValue('a', null)
    await expectEnviroment(`let [a, b] = []`).toHaveValue('b', null)
    await expectEnviroment(`let [ a, b, c ] = [ 1, "World" ]`).toHaveValue(
      'c',
      null
    )
  })

  it('should not destructure list into dictionary', async () => {
    await expectError(`let { a, b } = [ 1, "World" ]`)
  })

  it('should error if same name defined multiple times', async () => {
    await expectError(`let [a, a] = [ 1, "World" ]`)
    await expectError(`let { a, b: a } = { a: 1, b: "World" }`)
  })

  it('should not destructure dictionary into list', async () => {
    await expectError(`let [ a, b ] = { a: 1, b: "World" }`)
  })

  it('should not allow repetition of variable name in destructuring', async () => {
    await expectError(`let [ a, b ] = { a: 1, b: "World" }`)
  })
})

it('should not allow declaration to non identifier', async () => {
  await expectError('let < = 6')
})
