import { Literal } from '../Literal'

export abstract class Stmt {
  abstract execute(): Literal | null
}
