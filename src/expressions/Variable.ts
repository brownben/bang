import { Token } from '../tokens'
import { Expr } from './Expr'
import { Primitive } from '../primitives'
import { Enviroment } from '../Enviroment'
import BangError from '../BangError'

export class ExprVariable extends Expr {
  name: string

  constructor(name: Token) {
    super()
    this.name = name.value ?? ''
  }

  evaluate(enviroment: Enviroment): Primitive {
    if (enviroment) return enviroment.get(this.name)
    else throw new BangError('No Enviroment Defined')
  }
}
