import { Token } from '../tokens'
import { Primitive } from './Primitive'
import { PrimitiveBoolean } from './Boolean'
import { BuiltInPropertyVisitor } from './builtInProperties'

export class PrimitiveNull extends Primitive {
  token?: Token
  readonly value: string
  readonly type = 'null'
  readonly immutable: true = true

  constructor(value?: string, token?: Token) {
    super()
    this.value = token?.value ?? value ?? ''
    this.token = token
  }

  getValue(): null {
    return null
  }

  isTruthy(): boolean {
    return false
  }

  equals(value: Primitive): PrimitiveBoolean {
    return new PrimitiveBoolean(
      this.value === value.value && this.type === value.type
    )
  }
  notEquals(value: Primitive): PrimitiveBoolean {
    return new PrimitiveBoolean(
      this.value !== value.value || this.type !== value.type
    )
  }

  builtInProperties(
    visitor: BuiltInPropertyVisitor
  ): Record<string, Primitive> {
    return visitor.visitNull()
  }
}
