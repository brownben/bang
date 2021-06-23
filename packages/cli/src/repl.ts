import repl from 'repl'
import type { Context } from 'vm'
import { execute, BangError, Interpreter } from '@bang!/language'
import { createInterpreter, getErrorMessage } from './helpers'

const evaluate = (interpreter: Interpreter) => {
  return async (
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
}

const helpCommand = (replServer: repl.REPLServer) => {
  console.log(
    `
.break    Sometimes you get stuck, this gets you out
.clear    Break, and also clear the local context
.editor   Enter editor mode
.exit     Exit the REPL
.help     Print this help message
.load     Load a .bang file into the REPL session
.save     Save all evaluated commands in this REPL session to a file

Press Ctrl+C to abort current expression, Ctrl+D to exit the REPL`
  )
  replServer.displayPrompt()
}

export const createREPL = (version: string) => async () => {
  const interpreter = createInterpreter()

  const completer = (line: string) => {
    const enviroment = interpreter.getEnviroment()
    const variableNames = enviroment.getNamesOfLocalVariables()

    const editorCommands = [
      '.break',
      '.clear ',
      '.editor ',
      '.exit ',
      '.help ',
      '.load ',
      '.save',
    ]
    const keywords = [
      'if',
      'else',
      'while',
      'let',
      'const',
      'return',
      'import',
      'as',
      'from',
      'try',
    ]
    const completions = [...editorCommands, ...keywords, ...variableNames]

    const hits = completions.filter((c) => c.startsWith(line))

    return [hits || [], line]
  }

  console.log(`Bang (v${version})`)
  console.log('For more information type ".help"\n')

  const replServer = repl.start({
    prompt: '> ',
    eval: evaluate(interpreter),
    completer,
  })

  // redefine the help command, replacing reference to JS
  replServer.defineCommand('help', () => helpCommand(replServer))
}
