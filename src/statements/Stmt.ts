import { Enviroment } from '../Enviroment'
import { Literal } from '../Literal'

export abstract class Stmt {
  abstract execute(enviroment: Enviroment): Literal | null
}
