import { expectError, expectOutput } from './helpers'

it('should throw error when calling function from builtin function with error', () => {
  expectError('[1].map((a) => a * "hello")')
})

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
    expectOutput(`['hello',1,null].toString()`).toBe('["hello",1,null]')
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
    expectOutput('[1].toBoolean()').toBe(true)
    expectOutput('[].toBoolean()').toBe(false)
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

  it('should get chars from string by index', () => {
    expectOutput(`'hello'[0]`).toBe('h')
    expectOutput(`'hello'[2]`).toBe('l')
    expectOutput(`'hello'[-1]`).toBe('o')
    expectOutput(`'hello'[-2]`).toBe('l')
    expectError('"hello"[false]')
    expectError('"hello"[70]')
  })

  it('should not set chars from string by index', () => {
    expectError(`'hello'[0] = 'error'`)
  })

  it('should get slice of strings', () => {
    expectOutput(`'hello'[:1]`).toBe('h')
    expectOutput(`'hello'[:2]`).toBe('he')
    expectOutput(`'hello'[:4]`).toBe('hell')
    expectOutput(`'hello'[1:]`).toBe('ello')
    expectOutput(`'hello'[2:]`).toBe('llo')
    expectOutput(`'hello'[4:]`).toBe('o')
    expectOutput(`'hello'[0:1]`).toBe('h')
    expectOutput(`'hello'[0:2]`).toBe('he')
    expectOutput(`'hello'[0:4]`).toBe('hell')
    expectOutput(`'hello'[0:-1]`).toBe('hell')
    expectOutput(`'hello'[-3:-1]`).toBe('ll')
    expectOutput(`'hello'[-9:-7]`).toBe('')
    expectOutput(`'hello'[0:0]`).toBe('')
    expectOutput(`'hello'[1:1]`).toBe('')
    expectOutput(`'hello'[7:9]`).toBe('')
    expectOutput(`'hello'[:]`).toBe('hello')
    expectError(`'hello'[]`)
  })

  it('should not slice numbers', () => {
    expectError(`122[:1]`)
    expectError(`122[:2]`)
    expectError(`122[:4]`)
    expectError(`122[1:]`)
  })

  it('should only let slice values be numbers', () => {
    expectError(`'hello'[false:1]`)
    expectError(`'hello'[22:null]`)
  })

  it('should error on assignment to slice', () => {
    expectError(`'hello'[1:] = 'i'`)
  })
})

describe('immutible primitive functions', () => {
  it('should have freeze methods on dictionaries', () => {
    expectOutput(`{}.isImmutable`).toBe(false)
    expectOutput(`{}.freeze().isImmutable`).toBe(true)
    expectOutput(`{}.freeze().unfreeze().isImmutable`).toBe(false)
  })

  it('should have freeze methods on lists', () => {
    expectOutput(`[].isImmutable`).toBe(false)
    expectOutput(`[].freeze().isImmutable`).toBe(true)
    expectOutput(`[].freeze().unfreeze().isImmutable`).toBe(false)
  })

  it('should not have freeze methods on other primitives', () => {
    expectError('123.isImmutable')
    expectError('123.freeze()')
  })
})
