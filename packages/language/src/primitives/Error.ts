import { Primitive } from './Primitive'
import { PrimitiveBoolean } from './Boolean'
import { BuiltInPropertyVisitor } from './builtInProperties'
import BangError from '../BangError'

export class PrimitiveError extends Primitive {
  readonly token: undefined = undefined
  readonly value: string = ''
  readonly type = 'error'
  readonly immutable: true = true

  error: BangError

  constructor(error: BangError) {
    super()
    this.error = error
  }

  getValue(): string {
    return 'Error: ' + this.error.message
  }

  isTruthy(): boolean {
    return true
  }

  equals(value: Primitive): PrimitiveBoolean {
    return new PrimitiveBoolean(
      value instanceof PrimitiveError && value === this
    )
  }
  notEquals(value: Primitive): PrimitiveBoolean {
    return new PrimitiveBoolean(
      !(value instanceof PrimitiveError) || value !== this
    )
  }

  builtInProperties(
    visitor: BuiltInPropertyVisitor
  ): Record<string, Primitive> {
    return visitor.visitError(this)
  }
}
