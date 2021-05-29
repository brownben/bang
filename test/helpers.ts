import { Stmt } from '../src/statements'
import { Enviroment } from '../src/Enviroment'
import { ExternalIO } from '../src/library'
import { Interpreter } from '../src/Interpreter'
import { getTokens, getAbstractSyntaxTree, execute } from '../src/index'

import fs from 'fs'

const external: ExternalIO = {
  fs,
  printFunction: console.log,
}

export const interpretFinalEnviroment = (
  statements: Stmt[],
  externalIO: ExternalIO = external
): Enviroment => {
  const interpreter = new Interpreter(externalIO)
  interpreter.run(statements)
  return interpreter.getEnviroment()
}

const expectOutput = (source: string) => {
  const interpreter = new Interpreter(external)
  const output = execute(source, interpreter)

  return expect(output?.[output.length - 1]?.getValue() ?? null)
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
      expect(enviroment.get(name)?.getValue()).toEqual(value),
    not: {
      toHaveValue: (name: string) =>
        expect(enviroment.get(name)?.getValue()).toBe(undefined),
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

const expectError = (source: string) => {
  expect(() => executeWithInterpreter(source)).toThrow()
}

export {
  executeWithInterpreter as execute,
  expectOutput,
  expectEnviroment,
  expectError,
  ExternalIO,
}
