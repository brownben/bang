import { Enviroment } from '../Enviroment'
import { print, PrintFunction } from './print'
import { type } from './type'
import { maths } from './maths'
import { unique } from './unique'
import { regex } from './regex'
import { json } from './json'
import { file, FileSystem } from './file'
import { fetch } from './fetch'

export interface ExternalIO {
  printFunction?: PrintFunction
  fs?: FileSystem
  fetch?: typeof globalThis.fetch
}

export const getBuiltInFunction = (key: string, externalIO: ExternalIO) => {
  if (key === 'print') return print(externalIO?.printFunction)
  else if (key === 'type') return type
  else if (key === 'maths') return maths
  else if (key === 'unique') return unique
  else if (key === 'regex') return regex
  else if (key === 'json') return json
  else if (key === 'file') return file(externalIO?.fs)
  else if (key === 'fetch') return fetch(externalIO?.fetch)
  return undefined
}

export const defineBuiltInFunctions = (externalIO: ExternalIO): Enviroment => {
  const enviroment: Enviroment = new Enviroment(undefined, externalIO)
  enviroment.define('print', true, print(externalIO.printFunction))
  enviroment.define('type', true, type)
  return enviroment
}
