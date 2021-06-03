import { expectError, expectOutput } from '../helpers'

const expectOutputWithMaths = (string: string) =>
  expectOutput('import maths \n' + string)

it('should have constants', async () => {
  await expectOutputWithMaths('maths.pi').toEqual(Math.PI)
  await expectOutputWithMaths('maths.e').toBe(Math.E)
  await expectOutputWithMaths('maths.infinity').toEqual(Infinity)
  await expectOutputWithMaths('maths.infinity > 10000000000000').toBe(true)
  await expectOutputWithMaths('maths.infinity < 10000000000000').toBe(false)
})

it('should error if non number is passed', async () => {
  await expectError(`import maths\n maths.ceil('hello')`)
})

it('should have ceil function', async () => {
  await expectOutputWithMaths('maths.ceil(1)').toBe(1)
  await expectOutputWithMaths('maths.ceil(1.01)').toBe(2)
  await expectOutputWithMaths('maths.ceil(1.5)').toBe(2)
  await expectOutputWithMaths('maths.ceil(72.3)').toBe(73)
  await expectError('maths.ceil(false)')
})

it('should have floor function', async () => {
  await expectOutputWithMaths('maths.floor(1)').toBe(1)
  await expectOutputWithMaths('maths.floor(1.01)').toBe(1)
  await expectOutputWithMaths('maths.floor(1.5)').toBe(1)
  await expectOutputWithMaths('maths.floor(72.3)').toBe(72)
  await expectOutputWithMaths('maths.floor(72.99)').toBe(72)
})

it('should have round function', async () => {
  await expectOutputWithMaths('maths.round(1)').toBe(1)
  await expectOutputWithMaths('maths.round(1.01)').toBe(1)
  await expectOutputWithMaths('maths.round(1.5)').toBe(2)
  await expectOutputWithMaths('maths.round(2.5)').toBe(3)
  await expectOutputWithMaths('maths.round(72.3)').toBe(72)
  await expectOutputWithMaths('maths.round(72.99)').toBe(73)
})

it('should have abs function', async () => {
  await expectOutputWithMaths('maths.abs(1)').toBe(1)
  await expectOutputWithMaths('maths.abs(1.01)').toBe(1.01)
  await expectOutputWithMaths('maths.abs(1.5)').toBe(1.5)
  await expectOutputWithMaths('maths.abs(-1)').toBe(1)
  await expectOutputWithMaths('maths.abs(-1.01)').toBe(1.01)
  await expectOutputWithMaths('maths.abs(-1.5)').toBe(1.5)
})

it('should have sqrt/cbrt function', async () => {
  await expectOutputWithMaths('maths.sqrt(4)').toBe(2)
  await expectOutputWithMaths('maths.cbrt(8)').toBe(2)
})

it('should have sin/cos/tan function', async () => {
  await expectOutputWithMaths('maths.sin(0)').toBeCloseTo(0)
  await expectOutputWithMaths('maths.cos(0)').toBeCloseTo(1)
  await expectOutputWithMaths('maths.tan(0)').toBeCloseTo(0)

  await expectOutputWithMaths('maths.sin(maths.pi/6)').toBeCloseTo(0.5)
  await expectOutputWithMaths('maths.cos(maths.pi/6)').toBeCloseTo(
    Math.sqrt(3) / 2
  )
  await expectOutputWithMaths('maths.tan(maths.pi/6)').toBeCloseTo(
    Math.sqrt(3) / 3
  )
})

it('should have arcSin/arcCos/arcTan function', async () => {
  await expectOutputWithMaths('maths.arcSin(0)').toBeCloseTo(0)
  await expectOutputWithMaths('maths.arcCos(1)').toBeCloseTo(0)
  await expectOutputWithMaths('maths.arcTan(0)').toBeCloseTo(0)

  await expectOutputWithMaths('maths.arcSin(0.5)').toBeCloseTo(Math.PI / 6)
  await expectOutputWithMaths('maths.arcCos(maths.sqrt(3)/2)').toBeCloseTo(
    Math.PI / 6
  )
  await expectOutputWithMaths('maths.arcTan(maths.sqrt(3)/3)').toBeCloseTo(
    Math.PI / 6
  )

  await expectOutputWithMaths('maths.arcSin(55)').toBe(null)
  await expectOutputWithMaths('maths.arcCos(55)').toBe(null)
})

it('should have sign function', async () => {
  await expectOutputWithMaths('maths.sign(0)').toBe(0)
  await expectOutputWithMaths('maths.sign(-0)').toBe(0)
  await expectOutputWithMaths('maths.sign(44)').toBe(1)
  await expectOutputWithMaths('maths.sign(-7)').toBe(-1)
})

it('should have ln function', async () => {
  await expectOutputWithMaths('maths.ln(1)').toBe(0)
  await expectOutputWithMaths('maths.ln(maths.e)').toBe(1)
})

it('should have log function', async () => {
  await expectOutputWithMaths('maths.log(1)').toBe(0)
  await expectOutputWithMaths('maths.log(10)').toBe(1)
  await expectOutputWithMaths('maths.log(100)').toBe(2)
})

it('should have exp function', async () => {
  await expectOutputWithMaths('maths.exp(0)').toBe(1)
  await expectOutputWithMaths('maths.exp(1)').toBe(Math.E)
})

it('should have hyperbolic trig functions', async () => {
  await expectOutputWithMaths('maths.sinh(0)').toBe(0)
  await expectOutputWithMaths('maths.cosh(0)').toBe(1)
  await expectOutputWithMaths('maths.tanh(0)').toBe(0)
  await expectOutputWithMaths('maths.arcSinh(0)').toBe(0)
  await expectOutputWithMaths('maths.arcCosh(1)').toBe(0)
  await expectOutputWithMaths('maths.arcTanh(0)').toBe(0)
})
