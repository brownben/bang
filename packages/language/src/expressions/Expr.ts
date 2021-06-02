import { Primitive } from '../primitives'
import { Enviroment } from '../Enviroment'

export abstract class Expr {
  abstract evaluate(
    enviroment: Enviroment,
    ...extraArguments: string[]
  ): Promise<Primitive>
}
