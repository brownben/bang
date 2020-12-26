import { Primitive } from './Primitive'
import { PrimitiveBoolean } from './Boolean'
import { PrimitiveDictionary } from './Dictionary'
import { PrimitiveFunction } from './Function'
import { PrimitiveList } from './List'
import { PrimitiveNull } from './Null'
import { PrimitiveNumber } from './Number'
import { PrimitiveString } from './String'
import { ReturnValue } from './ReturnValue'
import BangError from '../BangError'

export interface VisitPrimitives<T> {
  visitBoolean: (primitive: PrimitiveBoolean) => T
  visitDictionary: (primitive: PrimitiveDictionary) => T
  visitFunction: (primitive: PrimitiveFunction) => T
  visitList: (primitive: PrimitiveList) => T
  visitNull: (primitive: PrimitiveNull) => T
  visitNumber: (primitive: PrimitiveNumber) => T
  visitString: (primitive: PrimitiveString) => T
}

const callFunction = (func: PrimitiveFunction, argument: Primitive[]) => {
  try {
    return func.call(argument)
  } catch (error) {
    if (error instanceof ReturnValue) return error.value
    else throw error
  }
}

export class BuiltInPropertyVisitor
  implements VisitPrimitives<Record<string, Primitive>> {
  visitBoolean(primitive: PrimitiveBoolean) {
    return {
      toBoolean: new PrimitiveFunction({
        name: 'toBoolean',
        arity: 0,
        call: () => new PrimitiveBoolean(primitive.value),
      }),

      toNumber: new PrimitiveFunction({
        name: 'toNumber',
        arity: 0,
        call: () => {
          if (primitive.getValue()) return new PrimitiveNumber(1)
          else return new PrimitiveNumber(0)
        },
      }),

      toString: new PrimitiveFunction({
        name: 'toString',
        arity: 0,
        call: () => new PrimitiveString(primitive.value),
      }),
    }
  }

  visitDictionary(primitive: PrimitiveDictionary) {
    return {
      isImmutable: new PrimitiveBoolean(primitive.immutable),

      freeze: new PrimitiveFunction({
        name: 'freeze',
        arity: 0,
        call: () => {
          primitive.immutable = true
          return primitive
        },
      }),

      unfreeze: new PrimitiveFunction({
        name: 'unfreeze',
        arity: 0,
        call: () => {
          primitive.immutable = false
          return primitive
        },
      }),

      get: new PrimitiveFunction({
        name: 'get',
        arity: 1,
        call: (argument: Primitive[]) => {
          const [key] = argument

          if (
            key instanceof PrimitiveString &&
            primitive.dictionary?.[key.value]
          )
            return primitive.dictionary[key.value]
          else return new PrimitiveNull()
        },
      }),

      keys: new PrimitiveList({
        values: Object.keys(primitive.dictionary).map(
          (value) => new PrimitiveString(value)
        ),
      }),

      values: new PrimitiveList({
        values: Object.values(primitive.dictionary),
      }),

      toBoolean: new PrimitiveFunction({
        name: 'toBoolean',
        arity: 0,
        call: () => new PrimitiveBoolean(true),
      }),

      toString: new PrimitiveFunction({
        name: 'toString',
        arity: 0,
        call: () => new PrimitiveString(JSON.stringify(primitive.getValue())),
      }),
    }
  }

  visitFunction(primitive: PrimitiveFunction) {
    return {
      toString: new PrimitiveFunction({
        name: 'toString',
        arity: 0,
        call: () => new PrimitiveString(primitive.getValue()),
      }),

      toBoolean: new PrimitiveFunction({
        name: 'toBoolean',
        arity: 0,
        call: () => new PrimitiveBoolean(true),
      }),
    }
  }

  visitList(primitive: PrimitiveList) {
    return {
      length: new PrimitiveNumber(primitive.list.length),

      isImmutable: new PrimitiveBoolean(primitive.immutable),

      freeze: new PrimitiveFunction({
        name: 'freeze',
        arity: 0,
        call: () => {
          primitive.immutable = true
          return primitive
        },
      }),

      unfreeze: new PrimitiveFunction({
        name: 'unfreeze',
        arity: 0,
        call: () => {
          primitive.immutable = false
          return primitive
        },
      }),

      map: new PrimitiveFunction({
        name: 'map',
        arity: 1,
        call: (argument: Primitive[]) => {
          const [func] = argument
          if (!(func instanceof PrimitiveFunction))
            throw new BangError('Transform must be a Function')

          return new PrimitiveList({
            values: primitive.list.map((value) => callFunction(func, [value])),
          })
        },
      }),

      filter: new PrimitiveFunction({
        name: 'filter',
        arity: 1,
        call: (argument: Primitive[]) => {
          const [func] = argument
          if (!(func instanceof PrimitiveFunction))
            throw new BangError('Predicate must be a Function')

          return new PrimitiveList({
            values: primitive.list.filter((value) =>
              callFunction(func, [value]).isTruthy()
            ),
          })
        },
      }),

      forEach: new PrimitiveFunction({
        name: 'forEach',
        arity: 1,
        call: (argument: Primitive[]) => {
          const [func] = argument
          if (!(func instanceof PrimitiveFunction))
            throw new BangError('Transform must be a Function')

          primitive.list.map((value) => callFunction(func, [value]))
          return new PrimitiveNull()
        },
      }),

      every: new PrimitiveFunction({
        name: 'every',
        arity: 0,
        call: () =>
          new PrimitiveBoolean(
            primitive.list.map((value) => value.isTruthy()).every(Boolean)
          ),
      }),

      any: new PrimitiveFunction({
        name: 'every',
        arity: 0,
        call: () =>
          new PrimitiveBoolean(
            primitive.list.map((value) => value.isTruthy()).some(Boolean)
          ),
      }),

      reverse: new PrimitiveFunction({
        name: 'reverse',
        arity: 0,
        call: () => new PrimitiveList({ values: primitive.list.reverse() }),
      }),

      includes: new PrimitiveFunction({
        name: 'includes',
        arity: 1,
        call: (argument: Primitive[]) => {
          const [value] = argument

          return new PrimitiveBoolean(
            primitive.list
              .map((value) => value.getValue())
              .includes(value.getValue())
          )
        },
      }),

      pop: new PrimitiveFunction({
        name: 'pop',
        arity: 0,
        call: () => {
          if (primitive.immutable)
            throw new BangError('List is immutable, it cannot be edited')

          return primitive.list.pop() ?? new PrimitiveNull()
        },
      }),

      push: new PrimitiveFunction({
        name: 'push',
        arity: 1,
        call: (argument: Primitive[]) => {
          if (primitive.immutable)
            throw new BangError('List is immutable, it cannot be edited')

          const [value] = argument
          primitive.list.push(value)
          return primitive
        },
      }),

      shift: new PrimitiveFunction({
        name: 'shift',
        arity: 0,
        call: () => {
          if (primitive.immutable)
            throw new BangError('List is immutable, it cannot be edited')

          return primitive.list.shift() ?? new PrimitiveNull()
        },
      }),

      unshift: new PrimitiveFunction({
        name: 'unshift',
        arity: 1,
        call: (argument: Primitive[]) => {
          if (primitive.immutable)
            throw new BangError('List is immutable, it cannot be edited')

          const [value] = argument
          primitive.list.unshift(value)
          return primitive
        },
      }),

      join: new PrimitiveFunction({
        name: 'join',
        arity: 1,
        call: (argument: Primitive[]) => {
          const [value] = argument

          if (!(value instanceof PrimitiveString))
            throw new BangError('Argument must be a string')

          return new PrimitiveString(
            primitive.list
              .map((value) => value.getValue())
              .join(value.getValue())
          )
        },
      }),

      find: new PrimitiveFunction({
        name: 'find',
        arity: 1,
        call: (argument: Primitive[]) => {
          const [func] = argument
          if (!(func instanceof PrimitiveFunction))
            throw new BangError('Predicate must be a Function')

          return (
            primitive.list.find((value) =>
              callFunction(func, [value]).isTruthy()
            ) ?? new PrimitiveNull()
          )
        },
      }),

      findIndex: new PrimitiveFunction({
        name: 'findIndex',
        arity: 1,
        call: (argument: Primitive[]) => {
          const [func] = argument
          if (!(func instanceof PrimitiveFunction))
            throw new BangError('Predicate must be a Function')

          const value = primitive.list.findIndex((value) =>
            callFunction(func, [value]).isTruthy()
          )
          if (value < 0) return new PrimitiveNull()
          else return new PrimitiveNumber(value)
        },
      }),

      indexOf: new PrimitiveFunction({
        name: 'indexOf',
        arity: 1,
        call: (argument: Primitive[]) => {
          const [value] = argument

          const listValues = primitive.list.map((value) => value.getValue())
          const result = listValues.indexOf(value.getValue())

          if (result < 0) return new PrimitiveNull()
          else return new PrimitiveNumber(result)
        },
      }),

      copy: new PrimitiveFunction({
        name: 'copy',
        arity: 0,
        call: () => new PrimitiveList({ values: primitive.list }),
      }),

      toString: new PrimitiveFunction({
        name: 'toString',
        arity: 0,
        call: () => new PrimitiveString(JSON.stringify(primitive.getValue())),
      }),

      toBoolean: new PrimitiveFunction({
        name: 'toBoolean',
        arity: 0,
        call: () => new PrimitiveBoolean(primitive.list.length > 0),
      }),
    }
  }

  visitNull() {
    return {
      toBoolean: new PrimitiveFunction({
        name: 'toBoolean',
        arity: 0,
        call: () => new PrimitiveBoolean(false),
      }),

      toNumber: new PrimitiveFunction({
        name: 'toNumber',
        arity: 0,
        call: () => new PrimitiveNumber(0),
      }),

      toString: new PrimitiveFunction({
        name: 'toString',
        arity: 0,
        call: () => new PrimitiveString('null'),
      }),
    }
  }

  visitNumber(primitive: PrimitiveNumber) {
    return {
      toBoolean: new PrimitiveFunction({
        name: 'toBoolean',
        arity: 0,
        call: () => new PrimitiveBoolean(primitive.getValue() !== 0),
      }),

      toNumber: new PrimitiveFunction({
        name: 'toNumber',
        arity: 0,
        call: () => new PrimitiveNumber(primitive.value),
      }),

      toString: new PrimitiveFunction({
        name: 'toString',
        arity: 0,
        call: () => new PrimitiveString(primitive.value),
      }),
    }
  }

  visitString(primitive: PrimitiveString) {
    return {
      length: new PrimitiveNumber(primitive.value.length),

      toUppercase: new PrimitiveFunction({
        name: 'toUppercase',
        arity: 0,
        call: () => new PrimitiveString(primitive.value.toUpperCase()),
      }),

      toLowercase: new PrimitiveFunction({
        name: 'toLowercase',
        arity: 0,
        call: () => new PrimitiveString(primitive.value.toLowerCase()),
      }),

      reverse: new PrimitiveFunction({
        name: 'reverse',
        arity: 0,
        call: () =>
          new PrimitiveString([...primitive.value].reverse().join('')),
      }),

      replaceOne: new PrimitiveFunction({
        name: 'replaceOne',
        arity: 2,
        call: (argument: Primitive[]) => {
          const [target, newString] = argument

          if (!(target instanceof PrimitiveString))
            throw new BangError('Replace target must be a string')

          if (!(newString instanceof PrimitiveString))
            throw new BangError('Replacement must be a string')

          return new PrimitiveString(
            primitive.value.replace(target.getValue(), newString.getValue())
          )
        },
      }),

      replace: new PrimitiveFunction({
        name: 'replace',
        arity: 2,
        call: (argument: Primitive[]) => {
          const [target, newString] = argument

          if (!(target instanceof PrimitiveString))
            throw new BangError('Replace target must be a string')

          if (!(newString instanceof PrimitiveString))
            throw new BangError('Replacement must be a string')

          return new PrimitiveString(
            primitive.value.replace(
              new RegExp(target.getValue(), 'g'),
              newString.getValue()
            )
          )
        },
      }),

      split: new PrimitiveFunction({
        name: 'split',
        arity: 1,
        call: (argument: Primitive[]) => {
          const [value] = argument

          if (!(value instanceof PrimitiveString))
            throw new BangError('Split specifier must be a string')

          return new PrimitiveList({
            values: primitive.value
              .split(value.getValue())
              .map((value) => new PrimitiveString(value)),
          })
        },
      }),

      trim: new PrimitiveFunction({
        name: 'trim',
        arity: 0,
        call: () => new PrimitiveString(primitive.value.trim()),
      }),

      trimStart: new PrimitiveFunction({
        name: 'trimStart',
        arity: 0,
        call: () => new PrimitiveString(primitive.value.trimStart()),
      }),

      trimEnd: new PrimitiveFunction({
        name: 'trimEnd',
        arity: 0,
        call: () => new PrimitiveString(primitive.value.trimEnd()),
      }),

      includes: new PrimitiveFunction({
        name: 'includes',
        arity: 1,
        call: (argument: Primitive[]) => {
          const [value] = argument

          if (!(value instanceof PrimitiveString))
            return new PrimitiveBoolean(false)

          return new PrimitiveBoolean(
            primitive.value.includes(value.getValue())
          )
        },
      }),

      toBoolean: new PrimitiveFunction({
        name: 'toBoolean',
        arity: 0,
        call: () => new PrimitiveBoolean(primitive.value !== ''),
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
        },
      }),

      toString: new PrimitiveFunction({
        name: 'toString',
        arity: 0,
        call: () => new PrimitiveString(primitive.value),
      }),
    }
  }
}
