import {
  Primitive,
  PrimitiveDictionary,
  PrimitiveError,
  PrimitiveFunction,
  PrimitiveNull,
  PrimitiveString,
  ReturnValue,
} from '../primitives'
import { Enviroment } from '../Enviroment'
import BangError from '../BangError'

const callFunction = async (func: PrimitiveFunction, argument: Primitive[]) => {
  try {
    return await func.call(argument)
  } catch (error) {
    if (error instanceof ReturnValue) return error.value
    else throw error
  }
}

export const testing = (enviroment: Enviroment) =>
  new PrimitiveDictionary({
    immutable: true,
    keyValues: {
      it: new PrimitiveFunction({
        name: 'testing.it',
        arity: 2,
        call: async ([description, func]: Primitive[]) => {
          if (!(description instanceof PrimitiveString))
            throw new BangError('Test description should be a string')

          if (!(func instanceof PrimitiveFunction))
            throw new BangError('Test should be a function')

          let caughtError: BangError | undefined
          try {
            await callFunction(func, [])
          } catch (error) {
            if (error instanceof BangError) caughtError = error
            else throw error
          }

          if (enviroment.exists('$_BANG_TEST_RESULTS_$')) {
            const BANG_TEST_RESULTS = enviroment.get('$_BANG_TEST_RESULTS_$')

            if (!(BANG_TEST_RESULTS instanceof PrimitiveDictionary))
              throw new BangError(
                'Expected internal $_BANG_TEST_RESULTS_$ variable to be a dictionary'
              )

            let descriptionText = description.getValue()

            while (BANG_TEST_RESULTS.hasKey(descriptionText))
              descriptionText += ' '

            BANG_TEST_RESULTS.dictionary[descriptionText] = caughtError
              ? new PrimitiveError(caughtError)
              : new PrimitiveNull()
          } else if (caughtError) throw caughtError

          return new PrimitiveNull()
        },
      }),

      expect: new PrimitiveFunction({
        name: 'testing.expect',
        arity: 1,
        call: async ([value]: Primitive[]) => {
          return new PrimitiveDictionary({
            immutable: true,
            keyValues: {
              toEqual: new PrimitiveFunction({
                name: 'testing.expect.toEqual',
                arity: 1,
                call: ([expectedValue]: Primitive[]) => {
                  if (value.notEquals(expectedValue).getValue())
                    throw new BangError(
                      `Expected value "${value.getValue()}" but recieved "${expectedValue.getValue()}"`
                    )
                  return new PrimitiveNull()
                },
              }),

              toThrow: new PrimitiveFunction({
                name: 'testing.expect.toThrow',
                arity: 0,
                call: async () => {
                  if (!(value instanceof PrimitiveFunction))
                    throw new BangError(
                      `Expected value "${value}" to be a function`
                    )

                  let caught: Primitive | BangError | undefined
                  try {
                    caught = await callFunction(value, [])
                  } catch (error) {
                    if (error instanceof BangError) caught = error
                    else throw error
                  }

                  if (caught instanceof BangError) return new PrimitiveNull()

                  throw new BangError(
                    `Expected function to throw, but recieved "${
                      caught?.getValue() ?? 'null'
                    }"`
                  )
                },
              }),
            },
          })
        },
      }),
    },
  })
