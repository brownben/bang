import {
  execute,
  expectError,
  expectOutput,
  mockFetch,
  ExternalIO,
} from '../helpers'

const expectOutputWithFetch = (string: string, externalIO?: ExternalIO) =>
  expectOutput('import fetch \n' + string, externalIO)

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

  await execute('import fetch\n fetch.delete("test", {body: `Hello World`})', {
    fetch: mock,
  })
  expect(mock).toHaveBeenLastCalledWith('test', {
    method: 'DELETE',
    headers: undefined,
    body: 'Hello World',
  })
})
