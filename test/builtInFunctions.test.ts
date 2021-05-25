import { execute, expectError, expectOutput } from './helpers'

const expectOutputWithMaths = (string: string) =>
  expectOutput('import maths \n' + string)

describe('print functions', () => {
  const originalConsoleLog = console.log

  beforeEach(() => {
    console.log = jest.fn()
  })
  afterEach(() => {
    console.log = originalConsoleLog
  })

  it('should throw error if no arguments are passed', () => {
    expectError('print(1, 2)')
  })

  it('should throw error if 2 arguments are passed', () => {
    expectError('print()')
  })

  it('should display literal values', () => {
    execute('print(5)')
    expect(console.log).toHaveBeenLastCalledWith(5)
    execute('print("hello world")')
    expect(console.log).toHaveBeenLastCalledWith('hello world')
    execute('print(false)')
    expect(console.log).toHaveBeenLastCalledWith(false)
    execute('print(null)')
    expect(console.log).toHaveBeenLastCalledWith(null)
  })

  it('should display value of expressions', () => {
    execute('print(5 + 5)')
    expect(console.log).toHaveBeenLastCalledWith(10)
    execute('print(22 / 2)')
    expect(console.log).toHaveBeenLastCalledWith(11)
    execute('print("hello " + "world")')
    expect(console.log).toHaveBeenLastCalledWith('hello world')
    execute('print(false == 5 > 9)')
    expect(console.log).toHaveBeenLastCalledWith(true)
    execute('print(5 * 5 - 9 == 8 * 2)')
    expect(console.log).toHaveBeenLastCalledWith(true)
  })

  it('should have correct string representation value', () => {
    execute('print(print)')
    expect(console.log).toHaveBeenLastCalledWith('<function print>')
  })

  it('should be possible to import print under a different name', () => {
    execute(`
import print as consoleLog
consoleLog(5)
  `)
    expect(console.log).toHaveBeenLastCalledWith(5)
  })
})

describe('type function', () => {
  it('should throw error if no arguments are passed', () => {
    expectError('type(1, 2)')
  })

  it('should throw error if 2 arguments are passed', () => {
    expectError('type()')
  })

  it('should have correct string representation value', () => {
    expectOutput('type').toBe('<function type>')
  })

  it('should return the correct type of values', () => {
    expectOutput('type(`a`)').toBe('string')
    expectOutput('type("hello world")').toBe('string')
    expectOutput('type(1)').toBe('number')
    expectOutput('type(0.21)').toBe('number')
    expectOutput('type(785.26)').toBe('number')
    expectOutput('type(true)').toBe('boolean')
    expectOutput('type(false)').toBe('boolean')
    expectOutput('type(null)').toBe('null')
    expectOutput('type(print)').toBe('function')
  })
})

