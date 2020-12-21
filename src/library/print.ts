import { Literal, LiteralFunction, LiteralNull } from '../literals'

export const print = new LiteralFunction({
  name: 'print',
  arity: 1,
  call: (argument: Literal[]) => {
    console.log(argument[0].getValue())
    return new LiteralNull()
  }
})
