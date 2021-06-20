import { execute, BangError } from '@bang!/language'
import { readFile, getErrorMessage, createInterpreter } from './helpers'

export const executeFile = async (filePath: string) => {
  const fileContents = await readFile(filePath)
  if (!fileContents) return

  try {
    const interpreter = createInterpreter()
    await execute(fileContents, interpreter)
  } catch (error) {
    if (error instanceof BangError)
      console.log(getErrorMessage(error, fileContents))
    else throw error
  }
}
