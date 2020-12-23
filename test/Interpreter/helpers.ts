import { getAbstractSyntaxTree } from '../../src/Parser'
import { interpret, interpretFinalEnviroment } from '../../src/Interpreter'

export const expectOutput = (source: string) => {
  const code = source
  const output = interpret(getAbstractSyntaxTree(code))
  return expect(output?.[output.length - 1]?.getValue() ?? null)
}

export const expectEnviroment = (source: string) => {
  const code = source
  const enviroment = interpretFinalEnviroment(getAbstractSyntaxTree(code))

  return {
    toHaveValue: (name: string, value: any) =>
      expect(enviroment.get(name)?.getValue()).toBe(value),
    not: {
      toHaveValue: (name: string) =>
        expect(enviroment.get(name)?.getValue()).toBe(undefined),
    },
  }
}

export const expectError = (source: string) => {
  const code = source
  expect(() => interpret(getAbstractSyntaxTree(code))).toThrow()
}

export const execute = (code: string) => interpret(getAbstractSyntaxTree(code))
