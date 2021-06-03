import { Interpreter, execute } from '../src'
import { expectEnviroment, expectOutput } from './helpers'

describe('try statements', () => {
  it('should get value if no error', async () => {
    await expectOutput('try (1 + 2)').toEqual([3, null])
    await expectOutput('try 1 + 2').toEqual([3, null])
    await expectEnviroment('let [value, error] = try fetch(77)').toHaveValue(
      'value',
      null
    )
    await expectEnviroment('let [value, error] = try fetch(77)').toHaveValue(
      'error',
      'Error: Unknown variable "fetch"'
    )
  })

  it('should get error if error occurs', async () => {
    await expectOutput('try (1 + "")').toEqual([
      null,
      'Error: No Operation "+" on type "number" and type "string"',
    ])
  })

  it('should not catch non bang errors', async () => {
    const interpreter = new Interpreter(
      {},
      {
        a: () => {
          throw new Error()
        },
      }
    )

    await expect(() => execute('try a()', interpreter)).rejects.toThrow()
  })
})

describe('error type', () => {
  it('should respect equality', async () => {
    await expectOutput(`let [value, error] = try 1 + ''\n error == error`).toBe(
      true
    )
    await expectOutput(
      `let [value, error] = try 1 + ''
       let [value1, error1] = try 1 + ''
       error1 != error`
    ).toBe(true)
  })

  it('should have builtin properties', async () => {
    expectOutput(`let [value, error] = try 1 + ''\n error.toBoolean()`).toBe(
      true
    )
    expectOutput(`let [value, error] = try 1 + ''\n error.toString()`).toBe(
      'Error: No Operation "+" on type "number" and type "string"'
    )
  })

  it('should be truthy', async () => {
    expectOutput(`let [value, error] = try 1 + ''\n error || 0`).toBe(
      'Error: No Operation "+" on type "number" and type "string"'
    )
  })
})
