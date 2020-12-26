import { expectError, expectOutput } from './helpers'

describe('literals should return values', () => {
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
    expectOutput('{hello:{world:"hi"}}.toString()').toBe(
      JSON.stringify({ hello: { world: 'hi' } })
    )
  })

  it('should have toNumber methods', () => {
    expectOutput(`'123'.toNumber()`).toBe(123)
    expectOutput(`'123.12'.toNumber()`).toBe(123.12)
    expectOutput(`123.toNumber()`).toBe(123)
    expectOutput(`123.12.toNumber()`).toBe(123.12)
    expectOutput('true.toNumber()').toBe(1)
    expectOutput('false.toNumber()').toBe(0)
    expectOutput('null.toNumber()').toBe(0)
    expectError(`'hello'.toNumber()`)
    expectError('print.toNumber()')
    expectError('{}.toNumber()')
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
    expectOutput('{}.toBoolean()').toBe(true)
    expectOutput('{hello:false}.toBoolean()').toBe(true)
  })

  it('should have case changing methods on strings', () => {
    expectOutput(`'hello'.toUppercase()`).toBe('HELLO')
    expectOutput(`'Hello'.toUppercase()`).toBe('HELLO')
    expectOutput(`'hElLo'.toUppercase()`).toBe('HELLO')
    expectOutput(`'HELLO'.toUppercase()`).toBe('HELLO')

    expectOutput(`'hello'.toLowercase()`).toBe('hello')
    expectOutput(`'Hello'.toLowercase()`).toBe('hello')
    expectOutput(`'hElLo'.toLowercase()`).toBe('hello')
    expectOutput(`'HELLO'.toLowercase()`).toBe('hello')

    expectError('123.toLowercase()')
  })
})

describe('dictionaries can be used', () => {
  it('should create dictionaries with identifier keys', () => {
    expectOutput(`{hello:'world'}`).toEqual({ hello: 'world' })
    expectOutput(`
    {
      hello:'world',
      does: 'this work',
      well: 77,
    }`).toEqual({ hello: 'world', does: 'this work', well: 77 })
    expectOutput(`{bang: 'is an awesome', language:true}`).toEqual({
      bang: 'is an awesome',
      language: true,
    })
  })

  it('should create dictionaries with string keys', () => {
    expectOutput(`{"hello":'world',}`).toEqual({ hello: 'world' })
    expectOutput(`{'hello':'world', does: 'this work', "well": 77}`).toEqual({
      hello: 'world',
      does: 'this work',
      well: 77,
    })
    expectOutput(`
    {
      'hello':'world',
      does: 'this work',
      "well": 77
    }`).toEqual({ hello: 'world', does: 'this work', well: 77 })
    expectOutput(`{'bang': 'is an awesome', 'language':true}`).toEqual({
      bang: 'is an awesome',
      language: true,
    })
  })

  it('should work with nested dictionaries', () => {
    expectOutput('{hello:{world:"hi"}}').toEqual({ hello: { world: 'hi' } })
  })

  it('should get values from dot notation', () => {
    expectOutput(`{'bang': 'is an awesome', 'language':true}.bang`).toBe(
      'is an awesome'
    )
    expectOutput(`{'bang': 'is an awesome', 'language':true}.language`).toBe(
      true
    )
    expectOutput('{hello:{world:"hi"}}.hello.world').toBe('hi')
  })

  it('should get values from get method', () => {
    expectOutput(`{'bang': 'is an awesome', 'language':true}.get('bang')`).toBe(
      'is an awesome'
    )
    expectOutput(
      `{'bang': 'is an awesome', 'language':true}.get('language')`
    ).toBe(true)
    expectOutput(
      `{'bang': 'is an awesome', 'language':true}.get('other')`
    ).toBe(null)
    expectOutput(`{'bang': 'is an awesome', 'language':true}.get(11)`).toBe(
      null
    )
    expectOutput(`{'bang': 'is an awesome', 'language':true}.get(null)`).toBe(
      null
    )
  })

  it('should be equal if they have the same properties', () => {
    expectOutput('{a:1,b:2,c:3} == {a:1,b:2,c:3}').toBe(true)
    expectOutput('{a:1,b:2,c:3} != {a:1,b:2,c:3,}').toBe(false)
    expectOutput('{a:1,b:2,c:3} == {}').toBe(false)
    expectOutput('{a:1,b:2,c:3} == {a:1,b:2}').toBe(false)
  })

  it('should expand variable identifiers if no colon', () => {
    expectOutput(`
let a = 0
let b = 'hello'
{a,b}`).toEqual({ a: 0, b: 'hello' })

    expectOutput(`
let a = 'world'
let b = 7
{a,b, c:false}`).toEqual({ a: 'world', b: 7, c: false })
  })

  it('should only allow strings as keys', () => {
    expectError('{true:1}')
    expectError('{1:1}')
    expectError('{null:1}')
  })

  it('should work with nested dictionaries', () => {
    expectOutput('{hello:{world:"hi"}}').toEqual({ hello: { world: 'hi' } })
  })

  it('should get values from square bracket expression notation', () => {
    expectOutput(`{'bang': 'is an awesome', 'language':true}['bang']`).toBe(
      'is an awesome'
    )
    expectOutput(
      `{'bang': 'is an awesome', 'language':true}['languag'+'e']`
    ).toBe(true)
    expectOutput(`{hello:{world:"hi"}}['hello'].world`).toBe('hi')
    expectOutput(`{hello:{world:"hi"}}['hello']['world']`).toBe('hi')
    expectOutput(`{hello:{world:"hi"}}.hello['world']`).toBe('hi')
    expectError(`{hello:'world'}['hi']`)
    expectError(`{hello:'world'}[false]`)
    expectError(`{hello:'world'}[123]`)
    expectError(`{hello:'world'}[null]`)
  })
})
