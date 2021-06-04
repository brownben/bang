import { Enviroment } from '../src/Enviroment'
import { execute, expectEnviroment, expectError } from './helpers'

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

describe('import external files', () => {
  it('should import default', async () => {
    await expectEnviroment('import "./test/data/number.bang"').toHaveValue(
      'number',
      123
    )
    await expectEnviroment('import "./test/data/string.bang"').toHaveValue(
      'string',
      'hello world'
    )
    await expectEnviroment('import "./test/data/dictionary.bang"').toHaveValue(
      'dictionary',
      {
        a: 1,
        b: 'Hello',
        c: [1, 2, 3],
      }
    )
  })

  it('should rename imports', async () => {
    await expectEnviroment(
      'import "./test/data/number.bang" as num'
    ).toHaveValue('num', 123)
    await expectEnviroment(
      'import "./test/data/string.bang" as helloWorld'
    ).toHaveValue('helloWorld', 'hello world')
    await expectEnviroment(
      'import "./test/data/dictionary.bang" as dict'
    ).toHaveValue('dict', {
      a: 1,
      b: 'Hello',
      c: [1, 2, 3],
    })
  })

  it('should just have default value if not exporting dictionary', async () => {
    await expectError('from "./test/data/number.bang" import a')
    await expectEnviroment(
      'from "./test/data/string.bang" import {default}'
    ).toHaveValue('default', 'hello world')
    await expectEnviroment(
      'from "./test/data/string.bang" import {default: hello}'
    ).toHaveValue('hello', 'hello world')
    await expectEnviroment(
      'from "./test/data/string.bang" import { a }'
    ).toHaveValue('a', null)
  })

  it('should destructure dictionary values', async () => {
    const enviroment = await expectEnviroment(
      'from "./test/data/dictionary.bang" import { a, b, c }'
    )
    enviroment.toHaveValue('a', 1)
    enviroment.toHaveValue('b', 'Hello')
    enviroment.toHaveValue('c', [1, 2, 3])
  })

  it('should destructure and rename dictionary values', async () => {
    const enviroment = await expectEnviroment(
      'from "./test/data/dictionary.bang" import { a: apple, b: bannana, c: carrot }'
    )
    enviroment.toHaveValue('apple', 1)
    enviroment.toHaveValue('bannana', 'Hello')
    enviroment.toHaveValue('carrot', [1, 2, 3])
  })

  it('should error if importer not defined and not builtin', async () => {
    await expectError('from frogs import {}', {})
    await expectError('import cats', {})
  })

  it('should import null if no export', async () => {
    await expectEnviroment(
      'from "./test/data/noExport.bang" import {default}'
    ).toHaveValue('default', null)
    await expectEnviroment('import "./test/data/noExport.bang"').toHaveValue(
      'noExport',
      null
    )
  })
})
