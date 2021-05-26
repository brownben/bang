import {
  Primitive,
  PrimitiveBoolean,
  PrimitiveDictionary,
  PrimitiveFunction,
  PrimitiveString,
  PrimitiveUnique,
} from '../primitives'
import BangError from '../BangError'
export const regex = new PrimitiveFunction({
  name: 'regex',
  arity: 1,
  spread: true,
  call: (argument: Primitive[]) => {
    const [arg, extra] = argument
    let flag = ''

    if (!(arg instanceof PrimitiveString))
      throw new BangError('Expected string')
    if (extra instanceof PrimitiveString) flag = extra.getValue() as string

    const internalRegex = new RegExp(arg.getValue(), flag)

    return new PrimitiveDictionary({
      keys: [],
      values: [],
      immutable: true,

      keyValues: {
        $_id: new PrimitiveUnique(),
        test: new PrimitiveFunction({
          name: 'regex.test',
          arity: 1,
          call: (argument: Primitive[]) => {
            const [arg] = argument

            if (!(arg instanceof PrimitiveString))
              throw new BangError('Expected string')

            return new PrimitiveBoolean(internalRegex.test(arg.getValue()))
          },
        }),
      },
    })
  },
})
