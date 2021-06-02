import { Interpreter } from '../src'
import { execute } from '../src/index'

it('should be able to add globals to interpreter', async () => {
  const interpreter = new Interpreter({}, { test: 7 })
  const source = 'let a = test'

  await execute(source, interpreter)
  expect(interpreter.getEnviroment().get('a').getValue()).toBe(7)
})

it('should be able to add foreign functions to interpreter', async () => {
  const interpreter = new Interpreter(
    {},
    { add: (a: number, b: number) => a + b }
  )
  const source = 'let a = add(3, 15)'

  await execute(source, interpreter)
  expect(interpreter.getEnviroment().get('a').getValue()).toBe(18)
})
