import { Token } from '../tokens'
import { Primitive } from './Primitive'
import { PrimitiveBoolean } from './Boolean'
import { PrimitiveFunction } from './Function'
import { PrimitiveString } from './String'
import { PrimitiveNumber } from './Number'

export class PrimitiveNull extends Primitive {
  token: Token | undefined
  value: string
  type = 'null'

  constructor(value?: string, token?: Token) {
    super()
    this.value = value ?? ''
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

  builtInProperties(): { [property: string]: Primitive } {
    return {
      toBoolean: new PrimitiveFunction({
        name: 'toBoolean',
        arity: 0,
        call: () => new PrimitiveBoolean(false)
      }),

      toNumber: new PrimitiveFunction({
        name: 'toNumber',
        arity: 0,
        call: () => new PrimitiveNumber(0)
      }),

      toString: new PrimitiveFunction({
        name: 'toString',
        arity: 0,
        call: () => new PrimitiveString('null')
      })
    }
  }
}
