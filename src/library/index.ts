import { Enviroment } from '../Enviroment'
import { print } from './print'
import { type } from './type'
import { maths } from './maths'

export const defineBuiltInFunctions = (): Enviroment => {
  const enviroment: Enviroment = new Enviroment()
  enviroment.define('print', true, print)
  enviroment.define('type', true, type)
  enviroment.define('maths', true, maths)
  return enviroment
}
