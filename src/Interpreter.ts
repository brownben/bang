import { Stmt } from './statements'

export const interpret = (statements: Stmt[]) =>
  statements.map(statement => statement.execute())
