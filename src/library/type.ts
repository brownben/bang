import { Literal, LiteralFunction, LiteralString } from '../literals'

export const type = new LiteralFunction('type', 1, (argument: Literal[]) => {
  return new LiteralString(argument[0].type)
})
