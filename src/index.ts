import { getTokens } from './tokens'
import { getAbstractSyntaxTree } from './Parser'
import { interpret, Interpreter } from './Interpreter'
import BangError from './BangError'

export const execute = (source: string, interpreter?: Interpreter) => {
  const tokens = getTokens(source)
  const abstractSyntaxTree = getAbstractSyntaxTree(tokens, source)

  if (interpreter) return interpreter.run(abstractSyntaxTree)
  else return interpret(abstractSyntaxTree)
}

export { getTokens, getAbstractSyntaxTree, interpret, Interpreter, BangError }
