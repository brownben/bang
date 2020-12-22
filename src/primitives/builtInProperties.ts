import { Primitive } from './Primitive'
import { PrimitiveBoolean } from './Boolean'
import { PrimitiveFunction } from './Function'
import { PrimitiveNull } from './Null'
import { PrimitiveNumber } from './Number'
import { PrimitiveString } from './String'
import BangError from '../BangError'

export interface VisitPrimitives<T> {
  visitBoolean: (primitive: PrimitiveBoolean) => T
  visitFunction: (primitive: PrimitiveFunction) => T
  visitNull: (primitive: PrimitiveNull) => T
  visitNumber: (primitive: PrimitiveNumber) => T
  visitString: (primitive: PrimitiveString) => T
}

export class BuiltInPropertyVisitor
  implements VisitPrimitives<Record<string, Primitive>> {
  visitBoolean(primitive: PrimitiveBoolean) {
    return {
      toBoolean: new PrimitiveFunction({
        name: 'toBoolean',
        arity: 0,
        call: () => new PrimitiveBoolean(primitive.value)
      }),

      toNumber: new PrimitiveFunction({
        name: 'toNumber',
        arity: 0,
        call: () => {
          if (primitive.getValue()) return new PrimitiveNumber(1)
          else return new PrimitiveNumber(0)
        }
      }),

      toString: new PrimitiveFunction({
        name: 'toString',
        arity: 0,
        call: () => new PrimitiveString(primitive.value)
      })
    }
  }

  visitFunction(primitive: PrimitiveFunction) {
    return {
      toString: new PrimitiveFunction({
        name: 'toString',
        arity: 0,
        call: () => new PrimitiveString(primitive.getValue())
      }),

      toBoolean: new PrimitiveFunction({
        name: 'toBoolean',
        arity: 0,
        call: () => new PrimitiveBoolean(true)
      })
    }
  }

  visitNull() {
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

  visitNumber(primitive: PrimitiveNumber) {
    return {
      toBoolean: new PrimitiveFunction({
        name: 'toBoolean',
        arity: 0,
        call: () => new PrimitiveBoolean(primitive.getValue() !== 0)
      }),

      toNumber: new PrimitiveFunction({
        name: 'toNumber',
        arity: 0,
        call: () => new PrimitiveNumber(primitive.value)
      }),

      toString: new PrimitiveFunction({
        name: 'toString',
        arity: 0,
        call: () => new PrimitiveString(primitive.value)
      })
    }
  }

  visitString(primitive: PrimitiveString) {
    return {
      length: new PrimitiveNumber(primitive.value.length),

      toBoolean: new PrimitiveFunction({
        name: 'toBoolean',
        arity: 0,
        call: () => new PrimitiveBoolean(primitive.value !== '')
      }),

      toNumber: new PrimitiveFunction({
        name: 'toNumber',
        arity: 0,
        call: () => {
          const asNumber = Number(primitive.value.replace(/_/g, ''))
          if (!Number.isNaN(asNumber)) return new PrimitiveNumber(asNumber)
          else
            throw new BangError(
              `Can't convert "${primitive.value}" to a number`
            )
        }
      }),

      toString: new PrimitiveFunction({
        name: 'toString',
        arity: 0,
        call: () => new PrimitiveString(primitive.value)
      })
    }
  }
}
