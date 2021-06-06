import { PrimitiveNull, ReturnValue } from '../../src/primitives'
import {
  expectEnviroment,
  expectError as expectErrorRaw,
  expectOutput as expectOutputRaw,
  ExternalIO,
} from '../helpers'

const expectOutput = (
  string: string,
  foreignValues?: Record<string, unknown>
) =>
  expectOutputRaw(
    'from testing import { expect, it } \n' + string,
    undefined,
    foreignValues
  )
const expectError = (
  string: string,
  external?: ExternalIO,
  foreignValues?: Record<string, unknown>
) =>
  expectErrorRaw(
    'from testing import { expect, it } \n' + string,
    external,
    foreignValues
  )

describe('expect', () => {
  it('should throw if value not equal', async () => {
    await expectError('expect(3).toEqual(4)')
    await expectError('expect("hello").toEqual("world")')
  })

  it('should not throw if value is equal', async () => {
    await expectOutput('expect(3).toEqual(3)').toEqual(null)
    await expectOutput('expect(3.0).toEqual(3)').toEqual(null)
    await expectOutput('expect(1 + 2).toEqual(3)').toEqual(null)
    await expectOutput('expect("hello").toEqual("hello")').toEqual(null)
  })

  it("should throw if function doesn't error", async () => {
    await expectError('expect(() => null).toThrow()')
    await expectError('expect(() => 2 + 3).toThrow()')
  })

  it('should not throw if function throws', async () => {
    await expectOutput(
      'expect(() => throw("error message")).toThrow()'
    ).toEqual(null)
    await expectOutput('expect(() => 2 + "").toThrow()').toEqual(null)
  })

  it('should not throw if not a function is expected to throw', async () => {
    await expectError('expect(1).toThrow()')
    await expectError('expect("").toThrow()')
  })

  it('should error if throws non bang error', async () => {
    await expectError(`expect(a).toThrow()`, undefined, {
      a: () => {
        throw new Error()
      },
    })

    await expectError(`expect(a).toThrow()`, undefined, {
      a: () => {
        throw new ReturnValue(new PrimitiveNull())
      },
    })
  })
})

describe('it', () => {
  it('should take description as a string', async () => {
    await expectError('it(7, () => 7)')
    await expectError('it(null, () => 7)')
    await expectError('it(() => 5, () => 7)')
  })

  it('should take test as a function', async () => {
    await expectError('it("", 7)')
    await expectError('it("", "")')
    await expectError('it("", null)')
  })

  it('should just throw error if no variable for capture is defined', async () => {
    await expectError('it("test", () => expect(4).toEqual(5))')
  })

  it('should just throw error if capture variable is not a dictionary', async () => {
    await expectError('it("test", () => expect(4).toEqual(5))', undefined, {
      $_BANG_TEST_RESULTS_$: '',
    })
  })

  it('should add to capture dictionary if exists', async () => {
    await expectEnviroment(
      'from testing import {it, expect}\n it ("1", () => null)',
      undefined,
      { $_BANG_TEST_RESULTS_$: {} }
    ).toHaveValue('$_BANG_TEST_RESULTS_$', { '1': null })

    await expectEnviroment(
      'from testing import {it, expect}\n it ("1", () => 7 + "")',
      undefined,
      { $_BANG_TEST_RESULTS_$: {} }
    ).toHaveValue('$_BANG_TEST_RESULTS_$', {
      '1': 'Error: No Operation "+" on type "number" and type "string"',
    })

    await expectEnviroment(
      'from testing import {it, expect}\n it ("1", () => 7)',
      undefined,
      { $_BANG_TEST_RESULTS_$: {} }
    ).toHaveValue('$_BANG_TEST_RESULTS_$', {
      '1': null,
    })
  })

  it('should not error if it returns', async () => {
    await expectOutput(`it("test", () =>
    return 7
)`).toBe(null)
  })

  it('should add space to description if multiple with the same description', async () => {
    await expectOutput(
      `it("1", () => null)\n it("1", () => null)\n it("1", () => null)`,
      { $_BANG_TEST_RESULTS_$: {} }
    ).toEqual(null)
  })

  it('should error if throws non bang error', async () => {
    await expectError(
      `it("test", () =>
    a()
)`,
      undefined,
      {
        a: () => {
          throw new Error()
        },
      }
    )
  })
})
