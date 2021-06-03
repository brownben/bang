import { expectEnviroment, expectError, expectOutput } from './helpers'

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

it('should work with spread parameters', async () => {
  await expectOutput(`let a = (a, b, c) => a + b + c
a(...[1,3,4])`).toBe(8)
  await expectOutput(`let a = (a, b, c) => a + b + c
a(...[1,3], 4)`).toBe(8)
  await expectOutput(`let a = (a, b, c) => a + b + c
a(5,...[1, 7])`).toBe(13)
  await expectError(`let a = (a, b, c) => a + b + c
a(5,...[1, 7,2])`)
})

it('should work with spread arguments', async () => {
  await expectOutput(`let a = (a, ...b) => b
a(1,3,4)`).toEqual([3, 4])
  await expectError(`let a = (...a, b, c) => a`)
  await expectOutput(`let a = (...a) => a
a(1,4,5)`).toEqual([1, 4, 5])
})

it('should have minimum of positional arguments with spread', async () => {
  await expectError(`let a = (a,c, ...b) => b
a(1)`)
})

it('should only have 1 spread in function definition', async () => {
  await expectError(`let a = (a,...c, ...b) => b`)
})

it('should only have spread as last argument', async () => {
  await expectError(`let a = (a,...c, b) => b`)
})

it('should not spread dictionary in parameters', async () => {
  await expectError('let a = (a,b) => b \n a(1, ...{b:3})')
})

it('should assign remaining elements in a list', async () => {
  await expectEnviroment('let [a, ...b] = [1, 2, 3]').toHaveValue('a', 1)
  await expectEnviroment('let [a, ...b] = [1, 2, 3]').toHaveValue('b', [2, 3])
})

it('should only accept spread as last parameter', async () => {
  await expectError('let [...a, b] = [1,2,3]')
})
it('should only accept one spread', async () => {
  await expectError('let [...a, ...b] = [1,2,3]')
})

it('should combine 2 lists', async () => {
  const enviroment = await expectEnviroment(`
let a = [1, 2, 3]
let b = [...a]
let c = [0, ...a]
let d = [...a, 4]
let e = [0, ...a, 4]`)
  enviroment.toHaveValue('a', [1, 2, 3])
  enviroment.toHaveValue('b', [1, 2, 3])
  enviroment.toHaveValue('c', [0, 1, 2, 3])
  enviroment.toHaveValue('d', [1, 2, 3, 4])
  enviroment.toHaveValue('e', [0, 1, 2, 3, 4])
})

it('should combine multiple lists', async () => {
  const enviroment = await expectEnviroment(`
let a = [1, 2, 3]
let b = [4,5]
let c = [...a, ...b]
let d = [...b, ...a]
let e = [...b, 1, ...a]`)
  enviroment.toHaveValue('a', [1, 2, 3])
  enviroment.toHaveValue('b', [4, 5])
  enviroment.toHaveValue('c', [1, 2, 3, 4, 5])
  enviroment.toHaveValue('d', [4, 5, 1, 2, 3])
  enviroment.toHaveValue('e', [4, 5, 1, 1, 2, 3])
})

it('should not spread other objects', async () => {
  await expectError('[1,2,...4]')
  await expectError('[1,2,...{a:2}]')
})
