import { Interpreter } from '../src'
import { execute } from '../src/index'

it('should be able to add globals to interpreter', () => {
  const interpreter = new Interpreter({}, { test: 7 })
  const source = 'let a = test'

  execute(source, interpreter)
  expect(interpreter.getEnviroment().get('a').getValue()).toBe(7)
})

it('should be able to add foreign functions to interpreter', () => {
  const interpreter = new Interpreter(
    {},
    { add: (a: number, b: number) => a + b }
  )
  const source = 'let a = add(3, 15)'

  execute(source, interpreter)
  expect(interpreter.getEnviroment().get('a').getValue()).toBe(18)
})
