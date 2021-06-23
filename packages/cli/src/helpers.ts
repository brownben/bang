import fs, { readFile as fsReadFile } from 'fs/promises'
import fetch from 'node-fetch'
import chalk from 'chalk'
import { Interpreter, BangError } from '@bang!/language'

const toFixedWidth = (number: number, size: number) =>
  number.toString().padStart(size)

export const getErrorMessage = (error: BangError, source?: string) => {
  let message = ''
  message += chalk.redBright`{bold Error:} ${error.message}`

  if (source && error.line) {
    message += '\n'

    const start = error.line < 3 ? 0 : error.line - 3
    const end = error.line + 3
    const adjustedLine = error.line - start - 1
    const width = end.toString().length

    source
      .split('\n')
      .slice(start, end)
      .forEach((line, index) => {
        const partial = `${toFixedWidth(start + 1 + index, width)} ｜ ${line}`
        if (index === adjustedLine) message += `>  ${partial}\n`
        else message += `   ${partial}\n`
      })
  }

  return message
}

export const readFile = async (filePath: string) => {
  try {
    return await fsReadFile(filePath, { encoding: 'utf8' })
  } catch {
    console.log(
      getErrorMessage(new BangError(`Problem Reading File "${filePath}"`))
    )
    return undefined
  }
}

export const createInterpreter = () =>
  new Interpreter({
    fs,
    fetch: fetch as unknown as typeof globalThis.fetch,
    importer: async (path: string) => {
      if (path.includes('https://')) return (await fetch(path)).text()
      else return fs.readFile(path, { encoding: 'utf8' })
    },
    printFunction: console.log,
  })
