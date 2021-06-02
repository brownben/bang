import { expectError, expectOutput } from './helpers'

it('should throw error when calling function from builtin function with error', async () => {
  await expectError('[1].map((a) => a * "hello")')
})

describe('literals should return values', () => {
  it('should handle numbers', async () => {
    await expectOutput('.1').toBe(0.1)
    await expectOutput('1').toBe(1)
    await expectOutput('758.23').toBe(758.23)
  })

  it('should handle numbers (with digit separators)', async () => {
    await expectOutput('.1').toBe(0.1)
    await expectOutput('1_1').toBe(11)
    await expectOutput('1__1').toBe(11)
    await expectOutput('222_758.232').toBe(222758.232)
    await expectOutput('12_222_758').toBe(12222758)
  })

  it('should handle booleans', async () => {
    await expectOutput('false').toBe(false)
    await expectOutput('true').toBe(true)
  })

  it('should handle strings', async () => {
    await expectOutput('"false"').toBe('false')
    await expectOutput('`true`').toBe('true')
  })

  it('should handle null', async () => {
    await expectOutput('null').toBe(null)
  })
})

describe('built in properties on primitives', () => {
  it('should have toString methods', async () => {
    await expectOutput(`123.toString()`).toBe('123')
    await expectOutput(`123.12.toString()`).toBe('123.12')
    await expectOutput('true.toString()').toBe('true')
    await expectOutput('false.toString()').toBe('false')
    await expectOutput('null.toString()').toBe('null')
    await expectOutput(`false.toString`).toBe('<function toString>')
    await expectOutput('print.toString()').toBe('<function print>')
    await expectOutput('34.toString').toBe('<function toString>')
    await expectOutput(`'hello'.toString()`).toBe('hello')
    await expectOutput(`['hello',1,null].toString()`).toBe('["hello",1,null]')
    await expectOutput('{hello:{world:"hi"}}.toString()').toBe(
      JSON.stringify({ hello: { world: 'hi' } })
    )
  })

  it('should have toNumber methods', async () => {
    await expectOutput(`'123'.toNumber()`).toBe(123)
    await expectOutput(`'123.12'.toNumber()`).toBe(123.12)
    await expectOutput(`123.toNumber()`).toBe(123)
    await expectOutput(`123.12.toNumber()`).toBe(123.12)
    await expectOutput('true.toNumber()').toBe(1)
    await expectOutput('false.toNumber()').toBe(0)
    await expectOutput('null.toNumber()').toBe(0)
    await expectError(`'hello'.toNumber()`)
    await expectError('print.toNumber()')
    await expectError('{}.toNumber()')
  })

  it('should have toBoolean methods', async () => {
    await expectOutput(`'hello'.toBoolean()`).toBe(true)
    await expectOutput(`'false'.toBoolean()`).toBe(true)
    await expectOutput(`''.toBoolean()`).toBe(false)
    await expectOutput(`123.toBoolean()`).toBe(true)
    await expectOutput(`0.toBoolean()`).toBe(false)
    await expectOutput('print.toBoolean()').toBe(true)
    await expectOutput('null.toBoolean()').toBe(false)
    await expectOutput('true.toBoolean()').toBe(true)
    await expectOutput('false.toBoolean()').toBe(false)
    await expectOutput('{}.toBoolean()').toBe(true)
    await expectOutput('{hello:false}.toBoolean()').toBe(true)
    await expectOutput('[1].toBoolean()').toBe(true)
    await expectOutput('[].toBoolean()').toBe(false)
  })
})

