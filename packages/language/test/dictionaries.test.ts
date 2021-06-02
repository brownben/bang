import { expectError, expectOutput } from './helpers'

it('should create dictionaries with identifier keys', async () => {
  await expectOutput(`{hello:'world'}`).toEqual({ hello: 'world' })
  await expectOutput(`
{
  hello:'world',
  does: 'this work',
  well: 77,
}`).toEqual({ hello: 'world', does: 'this work', well: 77 })
  await expectOutput(`{bang: 'is an awesome', language:true}`).toEqual({
    bang: 'is an awesome',
    language: true,
  })
})

it('should create dictionaries with string keys', async () => {
  await expectOutput(`{"hello":'world',}`).toEqual({ hello: 'world' })
  await expectOutput(
    `{'hello':'world', does: 'this work', "well": 77}`
  ).toEqual({
    hello: 'world',
    does: 'this work',
    well: 77,
  })
  await expectOutput(`
{
  'hello':'world',
  does: 'this work',
  "well": 77
}`).toEqual({ hello: 'world', does: 'this work', well: 77 })
  await expectOutput(`{'bang': 'is an awesome', 'language':true}`).toEqual({
    bang: 'is an awesome',
    language: true,
  })
})

it('should work with nested dictionaries', async () => {
  await expectOutput('{hello:{world:"hi"}}').toEqual({ hello: { world: 'hi' } })
})

it('should get values from dot notation', async () => {
  await expectOutput(`{'bang': 'is an awesome', 'language':true}.bang`).toBe(
    'is an awesome'
  )
  await expectOutput(
    `{'bang': 'is an awesome', 'language':true}.language`
  ).toBe(true)
  await expectOutput('{hello:{world:"hi"}}.hello.world').toBe('hi')
})

it('should get values from get method', async () => {
  await expectOutput(
    `{'bang': 'is an awesome', 'language':true}.get('bang')`
  ).toBe('is an awesome')
  await expectOutput(
    `{'bang': 'is an awesome', 'language':true}.get('language')`
  ).toBe(true)
  await expectOutput(
    `{'bang': 'is an awesome', 'language':true}.get('other')`
  ).toBe(null)
  await expectOutput(`{'bang': 'is an awesome', 'language':true}.get(11)`).toBe(
    null
  )
  await expectOutput(
    `{'bang': 'is an awesome', 'language':true}.get(null)`
  ).toBe(null)
})

it('should be equal if they have the same properties', async () => {
  await expectOutput('{a:1,b:2,c:3} == {a:1,b:2,c:3}').toBe(true)
  await expectOutput('{a:1,b:2,c:3} != {a:1,b:2,c:3,}').toBe(false)
  await expectOutput('{a:1,b:2,c:3} == {}').toBe(false)
  await expectOutput('{a:1,b:2,c:3} == {a:1,b:2}').toBe(false)
})

it('should expand variable identifiers if no colon', async () => {
  await expectOutput(`
let a = 0
let b = 'hello'
{a,b}`).toEqual({ a: 0, b: 'hello' })

  await expectOutput(`
let a = 'world'
let b = 7
{a,b, c:false}`).toEqual({ a: 'world', b: 7, c: false })
})

it('should only allow strings as keys', async () => {
  await expectError('{true:1}')
  await expectError('{1:1}')
  await expectError('{null:1}')
})

it('should work with nested dictionaries', async () => {
  await expectOutput('{hello:{world:"hi"}}').toEqual({ hello: { world: 'hi' } })
})

it('should get values from square bracket expression notation', async () => {
  await expectOutput(`{'bang': 'is an awesome', 'language':true}['bang']`).toBe(
    'is an awesome'
  )
  await expectOutput(
    `{'bang': 'is an awesome', 'language':true}['languag'+'e']`
  ).toBe(true)
  await expectOutput(`{hello:{world:"hi"}}['hello'].world`).toBe('hi')
  await expectOutput(`{hello:{world:"hi"}}['hello']['world']`).toBe('hi')
  await expectOutput(`{hello:{world:"hi"}}.hello['world']`).toBe('hi')
  await expectError(`{hello:'world'}['hi']`)
  await expectError(`{hello:'world'}[false]`)
  await expectError(`{hello:'world'}[123]`)
  await expectError(`{hello:'world'}[null]`)
})

it('should set properties on dictionaries', async () => {
  await expectOutput(`
let a = {}
a.hello = 'world'
a.hello`).toBe('world')
  await expectOutput(`
let a = {}
a['hello'] = 'world'
a.hello`).toBe('world')
  await expectError(`
let a = {}
a[77] = 'world'`)
})

it('should throw error when setting properties on immutable dictionaries', async () => {
  await expectError(`
let a = {}.freeze()
a.hello = 'world'
a.hello`)
  await expectError(`
let a = {}.freeze()
a['hello'] = 'world'
a.hello`)
  await expectError(`
let a = {d:1}
let b = {c:4, a}.freeze()
b.a = 11`)
})

it('should be able to use assignment operators to update properties', async () => {
  await expectOutput(`
let a = {hello:'hello'}
a.hello += 'world'
a.hello`)
  await expectOutput(`
let a = {key:77}
a['key'] /= 7
a.key`).toBe(11)
})

it('should not set properties on other primitives', async () => {
  await expectError('123.property = 1')
  await expectError('null.property = "hello"')
  await expectError('null.toString = "hello"')
  await expectError('false["22"] = true')
})

it('should have keys and values properties', async () => {
  await expectOutput(`{a:1, "hello":'world', other: false}.keys`).toEqual([
    'a',
    'hello',
    'other',
  ])
  await expectOutput(`{a:1, "hello":'world', other: false}.values`).toEqual([
    1,
    'world',
    false,
  ])
})

it('should error on missing colon', async () => {
  await expectError('{"hello"}')
})

it('should support expressions in keys', async () => {
  await expectOutput('{`a`+`b`:2}').toEqual({ ab: 2 })
  await expectOutput('let a = `hello`\n{a+``:5}').toEqual({ hello: 5 })
})

it('should support spread of dictioanries', async () => {
  await expectOutput(`
let a = {a:1, b:2}
{c:3, ...a}`).toEqual({ a: 1, b: 2, c: 3 })
  await expectOutput(`{c:3, ...{a:1, b: 2}}`).toEqual({ a: 1, b: 2, c: 3 })
  await expectOutput(`{...{a:1, b:2}, c: 3}`).toEqual({ a: 1, b: 2, c: 3 })
  await expectOutput(`{b:3, ...{a:1, b: 2}}`).toEqual({ a: 1, b: 2 })
  await expectOutput(`{...{a:1, b:2}, b: 3}`).toEqual({ a: 1, b: 3 })
})

it('should support spread list into dictioanries', async () => {
  await expectError(`{c:3, ...[1,2]}`)
})

it('should unwrap variables', async () => {
  await expectOutput('let a = 2\n {a}').toEqual({ a: 2 })
})
