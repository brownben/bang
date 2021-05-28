import { Enviroment } from '../Enviroment'
import { print } from './print'
import { type } from './type'
import { maths } from './maths'
import { unique } from './unique'
import { regex } from './regex'
import { json } from './json'

export const builtInFunctions = {
  print,
  type,
  maths,
  unique,
  regex,
  json,
}

export const isBuiltinIdentfier = (
  key: string
): key is keyof typeof builtInFunctions => key in builtInFunctions

export const defineBuiltInFunctions = (): Enviroment => {
  const enviroment: Enviroment = new Enviroment()
  enviroment.define('print', true, print)
  enviroment.define('type', true, type)
  return enviroment
}
