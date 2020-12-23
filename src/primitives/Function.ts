import { Primitive } from './Primitive'
import { PrimitiveBoolean } from './Boolean'
import { BuiltInPropertyVisitor } from './builtInProperties'
import { Callable } from './Callable'

interface PrimitiveFunctionConstructor {
  name?: string
  arity: number
  call: (argument: Primitive[]) => Primitive
}

export class PrimitiveFunction extends Primitive implements Callable {
  token: undefined = undefined
  value: string = ''
  type = 'function'

  name?: string
  arity: number
  call: (argument: Primitive[]) => Primitive

  constructor({ name, arity, call }: PrimitiveFunctionConstructor) {
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

  equals(value: Primitive): PrimitiveBoolean {
    return new PrimitiveBoolean(
      value instanceof PrimitiveFunction && this.call === value.call
    )
  }
  notEquals(value: Primitive): PrimitiveBoolean {
    return new PrimitiveBoolean(
      !(value instanceof PrimitiveFunction) || this.call !== value.call
    )
  }

  builtInProperties(
    visitor: BuiltInPropertyVisitor
  ): Record<string, Primitive> {
    return visitor.visitFunction(this)
  }
}