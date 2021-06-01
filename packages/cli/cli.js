import cac from 'cac'
import repl from 'repl'
import fs, { readFile } from 'fs/promises'
import { execute, Interpreter, BangError } from '@bang!/language'

const readJSON = async (filePath) =>
  JSON.parse(await readFile(new URL(filePath, import.meta.url)))

const interpreter = new Interpreter({
  fs,
  printFunction: console.log,
})

const evaluate = (cmd, _context, _filename, callback) => {
  try {
    const result = execute(cmd.trim(), interpreter)
    const resultValue = result?.[result.length - 1]?.getValue() ?? null

    if (resultValue !== null) callback(null, resultValue)
    else callback(null)
  } catch (error) {
    if (error instanceof BangError) {
      error.output()
      callback(null)
    } else throw error
  }
}

const packageJSON = await readJSON('./package.json')
const cli = cac('bang').version(`v${packageJSON.version}`).help()

cli.command('', 'Open a REPL').action(async () => {
  console.log(`Bang (v${packageJSON.version})`)
  console.log('For more information type ".help"\n')
  repl.start({ prompt: '> ', eval: evaluate })
})

cli.command('run <file>', 'Execute a Bang Program').action(async (file) => {
  try {
    const fileContents = await readFile(file, { encoding: 'utf8' })
    execute(fileContents, interpreter)
  } catch (error) {
    if (error instanceof BangError) error.output()
    else console.log(`Error: Problem Reading File "${file}"`)
  }
})

cli.parse()
