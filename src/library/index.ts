import { Enviroment } from '../Enviroment'
import { print } from './print'
import { type } from './type'

export const defineBuiltInFunctions = (): Enviroment => {
  const enviroment: Enviroment = new Enviroment()
  enviroment.define('print', true, print)
  enviroment.define('type', true, type)
  return enviroment
}
