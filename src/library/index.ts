import { Enviroment } from '../Enviroment'
import { print } from './print'
import { time } from './time'

export const defineBuiltInFunctions = (): Enviroment => {
  const enviroment: Enviroment = new Enviroment()
  enviroment.define('time', true, time)
  enviroment.define('print', true, print)
  return enviroment
}
