#!/usr/bin/env node

const cac = require('cac')
const repl = require('repl')
const fs = require('fs').promises
const { execute, Interpreter, BangError } = require('./dist')

const interpreter = new Interpreter()

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

const cli = cac('bang')
  .version(`v${require('./package.json').version}`)
  .help()

cli.command('', 'Open a REPL').action(async () => {
  console.log(`Bang (v${require('./package.json').version})`)
  console.log('For more information type ".help"\n')
  repl.start({ prompt: '> ', eval: evaluate })
})

cli.command('run <file>', 'Execute a Bang Program').action(async (file) => {
  try {
    const fileContents = await fs.readFile(file, { encoding: 'utf8' })
    execute(fileContents)
  } catch (error) {
    if (error instanceof BangError) error.output()
    else console.log(`Error: Problem Reading File "${file}"`)
  }
})

cli.parse()
