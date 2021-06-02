import { expectEnviroment, execute, expectError, expectOutput } from './helpers'

describe('if statements await execute properly', () => {
  it('should await execute expression when condition is truthy', async () => {
    await expectEnviroment(`let a = 0
if (true) a = 1`).toHaveValue('a', 1)
    await expectEnviroment(`let a = 0
if ("hello") a = 1`).toHaveValue('a', 1)
  })

  it('should not await execute expression when condition is falsy', async () => {
    await expectEnviroment(`let a = 0
if (false) let a = 1`).toHaveValue('a', 0)
    await expectEnviroment(`let a = 0
if (null) let a = 1`).toHaveValue('a', 0)
  })

  it('should match block to if statement', async () => {
    await expectEnviroment(`let a = 5
if (true)
  a = 4
else
  a = 5
a
`).toHaveValue('a', 4)
    await expectEnviroment(`let a = 5
if (false)
  a = 4
else
  a = 6
a
`).toHaveValue('a', 6)
  })

  it('should await execute else statement if condition is falsy', async () => {
    await expectEnviroment(`let a = 0
if (false) a = 1
else a = 2`).toHaveValue('a', 2)
  })

  it('should not await execute else statement if condition is truthy', async () => {
    await expectEnviroment(`let a = 0
if (true) a = 1
else a = 2`).toHaveValue('a', 1)
  })

  it('should associate else stament to nearest if statement', async () => {
    await expectEnviroment(`
let b = 0
if (false) b = 1
if (true) b = 2
else b = 3`).toHaveValue('b', 2)
    await expectEnviroment(`
let c = 0
if (true)
  c = 1
  if (false) c = 4
else c = 3`).toHaveValue('c', 1)
    await expectEnviroment(`
let a = 0
if (true) a = 1
if (false) a = 2
else a = 3`).toHaveValue('a', 3)
  })

  it('should handle else if', async () => {
    await expectEnviroment(`let a = 0
if (a > 1) a = 1
else if (a == 0) a = 2
else a = 3`).toHaveValue('a', 2)
  })
})

describe('while statements await execute correctly', () => {
  it('should loop 5 times', async () => {
    const mock = jest.fn()
    await execute(
      `
let a = 5
while (a > 0)
  print(a)
  a = a - 1
    `,
      { printFunction: mock }
    )
    expect(mock).toHaveBeenCalledTimes(5)
    expect(mock).toHaveBeenLastCalledWith(1)
    expect(mock).toHaveBeenCalledWith(5)
    expect(mock).toHaveBeenCalledWith(4)
    expect(mock).toHaveBeenCalledWith(3)
    expect(mock).toHaveBeenCalledWith(2)
  })

  it('should not run if condition false', async () => {
    const mock = jest.fn()
    await execute(
      `
let a = 5
while (false)
  print(a)
  a = a - 1
`,
      { printFunction: mock }
    )
    expect(mock).not.toHaveBeenCalled()
  })

  it('should detect infinite loops', async () => {
    await expectError('let a = 0\n while (true) a += 1')
    await expectOutput('let a  = 0\n while(a < 1001) a += 1').toBe(null)
  })
})
