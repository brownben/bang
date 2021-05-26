import { Primitive } from './Primitive'
import { PrimitiveBoolean } from './Boolean'
import { BuiltInPropertyVisitor } from './builtInProperties'

export class PrimitiveUnique extends Primitive {
  readonly token: undefined = undefined
  readonly value: string = ''
  readonly type = 'unique'
  readonly immutable: true = true

  internalSymbol: Symbol

  constructor() {
    super()
    this.internalSymbol = Symbol()
  }

  getValue(): string {
    return '<unique>'
  }

  isTruthy(): boolean {
    return true
  }

  equals(value: Primitive): PrimitiveBoolean {
    return new PrimitiveBoolean(
      value instanceof PrimitiveUnique &&
        value.internalSymbol === this.internalSymbol
    )
  }
  notEquals(value: Primitive): PrimitiveBoolean {
    return new PrimitiveBoolean(
      !(value instanceof PrimitiveUnique) ||
        value.internalSymbol !== this.internalSymbol
    )
  }

  not(): PrimitiveBoolean {
    return new PrimitiveBoolean(false)
  }

  builtInProperties(
    visitor: BuiltInPropertyVisitor
  ): Record<string, Primitive> {
    return visitor.visitUnique()
  }
}
