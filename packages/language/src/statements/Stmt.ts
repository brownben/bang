import { Enviroment } from '../Enviroment'
import { Primitive } from '../primitives'

export type StmtResult = Primitive | null

export abstract class Stmt {
  abstract execute(enviroment: Enviroment): Promise<StmtResult | StmtResult[]>
}
