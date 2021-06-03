import { Stmt } from '../src/statements'
import { Enviroment } from '../src/Enviroment'
import { ExternalIO } from '../src/library'
import { Interpreter } from '../src/Interpreter'
import { getTokens, getAbstractSyntaxTree, execute } from '../src/index'

import fs from 'fs/promises'

export const mockFetch = (value: string) =>
  jest.fn().mockResolvedValue({
    status: 200,
    ok: true,
    headers: {},
    redirected: false,
    text: jest.fn().mockResolvedValue(value),
  })

const external: ExternalIO = {
  fs,
  printFunction: console.log,
  fetch: mockFetch('"test"'),
}

export const interpretFinalEnviroment = async (
  statements: Stmt[],
  externalIO: ExternalIO = external
): Promise<Enviroment> => {
  const interpreter = new Interpreter(externalIO)
  await interpreter.run(statements)
  return interpreter.getEnviroment()
}

const expectOutput = (source: string, externalIO: ExternalIO = external) => {
  const interpreter = new Interpreter(externalIO)

  return expect(
    execute(source, interpreter).then(
      (output) => output?.[output.length - 1]?.getValue() ?? null
    )
  ).resolves
}

const expectEnviroment = (
  source: string,
  externalIO: ExternalIO = external
) => {
  const tokens = getTokens(source)
  const abstractSyntaxTree = getAbstractSyntaxTree(tokens, source)
  const enviroment = interpretFinalEnviroment(abstractSyntaxTree, externalIO)

  return {
    toHaveValue: (name: string, value: any) =>
      expect(
        enviroment.then((enviroment) => enviroment.get(name)?.getValue())
      ).resolves.toEqual(value),

    not: {
      toHaveValue: (name: string) =>
        expect(
          enviroment.then((enviroment) => enviroment.get(name)?.getValue())
        ).resolves.toEqual(undefined),
    },
  }
}

const executeWithInterpreter = (
  source: string,
  externalIO: ExternalIO = external
) => {
  const interpreter = new Interpreter(externalIO)
  return execute(source, interpreter)
}

const expectError = (source: string, externalIO: ExternalIO = external) =>
  expect(
    async () => await executeWithInterpreter(source, externalIO)
  ).rejects.toThrow()

export {
  executeWithInterpreter as execute,
  expectOutput,
  expectEnviroment,
  expectError,
  ExternalIO,
}
