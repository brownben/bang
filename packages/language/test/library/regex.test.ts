import { expectError, expectOutput } from '../helpers'

const expectOutputWithRegex = (string: string) =>
  expectOutput('import regex \n' + string)

it('should only be constructed with a string', async () => {
  await expectError('import regex\n regex(7)')
})

it('should create regex', async () => {
  await expectOutputWithRegex(`regex('[0-9]+').test('123')`).toBe(true)
  await expectOutputWithRegex(`regex('[0-9]+').test('aa')`).toBe(false)
})

it('should create regex with flag', async () => {
  await expectOutputWithRegex(`regex('hello').test('HELLO')`).toBe(false)
  await expectOutputWithRegex(`regex('HellO', 'i').test('HELLO')`).toBe(true)
})

it('should accept string for test', async () => {
  await expectError(`import regex\n regex('').test(7)`)
})

it('should work with multiple regex', async () => {
  await expectOutputWithRegex(`let a = regex('hello')
let b = regex('5+')
[a.test('hello world'), a.test('55'), b.test('hello world'), b.test('55')]`).toEqual(
    [true, false, false, true]
  )
})

it('should not be equal to another regex', async () => {
  await expectOutputWithRegex('regex("a") == regex("b")').toBe(false)
  await expectOutputWithRegex('regex("a") != regex("b")').toBe(true)
})
