import { getTokens } from '@bang!/language'
import { readFile } from './helpers'

export const displayTokens = async (filePath: string) => {
  const fileContents = await readFile(filePath)
  if (!fileContents) return

  const tokens = getTokens(fileContents)

  console.table(
    tokens.map((token) => token),
    ['type', 'line', 'value']
  )
}
