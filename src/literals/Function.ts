import { Literal } from './Literal'
import { LiteralBoolean } from './Boolean'
import { LiteralString } from './String'
import { Callable } from '../Callable'

interface LiteralFunctionConstructor {
  name?: string
  arity: number
  call: (argument: Literal[]) => Literal
}

export class LiteralFunction extends Literal implements Callable {
  token: undefined = undefined
  value: string = ''
  type = 'function'

  name?: string
  arity: number
  call: (argument: Literal[]) => Literal

  constructor({ name, arity, call }: LiteralFunctionConstructor) {
    super()
    this.name = name
    this.arity = arity
    this.call = call
  }

  getValue(): string {
    if (this.name) return `<function ${this.name}>`
    else return `<function>`
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

  builtInProperties(): { [property: string]: Literal } {
    return {
      toString: new LiteralFunction({
        name: 'toString',
        arity: 0,
        call: () => new LiteralString(this.getValue())
      }),

      toBoolean: new LiteralFunction({
        name: 'toBoolean',
        arity: 0,
        call: () => new LiteralBoolean(true)
      })
    }
  }
}
