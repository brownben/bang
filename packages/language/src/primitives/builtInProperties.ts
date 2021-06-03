import { Primitive } from './Primitive'
import { PrimitiveBoolean } from './Boolean'
import { PrimitiveDictionary } from './Dictionary'
import { PrimitiveError } from './Error'
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

const callFunction = async (func: PrimitiveFunction, argument: Primitive[]) => {
  try {
    return await func.call(argument)
  } catch (error) {
    if (error instanceof ReturnValue) return error.value
    else throw error
  }
}

export class BuiltInPropertyVisitor
  implements VisitPrimitives<Record<string, Primitive>>
{
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
        call: async (argument: Primitive[]) => {
          const [func] = argument
          if (!(func instanceof PrimitiveFunction))
            throw new BangError(
              'Transform must be a function',
              primitive.token?.line
            )

          return new PrimitiveList({
            values: await Promise.all(
              primitive.list.map((value, index) => {
                return callFunction(func, [value, new PrimitiveNumber(index)])
              })
            ),
          })
        },
      }),

      filter: new PrimitiveFunction({
        name: 'filter',
        arity: 1,
        call: async (argument: Primitive[]) => {
          const [func] = argument
          if (!(func instanceof PrimitiveFunction))
            throw new BangError(
              'Predicate must be a function',
              primitive.token?.line
            )

          const values = []
          for (const [index, value] of Object.entries(primitive.list)) {
            const predicateResult = await callFunction(func, [
              value,
              new PrimitiveNumber(index),
            ])
            if (predicateResult.isTruthy()) values.push(value)
          }

          return new PrimitiveList({ values })
        },
      }),

      reduce: new PrimitiveFunction({
        name: 'reduce',
        arity: 2,
        call: (argument: Primitive[]) => {
          const [func, startValue] = argument
          if (!(func instanceof PrimitiveFunction))
            throw new BangError(
              'Transform must be a function',
              primitive.token?.line
            )

          return primitive.list.reduce(async (accumulator, value, index) => {
            return callFunction(func, [
              await accumulator,
              value,
              new PrimitiveNumber(index),
            ])
          }, Promise.resolve(startValue))
        },
      }),

      forEach: new PrimitiveFunction({
        name: 'forEach',
        arity: 1,
        call: (argument: Primitive[]) => {
          const [func] = argument
          if (!(func instanceof PrimitiveFunction))
            throw new BangError(
              'Transform must be a function',
              primitive.token?.line
            )

          primitive.list.map((value, index) =>
            callFunction(func, [value, new PrimitiveNumber(index)])
          )
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
          const [givenValue] = argument

          return new PrimitiveBoolean(
            primitive.list
              .map((value) => value.equals(givenValue).getValue())
              .some(Boolean)
          )
        },
      }),

      pop: new PrimitiveFunction({
        name: 'pop',
        arity: 0,
        call: () => {
          if (primitive.immutable)
            throw new BangError(
              'List is immutable, it cannot be edited',
              primitive.token?.line
            )

          return primitive.list.pop() ?? new PrimitiveNull()
        },
      }),

      push: new PrimitiveFunction({
        name: 'push',
        arity: 1,
        call: (argument: Primitive[]) => {
          if (primitive.immutable)
            throw new BangError(
              'List is immutable, it cannot be edited',
              primitive.token?.line
            )

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
            throw new BangError(
              'List is immutable, it cannot be edited',
              primitive.token?.line
            )

          return primitive.list.shift() ?? new PrimitiveNull()
        },
      }),

      unshift: new PrimitiveFunction({
        name: 'unshift',
        arity: 1,
        call: (argument: Primitive[]) => {
          if (primitive.immutable)
            throw new BangError(
              'List is immutable, it cannot be edited',
              primitive.token?.line
            )

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
            throw new BangError(
              'Argument must be a string',
              primitive.token?.line
            )

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
        call: async (argument: Primitive[]) => {
          const [func] = argument
          if (!(func instanceof PrimitiveFunction))
            throw new BangError(
              'Predicate must be a Function',
              primitive.token?.line
            )

          for (const item of primitive.list)
            if ((await callFunction(func, [item])).isTruthy()) return item

          return new PrimitiveNull()
        },
      }),

      findIndex: new PrimitiveFunction({
        name: 'findIndex',
        arity: 1,
        call: async (argument: Primitive[]) => {
          const [func] = argument
          if (!(func instanceof PrimitiveFunction))
            throw new BangError(
              'Predicate must be a Function',
              primitive.token?.line
            )

          for (const [index, item] of Object.entries(primitive.list))
            if ((await callFunction(func, [item])).isTruthy())
              return new PrimitiveNumber(index)

          return new PrimitiveNull()
        },
      }),

      indexOf: new PrimitiveFunction({
        name: 'indexOf',
        arity: 1,
        call: (argument: Primitive[]) => {
          const [givenValue] = argument

          const result = primitive.list.findIndex((value) =>
            value.equals(givenValue).getValue()
          )

          if (result < 0) return new PrimitiveNull()
          else return new PrimitiveNumber(result)
        },
      }),

      copy: new PrimitiveFunction({
        name: 'copy',
        arity: 0,
        call: () => new PrimitiveList({ values: primitive.list }),
      }),

      get: new PrimitiveFunction({
        name: 'get',
        arity: 1,
        call: (argument: Primitive[]) => {
          const [key] = argument

          if (
            key instanceof PrimitiveNumber &&
            primitive.indexExists(key.getValue())
          )
            return primitive.getValueAtIndex(key.getValue())
          else return new PrimitiveNull()
        },
      }),

      min: new PrimitiveFunction({
        name: 'min',
        arity: 0,
        call: () => {
          const allNumbers = primitive.list
            .map((item) => item instanceof PrimitiveNumber)
            .every(Boolean)

          if (!allNumbers)
            throw new BangError(
              'Expected all elements of the list to be numbers',
              primitive.token?.line
            )

          const listAsNumbers = primitive.list.map((item) =>
            item.getValue()
          ) as number[]

          if (listAsNumbers.length <= 0)
            throw new BangError(
              'Expected at least one element in the list',
              primitive.token?.line
            )

          return new PrimitiveNumber(Math.min(...listAsNumbers))
        },
      }),

      max: new PrimitiveFunction({
        name: 'max',
        arity: 0,
        call: () => {
          const allNumbers = primitive.list
            .map((item) => item instanceof PrimitiveNumber)
            .every(Boolean)

          if (!allNumbers)
            throw new BangError(
              'Expected all elements of the list to be numbers',
              primitive.token?.line
            )

          const listAsNumbers = primitive.list.map((item) =>
            item.getValue()
          ) as number[]

          if (listAsNumbers.length <= 0)
            throw new BangError(
              'Expected at oleast one element in the list',
              primitive.token?.line
            )

          return new PrimitiveNumber(Math.max(...listAsNumbers))
        },
      }),

      sum: new PrimitiveFunction({
        name: 'sum',
        arity: 0,
        call: () => {
          const allNumbers = primitive.list
            .map((item) => item instanceof PrimitiveNumber)
            .every(Boolean)

          if (!allNumbers)
            throw new BangError(
              'Expected all elements of the list to be numbers',
              primitive.token?.line
            )

          const listAsNumbers = primitive.list.map((item) =>
            item.getValue()
          ) as number[]

          return new PrimitiveNumber(
            listAsNumbers.reduce((total, value) => total + value, 0)
          )
        },
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
            throw new BangError(
              'Replace target must be a string',
              primitive.token?.line
            )

          if (!(newString instanceof PrimitiveString))
            throw new BangError(
              'Replacement must be a string',
              primitive.token?.line
            )

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
            throw new BangError(
              'Replace target must be a string',
              primitive.token?.line
            )

          if (!(newString instanceof PrimitiveString))
            throw new BangError(
              'Replacement must be a string',
              primitive.token?.line
            )

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
            throw new BangError(
              'Split specifier must be a string',
              primitive.token?.line
            )

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
              `Can't convert "${primitive.value}" to a number`,
              primitive.token?.line
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

  visitUnique() {
    return {
      toBoolean: new PrimitiveFunction({
        name: 'toBoolean',
        arity: 0,
        call: () => new PrimitiveBoolean(true),
      }),
    }
  }

  visitError(primitive: PrimitiveError) {
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
}
