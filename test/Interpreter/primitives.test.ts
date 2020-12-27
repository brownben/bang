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

  it('should have keys and values properties', () => {
    expectOutput(`{a:1, "hello":'world', other: false}.keys`).toEqual([
      'a',
      'hello',
      'other',
    ])
    expectOutput(`{a:1, "hello":'world', other: false}.values`).toEqual([
      1,
      'world',
      false,
    ])
  })
})

describe('list should work', () => {
  it('should parse empty list', () => {
    expectOutput('[]').toEqual([])
  })

  it('should parse a list with a range of values', () => {
    expectOutput('[1, false, null, "hello"]').toEqual([1, false, null, 'hello'])
  })

  it('should cope with a list with consecutive commas', () => {
    expectOutput('[,,]').toEqual([null, null])
  })

  it('should match equality between lists', () => {
    expectOutput('[1, false, null, "hello"] == [1, false, null, "hello"]').toBe(
      true
    )
    expectOutput(
      '[1, false, null, "hello", 2] == [1, false, null, "hello"]'
    ).toBe(false)
    expectOutput('[1, false, null, "hello", 2] == "hello"').toBe(false)
    expectOutput('[1, false, null, "hello"] != [1, false, null, "hello"]').toBe(
      false
    )
    expectOutput(
      '[1, false, null, "hello", 2] != [1, false, null, "hello"]'
    ).toBe(true)
    expectOutput('[1, false, null, "hello", 2] != "hello"').toBe(true)
  })

  it('should have lengths for lists', () => {
    expectOutput('[].length').toBe(0)
    expectOutput('[1].length').toBe(1)
    expectOutput('[1, false, null, "hello"].length').toBe(4)
  })

  it('should concatenate lists with +', () => {
    expectOutput('[] + [1]').toEqual([1])
    expectOutput('[1,2,3] + [4,5]').toEqual([1, 2, 3, 4, 5])
  })

  it('should append to lists with +', () => {
    expectOutput('[] + 1').toEqual([1])
    expectOutput('[1,2,3] + 4 + 5').toEqual([1, 2, 3, 4, 5])
    expectOutput('[1,2,3] + "hello"').toEqual([1, 2, 3, 'hello'])
  })

  it('should not append to immutable lists with +', () => {
    expectError('[].freeze() + 1')
    expectError('[1,2,3].freeze() + 4 + 5')
    expectError('[1,2,3].freeze() + "hello"')
  })

  it('should have indexOf method', () => {
    expectOutput('[1,2,3].indexOf(4)').toBe(null)
    expectOutput('[1,2,3].indexOf(2)').toBe(1)
  })

  it('should have findIndex method', () => {
    expectOutput('[1,2,3].findIndex((a)=>a==1)').toBe(0)
    expectOutput('[1,2,3].findIndex((a)=> a > 4)').toBe(null)
    expectError(`["a","b","c"].findIndex(1)`)
  })

  it('should have find method', () => {
    expectOutput('[1,2,3].find((a)=> a < 3)').toBe(1)
    expectOutput('[1,2,3].find((a)=> a > 4)').toBe(null)
    expectError(`["a","b","c"].find(1)`)
  })

  it('should have join method', () => {
    expectOutput(`[].join(',')`).toBe('')
    expectOutput(`[1,2,3].join(',')`).toBe('1,2,3')
    expectOutput(`["a","b","c"].join(' and ')`).toBe('a and b and c')
    expectError(`["a","b","c"].join(1)`)
  })

  it('should have map function', () => {
    expectOutput('[1,2,3].map((a)=> a * 2)').toEqual([2, 4, 6])
    expectOutput('[1,2,3].map((a)=> a + 2)').toEqual([3, 4, 5])
    expectError('[1,2,3].map(7)')
  })

  it('should have filter function', () => {
    expectOutput('[1,2,3].filter((a)=> a >= 0)').toEqual([1, 2, 3])
    expectOutput('[1,2,3].filter((a)=> a >= 2)').toEqual([2, 3])
    expectOutput('[1,2,3].filter((a)=> a >= 7)').toEqual([])
    expectError('[1,2,3].filter(7)')
  })

  it('should have foreach function', () => {
    expectOutput('[1,2,3].forEach((a)=> a >= 0)').toBe(null)
    expectOutput('[1,2,3].forEach((a)=> a >= 2)').toBe(null)
    expectOutput('[1,2,3].forEach((a)=> a >= 7)').toBe(null)
    expectError('[1,2,3].forEach(7)')
  })

  it('should have any function', () => {
    expectOutput('[1,2,3].any()').toBe(true)
    expectOutput('[].any()').toBe(false)
    expectOutput('[false, null].any()').toBe(false)
    expectOutput('[false, null, 1].any()').toBe(true)
  })

  it('should have every function', () => {
    expectOutput('[1,2,3].every()').toBe(true)
    expectOutput('[].every()').toBe(true)
    expectOutput('[false, null].every()').toBe(false)
    expectOutput('[false, null, 1].every()').toBe(false)
  })

  it('should have includes function', () => {
    expectOutput('[1,2,3].includes(1)').toBe(true)
    expectOutput('[1,2,3].includes(4)').toBe(false)
    expectOutput('[].includes(1)').toBe(false)
    expectOutput('[false, null].includes(true)').toBe(false)
    expectOutput('[false, null, 1].includes(null)').toBe(true)
  })

  it('should have reverse function', () => {
    expectOutput('[1,2,3].reverse()').toEqual([3, 2, 1])
    expectOutput('[].reverse()').toEqual([])
    expectOutput('[false, null].reverse()').toEqual([null, false])
    expectOutput('[false, null, 1].reverse()').toEqual([1, null, false])
  })

  it('should have push function', () => {
    expectOutput('[1,2,3].push(4)').toEqual([1, 2, 3, 4])
    expectOutput('[1,2,3].push("helo")').toEqual([1, 2, 3, 'helo'])
    expectError('[1,2,3].freeze().push(4)')
  })

  it('should have pop function', () => {
    expectOutput('[1,2,3].pop()').toBe(3)
    expectOutput('[1,2,3,4].pop()').toBe(4)
    expectOutput('[].pop()').toBe(null)
    expectError('[1,2,3].freeze().pop()')
  })

  it('should have unshift function', () => {
    expectOutput('[1,2,3].unshift(4)').toEqual([4, 1, 2, 3])
    expectOutput('[1,2,3].unshift("helo")').toEqual(['helo', 1, 2, 3])
    expectError('[1,2,3].freeze().unshift(4)')
  })

  it('should have shift function', () => {
    expectOutput('[1,2,3].shift()').toBe(1)
    expectOutput('[5,1,2,3,4].shift()').toBe(5)
    expectOutput('[].shift()').toBe(null)
    expectError('[1,2,3].freeze().shift()')
  })

  it('should have copy function', () => {
    expectOutput('[1,2,3].copy()').toEqual([1, 2, 3])
    expectOutput('[5,1,2,3,4].copy()').toEqual([5, 1, 2, 3, 4])
    expectOutput('[1,2,3].freeze().copy()').toEqual([1, 2, 3])
  })

  it('should get values by index', () => {
    expectOutput('[1,2,3][0]').toBe(1)
    expectOutput('[1,2,3][1]').toBe(2)
    expectOutput('[1,2,3][2]').toBe(3)
    expectError('[1,2,3][4]')
  })

  it('should get values by negative index', () => {
    expectOutput('[1,2,3][-3]').toBe(1)
    expectOutput('[1,2,3][-2]').toBe(2)
    expectOutput('[1,2,3][-1]').toBe(3)
    expectError('[1,2,3][-4]')
  })

  it('should get values by other types', () => {
    expectError('[1,2,3]["hello"]')
    expectError('[1,2,3][null]')
    expectError('[1,2,3][true]')
  })

  it('should assign values in a list', () => {
    expectOutput(`
let a = [1,2,3]
a[0] = "hello"
a`).toEqual(['hello', 2, 3])
    expectOutput(`
let a = [1,2,3]
a[1] = "hello"
a`).toEqual([1, 'hello', 3])
    expectOutput(`
let a = [1,2,3]
a[-1] = "hello"
a`).toEqual([1, 2, 'hello'])
    expectError(`
let a = [1,2,3]
a[4] = "hello"
a`)
    expectError(`
let a = [1,2,3]
a["hello"] = "hello"
a`)
    expectError(`
let a = [1,2,3]
a.hello = "hello"
a`)
  })

  it('should not assign values in an immutable list', () => {
    expectError(`
let a = [1,2,3].freeze()
a[0] = "hello"
a`)
  })

  it('should ave get method', () => {
    expectOutput('[1,2,3].get(1)').toBe(2)
    expectOutput('[1,2,3].get(5)').toBe(null)
  })
})
