import { getTokens } from './tokens'
import { getAbstractSyntaxTree } from './Parser'
import { Interpreter } from './Interpreter'
import BangError from './BangError'

export const execute = async (source: string, interpreter: Interpreter) => {
  const tokens = getTokens(source)
  const abstractSyntaxTree = getAbstractSyntaxTree(tokens, source)

  return await interpreter.run(abstractSyntaxTree)
}

export { getTokens, getAbstractSyntaxTree, Interpreter, BangError }
