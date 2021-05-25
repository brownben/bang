import { BangError } from '..'
import {
  PrimitiveNumber,
  PrimitiveDictionary,
  PrimitiveFunction,
  Primitive,
  PrimitiveNull,
} from '../primitives'

const runMathsFunction = (
  argument: Primitive[],
  func: (num: number) => number
) => {
  const [arg] = argument

  if (!(arg instanceof PrimitiveNumber))
    throw new BangError('Expected a Number')

  const value = func(arg.getValue())
  if (Number.isNaN(value)) return new PrimitiveNull()
  else return new PrimitiveNumber(value)
}

export const maths = new PrimitiveDictionary({
  keys: [],
  values: [],
  immutable: true,

  keyValues: {
    pi: new PrimitiveNumber(Math.PI),
    e: new PrimitiveNumber(Math.E),

    ceil: new PrimitiveFunction({
      name: 'maths.ceil',
      arity: 1,
      call: (argument: Primitive[]) => runMathsFunction(argument, Math.ceil),
    }),
    floor: new PrimitiveFunction({
      name: 'maths.floor',
      arity: 1,
      call: (argument: Primitive[]) => runMathsFunction(argument, Math.floor),
    }),

    abs: new PrimitiveFunction({
      name: 'maths.abs',
      arity: 1,
      call: (argument: Primitive[]) => runMathsFunction(argument, Math.abs),
    }),

    sqrt: new PrimitiveFunction({
      name: 'maths.sqrt',
      arity: 1,
      call: (argument: Primitive[]) => runMathsFunction(argument, Math.sqrt),
    }),
    cbrt: new PrimitiveFunction({
      name: 'maths.cbrt',
      arity: 1,
      call: (argument: Primitive[]) => runMathsFunction(argument, Math.cbrt),
    }),

    sin: new PrimitiveFunction({
      name: 'maths.sin',
      arity: 1,
      call: (argument: Primitive[]) => runMathsFunction(argument, Math.sin),
    }),
    cos: new PrimitiveFunction({
      name: 'maths.cos',
      arity: 1,
      call: (argument: Primitive[]) => runMathsFunction(argument, Math.cos),
    }),
    tan: new PrimitiveFunction({
      name: 'maths.tan',
      arity: 1,
      call: (argument: Primitive[]) => runMathsFunction(argument, Math.tan),
    }),
    arcSin: new PrimitiveFunction({
      name: 'maths.arcSin',
      arity: 1,
      call: (argument: Primitive[]) => runMathsFunction(argument, Math.asin),
    }),
    arcCos: new PrimitiveFunction({
      name: 'maths.arcCos',
      arity: 1,
      call: (argument: Primitive[]) => runMathsFunction(argument, Math.acos),
    }),
    arcTan: new PrimitiveFunction({
      name: 'maths.arcTan',
      arity: 1,
      call: (argument: Primitive[]) => runMathsFunction(argument, Math.atan),
    }),

    sinh: new PrimitiveFunction({
      name: 'maths.sinh',
      arity: 1,
      call: (argument: Primitive[]) => runMathsFunction(argument, Math.sinh),
    }),
    cosh: new PrimitiveFunction({
      name: 'maths.cosh',
      arity: 1,
      call: (argument: Primitive[]) => runMathsFunction(argument, Math.cosh),
    }),
    tanh: new PrimitiveFunction({
      name: 'maths.tanh',
      arity: 1,
      call: (argument: Primitive[]) => runMathsFunction(argument, Math.tanh),
    }),
    arcSinh: new PrimitiveFunction({
      name: 'maths.arcSinh',
      arity: 1,
      call: (argument: Primitive[]) => runMathsFunction(argument, Math.asinh),
    }),
    arcCosh: new PrimitiveFunction({
      name: 'maths.arcCosh',
      arity: 1,
      call: (argument: Primitive[]) => runMathsFunction(argument, Math.acosh),
    }),
    arcTanh: new PrimitiveFunction({
      name: 'maths.arcTanh',
      arity: 1,
      call: (argument: Primitive[]) => runMathsFunction(argument, Math.atanh),
    }),

    exp: new PrimitiveFunction({
      name: 'maths.exp',
      arity: 1,
      call: (argument: Primitive[]) => runMathsFunction(argument, Math.exp),
    }),
    log: new PrimitiveFunction({
      name: 'maths.log',
      arity: 1,
      call: (argument: Primitive[]) => runMathsFunction(argument, Math.log10),
    }),
    ln: new PrimitiveFunction({
      name: 'maths.ln',
      arity: 1,
      call: (argument: Primitive[]) => runMathsFunction(argument, Math.log),
    }),

    sign: new PrimitiveFunction({
      name: 'maths.sign',
      arity: 1,
      call: (argument: Primitive[]) => runMathsFunction(argument, Math.sign),
    }),
    round: new PrimitiveFunction({
      name: 'maths.round',
      arity: 1,
      call: (argument: Primitive[]) => runMathsFunction(argument, Math.round),
    }),
  },
})
