import repl from 'repl'
import { execute, BangError, Interpreter } from '@bang!/language'
import { createInterpreter, getErrorMessage } from './helpers'
import { Context } from 'vm'

const evaluate =
  (interpreter: Interpreter) =>
  async (
    cmd: string,
    _context: Context,
    _filename: string,
    callback: (err: Error | null, result?: unknown) => void
  ) => {
    try {
      const result = await execute(cmd.trim(), interpreter)
      const resultValue = result?.[result.length - 1]?.getValue() ?? null

      if (resultValue !== null) callback(null, resultValue)
      else callback(null)
    } catch (error) {
      if (error instanceof BangError) {
        console.log(getErrorMessage(error))
        callback(null)
      } else throw error
    }
  }

export const createREPL = (version: string) => async () => {
  const interpreter = createInterpreter()

  console.log(`Bang (v${version})`)
  console.log('For more information type ".help"\n')
  repl.start({ prompt: '> ', eval: evaluate(interpreter) })
}