describe('string built-in functions', () => {
  it('should have length property on strings', async () => {
    await expectOutput('"a".length').toBe(1)
    await expectOutput('`Hello World`.length').toBe(11)
    await expectOutput(`'abc'.length`).toBe(3)
  })

  it('should have case changing methods on strings', async () => {
    await expectOutput(`'hello'.toUppercase()`).toBe('HELLO')
    await expectOutput(`'Hello'.toUppercase()`).toBe('HELLO')
    await expectOutput(`'hElLo'.toUppercase()`).toBe('HELLO')
    await expectOutput(`'HELLO'.toUppercase()`).toBe('HELLO')

    await expectOutput(`'hello'.toLowercase()`).toBe('hello')
    await expectOutput(`'Hello'.toLowercase()`).toBe('hello')
    await expectOutput(`'hElLo'.toLowercase()`).toBe('hello')
    await expectOutput(`'HELLO'.toLowercase()`).toBe('hello')

    await expectError('123.toLowercase()')
  })

  it('should have reverse method', async () => {
    await expectOutput(`'hello'.reverse()`).toBe('olleh')
    await expectOutput(`''.reverse()`).toBe('')
    await expectOutput(`'Hello World'.reverse()`).toBe('dlroW olleH')
  })

  it('should have trim methods', async () => {
    await expectOutput(`'hello'.trim()`).toBe('hello')
    await expectOutput(`'  hello   '.trim()`).toBe('hello')
    await expectOutput(`' hello'.trim()`).toBe('hello')
    await expectOutput(`'hello  '.trim()`).toBe('hello')

    await expectOutput(`'hello'.trimStart()`).toBe('hello')
    await expectOutput(`'  hello   '.trimStart()`).toBe('hello   ')
    await expectOutput(`' hello'.trimStart()`).toBe('hello')
    await expectOutput(`'hello  '.trimStart()`).toBe('hello  ')

    await expectOutput(`'hello'.trimEnd()`).toBe('hello')
    await expectOutput(`'  hello   '.trimEnd()`).toBe('  hello')
    await expectOutput(`' hello'.trimEnd()`).toBe(' hello')
    await expectOutput(`'hello  '.trimEnd()`).toBe('hello')
  })

  it('should have replace methods', async () => {
    await expectOutput(`'hello'.replace('l', '-')`).toBe('he--o')
    await expectOutput(`'hello'.replace('ll', '11')`).toBe('he11o')
    await expectOutput(`'hello'.replaceOne('l', '-')`).toBe('he-lo')
    await expectOutput(`'hello'.replaceOne('ll', '11')`).toBe('he11o')

    await expectError(`'hello'.replace('ll', 11)`)
    await expectError(`'hello'.replace(11, '11')`)
    await expectError(`'hello'.replaceOne('ll', 11)`)
    await expectError(`'hello'.replaceOne(11, '11')`)
  })

  it('should have split method', async () => {
    await expectError(`'hello hello'.split()`)
    await expectError(`'hello hello'.split(1)`)
    await expectOutput(`'hello hello'.split('l')`).toEqual([
      'he',
      '',
      'o he',
      '',
      'o',
    ])
    await expectOutput(`'hello'.split('e')`).toEqual(['h', 'llo'])
  })

  it('should have includes method', async () => {
    await expectOutput(`'hello'.includes('hell')`).toBe(true)
    await expectOutput(`'hello'.includes('helloo')`).toBe(false)
    await expectOutput(`'hello hello'.includes(1)`).toBe(false)
  })

  it('should get chars from string by index', async () => {
    await expectOutput(`'hello'[0]`).toBe('h')
    await expectOutput(`'hello'[2]`).toBe('l')
    await expectOutput(`'hello'[-1]`).toBe('o')
    await expectOutput(`'hello'[-2]`).toBe('l')
    await expectError('"hello"[false]')
    await expectError('"hello"[70]')
  })

  it('should not set chars from string by index', async () => {
    await expectError(`'hello'[0] = 'error'`)
  })

  it('should get slice of strings', async () => {
    await expectOutput(`'hello'[:1]`).toBe('h')
    await expectOutput(`'hello'[:2]`).toBe('he')
    await expectOutput(`'hello'[:4]`).toBe('hell')
    await expectOutput(`'hello'[1:]`).toBe('ello')
    await expectOutput(`'hello'[2:]`).toBe('llo')
    await expectOutput(`'hello'[4:]`).toBe('o')
    await expectOutput(`'hello'[0:1]`).toBe('h')
    await expectOutput(`'hello'[0:2]`).toBe('he')
    await expectOutput(`'hello'[0:4]`).toBe('hell')
    await expectOutput(`'hello'[0:-1]`).toBe('hell')
    await expectOutput(`'hello'[-3:-1]`).toBe('ll')
    await expectOutput(`'hello'[-9:-7]`).toBe('')
    await expectOutput(`'hello'[0:0]`).toBe('')
    await expectOutput(`'hello'[1:1]`).toBe('')
    await expectOutput(`'hello'[7:9]`).toBe('')
    await expectOutput(`'hello'[:]`).toBe('hello')
    await expectError(`'hello'[]`)
  })

  it('should not slice numbers', async () => {
    await expectError(`122[:1]`)
    await expectError(`122[:2]`)
    await expectError(`122[:4]`)
    await expectError(`122[1:]`)
  })

  it('should only let slice values be numbers', async () => {
    await expectError(`'hello'[false:1]`)
    await expectError(`'hello'[22:null]`)
  })

  it('should error on assignment to slice', async () => {
    await expectError(`'hello'[1:] = 'i'`)
  })
})

describe('immutible primitive functions', () => {
  it('should have freeze methods on dictionaries', async () => {
    await expectOutput(`{}.isImmutable`).toBe(false)
    await expectOutput(`{}.freeze().isImmutable`).toBe(true)
    await expectOutput(`{}.freeze().unfreeze().isImmutable`).toBe(false)
  })

  it('should have freeze methods on lists', async () => {
    await expectOutput(`[].isImmutable`).toBe(false)
    await expectOutput(`[].freeze().isImmutable`).toBe(true)
    await expectOutput(`[].freeze().unfreeze().isImmutable`).toBe(false)
  })

  it('should not have freeze methods on other primitives', async () => {
    await expectError('123.isImmutable')
    await expectError('123.freeze()')
  })
})
