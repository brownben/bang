import { Token } from '../tokens'
import { Primitive } from './Primitive'
import { PrimitiveBoolean } from './Boolean'
import { PrimitiveFunction } from './Function'
import { PrimitiveNumber } from './Number'
import BangError from '../BangError'

export class PrimitiveString extends Primitive {
  token: Token | undefined
  value: string
  type = 'string'

  constructor(value?: string, token?: Token) {
    super()
    this.value = token?.value ?? value?.toString() ?? ''
    this.token = token
  }

  getValue(): string {
    return this.value
  }

  isTruthy(): boolean {
    return true
  }

  plus(value: Primitive): PrimitiveString {
    if (value instanceof PrimitiveString)
      return new PrimitiveString(this.getValue() + value.getValue())
    else
      throw new BangError(
        `No Operation "+" on type "${this.type}" and type "${value.type}`
      )
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

  greaterThan(value: Primitive): PrimitiveBoolean {
    if (value instanceof PrimitiveString)
      return new PrimitiveBoolean(this.getValue() > value.getValue())
    else
      throw new BangError(
        `No Operation ">" on type "${this.type}" and type "${value.type}`
      )
  }
  lessThan(value: Primitive): PrimitiveBoolean {
    if (value instanceof PrimitiveString)
      return new PrimitiveBoolean(this.getValue() < value.getValue())
    else
      throw new BangError(
        `No Operation "<" on type "${this.type}" and type "${value.type}`
      )
  }
  greaterThanOrEqual(value: Primitive): PrimitiveBoolean {
    if (value instanceof PrimitiveString)
      return new PrimitiveBoolean(this.getValue() >= value.getValue())
    else
      throw new BangError(
        `No Operation ">=" on type "${this.type}" and type "${value.type}`
      )
  }
  lessThanOrEqual(value: Primitive): PrimitiveBoolean {
    if (value instanceof PrimitiveString)
      return new PrimitiveBoolean(this.getValue() <= value.getValue())
    else
      throw new BangError(
        `No Operation "<=" on type "${this.type}" and type "${value.type}`
      )
  }

  builtInProperties(): { [property: string]: Primitive } {
    return {
      length: new PrimitiveNumber(this.value.length),

      toBoolean: new PrimitiveFunction({
        name: 'toBoolean',
        arity: 0,
        call: () => new PrimitiveBoolean(this.value !== '')
      }),

      toNumber: new PrimitiveFunction({
        name: 'toNumber',
        arity: 0,
        call: () => {
          const asNumber = Number(this.value.replace(/_/g, ''))
          if (!Number.isNaN(asNumber)) return new PrimitiveNumber(asNumber)
          else throw new BangError(`Can't convert "${this.value}" to a number`)
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
