import { Enviroment } from '../Enviroment'
import { print } from './print'
import { type } from './type'
import { maths } from './maths'

export const builtInFunctions = {
  print,
  type,
  maths,
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
