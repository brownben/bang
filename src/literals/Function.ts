import { LiteralBoolean } from './Boolean'
import { Literal } from './Literal'
import { Callable } from '../Callable'

export class LiteralFunction extends Literal implements Callable {
  token: undefined = undefined
  value: string = ''
  type = 'function'
  name: string
  arity: number
  call: (argument: Literal[]) => Literal

  constructor(
    name: string,
    arity: number,
    call: (argument: Literal[]) => Literal
  ) {
    super()
    this.name = name
    this.arity = arity
    this.call = call
  }

  getValue(): string {
    return `<function ${this.name}>`
  }

  isTruthy(): boolean {
    return true
  }

  equals(value: Literal): LiteralBoolean {
    return new LiteralBoolean(
      value instanceof LiteralFunction && this.call === value.call
    )
  }
  notEquals(value: Literal): LiteralBoolean {
    return new LiteralBoolean(
      !(value instanceof LiteralFunction) || this.call !== value.call
    )
  }
}
