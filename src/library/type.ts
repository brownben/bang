import { Literal, LiteralFunction, LiteralString } from '../literals'

export const type = new LiteralFunction({
  name: 'type',
  arity: 1,
  call: (argument: Literal[]) => {
    return new LiteralString(argument[0].type)
  }
})
