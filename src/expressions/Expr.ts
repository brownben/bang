import { Literal } from '../literals'
import { Enviroment } from '../Enviroment'

export abstract class Expr {
  abstract evaluate(enviroment: Enviroment): Literal
}
