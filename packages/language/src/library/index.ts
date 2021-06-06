import { Enviroment } from '../Enviroment'
import { Primitive } from '../primitives'
import { print, PrintFunction } from './print'
import { type } from './type'
import { maths } from './maths'
import { unique } from './unique'
import { regex } from './regex'
import { json } from './json'
import { file, FileSystem } from './file'
import { fetch } from './fetch'
import { throwFunc } from './throw'
import { testing } from './testing'

export interface ExternalIO {
  printFunction?: PrintFunction
  fs?: FileSystem
  fetch?: typeof globalThis.fetch
  importer?: (path: string) => string | Promise<string>
}

export const getBuiltInFunction = (
  key: string,
  enviroment: Enviroment
): Primitive | undefined => {
  const externalIO = enviroment.getExternalIO()

  if (key === 'print') return print(externalIO?.printFunction)
  else if (key === 'type') return type
  else if (key === 'maths') return maths
  else if (key === 'unique') return unique
  else if (key === 'regex') return regex
  else if (key === 'json') return json
  else if (key === 'file') return file(externalIO?.fs)
  else if (key === 'fetch') return fetch(externalIO?.fetch)
  else if (key === 'throw') return throwFunc
  else if (key === 'testing') return testing(enviroment)
  return undefined
}

export const defineBuiltInFunctions = (externalIO: ExternalIO): Enviroment => {
  const enviroment: Enviroment = new Enviroment(undefined, externalIO)
  enviroment.define('print', true, print(externalIO.printFunction))
  enviroment.define('type', true, type)
  enviroment.define('throw', true, throwFunc)
  return enviroment
}
