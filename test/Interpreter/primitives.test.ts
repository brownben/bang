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
})

describe('string built-in functions', () => {
  it('should have length property on strings', () => {
    expectOutput('"a".length').toBe(1)
    expectOutput('`Hello World`.length').toBe(11)
    expectOutput(`'abc'.length`).toBe(3)
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

  it('should have reverse method', () => {
    expectOutput(`'hello'.reverse()`).toBe('olleh')
    expectOutput(`''.reverse()`).toBe('')
    expectOutput(`'Hello World'.reverse()`).toBe('dlroW olleH')
  })

  it('should have trim methods', () => {
    expectOutput(`'hello'.trim()`).toBe('hello')
    expectOutput(`'  hello   '.trim()`).toBe('hello')
    expectOutput(`' hello'.trim()`).toBe('hello')
    expectOutput(`'hello  '.trim()`).toBe('hello')

    expectOutput(`'hello'.trimStart()`).toBe('hello')
    expectOutput(`'  hello   '.trimStart()`).toBe('hello   ')
    expectOutput(`' hello'.trimStart()`).toBe('hello')
    expectOutput(`'hello  '.trimStart()`).toBe('hello  ')

    expectOutput(`'hello'.trimEnd()`).toBe('hello')
    expectOutput(`'  hello   '.trimEnd()`).toBe('  hello')
    expectOutput(`' hello'.trimEnd()`).toBe(' hello')
    expectOutput(`'hello  '.trimEnd()`).toBe('hello')
  })

  it('should have replace methods', () => {
    expectOutput(`'hello'.replace('l', '-')`).toBe('he--o')
    expectOutput(`'hello'.replace('ll', '11')`).toBe('he11o')
    expectOutput(`'hello'.replaceOne('l', '-')`).toBe('he-lo')
    expectOutput(`'hello'.replaceOne('ll', '11')`).toBe('he11o')

    expectError(`'hello'.replace('ll', 11)`)
    expectError(`'hello'.replace(11, '11')`)
    expectError(`'hello'.replaceOne('ll', 11)`)
    expectError(`'hello'.replaceOne(11, '11')`)
  })

  it('should have split method', () => {
    expectError(`'hello hello'.split()`)
    expectError(`'hello hello'.split(1)`)
    expectOutput(`'hello hello'.split('l')`).toEqual([
      'he',
      '',
      'o he',
      '',
      'o',
    ])
    expectOutput(`'hello'.split('e')`).toEqual(['h', 'llo'])
  })

  it('should have includes method', () => {
    expectOutput(`'hello'.includes('hell')`).toBe(true)
    expectOutput(`'hello'.includes('helloo')`).toBe(false)
    expectOutput(`'hello hello'.includes(1)`).toBe(false)
  })
})

describe('immutible primitive functions', () => {
  it('should have freeze methods on dictionaries', () => {
    expectOutput(`{}.isImmutable`).toBe(false)
    expectOutput(`{}.freeze().isImmutable`).toBe(true)
    expectOutput(`{}.freeze().unfreeze().isImmutable`).toBe(false)

    expectError('123.isImmutable')
    expectError('123.freeze()')
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

  it('should set properties on dictionaries', () => {
    expectOutput(`
let a = {}
a.hello = 'world'
a.hello`).toBe('world')
    expectOutput(`
let a = {}
a['hello'] = 'world'
a.hello`).toBe('world')
    expectError(`
let a = {}
a[77] = 'world'`)
  })

  it('should throw error when setting properties on immutable dictionaries', () => {
    expectError(`
let a = {}.freeze()
a.hello = 'world'
a.hello`)
    expectError(`
let a = {}.freeze()
a['hello'] = 'world'
a.hello`)
    expectError(`
let a = {d:1}
let b = {c:4, a}.freeze()
b.a = 11`)
  })

  it('should be able to use assignment operators to update properties', () => {
    expectOutput(`
let a = {hello:'hello'}
a.hello += 'world'
a.hello`)
    expectOutput(`
let a = {key:77}
a['key'] /= 7
a.key`).toBe(11)
  })

  it('should not set properties on other primitives', () => {
    expectError('123.property = 1')
    expectError('null.property = "hello"')
    expectError('null.toString = "hello"')
    expectError('false["22"] = true')
  })
})
