import { Token } from '../tokens'
import { Primitive } from './Primitive'
import { BuiltInPropertyVisitor } from './builtInProperties'

export class PrimitiveBoolean extends Primitive {
  token?: Token
  value: string
  type = 'boolean'

  constructor(value?: any, token?: Token) {
    super()
    this.value = token?.value ?? value?.toString() ?? ''
    this.token = token
  }

  getValue(): boolean {
    return this.value === 'true'
  }

  isTruthy(): boolean {
    return this.getValue()
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

  not(): PrimitiveBoolean {
    return new PrimitiveBoolean(!this.getValue())
  }

  builtInProperties(
    visitor: BuiltInPropertyVisitor
  ): Record<string, Primitive> {
    return visitor.visitBoolean(this)
  }
}