describe('maths', () => {
  it('should have constants', () => {
    expectOutputWithMaths('maths.pi').toEqual(Math.PI)
    expectOutputWithMaths('maths.e').toBe(Math.E)
  })

  it('should have ceil function', () => {
    expectOutputWithMaths('maths.ceil(1)').toBe(1)
    expectOutputWithMaths('maths.ceil(1.01)').toBe(2)
    expectOutputWithMaths('maths.ceil(1.5)').toBe(2)
    expectOutputWithMaths('maths.ceil(72.3)').toBe(73)
    expectError('maths.ceil(false)')
  })

  it('should have floor function', () => {
    expectOutputWithMaths('maths.floor(1)').toBe(1)
    expectOutputWithMaths('maths.floor(1.01)').toBe(1)
    expectOutputWithMaths('maths.floor(1.5)').toBe(1)
    expectOutputWithMaths('maths.floor(72.3)').toBe(72)
    expectOutputWithMaths('maths.floor(72.99)').toBe(72)
  })

  it('should have round function', () => {
    expectOutputWithMaths('maths.round(1)').toBe(1)
    expectOutputWithMaths('maths.round(1.01)').toBe(1)
    expectOutputWithMaths('maths.round(1.5)').toBe(2)
    expectOutputWithMaths('maths.round(2.5)').toBe(3)
    expectOutputWithMaths('maths.round(72.3)').toBe(72)
    expectOutputWithMaths('maths.round(72.99)').toBe(73)
  })

  it('should have abs function', () => {
    expectOutputWithMaths('maths.abs(1)').toBe(1)
    expectOutputWithMaths('maths.abs(1.01)').toBe(1.01)
    expectOutputWithMaths('maths.abs(1.5)').toBe(1.5)
    expectOutputWithMaths('maths.abs(-1)').toBe(1)
    expectOutputWithMaths('maths.abs(-1.01)').toBe(1.01)
    expectOutputWithMaths('maths.abs(-1.5)').toBe(1.5)
  })

  it('should have sqrt/cbrt function', () => {
    expectOutputWithMaths('maths.sqrt(4)').toBe(2)
    expectOutputWithMaths('maths.cbrt(8)').toBe(2)
  })

  it('should have sin/cos/tan function', () => {
    expectOutputWithMaths('maths.sin(0)').toBeCloseTo(0)
    expectOutputWithMaths('maths.cos(0)').toBeCloseTo(1)
    expectOutputWithMaths('maths.tan(0)').toBeCloseTo(0)

    expectOutputWithMaths('maths.sin(maths.pi/6)').toBeCloseTo(0.5)
    expectOutputWithMaths('maths.cos(maths.pi/6)').toBeCloseTo(Math.sqrt(3) / 2)
    expectOutputWithMaths('maths.tan(maths.pi/6)').toBeCloseTo(Math.sqrt(3) / 3)
  })

  it('should have arcSin/arcCos/arcTan function', () => {
    expectOutputWithMaths('maths.arcSin(0)').toBeCloseTo(0)
    expectOutputWithMaths('maths.arcCos(1)').toBeCloseTo(0)
    expectOutputWithMaths('maths.arcTan(0)').toBeCloseTo(0)

    expectOutputWithMaths('maths.arcSin(0.5)').toBeCloseTo(Math.PI / 6)
    expectOutputWithMaths('maths.arcCos(maths.sqrt(3)/2)').toBeCloseTo(
      Math.PI / 6
    )
    expectOutputWithMaths('maths.arcTan(maths.sqrt(3)/3)').toBeCloseTo(
      Math.PI / 6
    )

    expectOutputWithMaths('maths.arcSin(55)').toBe(null)
    expectOutputWithMaths('maths.arcCos(55)').toBe(null)
  })

  it('should have sign function', () => {
    expectOutputWithMaths('maths.sign(0)').toBe(0)
    expectOutputWithMaths('maths.sign(-0)').toBe(0)
    expectOutputWithMaths('maths.sign(44)').toBe(1)
    expectOutputWithMaths('maths.sign(-7)').toBe(-1)
  })

  it('should have ln function', () => {
    expectOutputWithMaths('maths.ln(1)').toBe(0)
    expectOutputWithMaths('maths.ln(maths.e)').toBe(1)
  })

  it('should have log function', () => {
    expectOutputWithMaths('maths.log(1)').toBe(0)
    expectOutputWithMaths('maths.log(10)').toBe(1)
    expectOutputWithMaths('maths.log(100)').toBe(2)
  })

  it('should have exp function', () => {
    expectOutputWithMaths('maths.exp(0)').toBe(1)
    expectOutputWithMaths('maths.exp(1)').toBe(Math.E)
  })

  it('should have hyperbolic trig functions', () => {
    expectOutputWithMaths('maths.sinh(0)').toBe(0)
    expectOutputWithMaths('maths.cosh(0)').toBe(1)
    expectOutputWithMaths('maths.tanh(0)').toBe(0)
    expectOutputWithMaths('maths.arcSinh(0)').toBe(0)
    expectOutputWithMaths('maths.arcCosh(1)').toBe(0)
    expectOutputWithMaths('maths.arcTanh(0)').toBe(0)
  })
})

describe('import builtins', () => {
  it('should throw if an unknown is imported', () => {
    expectError('import x')
    expectError('import x as y')
  })
})
