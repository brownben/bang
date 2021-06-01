import { expectError, expectOutput } from './helpers'

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
  expectOutput(`{'bang': 'is an awesome', 'language':true}.language`).toBe(true)
  expectOutput('{hello:{world:"hi"}}.hello.world').toBe('hi')
})

it('should get values from get method', () => {
  expectOutput(`{'bang': 'is an awesome', 'language':true}.get('bang')`).toBe(
    'is an awesome'
  )
  expectOutput(
    `{'bang': 'is an awesome', 'language':true}.get('language')`
  ).toBe(true)
  expectOutput(`{'bang': 'is an awesome', 'language':true}.get('other')`).toBe(
    null
  )
  expectOutput(`{'bang': 'is an awesome', 'language':true}.get(11)`).toBe(null)
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

it('should error on missing colon', () => {
  expectError('{"hello"}')
})

it('should support expressions in keys', () => {
  expectOutput('{`a`+`b`:2}').toEqual({ ab: 2 })
  expectOutput('let a = `hello`\n{a+``:5}').toEqual({ hello: 5 })
})

it('should support spread of dictioanries', () => {
  expectOutput(`
let a = {a:1, b:2}
{c:3, ...a}`).toEqual({ a: 1, b: 2, c: 3 })
  expectOutput(`{c:3, ...{a:1, b: 2}}`).toEqual({ a: 1, b: 2, c: 3 })
  expectOutput(`{...{a:1, b:2}, c: 3}`).toEqual({ a: 1, b: 2, c: 3 })
  expectOutput(`{b:3, ...{a:1, b: 2}}`).toEqual({ a: 1, b: 2 })
  expectOutput(`{...{a:1, b:2}, b: 3}`).toEqual({ a: 1, b: 3 })
})

it('should support spread list into dictioanries', () => {
  expectError(`{c:3, ...[1,2]}`)
})

it('should unwrap variables', () => {
  expectOutput('let a = 2\n {a}').toEqual({ a: 2 })
})
