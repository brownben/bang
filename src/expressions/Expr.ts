import { Literal } from '../Literal'
import { Enviroment } from '../Enviroment'

export abstract class Expr {
  abstract evaluate(enviroment: Enviroment): Literal
}
