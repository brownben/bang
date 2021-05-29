import { execute, expectEnviroment, expectError, expectOutput } from './helpers'
import { writeFileSync } from 'fs'

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
    expectOutputWithMaths('maths.pi').toEqual(Math.PI)
    expectOutputWithMaths('maths.e').toBe(Math.E)
    expectOutputWithMaths('maths.infinity').toEqual(Infinity)
    expectOutputWithMaths('maths.infinity > 10000000000000').toBe(true)
    expectOutputWithMaths('maths.infinity < 10000000000000').toBe(false)
  })

  it('should error if non number is passed', () => {
    expectError(`import maths\n maths.ceil('hello')`)
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

  it('should destructure imports', () => {
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

  it('should be possible to import under a different name', () => {
    expectEnviroment(`
import print as consoleLog
consoleLog`).toHaveValue('consoleLog', '<function print>')
  })
})

describe('unique', () => {
  it('should have uniques not equal', () => {
    expectOutputWithUnique('unique() != unique()').toBe(true)
    expectOutputWithUnique('unique()').toBeDefined()
  })

  it('value should be equal to itself', () => {
    expectOutputWithUnique('let a = unique()\n a == a').toBe(true)
  })

  it('value should be truthy', () => {
    expectOutputWithUnique('unique().toBoolean()').toBe(true)
    expectOutputWithUnique('!unique()').toBe(false)
    expectOutputWithUnique('let a\n if(unique) a = 7\n a == 7').toBe(true)
    expectOutputWithUnique('unique() || false').not.toBe(false)
  })
})

describe('regex', () => {
  it('should only be constructed with a string', () => {
    expectError('import regex\n regex(7)')
  })

  it('should create regex', () => {
    expectOutputWithRegex(`regex('[0-9]+').test('123')`).toBe(true)
    expectOutputWithRegex(`regex('[0-9]+').test('aa')`).toBe(false)
  })

  it('should create regex with flag', () => {
    expectOutputWithRegex(`regex('hello').test('HELLO')`).toBe(false)
    expectOutputWithRegex(`regex('HellO', 'i').test('HELLO')`).toBe(true)
  })

  it('should accept string for test', () => {
    expectError(`import regex\n regex('').test(7)`)
  })

  it('should work with multiple regex', () => {
    expectOutputWithRegex(`let a = regex('hello')
let b = regex('5+')
[a.test('hello world'), a.test('55'), b.test('hello world'), b.test('55')]`).toEqual(
      [true, false, false, true]
    )
  })

  it('should not be equal to another regex', () => {
    expectOutputWithRegex('regex("a") == regex("b")').toBe(false)
    expectOutputWithRegex('regex("a") != regex("b")').toBe(true)
  })
})

describe('json', () => {
  it('should parse values from string', () => {
    expectOutputWithJSON('json.parse("2")').toBe(2)
    expectOutputWithJSON('json.parse(`"2"`)').toBe('2')
    expectOutputWithJSON('type(json.parse(`"<unique>"`)) == `unique`')
    expectOutputWithJSON('json.parse("[1,2,3]")').toEqual([1, 2, 3])
    expectOutputWithJSON('json.parse(`{"a":2}`)').toEqual({ a: 2 })
    expectOutputWithJSON('json.parse("true")').toBe(true)
    expectOutputWithJSON('json.parse("null")').toBe(null)
  })

  it('should parse nested dictionaries', () => {
    expectOutputWithJSON(
      `json.parse('{"1": 1, "2": 2, "3": {"4": 4, "5": {"6": 6}}}')`
    ).toEqual({ '1': 1, '2': 2, '3': { '4': 4, '5': { '6': 6 } } })
  })

  it('should throw error on invalid json', () => {
    expectError('import json\n json.parse("{a:4}")')
  })

  it('should only parse a string', () => {
    expectError('import json\n json.parse(7)')
  })

  it('should stringify objects', () => {
    expectOutputWithJSON(
      `json.stringify({"1": 1, "2": 2, "3": {"4": 4, "5": {"6": 6}}})`
    ).toBe('{"1":1,"2":2,"3":{"4":4,"5":{"6":6}}}')
    expectOutputWithJSON(
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

  it('should stringify primitives', () => {
    expectOutputWithJSON(`json.stringify(2)`).toBe('2')
    expectOutputWithJSON(`json.stringify(true)`).toBe('true')
    expectOutputWithJSON(`json.stringify(false)`).toBe('false')
    expectOutputWithJSON(`json.stringify(null)`).toBe('null')
    expectOutputWithJSON(`json.stringify('hi')`).toBe('"hi"')
    expectOutputWithJSON(`import unique\n json.stringify(unique())`).toBe(
      '"<unique>"'
    )
  })
})

describe('file', () => {
  beforeAll(() => {
    writeFileSync('./testFile.txt', 'test data')
  })
  afterAll(() => execute('import file \n file.remove("./testFile.txt")'))

  it('should read files', () => {
    expectOutputWithFile('file.read("./testFile.txt")').toBe('test data')
    expectError('import file\n file.read(7)')
  })

  it('should check for existance of file', () => {
    expectOutputWithFile('file.exists("./testFile.txt")').toBe(true)
    expectOutputWithFile('file.exists("./testFileMissing.txt")').toBe(false)
    expectError('import file\n file.exists(7)')
  })

  it('should write to files', () => {
    expectOutputWithFile('file.write("./testFile.txt", "new data")').toBe(null)
    expectOutputWithFile('file.read("./testFile.txt")').toBe('new data')
    expectError('import file\n file.write(7,7)')
    expectError('import file\n file.write("hello", 7)')
  })

  it('should append to files', () => {
    expectOutputWithFile('file.append("./testFile.txt", "even more")').toBe(
      null
    )
    expectOutputWithFile('file.read("./testFile.txt")').toBe(
      'new dataeven more'
    )
    expectError('import file\n file.append(7, 7)')
    expectError('import file\n file.append("hello", 7)')
  })

  it('should copy files', () => {
    expectOutputWithFile('file.copy("./testFile.txt", "./testFile2.txt")').toBe(
      null
    )
    expectOutputWithFile('file.exists("./testFile2.txt")').toBe(true)
    expectError('import file\n file.copy(7, 7)')
    expectError('import file\n file.copy("hello", 7)')
  })

  it('should delete files', () => {
    expectOutputWithFile('file.remove("./testFile2.txt")').toBe(null)
    expectOutputWithFile('file.exists("./testFile2.txt")').toBe(false)
    expectError('import file\n file.remove(7)')
  })

  it('should create directpry', () => {
    expectOutputWithFile('file.createDirectory("./testDir")').toBe(null)
    expectError('import file\n file.createDirectory(7)')
  })

  it('should create files in directory', () => {
    expectOutputWithFile(
      'file.write("./testDir/testFile.txt", "new data")'
    ).toBe(null)
    expectOutputWithFile(
      'file.write("./testDir/testFile1.txt", "new data")'
    ).toBe(null)
  })
  it('should error removing directory if contents', () => {
    expectError('import file\n file.removeDirectory("./testFile.txt")')
  })

  it('should list directory contents', () => {
    expectOutputWithFile('file.list("./testDir")').toEqual([
      'testFile.txt',
      'testFile1.txt',
    ])
    expectOutputWithFile('file.remove("./testDir/testFile.txt")').toBe(null)
    expectOutputWithFile('file.remove("./testDir/testFile1.txt")').toBe(null)
    expectOutputWithFile('file.list("./testDir")').toEqual([])
    expectError('import file\n file.list(7)')
  })

  it('should remove directory', () => {
    expectOutputWithFile('file.removeDirectory("./testDir")').toBe(null)
    expectError('import file\n file.removeDirectory(7)')
  })

  it('should error if file doesnt exist', () => {
    expectError('import file\n file.read("./testFile/ad/c.txt")')
    expectError('import file\n file.append("./testFile/ad/c.txt", "")')
    expectError('import file\n file.write("./testFile/ad/c.txt", "")')
    expectError('import file\n file.remove("./testFile/ad/c.txt")')
    expectError('import file\n file.copy("./testFile/ad/c.txt", "./2")')
    expectError('import file\n file.list("./testFile.txt")')
    expectError('import file\n file.removeDirectory("./testFile.txt")')
    expectError('import file\n file.createDirectory("./testFile/ad/c.txt")')
  })
})
