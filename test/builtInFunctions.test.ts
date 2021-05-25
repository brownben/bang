import { execute, expectError, expectOutput } from './helpers'

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
    expectOutput('maths.pi').toEqual(Math.PI)
    expectOutput('maths.e').toBe(Math.E)
  })

  it('should have ceil function', () => {
    expectOutput('maths.ceil(1)').toBe(1)
    expectOutput('maths.ceil(1.01)').toBe(2)
    expectOutput('maths.ceil(1.5)').toBe(2)
    expectOutput('maths.ceil(72.3)').toBe(73)
    expectError('maths.ceil(false)')
  })

  it('should have floor function', () => {
    expectOutput('maths.floor(1)').toBe(1)
    expectOutput('maths.floor(1.01)').toBe(1)
    expectOutput('maths.floor(1.5)').toBe(1)
    expectOutput('maths.floor(72.3)').toBe(72)
    expectOutput('maths.floor(72.99)').toBe(72)
  })

  it('should have round function', () => {
    expectOutput('maths.round(1)').toBe(1)
    expectOutput('maths.round(1.01)').toBe(1)
    expectOutput('maths.round(1.5)').toBe(2)
    expectOutput('maths.round(2.5)').toBe(3)
    expectOutput('maths.round(72.3)').toBe(72)
    expectOutput('maths.round(72.99)').toBe(73)
  })

  it('should have abs function', () => {
    expectOutput('maths.abs(1)').toBe(1)
    expectOutput('maths.abs(1.01)').toBe(1.01)
    expectOutput('maths.abs(1.5)').toBe(1.5)
    expectOutput('maths.abs(-1)').toBe(1)
    expectOutput('maths.abs(-1.01)').toBe(1.01)
    expectOutput('maths.abs(-1.5)').toBe(1.5)
  })

  it('should have sqrt/cbrt function', () => {
    expectOutput('maths.sqrt(4)').toBe(2)
    expectOutput('maths.cbrt(8)').toBe(2)
  })

  it('should have sin/cos/tan function', () => {
    expectOutput('maths.sin(0)').toBeCloseTo(0)
    expectOutput('maths.cos(0)').toBeCloseTo(1)
    expectOutput('maths.tan(0)').toBeCloseTo(0)

    expectOutput('maths.sin(maths.pi/6)').toBeCloseTo(0.5)
    expectOutput('maths.cos(maths.pi/6)').toBeCloseTo(Math.sqrt(3) / 2)
    expectOutput('maths.tan(maths.pi/6)').toBeCloseTo(Math.sqrt(3) / 3)
  })

  it('should have arcSin/arcCos/arcTan function', () => {
    expectOutput('maths.arcSin(0)').toBeCloseTo(0)
    expectOutput('maths.arcCos(1)').toBeCloseTo(0)
    expectOutput('maths.arcTan(0)').toBeCloseTo(0)

    expectOutput('maths.arcSin(0.5)').toBeCloseTo(Math.PI / 6)
    expectOutput('maths.arcCos(maths.sqrt(3)/2)').toBeCloseTo(Math.PI / 6)
    expectOutput('maths.arcTan(maths.sqrt(3)/3)').toBeCloseTo(Math.PI / 6)

    expectOutput('maths.arcSin(55)').toBe(null)
    expectOutput('maths.arcCos(55)').toBe(null)
  })

  it('should have sign function', () => {
    expectOutput('maths.sign(0)').toBe(0)
    expectOutput('maths.sign(-0)').toBe(0)
    expectOutput('maths.sign(44)').toBe(1)
    expectOutput('maths.sign(-7)').toBe(-1)
  })

  it('should have ln function', () => {
    expectOutput('maths.ln(1)').toBe(0)
    expectOutput('maths.ln(maths.e)').toBe(1)
  })

  it('should have log function', () => {
    expectOutput('maths.log(1)').toBe(0)
    expectOutput('maths.log(10)').toBe(1)
    expectOutput('maths.log(100)').toBe(2)
  })

  it('should have exp function', () => {
    expectOutput('maths.exp(0)').toBe(1)
    expectOutput('maths.exp(1)').toBe(Math.E)
  })

  it('should have hyperbolic trig functions', () => {
    expectOutput('maths.sinh(0)').toBe(0)
    expectOutput('maths.cosh(0)').toBe(1)
    expectOutput('maths.tanh(0)').toBe(0)
    expectOutput('maths.arcSinh(0)').toBe(0)
    expectOutput('maths.arcCosh(1)').toBe(0)
    expectOutput('maths.arcTanh(0)').toBe(0)
  })
})
