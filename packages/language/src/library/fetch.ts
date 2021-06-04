import {
  Primitive,
  PrimitiveBoolean,
  PrimitiveDictionary,
  PrimitiveFunction,
  PrimitiveNumber,
  PrimitiveString,
} from '../primitives'
import BangError from '../BangError'
import { wrapValue } from './wrapper'

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

const attemptJSON = (string: string) => {
  try {
    return JSON.parse(string, (_key: string, value: unknown) =>
      wrapValue(value)
    )
  } catch {
    return null
  }
}

const callFetch = async ({
  fetch,
  method,
  url,
  headers,
  body,
}: {
  fetch?: typeof globalThis.fetch
  method: HTTPMethod
  url: string
  headers?: Record<string, string>
  body?: string
}) => {
  if (!fetch) throw new BangError('Fetch function is not defined')

  const fetchResult = await fetch(url, {
    headers,
    body,
    method,
  })

  const text = await fetchResult.text()

  return new PrimitiveDictionary({
    immutable: true,
    keyValues: {
      headers: wrapValue(fetchResult.headers),
      ok: new PrimitiveBoolean(fetchResult.ok),
      status: new PrimitiveNumber(fetchResult.status),
      redirected: new PrimitiveBoolean(fetchResult.redirected),
      text: new PrimitiveString(text),
      json: wrapValue(attemptJSON(text)),
    },
  })
}

const fetchFunction =
  (method: HTTPMethod, fetch?: typeof globalThis.fetch) =>
  async ([path, options]: Primitive[]) => {
    if (!(path instanceof PrimitiveString))
      throw new BangError('Expected path to be a string')
    if (options && !(options instanceof PrimitiveDictionary))
      throw new BangError('Expected options to be a dictionary')

    const headers = options?.getValueForKey('headers')
    const body = options?.getValueForKey('body')

    if (headers !== undefined && !(headers instanceof PrimitiveDictionary))
      throw new BangError('Expected options.headers to be a dictionary')

    let bodyValue
    if (body instanceof PrimitiveString) bodyValue = body.getValue()
    else if (body) bodyValue = JSON.stringify(body.getValue())

    try {
      return await callFetch({
        fetch,
        method,
        url: path.getValue(),
        headers: headers?.getValue() as Record<string, string>,
        body: bodyValue,
      })
    } catch {
      throw new BangError('Problem making network request')
    }
  }

export const fetch = (fetch?: typeof globalThis.fetch) =>
  new PrimitiveDictionary({
    immutable: true,

    keyValues: {
      get: new PrimitiveFunction({
        name: 'fetch.get',
        arity: 1,
        spread: true,
        call: fetchFunction('GET', fetch),
      }),
      put: new PrimitiveFunction({
        name: 'fetch.put',
        arity: 1,
        spread: true,
        call: fetchFunction('PUT', fetch),
      }),
      patch: new PrimitiveFunction({
        name: 'fetch.patch',
        arity: 1,
        spread: true,
        call: fetchFunction('PATCH', fetch),
      }),
      post: new PrimitiveFunction({
        name: 'fetch.put',
        arity: 1,
        spread: true,
        call: fetchFunction('POST', fetch),
      }),
      delete: new PrimitiveFunction({
        name: 'fetch.delete',
        arity: 1,
        spread: true,
        call: fetchFunction('DELETE', fetch),
      }),
    },
  })
