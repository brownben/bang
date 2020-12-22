import { Token } from '../tokens'
import { Primitive } from './Primitive'
import { PrimitiveFunction } from './Function'
import { PrimitiveNumber } from './Number'
import { PrimitiveString } from './String'

export class PrimitiveBoolean extends Primitive {
  token: Token | undefined
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

  builtInProperties(): { [property: string]: Primitive } {
    return {
      toBoolean: new PrimitiveFunction({
        name: 'toBoolean',
        arity: 0,
        call: () => new PrimitiveBoolean(this.value)
      }),

      toNumber: new PrimitiveFunction({
        name: 'toNumber',
        arity: 0,
        call: () => {
          if (this.getValue()) return new PrimitiveNumber(1)
          else return new PrimitiveNumber(0)
        }
      }),

      toString: new PrimitiveFunction({
        name: 'toString',
        arity: 0,
        call: () => new PrimitiveString(this.value)
      })
    }
  }
}
