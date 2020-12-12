import { Enviroment } from '../Enviroment'
import { Literal } from '../literals'

export abstract class Stmt {
  abstract execute(enviroment: Enviroment): Literal | null
}
