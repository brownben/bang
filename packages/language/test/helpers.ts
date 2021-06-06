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
  importer: async (path: string) => fs.readFile(path, { encoding: 'utf-8' }),
}

export const interpretFinalEnviroment = async (
  statements: Stmt[],
  externalIO: ExternalIO = external,
  foreignValues?: Record<string, unknown>
): Promise<Enviroment> => {
  const interpreter = new Interpreter(externalIO, foreignValues)
  await interpreter.run(statements)
  return interpreter.getEnviroment()
}

const expectOutput = (
  source: string,
  externalIO: ExternalIO = external,
  foreignValues?: Record<string, unknown>
) => {
  const interpreter = new Interpreter(externalIO, foreignValues)

  return expect(
    execute(source, interpreter).then(
      (output) => output?.[output.length - 1]?.getValue() ?? null
    )
  ).resolves
}

const expectEnviroment = (
  source: string,
  externalIO: ExternalIO = external,
  foreignValues?: Record<string, unknown>
) => {
  const tokens = getTokens(source)
  const abstractSyntaxTree = getAbstractSyntaxTree(tokens, source)
  const enviroment = interpretFinalEnviroment(
    abstractSyntaxTree,
    externalIO,
    foreignValues
  )

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
  externalIO: ExternalIO = external,
  foreignValues?: Record<string, unknown>
) => {
  const interpreter = new Interpreter(externalIO, foreignValues)
  return execute(source, interpreter)
}

const expectError = (
  source: string,
  externalIO: ExternalIO = external,
  foreignValues?: Record<string, unknown>
) =>
  expect(
    async () => await executeWithInterpreter(source, externalIO, foreignValues)
  ).rejects.toThrow()

export {
  executeWithInterpreter as execute,
  expectOutput,
  expectEnviroment,
  expectError,
  ExternalIO,
}
