import { getTokens, getAbstractSyntaxTree, execute } from '../../src/index'
import { interpretFinalEnviroment } from '../../src/Interpreter'

const expectOutput = (source: string) => {
  const output = execute(source)

  return expect(output?.[output.length - 1]?.getValue() ?? null)
}

const expectEnviroment = (source: string) => {
  const tokens = getTokens(source)
  const abstractSyntaxTree = getAbstractSyntaxTree(tokens, source)
  const enviroment = interpretFinalEnviroment(abstractSyntaxTree)

  return {
    toHaveValue: (name: string, value: any) =>
      expect(enviroment.get(name)?.getValue()).toBe(value),
    not: {
      toHaveValue: (name: string) =>
        expect(enviroment.get(name)?.getValue()).toBe(undefined),
    },
  }
}

const expectError = (source: string) => {
  expect(() => execute(source)).toThrow()
}

export { execute, expectOutput, expectEnviroment, expectError }
