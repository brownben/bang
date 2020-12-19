import { Literal, LiteralFunction, LiteralNull } from '../literals'

export const print = new LiteralFunction('print', 1, (argument: Literal[]) => {
  console.log(argument[0].getValue())
  return new LiteralNull()
})
