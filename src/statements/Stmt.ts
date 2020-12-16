import { Enviroment } from '../Enviroment'
import { Literal } from '../literals'

export type StmtResult = Literal | null

export abstract class Stmt {
  abstract execute(enviroment: Enviroment): StmtResult | StmtResult[]
}
