import { execute, expectError, expectOutput } from '../helpers'

const expectOutputWithUnique = (string: string) =>
  expectOutput('import unique \n' + string)

describe('print functions', () => {
  it('should throw error if no arguments are passed', async () => {
    await expectError('print(1, 2)')
  })

  it('should throw error if 2 arguments are passed', async () => {
    await expectError('print()')
  })

  it('should display literal values', async () => {
    const mock = jest.fn()
    await execute('print(5)', { printFunction: mock })
    expect(mock).toHaveBeenLastCalledWith(5)
    await execute('print("hello world")', { printFunction: mock })
    expect(mock).toHaveBeenLastCalledWith('hello world')
    await execute('print(false)', { printFunction: mock })
    expect(mock).toHaveBeenLastCalledWith(false)
    await execute('print(null)', { printFunction: mock })
    expect(mock).toHaveBeenLastCalledWith(null)
  })

  it('should display value of expressions', async () => {
    const mock = jest.fn()
    await execute('print(5 + 5)', { printFunction: mock })
    expect(mock).toHaveBeenLastCalledWith(10)
    await execute('print(22 / 2)', { printFunction: mock })
    expect(mock).toHaveBeenLastCalledWith(11)
    await execute('print("hello " + "world")', { printFunction: mock })
    expect(mock).toHaveBeenLastCalledWith('hello world')
    await execute('print(false == 5 > 9)', { printFunction: mock })
    expect(mock).toHaveBeenLastCalledWith(true)
    await execute('print(5 * 5 - 9 == 8 * 2)', { printFunction: mock })
    expect(mock).toHaveBeenLastCalledWith(true)
  })

  it('should have correct string representation value', async () => {
    const mock = jest.fn()
    await execute('print(print)', { printFunction: mock })
    expect(mock).toHaveBeenLastCalledWith('<function print>')
  })
})

describe('type function', () => {
  it('should throw error if no arguments are passed', async () => {
    await expectError('type(1, 2)')
  })

  it('should throw error if 2 arguments are passed', async () => {
    await expectError('type()')
  })

  it('should have correct string representation value', async () => {
    await expectOutput('type').toBe('<function type>')
  })

  it('should return the correct type of values', async () => {
    await expectOutput('type(`a`)').toBe('string')
    await expectOutput('type("hello world")').toBe('string')
    await expectOutput('type(1)').toBe('number')
    await expectOutput('type(0.21)').toBe('number')
    await expectOutput('type(785.26)').toBe('number')
    await expectOutput('type(true)').toBe('boolean')
    await expectOutput('type(false)').toBe('boolean')
    await expectOutput('type(null)').toBe('null')
    await expectOutput('type(print)').toBe('function')
  })

  it('should be able to be imported', async () => {
    await execute('import type as getTypeOf')
  })
})

describe('unique', () => {
  it('should have uniques not equal', async () => {
    await expectOutputWithUnique('unique() != unique()').toBe(true)
    await expectOutputWithUnique('unique()').toBeDefined()
  })

  it('value should be equal to itself', async () => {
    await expectOutputWithUnique('let a = unique()\n a == a').toBe(true)
  })

  it('value should be truthy', async () => {
    await expectOutputWithUnique('unique().toBoolean()').toBe(true)
    await expectOutputWithUnique('let a\n if(unique) a = 7\n a == 7').toBe(true)
    await expectOutputWithUnique('unique() || false').not.toBe(false)
  })
})
