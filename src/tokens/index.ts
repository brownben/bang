import { Tokenizer } from './Tokenizer'

export { Token } from './Token'
export { TokenType } from './TokenType'
export {
  additionTokens,
  assignmentOperatorTokens,
  comparisonTokens,
  equalityTokens,
  indiceTokens,
  multiplicationTokens,
  synchronizeTokens,
  unaryTokens,
  variableDeclarationTokens,
  getAssignmentOperator,
} from './tokenGroups'

export const getTokens = (code: string) => new Tokenizer(code).getTokens()
