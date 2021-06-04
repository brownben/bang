#!/usr/bin/env node

import cac from 'cac'
import repl from 'repl'
import chalk from 'chalk'
import fetch from 'node-fetch'
import fs, { readFile } from 'fs/promises'
import { execute, Interpreter, BangError } from '@bang!/language'

const readJSON = async (filePath) =>
  JSON.parse(await readFile(new URL(filePath, import.meta.url)))

const toFixedWidth = (number, size) => number.toString().padStart(size)

const outputError = (error, source) => {
  console.log(chalk.redBright`{bold Error:} ${error.message}\n`)

  if (source && error.line) {
    const start = error.line < 3 ? 0 : error.line - 3
    const end = error.line + 3
    const adjustedLine = error.line - start - 1
    const width = end.toString().length

    source
      .split('\n')
      .slice(start, end)
      .forEach((line, index) => {
        const message = `${toFixedWidth(start + 1 + index, width)} ｜ ${line}`
        if (index === adjustedLine) console.log(`>  ${message}`)
        else console.log(`   ${message}`)
      })
  }
}

const evaluate = async (cmd, _context, _filename, callback) => {
  try {
    const result = await execute(cmd.trim(), interpreter)
    const resultValue = result?.[result.length - 1]?.getValue() ?? null

    if (resultValue !== null) callback(null, resultValue)
    else callback(null)
  } catch (error) {
    if (error instanceof BangError) {
      outputError(error)
      callback(null)
    } else throw error
  }
}

const importer = async (path) => {
  if (path.includes('https://')) return (await fetch(path)).text()
  else return fs.readFile(path, { encoding: 'utf8' })
}

const interpreter = new Interpreter({
  fs,
  fetch,
  importer,
  printFunction: console.log,
})
const packageJSON = await readJSON('./package.json')
const cli = cac('bang').version(`v${packageJSON.version}`).help()

cli.command('', 'Open a REPL').action(async () => {
  console.log(`Bang (v${packageJSON.dependencies['@bang!/language']})`)
  console.log('For more information type ".help"\n')
  repl.start({ prompt: '> ', eval: evaluate })
})

cli.command('run <file>', 'Execute a Bang Program').action(async (file) => {
  try {
    const fileContents = await readFile(file, { encoding: 'utf8' })

    try {
      await execute(fileContents, interpreter)
    } catch (error) {
      if (error instanceof BangError) outputError(error, fileContents)
      else throw error
    }
  } catch {
    outputError(new BangError(`Problem Reading File "${file}"`))
  }
})

cli.parse()
