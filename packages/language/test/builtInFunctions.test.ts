import {
  execute,
  expectEnviroment,
  expectError,
  expectOutput,
  ExternalIO,
  mockFetch,
} from './helpers'
import { writeFileSync, rmSync } from 'fs'
import { Enviroment } from '../src/Enviroment'

const expectOutputWithMaths = (string: string) =>
  expectOutput('import maths \n' + string)

const expectOutputWithUnique = (string: string) =>
  expectOutput('import unique \n' + string)

const expectOutputWithRegex = (string: string) =>
  expectOutput('import regex \n' + string)

const expectOutputWithJSON = (string: string) =>
  expectOutput('import json \n' + string)

const expectOutputWithFile = (string: string) =>
  expectOutput('import file \n' + string)

const expectOutputWithFetch = (string: string, externalIO?: ExternalIO) =>
  expectOutput('import fetch \n' + string, externalIO)

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

describe('maths', () => {
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
})

describe('import builtins', () => {
  it('should throw if an unknown is imported', async () => {
    await expectError('import x')
    await expectError('import x as y')
  })

  it('should destructure imports', async () => {
    expectEnviroment('from json import {stringify}').toHaveValue(
      'stringify',
      '<function json.stringify>'
    )

    expectEnviroment('from json import {stringify:toString}').toHaveValue(
      'toString',
      '<function json.stringify>'
    )

    expectEnviroment('from json import {stringify, unknown}').toHaveValue(
      'unknown',
      null
    )
    expectEnviroment('from print import { unknown }').toHaveValue(
      'unknown',
      null
    )
  })

  it('should be possible to import under a different name', async () => {
    expectEnviroment(`
import print as consoleLog
consoleLog`).toHaveValue('consoleLog', '<function print>')
  })

  it('should import from block', async () => {
    await execute('    import file')
    expect(new Enviroment().getExternalIO()).toEqual({})
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

describe('regex', () => {
  it('should only be constructed with a string', async () => {
    await expectError('import regex\n regex(7)')
  })

  it('should create regex', async () => {
    await expectOutputWithRegex(`regex('[0-9]+').test('123')`).toBe(true)
    await expectOutputWithRegex(`regex('[0-9]+').test('aa')`).toBe(false)
  })

  it('should create regex with flag', async () => {
    await expectOutputWithRegex(`regex('hello').test('HELLO')`).toBe(false)
    await expectOutputWithRegex(`regex('HellO', 'i').test('HELLO')`).toBe(true)
  })

  it('should accept string for test', async () => {
    await expectError(`import regex\n regex('').test(7)`)
  })

  it('should work with multiple regex', async () => {
    await expectOutputWithRegex(`let a = regex('hello')
let b = regex('5+')
[a.test('hello world'), a.test('55'), b.test('hello world'), b.test('55')]`).toEqual(
      [true, false, false, true]
    )
  })

  it('should not be equal to another regex', async () => {
    await expectOutputWithRegex('regex("a") == regex("b")').toBe(false)
    await expectOutputWithRegex('regex("a") != regex("b")').toBe(true)
  })
})

describe('json', () => {
  it('should parse values from string', async () => {
    await expectOutputWithJSON('json.parse("2")').toBe(2)
    await expectOutputWithJSON('json.parse(`"2"`)').toBe('2')
    await expectOutputWithJSON('type(json.parse(`"<unique>"`)) == `unique`')
    await expectOutputWithJSON('json.parse("[1,2,3]")').toEqual([1, 2, 3])
    await expectOutputWithJSON('json.parse(`{"a":2}`)').toEqual({ a: 2 })
    await expectOutputWithJSON('json.parse("true")').toBe(true)
    await expectOutputWithJSON('json.parse("null")').toBe(null)
  })

  it('should parse nested dictionaries', async () => {
    await expectOutputWithJSON(
      `json.parse('{"1": 1, "2": 2, "3": {"4": 4, "5": {"6": 6}}}')`
    ).toEqual({ '1': 1, '2': 2, '3': { '4': 4, '5': { '6': 6 } } })
  })

  it('should throw error on invalid json', async () => {
    await expectError('import json\n json.parse("{a:4}")')
  })

  it('should only parse a string', async () => {
    await expectError('import json\n json.parse(7)')
  })

  it('should stringify objects', async () => {
    await expectOutputWithJSON(
      `json.stringify({"1": 1, "2": 2, "3": {"4": 4, "5": {"6": 6}}})`
    ).toBe('{"1":1,"2":2,"3":{"4":4,"5":{"6":6}}}')
    await expectOutputWithJSON(
      `json.stringify({"1": 1, "2": 2, "3": {"4": 4, "5": {"6": 6}}}, 2)`
    ).toBe(`{
  "1": 1,
  "2": 2,
  "3": {
    "4": 4,
    "5": {
      "6": 6
    }
  }
}`)
  })

  it('should stringify primitives', async () => {
    await expectOutputWithJSON(`json.stringify(2)`).toBe('2')
    await expectOutputWithJSON(`json.stringify(true)`).toBe('true')
    await expectOutputWithJSON(`json.stringify(false)`).toBe('false')
    await expectOutputWithJSON(`json.stringify(null)`).toBe('null')
    await expectOutputWithJSON(`json.stringify('hi')`).toBe('"hi"')
    await expectOutputWithJSON(`import unique\n json.stringify(unique())`).toBe(
      '"<unique>"'
    )
  })
})

describe('file', () => {
  beforeAll(() => {
    writeFileSync('./testFile.txt', 'test data')
  })
  afterAll(() => rmSync('./testFile.txt'))

  it('should read files', async () => {
    await expectOutputWithFile('file.read("./testFile.txt")').toBe('test data')
    await expectError('import file\n file.read(7)')
  })

  it('should write to files', async () => {
    await expectOutputWithFile('file.write("./testFile.txt", "new data")').toBe(
      null
    )
    await expectOutputWithFile('file.read("./testFile.txt")').toBe('new data')
    await expectError('import file\n file.write(7,7)')
    await expectError('import file\n file.write("hello", 7)')
  })

  it('should append to files', async () => {
    await expectOutputWithFile(
      'file.append("./testFile.txt", "even more")'
    ).toBe(null)
    await expectOutputWithFile('file.read("./testFile.txt")').toBe(
      'new dataeven more'
    )
    await expectError('import file\n file.append(7, 7)')
    await expectError('import file\n file.append("hello", 7)')
  })

  it('should copy files', async () => {
    await expectOutputWithFile(
      'file.copy("./testFile.txt", "./testFile2.txt")'
    ).toBe(null)
    await expectError('import file\n file.copy(7, 7)')
    await expectError('import file\n file.copy("hello", 7)')
  })

  it('should delete files', async () => {
    await expectOutputWithFile('file.remove("./testFile2.txt")').toBe(null)
    await expectError('import file\n file.remove(7)')
  })

  it('should create directpry', async () => {
    await expectOutputWithFile('file.createDirectory("./testDir")').toBe(null)
    await expectError('import file\n file.createDirectory(7)')
  })

  it('should create files in directory', async () => {
    await expectOutputWithFile(
      'file.write("./testDir/testFile.txt", "new data")'
    ).toBe(null)
    await expectOutputWithFile(
      'file.write("./testDir/testFile1.txt", "new data")'
    ).toBe(null)
  })
  it('should error removing directory if contents', async () => {
    await expectError('import file\n file.removeDirectory("./testFile.txt")')
  })

  it('should list directory contents', async () => {
    await expectOutputWithFile('file.list("./testDir")').toEqual([
      'testFile.txt',
      'testFile1.txt',
    ])
    await expectOutputWithFile('file.remove("./testDir/testFile.txt")').toBe(
      null
    )
    await expectOutputWithFile('file.remove("./testDir/testFile1.txt")').toBe(
      null
    )
    await expectOutputWithFile('file.list("./testDir")').toEqual([])
    await expectError('import file\n file.list(7)')
  })

  it('should remove directory', async () => {
    await expectOutputWithFile('file.removeDirectory("./testDir")').toBe(null)
    await expectError('import file\n file.removeDirectory(7)')
  })

  it('should error if file doesnt exist', async () => {
    await expectError('import file\n file.read("./testFile/ad/c.txt")')
    await expectError('import file\n file.append("./testFile/ad/c.txt", "")')
    await expectError('import file\n file.write("./testFile/ad/c.txt", "")')
    await expectError('import file\n file.remove("./testFile/ad/c.txt")')
    await expectError('import file\n file.copy("./testFile/ad/c.txt", "./2")')
    await expectError('import file\n file.list("./testFile.txt")')
    await expectError('import file\n file.removeDirectory("./testFile.txt")')
    await expectError(
      'import file\n file.createDirectory("./testFile/ad/c.txt")'
    )
  })

  it('should error filesystem not defined', async () => {
    await expectError('import file\n file.read("./testFile/ad/c.txt")', {})
    await expectError(
      'import file\n file.append("./testFile/ad/c.txt", "")',
      {}
    )
    await expectError('import file\n file.write("./testFile/ad/c.txt", "")', {})
    await expectError('import file\n file.remove("./testFile/ad/c.txt")', {})
    await expectError(
      'import file\n file.copy("./testFile/ad/c.txt", "./2")',
      {}
    )
    await expectError('import file\n file.list("./testFile.txt")', {})
    await expectError(
      'import file\n file.removeDirectory("./testFile.txt")',
      {}
    )
    await expectError(
      'import file\n file.createDirectory("./testFile/ad/c.txt")',
      {}
    )
  })
})

describe('fetch', () => {
  it('should get data', async () => {
    await expectOutputWithFetch('fetch.get("test")').toEqual({
      text: '"test"',
      json: 'test',
      status: 200,
      ok: true,
      headers: {},
      redirected: false,
    })

    await expectOutputWithFetch('fetch.get("test")', {
      fetch: mockFetch('{"hello": 44, "world": true}'),
    }).toEqual({
      text: '{"hello": 44, "world": true}',
      json: { hello: 44, world: true },
      status: 200,
      ok: true,
      headers: {},
      redirected: false,
    })

    await expectOutputWithFetch('fetch.get("test")', {
      fetch: mockFetch('hats'),
    }).toEqual({
      text: 'hats',
      json: null,
      status: 200,
      ok: true,
      headers: {},
      redirected: false,
    })
  })

  it('should accept correct arguments', async () => {
    await expectError('import fetch\n fetch.get(77)')
    await expectError('import fetch\n fetch.get("test", 77)')
    await expectError('import fetch\n fetch.get("test", {headers:77})')
  })

  it('should convert body correctly', async () => {
    const mock = mockFetch('hats')

    await execute('import fetch\n fetch.get("test", {body: `Hello World`})', {
      fetch: mock,
    })
    expect(mock).toHaveBeenLastCalledWith('test', {
      method: 'GET',
      headers: undefined,
      body: 'Hello World',
    })

    await execute(
      'import fetch\n fetch.get("test", {body: {"hello": 44, "world": true}})',
      {
        fetch: mock,
      }
    )
    expect(mock).toHaveBeenLastCalledWith('test', {
      method: 'GET',
      headers: undefined,
      body: '{"hello":44,"world":true}',
    })
  })

  it('should throw error if request fails', async () => {
    await expectError('import fetch\n fetch.get("test")', {
      fetch: () => Promise.reject(),
    })
  })

  it('should error if fetch is not defined', async () => {
    await expectError('import fetch\n fetch.get("test")', { fetch: undefined })
  })

  it('should have all http verbs', async () => {
    const mock = mockFetch('hats')

    await execute('import fetch\n fetch.put("test", {body: `Hello World`})', {
      fetch: mock,
    })
    expect(mock).toHaveBeenLastCalledWith('test', {
      method: 'PUT',
      headers: undefined,
      body: 'Hello World',
    })

    await execute('import fetch\n fetch.post("test", {body: `Hello World`})', {
      fetch: mock,
    })
    expect(mock).toHaveBeenLastCalledWith('test', {
      method: 'POST',
      headers: undefined,
      body: 'Hello World',
    })

    await execute('import fetch\n fetch.patch("test", {body: `Hello World`})', {
      fetch: mock,
    })
    expect(mock).toHaveBeenLastCalledWith('test', {
      method: 'PATCH',
      headers: undefined,
      body: 'Hello World',
    })

    await execute(
      'import fetch\n fetch.delete("test", {body: `Hello World`})',
      {
        fetch: mock,
      }
    )
    expect(mock).toHaveBeenLastCalledWith('test', {
      method: 'DELETE',
      headers: undefined,
      body: 'Hello World',
    })
  })
})
