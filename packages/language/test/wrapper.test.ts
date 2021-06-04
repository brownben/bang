import { deepWrap as wrapValue } from '../src/library/wrapper'
import {
  PrimitiveBoolean,
  PrimitiveDictionary,
  PrimitiveFunction,
  PrimitiveList,
  PrimitiveNull,
  PrimitiveNumber,
  PrimitiveString,
  PrimitiveUnique,
} from '../src/primitives'

it('should wrap numbers', () => {
  expect(wrapValue(7)).toEqual(new PrimitiveNumber(7))
  expect(wrapValue(123.33)).toEqual(new PrimitiveNumber(123.33))
})

it('should wrap null/ undefined', () => {
  expect(wrapValue(null)).toEqual(new PrimitiveNull())
  expect(wrapValue(undefined)).toEqual(new PrimitiveNull())
})

it('should wrap symbol', () => {
  expect(String(wrapValue('<unique>'))).toEqual(String(new PrimitiveUnique()))
  expect(String(wrapValue(Symbol()))).toEqual(String(new PrimitiveUnique()))
})

it('should wrap strings', () => {
  expect(wrapValue('hello world')).toEqual(new PrimitiveString('hello world'))
})

it('should wrap boolean', () => {
  expect(wrapValue(true)).toEqual(new PrimitiveBoolean(true))
  expect(wrapValue(false)).toEqual(new PrimitiveBoolean(false))
})

it('should wrap lists', () => {
  expect(wrapValue([1, 2, 3])).toEqual(
    new PrimitiveList({
      values: [
        new PrimitiveNumber(1),
        new PrimitiveNumber(2),
        new PrimitiveNumber(3),
      ],
    })
  )
})

it('should wrap functions', () => {
  expect(
    (
      wrapValue(function test(a: number, b: number, c: number) {
        return a + b + c
      }) as PrimitiveFunction
    ).arity
  ).toEqual(3)

  expect(
    (
      wrapValue(function test(a: number, b: number, c: number) {
        return a + b + c
      }) as PrimitiveFunction
    ).name
  ).toEqual('test')
})

it('should wrap deep dictionaries', () => {
  expect(wrapValue({ a: 1, b: { c: 3, d: [4, 5] } })).toEqual(
    new PrimitiveDictionary({
      keyValues: {
        a: new PrimitiveNumber(1),
        b: new PrimitiveDictionary({
          keyValues: {
            c: new PrimitiveNumber(3),
            d: new PrimitiveList({
              values: [new PrimitiveNumber(4), new PrimitiveNumber(5)],
            }),
          },
        }),
      },
    })
  )
})
